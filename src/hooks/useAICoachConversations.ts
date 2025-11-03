import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  persona?: string;
  created_at: string;
}

export interface ConversationPreview {
  id: string;
  title: string;
  last_message_preview: string | null;
  message_count: number;
  updated_at: string;
}

export function useAICoachConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  const fetchConversations = async () => {
    if (!user?.id) {
      setIsLoadingConversations(false);
      return;
    }

    try {
      setIsLoadingConversations(true);
      
      // Fetch conversations with message preview and count
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('ai_coach_conversations')
        .select('id, title, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // For each conversation, get message count and last message
      const conversationsWithDetails = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          // Get message count
          const { count } = await supabase
            .from('ai_coach_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id);

          // Get last message
          const { data: lastMessageData } = await supabase
            .from('ai_coach_messages')
            .select('content')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            id: conv.id,
            title: conv.title,
            last_message_preview: lastMessageData?.content || null,
            message_count: count || 0,
            updated_at: conv.updated_at
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
      setConversations([]);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: string): Promise<ConversationMessage[]> => {
    if (!user?.id) return [];

    try {
      const { data, error } = await supabase
        .from('ai_coach_messages')
        .select('id, role, content, persona, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []) as ConversationMessage[];
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load conversation messages');
      return [];
    }
  };

  const saveConversation = async (
    title: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string; persona?: string }>
  ): Promise<string | null> => {
    if (!user?.id || messages.length === 0) return null;

    try {
      // Create conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('ai_coach_conversations')
        .insert({
          user_id: user.id,
          title: title
        })
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Insert all messages
      const messagesWithConvId = messages.map(msg => ({
        conversation_id: conversationData.id,
        role: msg.role,
        content: msg.content,
        persona: msg.persona
      }));

      const { error: messagesError } = await supabase
        .from('ai_coach_messages')
        .insert(messagesWithConvId);

      if (messagesError) throw messagesError;

      toast.success('Conversation saved successfully');
      await fetchConversations();
      
      return conversationData.id;
    } catch (error) {
      console.error('Error saving conversation:', error);
      toast.error('Failed to save conversation');
      return null;
    }
  };

  const updateConversationTitle = async (conversationId: string, newTitle: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('ai_coach_conversations')
        .update({ title: newTitle })
        .eq('id', conversationId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Conversation renamed');
      await fetchConversations();
      return true;
    } catch (error) {
      console.error('Error updating conversation title:', error);
      toast.error('Failed to rename conversation');
      return false;
    }
  };

  const deleteConversation = async (conversationId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      // Delete conversation (messages cascade delete automatically)
      const { error } = await supabase
        .from('ai_coach_conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Conversation deleted');
      await fetchConversations();
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Failed to delete conversation');
      return false;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user?.id]);

  return {
    conversations,
    isLoadingConversations,
    loadMessages,
    saveConversation,
    updateConversationTitle,
    deleteConversation,
    refetchConversations: fetchConversations
  };
}
