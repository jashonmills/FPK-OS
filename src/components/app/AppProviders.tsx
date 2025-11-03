import { ReactNode } from 'react';
import { HelpCenter } from '@/components/help/HelpCenter';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <HelpCenter />
      <OnboardingTour />
      {children}
    </>
  );
};
