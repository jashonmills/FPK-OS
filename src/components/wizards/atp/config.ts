import { WizardConfig } from '@/lib/wizards/types';
import { Target } from 'lucide-react';

export const atpWizardConfig: WizardConfig = {
  type: 'atp',
  name: 'FPX-ATP™',
  description: 'Attention & Task Performance - Measure sustained attention and impulse control (inspired by CPT-3)',
  icon: Target,
  flagKey: 'enable-assessment-atp',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 25,
  requiresSubscription: 'pro',
  category: 'adhd',
};
