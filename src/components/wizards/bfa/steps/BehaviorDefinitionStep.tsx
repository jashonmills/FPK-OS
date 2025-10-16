import { WizardStepProps } from '@/lib/wizards/types';
import { TextInputStep } from '@/components/wizards/steps/TextInputStep';

export const BehaviorDefinitionStep = (props: WizardStepProps) => (
  <TextInputStep
    {...props}
    fields={[
      {
        id: 'behaviorDescription',
        label: 'Operational Definition of Behavior',
        type: 'textarea',
        placeholder: 'Describe the behavior in observable, measurable terms...',
        required: true,
        helperText: 'Be specific: What does it look like? Sound like?',
      },
      {
        id: 'frequency',
        label: 'Typical Frequency',
        required: true,
        placeholder: 'e.g., 5-10 times per day',
      },
      {
        id: 'duration',
        label: 'Typical Duration',
        placeholder: 'e.g., 2-5 minutes per incident',
      },
      {
        id: 'intensity',
        label: 'Intensity/Severity',
        type: 'textarea',
        placeholder: 'Describe the intensity level...',
      },
    ]}
  />
);
