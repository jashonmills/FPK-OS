import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { WizardStep } from '@/types/course-builder';
import { useCourseDraft } from './hooks/useCourseDraft';
import { CourseOverviewStep } from './steps/CourseOverviewStep';
import { LessonPlanningStep } from './steps/LessonPlanningStep';
import { MicroLessonDesignStep } from './steps/MicroLessonDesignStep';
import { ReviewStep } from './steps/ReviewStep';

const steps: Array<{ key: WizardStep; title: string; description: string }> = [
  { key: 'overview', title: 'Course Overview', description: 'Basic information and background' },
  { key: 'planning', title: 'Lesson Planning', description: 'Structure modules and lessons' },
  { key: 'design', title: 'Content Design', description: 'Create slides and content' },
  { key: 'review', title: 'Review & Publish', description: 'Final review and publication' },
];

interface CourseCreationWizardProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  orgId: string;
}

export const CourseCreationWizard: React.FC<CourseCreationWizardProps> = React.memo(({ 
  open = true, 
  onOpenChange, 
  orgId: propOrgId 
}) => {
  const navigate = useNavigate();
  const { orgId: paramOrgId } = useParams<{ orgId: string }>();
  const [currentStep, setCurrentStep] = useState<WizardStep>('overview');
  
  // Use prop orgId if provided, otherwise use param orgId
  const orgId = propOrgId || paramOrgId;
  
  const courseDraftHook = useCourseDraft({ orgId: orgId! });
  const { draft, isLoading } = courseDraftHook;
  
  // Memoize the entire hook result to prevent child components from re-rendering
  const stableHookData = useMemo(() => ({
    draft,
    updateCourse: courseDraftHook.updateCourse,
    addModule: courseDraftHook.addModule,
    addLesson: courseDraftHook.addLesson,
    addSlide: courseDraftHook.addSlide,
    setBackgroundImageUrl: courseDraftHook.setBackgroundImageUrl,
    clearDraft: courseDraftHook.clearDraft
  }), [
    draft,
    courseDraftHook.updateCourse,
    courseDraftHook.addModule,
    courseDraftHook.addLesson,
    courseDraftHook.addSlide,
    courseDraftHook.setBackgroundImageUrl,
    courseDraftHook.clearDraft
  ]);

  if (isLoading || !stableHookData.draft || !orgId) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const canProceed = () => {
    const { draft } = stableHookData;
    switch (currentStep) {
      case 'overview':
        return draft.title?.trim().length > 0;
      case 'planning':
        return draft.modules.length > 0 && draft.modules.every(m => m.lessons.length > 0);
      case 'design':
        return draft.modules.every(m => 
          m.lessons.every(l => l.slides.length > 0)
        );
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleCancel = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      navigate(-1);
    }
  };

  const handlePublish = () => {
    stableHookData.clearDraft();
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      navigate(`/org/${orgId}/courses`);
    }
  };

  const WizardContent = () => (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create Interactive Course</h2>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Step Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step {steps.findIndex(s => s.key === currentStep) + 1} of {steps.length}</span>
            <span>{Math.round(((steps.findIndex(s => s.key === currentStep) + 1) / steps.length) * 100)}% complete</span>
          </div>
          <Progress value={((steps.findIndex(s => s.key === currentStep) + 1) / steps.length) * 100} />
        </div>
        
        {/* Step Indicators */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.key === currentStep;
            const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
            
            return (
              <div key={step.key} className="flex flex-col items-center space-y-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCompleted 
                    ? 'bg-primary text-primary-foreground' 
                    : isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <div className={`text-xs text-center ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  <div>{step.title}</div>
                  <div className="hidden sm:block">{step.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 'overview' && (
            <CourseOverviewStep
              key={`overview-${stableHookData.draft.id}`}
              draft={stableHookData.draft}
              orgId={orgId}
              updateCourse={stableHookData.updateCourse}
              setBackgroundImageUrl={stableHookData.setBackgroundImageUrl}
            />
          )}
          
          {currentStep === 'planning' && (
            <LessonPlanningStep
              key={`planning-${stableHookData.draft.id}`}
              draft={stableHookData.draft}
              orgId={orgId}
              updateCourse={stableHookData.updateCourse}
              addModule={stableHookData.addModule}
              addLesson={stableHookData.addLesson}
            />
          )}
          
          {currentStep === 'design' && (
            <MicroLessonDesignStep
              key={`design-${stableHookData.draft.id}`}
              draft={stableHookData.draft}
              orgId={orgId}
              updateCourse={stableHookData.updateCourse}
              addSlide={stableHookData.addSlide}
            />
          )}
          
          {currentStep === 'review' && (
            <ReviewStep
              key={`review-${stableHookData.draft.id}`}
              draft={stableHookData.draft}
              orgId={orgId}
              onPublish={handlePublish}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 'overview'}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2"
        >
          {currentStep === 'review' ? 'Publish Course' : 'Next'}
          {currentStep !== 'review' && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );

  // Render as dialog if onOpenChange is provided, otherwise as full page
  if (onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Interactive Course</DialogTitle>
          </DialogHeader>
          <WizardContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <WizardContent />
      </div>
    </div>
  );
});

CourseCreationWizard.displayName = 'CourseCreationWizard';