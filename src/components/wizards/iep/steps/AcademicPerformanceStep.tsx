import { WizardStepProps } from '@/lib/wizards/types';
import { TextInputStep } from '@/components/wizards/steps/TextInputStep';

export const AcademicPerformanceStep = (props: WizardStepProps) => (
  <TextInputStep
    {...props}
    fields={[
      {
        id: 'strengths',
        label: 'Academic Strengths',
        type: 'textarea',
        placeholder: 'Describe specific academic strengths...',
        required: true,
      },
      {
        id: 'weaknesses',
        label: 'Areas for Growth',
        type: 'textarea',
        placeholder: 'Describe specific areas needing support...',
        required: true,
      },
      {
        id: 'currentData',
        label: 'Supporting Data',
        type: 'textarea',
        placeholder: 'Include test scores, grades, observations...',
      },
    ]}
  />
);
