
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  context_tag: string;
  created_at: string;
  updated_at: string;
}

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load all sessions for the user
  const loadSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: "Error loading sessions",
        description: "There was a problem loading your chat sessions.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new session
  const createSession = async (contextTag: string = 'Study Coach') => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: 'New Chat',
          context_tag: contextTag
        })
        .select()
        .single();

      if (error) throw error;

      setSessions(prev => [data, ...prev]);
      setCurrentSessionId(data.id);
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error creating session",
        description: "There was a problem creating a new chat session.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Update session title
  const updateSessionTitle = async (sessionId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, title, updated_at: new Date().toISOString() }
            : session
        )
      );
    } catch (error) {
      console.error('Error updating session title:', error);
    }
  };

  // Delete a session
  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      if (currentSessionId === sessionId) {
        setCurrentSessionId(sessions.length > 1 ? sessions[0].id : null);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error deleting session",
        description: "There was a problem deleting the chat session.",
        variant: "destructive"
      });
    }
  };

  // Switch to a different session
  const switchToSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  return {
    sessions,
    currentSessionId,
    isLoading,
    createSession,
    updateSessionTitle,
    deleteSession,
    switchToSession,
    loadSessions
  };
};
