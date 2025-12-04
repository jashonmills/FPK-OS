import { WizardStepProps } from '@/lib/wizards/types';
import { MultiSelectStep } from '@/components/wizards/steps/MultiSelectStep';

export const AntecedentAnalysisStep = (props: WizardStepProps) => (
  <MultiSelectStep
    {...props}
    title="What typically happens BEFORE the behavior occurs?"
    description="Select all common antecedents"
    options={[
      { id: 'demand', label: 'Academic or task demand presented' },
      { id: 'transition', label: 'Transition or change in activity' },
      { id: 'denied', label: 'Request denied or told "no"' },
      { id: 'attention-removed', label: 'Attention removed or ignored' },
      { id: 'peer-interaction', label: 'Peer interaction or conflict' },
      { id: 'loud-noises', label: 'Loud noises or sensory stimuli' },
      { id: 'unstructured', label: 'Unstructured time' },
    ]}
    allowOther
  />
);
