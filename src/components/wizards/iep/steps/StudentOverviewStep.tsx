import { WizardStepProps } from '@/lib/wizards/types';
import { TextInputStep } from '@/components/wizards/steps/TextInputStep';

export const StudentOverviewStep = (props: WizardStepProps) => (
  <TextInputStep
    {...props}
    fields={[
      { id: 'studentName', label: 'Student Name', required: true },
      { id: 'grade', label: 'Current Grade', required: true },
      { id: 'dateOfBirth', label: 'Date of Birth', type: 'text' },
      { id: 'primaryDisability', label: 'Primary Disability Category', required: true },
      { id: 'secondaryDisabilities', label: 'Secondary Disabilities (if any)', type: 'textarea' },
    ]}
  />
);
