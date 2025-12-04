import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SavedChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SavedCoachChat {
  id: string;
  user_id: string;
  title: string;
  context_tag: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
  preview?: string;
}

export const useSavedCoachChats = () => {
  const [savedChats, setSavedChats] = useState<SavedCoachChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load saved AI coach chats
  const loadSavedChats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          chat_messages(id, content)
        `)
        .eq('user_id', user.id)
        .eq('context_tag', 'AI_Coach')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const chatsWithMetadata = data?.map(chat => ({
        ...chat,
        message_count: chat.chat_messages?.length || 0,
        preview: chat.chat_messages?.length > 0 
          ? chat.chat_messages[0].content.substring(0, 100) + '...'
          : 'Empty chat'
      })) || [];

      setSavedChats(chatsWithMetadata);
    } catch (error) {
      console.error('Error loading saved chats:', error);
      toast({
        title: "Error loading saved chats",
        description: "There was a problem loading your saved conversations.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save current chat messages to database
  const saveCurrentChat = async (messages: SavedChatMessage[], title?: string) => {
    if (!user || messages.length === 0) return null;

    try {
      // Generate title from first user message or use provided title
      const generatedTitle = title || generateChatTitle(messages) || 'AI Coach Chat';

      // Create chat session
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: generatedTitle,
          context_tag: 'AI_Coach'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Save all messages
      const messagesToSave = messages.map(msg => ({
        session_id: session.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));

      const { error: messagesError } = await supabase
        .from('chat_messages')
        .insert(messagesToSave);

      if (messagesError) throw messagesError;

      // Refresh saved chats
      await loadSavedChats();

      toast({
        title: "Chat saved successfully",
        description: `"${generatedTitle}" has been saved to your history.`,
        duration: 3000
      });

      return session;
    } catch (error) {
      console.error('Error saving chat:', error);
      toast({
        title: "Error saving chat",
        description: "There was a problem saving your conversation.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Load messages from a saved chat
  const loadChatMessages = async (chatId: string): Promise<SavedChatMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', chatId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      return data?.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      })) || [];
    } catch (error) {
      console.error('Error loading chat messages:', error);
      toast({
        title: "Error loading chat",
        description: "There was a problem loading the conversation.",
        variant: "destructive"
      });
      return [];
    }
  };

  // Delete a saved chat
  const deleteSavedChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', chatId);

      if (error) throw error;

      setSavedChats(prev => prev.filter(chat => chat.id !== chatId));
      
      toast({
        title: "Chat deleted",
        description: "The conversation has been removed from your history.",
        duration: 2000
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Error deleting chat",
        description: "There was a problem deleting the conversation.",
        variant: "destructive"
      });
    }
  };

  // Rename a saved chat
  const renameSavedChat = async (chatId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title: newTitle, updated_at: new Date().toISOString() })
        .eq('id', chatId);

      if (error) throw error;

      setSavedChats(prev => 
        prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, title: newTitle, updated_at: new Date().toISOString() }
            : chat
        )
      );

      toast({
        title: "Chat renamed",
        description: `Chat renamed to "${newTitle}"`,
        duration: 2000
      });
    } catch (error) {
      console.error('Error renaming chat:', error);
      toast({
        title: "Error renaming chat",
        description: "There was a problem renaming the conversation.",
        variant: "destructive"
      });
    }
  };

  // Generate a smart title from messages
  const generateChatTitle = (messages: SavedChatMessage[]): string => {
    const firstUserMessage = messages.find(m => m.role === 'user')?.content;
    if (!firstUserMessage) return 'AI Coach Chat';

    // Extract key topics or subjects
    const content = firstUserMessage.toLowerCase();
    
    // Look for common study subjects
    if (content.includes('math') || content.includes('algebra') || content.includes('calculus')) {
      return 'Math Help Session';
    }
    if (content.includes('science') || content.includes('biology') || content.includes('chemistry') || content.includes('physics')) {
      return 'Science Study Session';
    }
    if (content.includes('history') || content.includes('geography')) {
      return 'History Study Session';
    }
    if (content.includes('english') || content.includes('literature') || content.includes('writing')) {
      return 'English Study Session';
    }
    if (content.includes('quiz') || content.includes('test') || content.includes('exam')) {
      return 'Quiz Practice Session';
    }
    if (content.includes('study') || content.includes('learn')) {
      return 'Study Session';
    }

    // Use first few words if no topic detected
    const words = firstUserMessage.split(' ').slice(0, 4).join(' ');
    return words.length > 30 ? words.substring(0, 30) + '...' : words;
  };

  useEffect(() => {
    if (user) {
      loadSavedChats();
    }
  }, [user]);

  return {
    savedChats,
    isLoading,
    saveCurrentChat,
    loadChatMessages,
    deleteSavedChat,
    renameSavedChat,
    loadSavedChats
  };
};