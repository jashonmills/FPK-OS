import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTour } from '@/hooks/useTour';

export const OnboardingTour = () => {
  const { user } = useAuth();
  const { shouldShowTour, startTour } = useTour(user?.id);

  useEffect(() => {
    if (shouldShowTour) {
      // Delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        startTour();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [shouldShowTour, startTour]);

  return null;
};
