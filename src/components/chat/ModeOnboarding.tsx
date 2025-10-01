import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, GraduationCap, ArrowRight } from 'lucide-react';
import { safeLocalStorage } from '@/utils/safeStorage';

interface ModeOnboardingProps {
  onComplete: () => void;
}

export function ModeOnboarding({ onComplete }: ModeOnboardingProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = safeLocalStorage.getItem<string>('ai_coach_onboarding_complete', {
      fallbackValue: 'false',
      logErrors: false
    }) === 'true';

    if (!hasSeenOnboarding) {
      setOpen(true);
    }
  }, []);

  const handleComplete = () => {
    safeLocalStorage.setItem('ai_coach_onboarding_complete', 'true');
    setOpen(false);
    onComplete();
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleComplete()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 1 ? 'Welcome to AI Org Assistant!' : 'Two Powerful Modes'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {step === 1 
              ? 'Choose the assistance mode that works best for your organization'
              : 'Switch between modes anytime based on your administrative needs'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 && (
            <>
              <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="flex-shrink-0">
                  <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg">General Chat Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Quick answers when you need them.</strong> Ask me anything! Get administrative support, teaching strategies, educational resources, and organizational guidance.
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    💡 Perfect for: Quick questions, administrative tasks, teaching strategies
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                <div className="flex-shrink-0">
                  <GraduationCap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg">Structured Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Deep guidance through structured support.</strong> Ready for comprehensive assistance? I'll guide you through complex topics with detailed, step-by-step support for your organization's needs.
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    🎯 Perfect for: Professional development, curriculum planning, strategic guidance
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Seamless Transitions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Start in General Chat for quick questions, then click <strong>"Start Structured Session"</strong> when you need comprehensive guidance on organizational topics.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
                <p className="text-sm text-muted-foreground">
                  Use the toggle at the top to switch between modes anytime. The mode you choose determines how I'll assist your organization!
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-1">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <Button onClick={handleNext}>
            {step < 2 ? 'Next' : 'Get Started'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
