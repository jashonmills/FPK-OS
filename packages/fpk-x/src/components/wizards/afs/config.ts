import { WizardConfig } from '@/lib/wizards/types';
import { Activity } from 'lucide-react';

export const afsWizardConfig: WizardConfig = {
  type: 'afs',
  name: 'FPX-AFS™',
  description: 'Adaptive Functioning Scale - Assess daily living skills and adaptive behavior (inspired by Vineland-3)',
  icon: Activity,
  flagKey: 'enable-assessment-afs',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 35,
  requiresSubscription: 'pro',
  category: 'autism',
};
