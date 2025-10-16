import { useParams, Navigate } from 'react-router-dom';
import { useFamily } from '@/contexts/FamilyContext';
import { WizardEngine } from '@/components/wizards/core/WizardEngine';
import { getWizardByType } from '@/lib/wizards/registry';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export default function WizardRunner() {
  const { wizardType, sessionId } = useParams<{ wizardType: string; sessionId?: string }>();
  const { selectedFamily, selectedStudent } = useFamily();

  console.log('🎯 WizardRunner:', { wizardType, sessionId, selectedFamily: selectedFamily?.id, selectedStudent: selectedStudent?.id });

  const wizard = wizardType ? getWizardByType(wizardType) : undefined;
  console.log('🎯 Found wizard:', { wizard: wizard?.name, type: wizard?.type, stepsCount: wizard?.steps?.length });
  
  const { flags, loading } = useFeatureFlags(wizard ? [wizard.flagKey] : []);
  console.log('🎯 Feature flags:', { flags, loading, flagKey: wizard?.flagKey });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!wizard) {
    console.error('🎯 No wizard found for type:', wizardType);
    return <Navigate to="/assessments" replace />;
  }

  if (!flags[wizard.flagKey]) {
    console.error('🎯 Feature flag disabled:', wizard.flagKey);
    return <Navigate to="/assessments" replace />;
  }

  if (!selectedFamily || !selectedStudent) {
    console.error('🎯 Missing family or student');
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please select a family and student first</p>
          <a href="/settings" className="text-primary underline">
            Go to Settings
          </a>
        </div>
      </div>
    );
  }

  console.log('🎯 Rendering WizardEngine with config:', wizard);

  return (
    <WizardEngine
      config={wizard}
      sessionId={sessionId}
      familyId={selectedFamily.id}
      studentId={selectedStudent.id}
    />
  );
}
