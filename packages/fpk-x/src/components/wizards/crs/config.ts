import { WizardConfig } from '@/lib/wizards/types';
import { Zap } from 'lucide-react';

export const crsWizardConfig: WizardConfig = {
  type: 'crs',
  name: 'FPX-CRS™',
  description: 'Comprehensive Rating Scale - Multi-informant ADHD and behavioral assessment (inspired by Conners-4)',
  icon: Zap,
  flagKey: 'enable-assessment-crs',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 40,
  requiresSubscription: 'pro',
  category: 'adhd',
};
