import { WizardConfig } from '@/lib/wizards/types';
import { Shield } from 'lucide-react';

export const plan504WizardConfig: WizardConfig = {
  type: '504-framework',
  name: 'FPX-504 Framework™',
  description: 'Create a comprehensive Section 504 accommodation plan for students with disabilities',
  icon: Shield,
  flagKey: 'enable-assessment-504',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 30,
  requiresSubscription: 'team',
  category: 'educational',
};
