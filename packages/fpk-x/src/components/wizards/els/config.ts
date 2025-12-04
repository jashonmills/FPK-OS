import { WizardConfig } from '@/lib/wizards/types';
import { MessageCircle } from 'lucide-react';

export const elsWizardConfig: WizardConfig = {
  type: 'els',
  name: 'FPX-ELS™',
  description: 'Expressive Language Scale - Assess verbal expression and communication abilities (inspired by CELF-5)',
  icon: MessageCircle,
  flagKey: 'enable-assessment-els',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 35,
  requiresSubscription: 'pro',
  category: 'learning',
};
