import { WizardConfig } from '@/lib/wizards/types';
import { Brain } from 'lucide-react';

export const efsWizardConfig: WizardConfig = {
  type: 'efs',
  name: 'FPX-EFS™',
  description: 'Executive Function Snapshot - Assess planning, organization, and self-regulation (inspired by BRIEF-2)',
  icon: Brain,
  flagKey: 'enable-assessment-efs',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 30,
  requiresSubscription: 'pro',
  category: 'adhd',
};
