import { WizardConfig } from '@/lib/wizards/types';
import { Lightbulb } from 'lucide-react';

export const bipWizardConfig: WizardConfig = {
  type: 'bip-architect',
  name: 'FPX-BIP Architect™',
  description: 'Design a comprehensive Behavior Intervention Plan based on functional assessment data',
  icon: Lightbulb,
  flagKey: 'enable-assessment-bip',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 40,
  requiresSubscription: 'team',
  category: 'behavioral',
};
