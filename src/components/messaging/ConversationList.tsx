import React, { useEffect, useState, useMemo, useCallback } from "react";
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

const ConversationListComponent = ({ activeConversationId }: { activeConversationId?: string }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      // OPTIMIZED: Use a more efficient approach - fetch conversations with their data at once
      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations (
            id,
            conversation_type,
            group_name,
            group_avatar_url,
            updated_at
          )
        `)
        .eq('user_id', user.id);

      if (participantError) throw participantError;
      if (!participantData || participantData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Extract conversation IDs
      const conversationIds = participantData.map(p => p.conversation_id);
      
      // OPTIMIZED: Fetch all last messages in one query
      const { data: lastMessages } = await supabase
        .from('messages')
        .select('id, conversation_id, content, created_at')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      // Create a map of last messages per conversation
      const lastMessageMap = new Map();
      lastMessages?.forEach(msg => {
        if (!lastMessageMap.has(msg.conversation_id)) {
          lastMessageMap.set(msg.conversation_id, {
            content: msg.content,
            created_at: msg.created_at,
          });
        }
      });

      // OPTIMIZED: Get all participants for DMs in one query
      const { data: allParticipants } = await supabase
        .from('conversation_participants')
        .select('conversation_id, user_id')
        .in('conversation_id', conversationIds);

      // Get unique user IDs (excluding current user)
      const userIds = [...new Set(
        allParticipants
          ?.filter(p => p.user_id !== user.id)
          .map(p => p.user_id) || []
      )];

      // OPTIMIZED: Fetch all personas at once
      const { data: allPersonas } = await supabase
        .from('personas')
        .select('user_id, display_name, avatar_url')
        .in('user_id', userIds);

      // Create persona lookup map
      const personaMap = new Map(
        allPersonas?.map(p => [p.user_id, { display_name: p.display_name, avatar_url: p.avatar_url }]) || []
      );

      // Create participant lookup map
      const participantMap = new Map<string, string>();
      allParticipants?.forEach(p => {
        if (p.user_id !== user.id) {
          participantMap.set(p.conversation_id, p.user_id);
        }
      });

      // Build enriched conversations
      const enriched = participantData
        .map(p => {
          const conv = (p as any).conversations;
          if (!conv) return null;

          const lastMessage = lastMessageMap.get(conv.id);
          
          // For DMs, get other participant's persona
          let otherPersona;
          if (conv.conversation_type === 'DM') {
            const otherUserId = participantMap.get(conv.id);
            if (otherUserId) {
              otherPersona = personaMap.get(otherUserId);
            }
          }

          return {
            id: conv.id,
            conversation_type: conv.conversation_type,
            group_name: conv.group_name,
            group_avatar_url: conv.group_avatar_url,
            updated_at: conv.updated_at,
            lastMessage,
            otherPersona,
          } as Conversation;
        })
        .filter((c): c is Conversation => c !== null)
        .sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

      setConversations(enriched);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchConversations();

    // OPTIMIZED: More selective real-time updates
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
  }, [user, fetchConversations]);

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

// OPTIMIZED: Memoized component to prevent unnecessary re-renders
export const ConversationList = React.memo(ConversationListComponent);
