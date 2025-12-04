import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProductTourProps {
  run: boolean;
  onComplete: () => void;
  tourSteps: Step[];
  tourTitle?: string;
  tourDescription?: string;
}

export const ProductTour = ({ run, onComplete, tourSteps, tourTitle = "Welcome to the CNS Platform!", tourDescription = "We're excited to have you. Would you like a quick 2-minute tour to learn the basics?" }: ProductTourProps) => {

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
            <DialogTitle className="text-2xl">{tourTitle}</DialogTitle>
            <DialogDescription className="text-base pt-2">
              {tourDescription}
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
