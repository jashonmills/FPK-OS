import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProductTourProps {
  run: boolean;
  onComplete: () => void;
}

const tourSteps: Step[] = [
  {
    target: 'main',
    content: 'This is your Dashboard, your daily command center. Key insights and recent activity will appear here.',
    placement: 'center',
    title: 'Welcome to Your Dashboard',
  },
  {
    target: '[data-tour="add-log"]',
    content: 'This is the most important button. Use it to log behaviors, sleep, and other events as they happen. Consistent logging is the key to powerful insights.',
    placement: 'bottom',
    title: 'Logging Data',
  },
  {
    target: '[data-tour="documents"]',
    content: 'Click here to upload important files like IEPs and evaluations. Our AI can analyze them to help you set meaningful goals.',
    placement: 'right',
    title: 'Upload Documents',
  },
  {
    target: '[data-tour="settings"]',
    content: "You're not in this alone. Go here to invite your spouse, therapists, and teachers to collaborate as part of your support team.",
    placement: 'right',
    title: 'Invite Your Team',
  },
  {
    target: '[data-tour="help"]',
    content: 'If you ever need help or want to replay this tour, just click here. Welcome aboard!',
    placement: 'bottom',
    title: 'Getting Help',
  },
];

export const ProductTour = ({ run, onComplete }: ProductTourProps) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    if (run) {
      setShowWelcome(true);
    }
  }, [run]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      onComplete();
    }
  };

  const handleStartTour = () => {
    setShowWelcome(false);
    setRunTour(true);
  };

  const handleSkipTour = () => {
    setShowWelcome(false);
    onComplete();
  };

  return (
    <>
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Welcome to the CNS Platform!</DialogTitle>
            <DialogDescription className="text-base pt-2">
              We're excited to have you. Would you like a quick 2-minute tour to learn the basics?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleSkipTour}>
              No Thanks, I'll Explore
            </Button>
            <Button onClick={handleStartTour}>
              Yes, Show Me Around
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: 'hsl(var(--primary))',
            zIndex: 10000,
          },
        }}
      />
    </>
  );
};
