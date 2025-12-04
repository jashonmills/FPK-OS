import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WizardSession } from '@/lib/wizards/types';

export const useWizardSession = (
  wizardType: string,
  sessionId?: string,
  studentId?: string
) => {
  const [session, setSession] = useState<WizardSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load existing session or create new one
  useEffect(() => {
    const loadSession = async () => {
      try {
        if (sessionId) {
          // Load existing session
          const { data, error } = await supabase
            .from('wizard_sessions')
            .select('*')
            .eq('id', sessionId)
            .single();

          if (error) throw error;
          setSession(data as unknown as WizardSession);
        }
      } catch (error) {
        console.error('Error loading wizard session:', error);
        toast({
          title: 'Error',
          description: 'Failed to load assessment session',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId, toast]);

  // Create new session
  const createSession = useCallback(async (
    familyId: string,
    studentId: string,
    totalSteps: number
  ) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('wizard_sessions')
        .insert({
          family_id: familyId,
          student_id: studentId,
          wizard_type: wizardType,
          total_steps: totalSteps,
          current_step: 0,
          session_data: {},
          status: 'in_progress',
          created_by: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setSession(data as unknown as WizardSession);
      return data.id;
    } catch (error) {
      console.error('Error creating wizard session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create assessment session',
        variant: 'destructive',
      });
      return null;
    }
  }, [wizardType, toast]);

  // Update session data
  const updateSession = useCallback(async (updates: Partial<WizardSession>) => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from('wizard_sessions')
        .update({
          ...updates,
          last_updated: new Date().toISOString(),
        })
        .eq('id', session.id);

      if (error) throw error;

      setSession(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating wizard session:', error);
      toast({
        title: 'Error',
        description: 'Failed to save progress',
        variant: 'destructive',
      });
    }
  }, [session, toast]);

  // Save and exit
  const saveAndExit = useCallback(async () => {
    if (!session) return;

    try {
      await updateSession({ status: 'in_progress' });
      toast({
        title: 'Progress Saved',
        description: 'You can resume this assessment later',
      });
      navigate('/assessments');
    } catch (error) {
      console.error('Error saving and exiting:', error);
    }
  }, [session, updateSession, navigate, toast]);

  // Complete wizard
  const completeWizard = useCallback(async (reportData: any) => {
    if (!session) return;

    try {
      // Update session status
      await supabase
        .from('wizard_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', session.id);

      // Create completion record
      const { error } = await supabase
        .from('wizard_completions')
        .insert({
          session_id: session.id,
          family_id: session.family_id,
          student_id: session.student_id,
          wizard_type: wizardType,
          generated_report: reportData,
        });

      if (error) throw error;

      toast({
        title: 'Assessment Complete!',
        description: 'Your report has been generated',
      });

      navigate(`/assessments/complete/${session.id}`);
    } catch (error) {
      console.error('Error completing wizard:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete assessment',
        variant: 'destructive',
      });
    }
  }, [session, wizardType, navigate, toast]);

  return {
    session,
    loading,
    createSession,
    updateSession,
    saveAndExit,
    completeWizard,
  };
};
