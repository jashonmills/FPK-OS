import { WizardStepProps } from '@/lib/wizards/types';
import { TextInputStep } from '@/components/wizards/steps/TextInputStep';

export const BaselineDataStep = (props: WizardStepProps) => (
  <TextInputStep
    {...props}
    fields={[
      {
        id: 'dataCollectionPeriod',
        label: 'Data Collection Period',
        placeholder: 'e.g., 5 days, 2 weeks',
        required: true,
      },
      {
        id: 'averageFrequency',
        label: 'Average Frequency',
        type: 'number',
        placeholder: 'Average occurrences per day',
      },
      {
        id: 'averageDuration',
        label: 'Average Duration',
        placeholder: 'Average minutes per incident',
      },
      {
        id: 'patterns',
        label: 'Observed Patterns',
        type: 'textarea',
        placeholder: 'Any patterns noticed (time of day, specific activities, etc.)',
      },
    ]}
  />
);
