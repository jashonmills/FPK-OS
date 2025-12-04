import { WizardStepProps } from '@/lib/wizards/types';
import { MultiSelectStep } from '@/components/wizards/steps/MultiSelectStep';

export const AcademicStrengthsStep = (props: WizardStepProps) => (
  <MultiSelectStep
    {...props}
    title="Academic Areas of Strength"
    description="Select all that apply"
    options={[
      { id: 'reading', label: 'Reading Comprehension' },
      { id: 'math', label: 'Mathematics' },
      { id: 'writing', label: 'Written Expression' },
      { id: 'science', label: 'Science' },
      { id: 'social-studies', label: 'Social Studies' },
      { id: 'oral-expression', label: 'Oral Expression' },
    ]}
    allowOther
  />
);
