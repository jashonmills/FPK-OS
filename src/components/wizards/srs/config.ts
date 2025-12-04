import { WizardConfig } from '@/lib/wizards/types';
import { Users } from 'lucide-react';

export const srsWizardConfig: WizardConfig = {
  type: 'srs',
  name: 'FPX-SRS™',
  description: 'Social Responsiveness Scale - Measure social impairment associated with autism',
  icon: Users,
  flagKey: 'enable-assessment-srs',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 25,
  requiresSubscription: 'pro',
  category: 'autism',
};
