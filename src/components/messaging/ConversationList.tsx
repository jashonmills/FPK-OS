import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

interface Conversation {
  id: string;
  conversation_type: string;
  group_name: string | null;
  group_avatar_url: string | null;
  updated_at: string;
  lastMessage?: {
    content: string;
    created_at: string;
  };
  otherPersona?: {
    display_name: string;
    avatar_url: string | null;
  };
}

export const ConversationList = ({ activeConversationId }: { activeConversationId?: string }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      // Get conversations user is part of
      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (participantError) {
        console.error('Error fetching participants:', participantError);
        setLoading(false);
        return;
      }

      const conversationIds = participantData.map(p => p.conversation_id);

      if (conversationIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Get conversation details
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (convError) {
        console.error('Error fetching conversations:', convError);
        setLoading(false);
        return;
      }

      // Enrich with last message and other participant info
      const enriched = await Promise.all(
        convData.map(async (conv) => {
          // Get last message
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // For DMs, get other participant's persona
          let otherPersona;
          if (conv.conversation_type === 'DM') {
            const { data: participants } = await supabase
              .from('conversation_participants')
              .select('user_id')
              .eq('conversation_id', conv.id);

            const otherUserId = participants?.find(p => p.user_id !== user.id)?.user_id;

            if (otherUserId) {
              const { data: persona } = await supabase
                .from('personas')
                .select('display_name, avatar_url')
                .eq('user_id', otherUserId)
                .single();

              otherPersona = persona;
            }
          }

          return {
            ...conv,
            lastMessage: lastMsg || undefined,
            otherPersona: otherPersona || undefined,
          };
        })
      );

      setConversations(enriched);
      setLoading(false);
    };

    fetchConversations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('conversation-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => fetchConversations()
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getConversationName = (conv: Conversation) => {
    if (conv.conversation_type === 'GROUP') {
      return conv.group_name;
    }
    return conv.otherPersona?.display_name || 'Unknown User';
  };

  const getConversationAvatar = (conv: Conversation) => {
    if (conv.conversation_type === 'GROUP') {
      return conv.group_avatar_url;
    }
    return conv.otherPersona?.avatar_url;
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No conversations yet</p>
            <p className="text-sm">Start a new conversation to get started</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => navigate(`/messages/${conv.id}`)}
              className={`w-full p-3 rounded-lg text-left transition-colors hover:bg-accent ${
                activeConversationId === conv.id ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={getConversationAvatar(conv) || undefined} />
                  <AvatarFallback>
                    {getConversationName(conv)?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate flex-1">
                      {getConversationName(conv)}
                    </h3>
                    {conv.lastMessage && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {formatDistanceToNow(new Date(conv.lastMessage.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </ScrollArea>
  );
};
