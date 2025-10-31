import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Hash, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChatWindowProps {
  conversationId: string | null;
}

export const ChatWindow = ({ conversationId }: ChatWindowProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId!)
        .single();

      if (error) throw error;

      // For DMs, get the other participant
      if (data.type === 'dm') {
        const { data: participants } = await supabase
          .from('conversation_participants')
          .select('profiles!inner(full_name, avatar_url)')
          .eq('conversation_id', conversationId!)
          .neq('user_id', user!.id)
          .single();

        return {
          ...data,
          dmPartner: participants?.profiles,
        };
      }

      return data;
    },
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!inner(full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId!)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId!,
          sender_id: user!.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
      setShouldAutoScroll(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
          setShouldAutoScroll(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient, user?.id]);

  // Mark as read when viewing
  useEffect(() => {
    if (!conversationId || !user?.id) return;

    const markAsRead = async () => {
      await supabase.rpc('mark_conversation_read', {
        p_conversation_id: conversationId,
        p_user_id: user.id,
      });
    };

    markAsRead();
  }, [conversationId, user?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (shouldAutoScroll && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        setShouldAutoScroll(false);
      }
    }
  }, [messages, shouldAutoScroll]);

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  const displayName = conversation?.type === 'channel' 
    ? conversation.name 
    : (conversation as any)?.dmPartner?.full_name || 'Direct Message';

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-16 border-b border-border px-6 flex items-center gap-3">
        {conversation?.type === 'channel' ? (
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Hash className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted" />
        )}
        <div>
          <h2 className="font-semibold">{displayName}</h2>
          {conversation?.description && (
            <p className="text-sm text-muted-foreground">{conversation.description}</p>
          )}
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_id === user?.id}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            onSend={(content) => sendMessageMutation.mutate(content)}
            disabled={sendMessageMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};
