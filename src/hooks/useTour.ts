import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createOnboardingTour } from '@/lib/onboarding-tour';

export const useTour = (userId: string | undefined) => {
  const [shouldShowTour, setShouldShowTour] = useState(false);

  useEffect(() => {
    if (!userId) return;

    checkOnboardingStatus();
  }, [userId]);

  const checkOnboardingStatus = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from('profiles')
      .select('has_completed_onboarding')
      .eq('id', userId)
      .single();

    if (data && !data.has_completed_onboarding) {
      setShouldShowTour(true);
    }
  };

  const startTour = async () => {
    if (!userId) return;

    const tour = createOnboardingTour(
      async () => {
        await markTourCompleted();
      },
      async () => {
        await markTourCompleted();
      }
    );

    tour.start();
  };

  const markTourCompleted = async () => {
    if (!userId) return;

    await supabase
      .from('profiles')
      .update({ has_completed_onboarding: true })
      .eq('id', userId);

    setShouldShowTour(false);
  };

  return { shouldShowTour, startTour, markTourCompleted };
};
