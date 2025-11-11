import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { ReactionPicker } from "./ReactionPicker";
import { MessageReactions } from "./MessageReactions";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    display_name: string;
    avatar_url: string | null;
  };
}

interface ChatWindowProps {
  conversationId: string;
}

export const ChatWindow = ({ conversationId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Array<{ display_name: string }>>([]);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleOptimisticMessage = (optimisticMsg: any) => {
    if (optimisticMsg.failed) {
      // Remove failed message
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      return;
    }
    
    // Add optimistic message if not already present
    setMessages(prev => {
      const exists = prev.find(m => m.id === optimisticMsg.id);
      if (exists) return prev;
      return [...prev, optimisticMsg];
    });
    
    // Scroll to bottom
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    // Get user's persona
    const { data: persona } = await supabase
      .from('personas')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!persona) {
      toast.error("Could not find your profile");
      return;
    }

    const { error } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: user.id,
        persona_id: persona.id,
        emoji,
      });

    if (error) {
      console.error('Error adding reaction:', error);
      toast.error("Failed to add reaction");
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
        return;
      }

      // Fetch sender personas for all messages
      const enriched = await Promise.all(
        data.map(async (msg) => {
          const { data: persona } = await supabase
            .from('personas')
            .select('display_name, avatar_url')
            .eq('id', msg.sender_id)
            .single();

          return {
            ...msg,
            sender: persona || undefined,
          };
        })
      );

      setMessages(enriched);
      setLoading(false);
      
      // Scroll to bottom
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          console.log('Realtime message received:', payload);
          
          // Fetch sender persona info
          const { data: persona } = await supabase
            .from('personas')
            .select('display_name, avatar_url')
            .eq('id', (payload.new as any).sender_id)
            .single();

          const newMessage = {
            ...payload.new,
            sender: persona || undefined,
          } as Message;

          // Remove optimistic message if it exists and replace with real message
          setMessages(prev => {
            // Filter out any optimistic messages (temporary IDs)
            const withoutOptimistic = prev.filter(m => 
              !m.id.toString().startsWith('temp-') || 
              m.sender_id !== newMessage.sender_id
            );
            
            // Check if this message is already in the list
            const exists = withoutOptimistic.find(m => m.id === newMessage.id);
            if (exists) return withoutOptimistic;
            
            return [...withoutOptimistic, newMessage];
          });
          
          // Scroll to bottom
          setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Set up typing indicator presence
  useEffect(() => {
    if (!conversationId) return;

    const typingChannel = supabase.channel(`typing:${conversationId}`, {
      config: { presence: { key: user?.id } }
    });

    typingChannel
      .on('presence', { event: 'sync' }, () => {
        const state = typingChannel.presenceState();
        const typing: Array<{ display_name: string }> = [];
        
        Object.keys(state).forEach((key) => {
          const presences = state[key] as any[];
          presences.forEach((presence) => {
            // Don't show current user as typing
            if (presence.user_id !== user?.id && presence.typing) {
              typing.push({ display_name: presence.display_name });
            }
          });
        });
        
        setTypingUsers(typing);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User started typing:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User stopped typing:', leftPresences);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(typingChannel);
    };
  }, [conversationId, user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`group flex items-start gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.sender?.avatar_url || undefined} />
                    <AvatarFallback>
                      {message.sender?.display_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {message.sender?.display_name || 'Unknown'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div
                        className={`rounded-lg px-4 py-2 max-w-md ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      <ReactionPicker onSelect={(emoji) => handleAddReaction(message.id, emoji)} />
                    </div>
                    <MessageReactions messageId={message.id} />
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>
        <TypingIndicator typingUsers={typingUsers} />
      </ScrollArea>
      <div className="border-t p-4">
        <MessageInput 
          conversationId={conversationId}
          onOptimisticMessage={handleOptimisticMessage}
        />
      </div>
    </div>
  );
};
