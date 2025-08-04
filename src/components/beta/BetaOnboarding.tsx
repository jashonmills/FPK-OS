import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Play, BookOpen, MessageSquare, BarChart3, Settings, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action?: string;
  link?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to FPK University Beta!',
    description: 'You\'re among the first to experience our revolutionary learning platform.',
    icon: Sparkles
  },
  {
    id: 'modules',
    title: 'Explore Learning Modules',
    description: 'Navigate through video, audio, and interactive content designed for optimal learning.',
    icon: BookOpen,
    action: 'Try a Module',
    link: '/dashboard/learner/learning-state'
  },
  {
    id: 'progress',
    title: 'Track Your Progress',
    description: 'Monitor your learning journey with detailed analytics and insights.',
    icon: BarChart3,
    action: 'View Analytics',
    link: '/dashboard/learner/analytics'
  },
  {
    id: 'ai-coach',
    title: 'Meet Your AI Study Coach',
    description: 'Get personalized guidance and support throughout your learning journey.',
    icon: MessageSquare,
    action: 'Chat with AI',
    link: '/dashboard/learner/ai-coach'
  },
  {
    id: 'feedback',
    title: 'Share Your Experience',
    description: 'Your feedback helps us build the best learning platform possible.',
    icon: MessageSquare,
    action: 'Give Feedback'
  },
  {
    id: 'settings',
    title: 'Customize Your Experience',
    description: 'Adjust accessibility, notifications, and learning preferences.',
    icon: Settings,
    action: 'Open Settings',
    link: '/dashboard/learner/settings'
  }
];

interface BetaOnboardingProps {
  autoShow?: boolean;
  onComplete?: () => void;
  forceShow?: boolean;
}

const BetaOnboarding: React.FC<BetaOnboardingProps> = ({ 
  autoShow = true, 
  onComplete,
  forceShow = false 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
    } else {
      checkOnboardingStatus();
    }
  }, [user, forceShow]);

  const checkOnboardingStatus = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const completed = (data as any)?.onboarding_completed || false;
      setHasSeenOnboarding(completed);
      
      if (autoShow && !completed) {
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      if (autoShow) {
        setIsOpen(true);
      }
    }
  };

  const markOnboardingComplete = async () => {
    if (!user) return;

    try {
      await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          onboarding_completed: true 
        } as any);
      
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Failed to mark onboarding complete:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await markOnboardingComplete();
    setIsOpen(false);
    onComplete?.();
  };

  const handleStepAction = (step: OnboardingStep) => {
    if (step.id === 'feedback') {
      // This would trigger the feedback system
      return;
    }
    
    if (step.link) {
      try {
        navigate(step.link);
      } catch (error) {
        console.error('Navigation failed:', error);
        // Fallback to window.location for external links
        window.location.href = step.link;
      }
    }
  };

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  const IconComponent = currentStepData?.icon;

  return (
    <>
      {/* Trigger button for reopening onboarding */}
      {hasSeenOnboarding && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="text-muted-foreground"
        >
          <Play className="w-4 h-4 mr-2" />
          Beta Tour
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center">
                  <Badge variant="secondary" className="mr-3">BETA</Badge>
                  FPK University Platform Tour
                </DialogTitle>
                <DialogDescription>
                  Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleComplete}>
                Skip Tour
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Current Step */}
            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {IconComponent && <IconComponent className="w-8 h-8 text-primary" />}
                </div>
                <CardTitle className="text-xl">{currentStepData?.title}</CardTitle>
                <CardDescription className="text-base">
                  {currentStepData?.description}
                </CardDescription>
              </CardHeader>
              
              {currentStepData?.action && (
                <CardContent className="text-center">
                  <Button 
                    onClick={() => handleStepAction(currentStepData)}
                    variant="outline"
                    className="mb-4"
                  >
                    {currentStepData.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Step Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ONBOARDING_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 p-2 rounded-lg text-sm ${
                    index === currentStep 
                      ? 'bg-primary/10 text-primary' 
                      : index < currentStep 
                      ? 'bg-green-50 text-green-700'
                      : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                  <span className="truncate">{step.title.replace('FPK University', '').trim()}</span>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              <Button onClick={handleNext}>
                {currentStep === ONBOARDING_STEPS.length - 1 ? 'Complete Tour' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BetaOnboarding;