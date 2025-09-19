import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
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

export const CourseCreationWizard: React.FC = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const [currentStep, setCurrentStep] = useState<WizardStep>('overview');
  
  const {
    draft,
    isLoading,
    updateCourse,
    addModule,
    addLesson,
    addSlide,
    setBackgroundImageUrl,
    clearDraft
  } = useCourseDraft({ orgId: orgId! });

  if (isLoading || !draft || !orgId) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 'overview':
        return draft.title.trim().length > 0;
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
    clearDraft();
    navigate(`/org/${orgId}/courses`);
  };

  const renderStep = () => {
    const stepProps = {
      draft,
      orgId,
      updateCourse,
      addModule,
      addLesson,
      addSlide,
      setBackgroundImageUrl
    };

    switch (currentStep) {
      case 'overview':
        return <CourseOverviewStep {...stepProps} />;
      case 'planning':
        return <LessonPlanningStep {...stepProps} />;
      case 'design':
        return <MicroLessonDesignStep {...stepProps} />;
      case 'review':
        return <ReviewStep {...stepProps} onPublish={() => navigate(`/org/${orgId}/courses`)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {draft.backgroundImageUrl && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: `url(${draft.backgroundImageUrl}) center/cover no-repeat fixed`
          }}
        />
      )}
      
      <div className="relative z-10 container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-2xl">Create New Course</CardTitle>
                <CardDescription>
                  {steps[currentStepIndex].description}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{steps[currentStepIndex].title}</span>
                <span>Step {currentStepIndex + 1} of {steps.length}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <div className="flex items-center space-x-4 mt-4">
              {steps.map((step, index) => (
                <div 
                  key={step.key}
                  className={`flex items-center space-x-2 ${
                    index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    index < currentStepIndex 
                      ? 'bg-primary text-primary-foreground' 
                      : index === currentStepIndex
                      ? 'bg-primary/20 border border-primary'
                      : 'bg-muted'
                  }`}>
                    {index < currentStepIndex ? <Check className="w-3 h-3" /> : index + 1}
                  </div>
                  <span className="hidden sm:inline text-sm">{step.title}</span>
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {renderStep()}
            
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed() || currentStepIndex === steps.length - 1}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};