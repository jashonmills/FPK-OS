import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, GraduationCap, ArrowRight } from 'lucide-react';
import { safeLocalStorage } from '@/utils/safeStorage';

interface ModeOnboardingProps {
  onComplete: () => void;
  userRole?: string; // 'student', 'instructor', 'owner'
}

export function ModeOnboarding({ onComplete, userRole = 'student' }: ModeOnboardingProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  
  // Determine if user is a student or admin/instructor
  const isStudent = userRole === 'student';
  const assistantName = isStudent ? 'AI Learning Coach' : 'AI Org Assistant';

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
            {step === 1 ? `Welcome to ${assistantName}!` : 'Two Powerful Modes'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {step === 1 
              ? isStudent 
                ? 'Choose the learning experience that works best for you'
                : 'Choose the assistance mode that works best for your organization'
              : isStudent
                ? 'Switch between modes anytime based on your learning goals'
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
                    <strong>Quick answers when you need them.</strong> {isStudent 
                      ? 'Ask me anything! Use me as your go-to resource for direct answers, research help, and study tips.'
                      : 'Ask me anything about your organization! Get insights on students, courses, analytics, groups, goals, notes, and platform features.'
                    }
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    💡 Perfect for: {isStudent 
                      ? 'Quick questions, research, study strategies'
                      : 'Student data queries, course information, analytics insights, organizational management'
                    }
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
                    <strong>{isStudent 
                      ? 'Deep learning through guided questions.'
                      : 'Educational expertise and curriculum support.'
                    }</strong> {isStudent 
                      ? "Ready for a deep dive? I'll guide you with questions to help you master topics yourself. It's a workout for your brain!"
                      : "Access comprehensive educational knowledge, teaching strategies, curriculum development guidance, and subject matter expertise for your instructional needs."
                    }
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    🎯 Perfect for: {isStudent 
                      ? 'Mastering concepts, exam prep, deep understanding'
                      : 'Lesson planning, teaching methods, curriculum design, educational theory'
                    }
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
                  Start in General Chat for quick questions, then click <strong>"Start Structured Session"</strong> when you{isStudent 
                    ? "'re ready for deep learning on that topic."
                    : " need comprehensive guidance on organizational topics."
                  }
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
                <p className="text-sm text-muted-foreground">
                  Use the toggle at the top to switch between modes anytime. The mode you choose determines how I'll {isStudent ? 'help you learn' : 'assist your organization'}!
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
