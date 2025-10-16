import { WizardConfig } from '@/lib/wizards/types';
import { Volume2 } from 'lucide-react';

export const pasWizardConfig: WizardConfig = {
  type: 'pas',
  name: 'FPX-PAS™',
  description: 'Phonological Awareness Screener - Assess early literacy and reading readiness (inspired by CTOPP-2)',
  icon: Volume2,
  flagKey: 'enable-assessment-pas',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 30,
  requiresSubscription: 'pro',
  category: 'learning',
};
