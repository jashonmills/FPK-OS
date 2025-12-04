import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Conversation {
  id: string;
  org_id: string;
  type: 'dm' | 'group';
  name: string | null;
  created_by: string;
  created_at: string;
  participants?: ConversationParticipant[];
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count?: number;
}

export interface ConversationParticipant {
  conversation_id: string;
  user_id: string;
  last_read_at: string;
  joined_at: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
    email?: string;
  };
}

export function useConversations(orgId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConversations = useCallback(async () => {
    if (!orgId || !user) return;

    try {
      setIsLoading(true);
      
      // Fetch conversations user is a participant of
      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (participantError) throw participantError;

      if (!participantData?.length) {
        setConversations([]);
        return;
      }

      const conversationIds = participantData.map(p => p.conversation_id);

      // Fetch conversation details
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('org_id', orgId)
        .in('id', conversationIds)
        .order('created_at', { ascending: false });

      if (convError) throw convError;

      // Fetch participants for each conversation
      const { data: allParticipants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('*')
        .in('conversation_id', conversationIds);

      if (participantsError) throw participantsError;

      // Fetch user profiles for participants
      const participantUserIds = [...new Set(allParticipants?.map(p => p.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .in('id', participantUserIds);

      // Fetch last message for each conversation
      const conversationsWithDetails: Conversation[] = await Promise.all(
        (convData || []).map(async (conv: any) => {
          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const convParticipants = allParticipants?.filter(p => p.conversation_id === conv.id) || [];
          const myParticipation = convParticipants.find(p => p.user_id === user.id);
          
          // Count unread messages
          let unreadCount = 0;
          if (myParticipation?.last_read_at) {
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .gt('created_at', myParticipation.last_read_at)
              .neq('sender_id', user.id);
            unreadCount = count || 0;
          }

          return {
            ...conv,
            type: conv.type as 'dm' | 'group',
            participants: convParticipants.map(p => ({
              ...p,
              profile: profiles?.find(pr => pr.id === p.user_id)
            })),
            last_message: lastMessageData || undefined,
            unread_count: unreadCount
          };
        })
      );

      // Sort by last message time
      conversationsWithDetails.sort((a, b) => {
        const aTime = a.last_message?.created_at || a.created_at;
        const bTime = b.last_message?.created_at || b.created_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [orgId, user, toast]);

  const createConversation = useCallback(async (
    type: 'dm' | 'group',
    participantIds: string[],
    name?: string
  ): Promise<Conversation | null> => {
    if (!orgId || !user) return null;

    try {
      // For DMs, check if conversation already exists
      if (type === 'dm' && participantIds.length === 1) {
        const existingConv = conversations.find(c => 
          c.type === 'dm' && 
          c.participants?.some(p => p.user_id === participantIds[0])
        );
        if (existingConv) return existingConv;
      }

      // Create conversation
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .insert({
          org_id: orgId,
          type,
          name: type === 'group' ? name : null,
          created_by: user.id
        })
        .select()
        .single();

      if (convError) throw convError;
      
      const conv: Conversation = {
        ...convData,
        type: convData.type as 'dm' | 'group'
      };

      // Add participants (including self)
      const allParticipants = [...new Set([user.id, ...participantIds])];
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(
          allParticipants.map(userId => ({
            conversation_id: conv.id,
            user_id: userId
          }))
        );

      if (participantsError) throw participantsError;

      // Refresh conversations
      await fetchConversations();
      
      return conv;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create conversation',
        variant: 'destructive'
      });
      return null;
    }
  }, [orgId, user, conversations, fetchConversations, toast]);

  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      // Update local state
      setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, unread_count: 0 } : c
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    createConversation,
    markAsRead,
    refetch: fetchConversations
  };
}
