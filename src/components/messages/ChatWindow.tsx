import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Hash, MessageCircle, ArrowLeft, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/avatar-with-initials';

interface ChatWindowProps {
  conversationId: string | null;
  onBack?: () => void;
  onToggleDetails?: () => void;
  detailsCollapsed?: boolean;
}

export const ChatWindow = ({ conversationId, onBack, onToggleDetails, detailsCollapsed }: ChatWindowProps) => {
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
      
      // Process mentions if content contains @mentions
      if (content.includes('@[')) {
        try {
          await supabase.functions.invoke('process-message-mentions', {
            body: {
              messageId: data.id,
              conversationId: conversationId,
              content: content,
              senderId: user!.id,
            },
          });
        } catch (mentionError) {
          console.error('Failed to process mentions:', mentionError);
          // Don't fail the message send if mention processing fails
        }
      }
      
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
  
  const dmPartner = (conversation as any)?.dmPartner;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-background">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {conversation?.type === 'channel' ? (
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Hash className="h-5 w-5 text-primary" />
            </div>
          ) : dmPartner ? (
            <UserAvatar
              fullName={dmPartner.full_name}
              avatarUrl={dmPartner.avatar_url}
              size={36}
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-muted flex-shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold truncate">
              {conversation?.type === 'channel' 
                ? `# ${displayName}` 
                : displayName}
            </h2>
            {conversation?.type === 'channel' && conversation.description && (
              <p className="text-xs text-muted-foreground truncate">
                {conversation.description}
              </p>
            )}
          </div>
        </div>
        {onToggleDetails && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDetails}
            className="hidden md:flex flex-shrink-0"
            title={detailsCollapsed ? "Show details" : "Hide details"}
          >
            <Info className="h-5 w-5" />
          </Button>
        )}
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

      <div className="p-4 border-t border-border/50 bg-background">
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
