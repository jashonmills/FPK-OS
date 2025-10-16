import { WizardConfig } from '@/lib/wizards/types';
import { Home } from 'lucide-react';

export const dlsWizardConfig: WizardConfig = {
  type: 'dls',
  name: 'FPX-DLS™',
  description: 'Daily Living Skills Inventory - Evaluate independence in self-care and home/community tasks (inspired by ABAS-3)',
  icon: Home,
  flagKey: 'enable-assessment-dls',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 40,
  requiresSubscription: 'pro',
  category: 'developmental',
};
