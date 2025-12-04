import { WizardConfig } from '@/lib/wizards/types';
import { Baby } from 'lucide-react';

export const ifspWizardConfig: WizardConfig = {
  type: 'ifsp-guide',
  name: 'FPX-IFSP Guide™',
  description: 'Develop an Individualized Family Service Plan for early intervention (birth to age 3)',
  icon: Baby,
  flagKey: 'enable-assessment-ifsp',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 50,
  requiresSubscription: 'team',
  category: 'educational',
};
