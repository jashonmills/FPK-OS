import React, { useEffect } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useTour } from '@/contexts/TourContext';
import { tourConfigs, tourStyles } from '@/config/tours';
import type { TourName } from '@/contexts/TourContext';

interface TourGuideProps {
  tourName: TourName;
  autoStart?: boolean;
}

export const TourGuide: React.FC<TourGuideProps> = ({ tourName, autoStart = true }) => {
  const { shouldShowTour, markTourComplete, activeTour, startTour } = useTour();

  useEffect(() => {
    if (autoStart && shouldShowTour(tourName)) {
      // Small delay to ensure DOM elements are rendered
      setTimeout(() => {
        startTour(tourName);
      }, 500);
    }
  }, [autoStart, shouldShowTour, tourName, startTour]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      markTourComplete(tourName);
    }
  };

  const isActive = activeTour === tourName;
  const steps = tourConfigs[tourName] || [];

  if (!isActive || steps.length === 0) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      continuous
      showProgress
      showSkipButton
      run={isActive}
      callback={handleJoyrideCallback}
      styles={tourStyles}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
};
