import { useParams, Navigate } from 'react-router-dom';
import { useFamily } from '@/contexts/FamilyContext';
import { WizardEngine } from '@/components/wizards/core/WizardEngine';
import { getWizardByType } from '@/lib/wizards/registry';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export default function WizardRunner() {
  const { wizardType, sessionId } = useParams<{ wizardType: string; sessionId?: string }>();
  const { selectedFamily, selectedStudent } = useFamily();


  const wizard = wizardType ? getWizardByType(wizardType) : undefined;
  const { flags, loading } = useFeatureFlags(wizard ? [wizard.flagKey] : []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!wizard) {
    return <Navigate to="/assessments" replace />;
  }

  if (!flags[wizard.flagKey]) {
    return <Navigate to="/assessments" replace />;
  }

  if (!selectedFamily || !selectedStudent) {
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

  return (
    <WizardEngine
      config={wizard}
      sessionId={sessionId}
      familyId={selectedFamily.id}
      studentId={selectedStudent.id}
    />
  );
}
