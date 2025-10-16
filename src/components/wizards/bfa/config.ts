import { WizardConfig } from '@/lib/wizards/types';
import { Brain } from 'lucide-react';
import { BehaviorDefinitionStep } from './steps/BehaviorDefinitionStep';
import { BaselineDataStep } from './steps/BaselineDataStep';
import { AntecedentAnalysisStep } from './steps/AntecedentAnalysisStep';

export const bfaWizardConfig: WizardConfig = {
  type: 'bfa',
  name: 'FPX-BFA™',
  description: 'Conduct a structured Functional Behavior Assessment to identify behavior patterns',
  icon: Brain,
  flagKey: 'enable-assessment-fba',
  steps: [
    {
      id: 'behavior-definition',
      title: 'Target Behavior Definition',
      description: 'Define the specific behavior of concern',
      component: BehaviorDefinitionStep,
      validation: (data) => !!data.behaviorDescription && !!data.frequency,
    },
    {
      id: 'baseline-data',
      title: 'Baseline Data',
      description: 'Document current frequency and duration',
      component: BaselineDataStep,
    },
    {
      id: 'antecedent-analysis',
      title: 'Antecedent Analysis',
      description: 'What happens before the behavior?',
      component: AntecedentAnalysisStep,
    },
  ],
  estimatedMinutes: 35,
  requiresSubscription: 'team',
  category: 'behavioral',
};
