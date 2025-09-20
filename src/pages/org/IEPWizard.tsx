import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useIEPWizard } from '@/hooks/useIEPWizard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';
import { StudentProfileStep } from '@/components/iep-wizard/StudentProfileStep';
import { JurisdictionConsentStep } from '@/components/iep-wizard/JurisdictionConsentStep';
import { ConcernsReferralStep } from '@/components/iep-wizard/ConcernsReferralStep';
import { ScreeningEligibilityStep } from '@/components/iep-wizard/ScreeningEligibilityStep';
import { PresentLevelsStep } from '@/components/iep-wizard/PresentLevelsStep';
import { GoalsObjectivesStep } from '@/components/iep-wizard/GoalsObjectivesStep';
import { ServicesSupportsStep } from '@/components/iep-wizard/ServicesSupportsStep';
import { LREPlacementStep } from '@/components/iep-wizard/LREPlacementStep';
import { TransitionPlanningStep } from '@/components/iep-wizard/TransitionPlanningStep';
import { AssessmentParticipationStep } from '@/components/iep-wizard/AssessmentParticipationStep';
import { ParentStudentInputStep } from '@/components/iep-wizard/ParentStudentInputStep';
import { ProgressMonitoringStep } from '@/components/iep-wizard/ProgressMonitoringStep';
import { ReviewFinalizeStep } from '@/components/iep-wizard/ReviewFinalizeStep';

export function IEPWizard() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId');
  
  const {
    currentStep,
    formData,
    steps,
    jurisdiction,
    setJurisdiction,
    updateFormData,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    progress,
    saveProgress,
    isSaving,
    completeWizard
  } = useIEPWizard(orgId!, studentId || undefined);

  const renderCurrentStep = () => {
    const stepProps = {
      data: formData[currentStep] || {},
      onUpdate: (data: any) => updateFormData(currentStep, data),
      jurisdiction
    };

    switch (currentStep) {
      case 1: return <StudentProfileStep {...stepProps} />;
      case 2: return <JurisdictionConsentStep {...stepProps} onJurisdictionChange={setJurisdiction} />;
      case 3: return <ConcernsReferralStep {...stepProps} />;
      case 4: return <ScreeningEligibilityStep {...stepProps} />;
      case 5: return <PresentLevelsStep {...stepProps} />;
      case 6: return <GoalsObjectivesStep {...stepProps} />;
      case 7: return <ServicesSupportsStep {...stepProps} />;
      case 8: return <LREPlacementStep {...stepProps} />;
      case 9: return <TransitionPlanningStep {...stepProps} />;
      case 10: return <AssessmentParticipationStep {...stepProps} />;
      case 11: return <ParentStudentInputStep {...stepProps} />;
      case 12: return <ProgressMonitoringStep {...stepProps} />;
      case 13: return <ReviewFinalizeStep {...stepProps} formData={formData} steps={steps} />;
      default: return <div>Step not found</div>;
    }
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (studentId) {
                  navigate(`/org/${orgId}/students/${studentId}`);
                } else {
                  navigate(`/org/${orgId}/iep`);
                }
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {studentId ? 'Back to Student Profile' : 'Back to IEP Module'}
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Interactive IEP Builder
            </h1>
            <p className="text-muted-foreground">
              Step {currentStep} of {steps.length}: {currentStepData?.title}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{Math.round(progress)}% Complete</span>
              <span>Jurisdiction: {jurisdiction === 'US_IDEA' ? 'US (IDEA)' : 'Ireland (EPSEN)'}</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {currentStepData?.required && (
                <span className="text-destructive text-sm font-normal">* Required</span>
              )}
              <span>{currentStepData?.title}</span>
            </CardTitle>
            <p className="text-muted-foreground">
              {currentStepData?.description}
            </p>
          </CardHeader>
          <CardContent>
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={saveProgress}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Progress'}
            </Button>

            <Button
              onClick={isLastStep ? completeWizard : nextStep}
              className="flex items-center gap-2"
            >
              {isLastStep ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Complete IEP
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IEPWizard;