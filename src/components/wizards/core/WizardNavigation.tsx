import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, X } from 'lucide-react';

interface WizardNavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveAndExit: () => void;
  isLastStep?: boolean;
}

export const WizardNavigation = ({
  canGoBack,
  canGoNext,
  onBack,
  onNext,
  onSaveAndExit,
  isLastStep = false,
}: WizardNavigationProps) => {
  return (
    <div className="flex justify-between items-center pt-6 border-t mt-8">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onSaveAndExit}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save & Exit
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={!canGoBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="gap-2"
        >
          {isLastStep ? 'Complete' : 'Next'}
          {!isLastStep && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
