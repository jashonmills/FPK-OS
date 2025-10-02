import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SocraticSession {
  id: string;
  topic: string;
  objective: string;
  state: 'ASK' | 'WAIT' | 'EVALUATE' | 'NUDGE' | 'NEXT' | 'COMPLETED';
  score_history: number[];
  current_question: string | null;
  nudge_count: number;
}

export interface SocraticTurn {
  id: string;
  role: 'coach' | 'student' | 'system';
  content: string;
  score?: number;
  misconception?: string;
  created_at: string;
}

export function useSocraticSession(userId?: string, orgId?: string) {
  const [session, setSession] = useState<SocraticSession | null>(null);
  const [turns, setTurns] = useState<SocraticTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startSession = useCallback(async (topic: string, objective: string) => {
    if (!userId) {
      console.error('Cannot start session: userId is missing');
      toast({ 
        title: 'Authentication Required', 
        description: 'Please log in to start a learning session', 
        variant: 'destructive' 
      });
      return null;
    }

    console.log('Starting Socratic session:', { userId, orgId, topic, objective });
    setLoading(true);
    
    try {
      const { data: newSession, error } = await supabase
        .from('socratic_sessions')
        .insert({
          user_id: userId,
          org_id: orgId || null,
          topic,
          objective,
          state: 'ASK'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating session:', error);
        throw error;
      }

      console.log('Session created successfully:', newSession);
      setSession(newSession as SocraticSession);
      setTurns([]);
      
      return newSession.id;
    } catch (error: any) {
      console.error('Error starting Socratic session:', error);
      toast({ 
        title: 'Session Error', 
        description: error.message || 'Failed to start learning session. Please try again.', 
        variant: 'destructive' 
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, orgId, toast]);

  const loadSession = useCallback(async (sessionId: string) => {
    setLoading(true);
    try {
      const [sessionResult, turnsResult] = await Promise.all([
        supabase
          .from('socratic_sessions')
          .select('*')
          .eq('id', sessionId)
          .single(),
        supabase
          .from('socratic_turns')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })
      ]);

      if (sessionResult.error) throw sessionResult.error;
      if (turnsResult.error) throw turnsResult.error;

      setSession(sessionResult.data as SocraticSession);
      setTurns(turnsResult.data as SocraticTurn[]);
    } catch (error: any) {
      console.error('Error loading Socratic session:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to load session', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addTurn = useCallback((turn: Omit<SocraticTurn, 'id' | 'created_at'>) => {
    const newTurn: SocraticTurn = {
      ...turn,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    setTurns(prev => [...prev, newTurn]);
  }, []);

  const updateSession = useCallback((updates: Partial<SocraticSession>) => {
    setSession(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const completeSession = useCallback(async () => {
    if (!session) return;

    try {
      await supabase
        .from('socratic_sessions')
        .update({ state: 'COMPLETED', completed_at: new Date().toISOString() })
        .eq('id', session.id);

      updateSession({ state: 'COMPLETED' });
      
      toast({
        title: 'Session Complete',
        description: 'Great work! Your learning session is complete.',
      });
    } catch (error: any) {
      console.error('Error completing session:', error);
    }
  }, [session, updateSession, toast]);

  return {
    session,
    turns,
    loading,
    startSession,
    loadSession,
    addTurn,
    updateSession,
    completeSession
  };
}
