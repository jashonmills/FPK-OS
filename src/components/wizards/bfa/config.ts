import { WizardConfig } from '@/lib/wizards/types';
import { Brain } from 'lucide-react';

export const bfaWizardConfig: WizardConfig = {
  type: 'bfa',
  name: 'FPX-BFA™',
  description: 'Conduct a structured Functional Behavior Assessment to identify behavior patterns',
  icon: Brain,
  flagKey: 'enable-assessment-fba',
  steps: [
    // Steps will be added in Phase 3
  ],
  estimatedMinutes: 35,
  requiresSubscription: 'team',
  category: 'behavioral',
};
