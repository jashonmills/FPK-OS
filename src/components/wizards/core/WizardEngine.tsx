import { useState, useEffect } from 'react';
import { WizardConfig } from '@/lib/wizards/types';
import { useWizardSession } from './useWizardSession';
import { WizardProgress } from './WizardProgress';
import { WizardNavigation } from './WizardNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WizardEngineProps {
  config: WizardConfig;
  sessionId?: string;
  familyId: string;
  studentId: string;
}

export const WizardEngine = ({ config, sessionId, familyId, studentId }: WizardEngineProps) => {
  console.log('🧙 WizardEngine render:', { 
    configType: config.type, 
    stepsCount: config.steps?.length,
    sessionId, 
    familyId, 
    studentId 
  });

  const { session, loading, createSession, updateSession, saveAndExit, completeWizard } = 
    useWizardSession(config.type, sessionId, studentId);
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionData, setSessionData] = useState<Record<string, any>>({});

  // Initialize session if needed
  useEffect(() => {
    const initSession = async () => {
      if (!sessionId && !session) {
        console.log('🧙 Creating new session...');
        await createSession(familyId, studentId, config.steps.length);
      }
    };
    initSession();
  }, [sessionId, session, createSession, familyId, studentId, config.steps.length]);

  // Load session data
  useEffect(() => {
    if (session) {
      console.log('🧙 Loading session data:', { currentStep: session.currentStep, sessionData: session.sessionData });
      setCurrentStep(session.currentStep);
      setSessionData(session.sessionData);
    }
  }, [session]);

  const handleDataUpdate = (stepId: string, data: any) => {
    const updatedData = {
      ...sessionData,
      [stepId]: data,
    };
    setSessionData(updatedData);
    updateSession({
      sessionData: updatedData,
      currentStep,
    });
  };

  const handleNext = async () => {
    if (currentStep === config.steps.length - 1) {
      // Last step - complete the wizard
      await completeWizard({
        summary: 'Assessment completed',
        sections: [],
        recommendations: [],
        nextSteps: [],
        generatedAt: new Date().toISOString(),
      });
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateSession({ currentStep: nextStep });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      updateSession({ currentStep: prevStep });
    }
  };

  const validateCurrentStep = () => {
    const stepConfig = config.steps[currentStep];
    if (stepConfig.validation) {
      return stepConfig.validation(sessionData[stepConfig.id]);
    }
    return true;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Safety check: ensure we have a valid step
  console.log('🧙 Checking step validity:', { 
    hasSteps: !!config.steps, 
    stepsLength: config.steps?.length, 
    currentStep, 
    isOutOfBounds: currentStep >= (config.steps?.length || 0) 
  });
  
  if (!config.steps || config.steps.length === 0 || currentStep >= config.steps.length) {
    console.error('🧙 Invalid step configuration:', { config, currentStep });
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">No steps configured for this assessment.</p>
          <p className="text-xs text-muted-foreground mt-2">Steps: {config.steps?.length || 0}, Current: {currentStep}</p>
        </div>
      </div>
    );
  }

  const currentStepConfig = config.steps[currentStep];
  console.log('🧙 Current step config:', { 
    stepId: currentStepConfig?.id, 
    hasComponent: !!currentStepConfig?.component 
  });
  
  if (!currentStepConfig || !currentStepConfig.component) {
    console.error('🧙 Missing step component:', { currentStepConfig, currentStep });
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Step configuration error.</p>
        </div>
      </div>
    );
  }
  
  const CurrentStepComponent = currentStepConfig.component;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">{config.name}</h1>
        <p className="text-muted-foreground">{config.description}</p>
      </div>

      <WizardProgress current={currentStep + 1} total={config.steps.length} />

      <Card>
        <CardHeader>
          <CardTitle>{currentStepConfig.title}</CardTitle>
          {currentStepConfig.description && (
            <CardDescription>{currentStepConfig.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            data={sessionData[currentStepConfig.id] || {}}
            onUpdate={(data) => handleDataUpdate(currentStepConfig.id, data)}
          />
        </CardContent>
      </Card>

      <WizardNavigation
        canGoBack={currentStep > 0}
        canGoNext={validateCurrentStep()}
        onBack={handleBack}
        onNext={handleNext}
        onSaveAndExit={saveAndExit}
        isLastStep={currentStep === config.steps.length - 1}
      />
    </div>
  );
};
