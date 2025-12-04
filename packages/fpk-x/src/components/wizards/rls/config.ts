import { WizardConfig } from '@/lib/wizards/types';
import { Ear } from 'lucide-react';

export const rlsWizardConfig: WizardConfig = {
  type: 'rls',
  name: 'FPX-RLS™',
  description: 'Receptive Language Scale - Evaluate language comprehension and listening skills (inspired by CELF-5)',
  icon: Ear,
  flagKey: 'enable-assessment-rls',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 35,
  requiresSubscription: 'pro',
  category: 'learning',
};
