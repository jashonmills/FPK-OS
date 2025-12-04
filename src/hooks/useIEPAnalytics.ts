import { useCallback } from 'react';
import { ga4 } from '@/utils/ga4Setup';
import { useAuth } from '@/hooks/useAuth';

export const useIEPAnalytics = () => {
  const { user } = useAuth();

  const trackIEPWizardStarted = useCallback(() => {
    ga4.trackCustomEvent('iep_wizard_started', {
      user_id: user?.id,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackIEPStepCompleted = useCallback((stepNumber: number, stepName: string) => {
    ga4.trackCustomEvent('iep_step_completed', {
      user_id: user?.id,
      step_number: stepNumber,
      step_name: stepName,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackIEPSubmitted = useCallback((studentId: string, totalSteps: number) => {
    ga4.trackCustomEvent('iep_submitted', {
      user_id: user?.id,
      student_id: studentId,
      total_steps: totalSteps,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackIEPAbandoned = useCallback((stepNumber: number, stepName: string) => {
    ga4.trackCustomEvent('iep_abandoned', {
      user_id: user?.id,
      step_number: stepNumber,
      step_name: stepName,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackIEPSaveProgress = useCallback((stepNumber: number) => {
    ga4.trackCustomEvent('iep_progress_saved', {
      user_id: user?.id,
      step_number: stepNumber,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  return {
    trackIEPWizardStarted,
    trackIEPStepCompleted,
    trackIEPSubmitted,
    trackIEPAbandoned,
    trackIEPSaveProgress
  };
};
