import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UATSession {
  id: string;
  session_goals: any;
  completed_goals: any;
  feedback_submitted: boolean;
  session_start: string;
  last_activity: string;
}

const DEFAULT_GOALS = [
  'enroll_in_course',
  'complete_2_modules', 
  'create_goal',
  'complete_goal',
  'submit_feedback'
];

export function useUATSession() {
  const { user } = useAuth();
  const [session, setSession] = useState<UATSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check for existing session
        const { data: existingSession } = await supabase
          .from('uat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingSession) {
          setSession(existingSession);
          // Show welcome guide if user hasn't completed any goals yet
          const completedGoals = Array.isArray(existingSession.completed_goals) ? existingSession.completed_goals : [];
          setShowWelcome(completedGoals.length === 0);
        } else {
          // Create new session
          const { data: newSession, error } = await supabase
            .from('uat_sessions')
            .insert({
              user_id: user.id,
              session_goals: DEFAULT_GOALS,
              completed_goals: [],
              feedback_submitted: false
            })
            .select()
            .single();

          if (error) throw error;

          setSession(newSession);
          setShowWelcome(true);
        }
      } catch (error) {
        console.error('Error initializing UAT session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [user]);

  const completeGoal = async (goalId: string) => {
    if (!session || !user) return;

    const currentGoals = Array.isArray(session.completed_goals) ? session.completed_goals : [];
    const updatedGoals = [...currentGoals];
    if (!updatedGoals.includes(goalId)) {
      updatedGoals.push(goalId);
    }

    try {
      const { error } = await supabase
        .from('uat_sessions')
        .update({
          completed_goals: updatedGoals,
          last_activity: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) throw error;

      setSession(prev => prev ? {
        ...prev,
        completed_goals: updatedGoals,
        last_activity: new Date().toISOString()
      } : null);
    } catch (error) {
      console.error('Error completing goal:', error);
    }
  };

  const markFeedbackSubmitted = async () => {
    if (!session || !user) return;

    try {
      const { error } = await supabase
        .from('uat_sessions')
        .update({
          feedback_submitted: true,
          last_activity: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) throw error;

      setSession(prev => prev ? {
        ...prev,
        feedback_submitted: true,
        last_activity: new Date().toISOString()
      } : null);

      // Auto-complete feedback goal
      await completeGoal('submit_feedback');
    } catch (error) {
      console.error('Error marking feedback as submitted:', error);
    }
  };

  const updateActivity = async () => {
    if (!session || !user) return;

    try {
      await supabase
        .from('uat_sessions')
        .update({
          last_activity: new Date().toISOString()
        })
        .eq('id', session.id);
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const getProgress = () => {
    if (!session) return { completed: 0, total: 0, percentage: 0 };
    
    const completedGoals = Array.isArray(session.completed_goals) ? session.completed_goals : [];
    const sessionGoals = Array.isArray(session.session_goals) ? session.session_goals : [];
    const completed = completedGoals.length;
    const total = sessionGoals.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  return {
    session,
    isLoading,
    showWelcome,
    setShowWelcome,
    completeGoal,
    markFeedbackSubmitted,
    updateActivity,
    getProgress
  };
}