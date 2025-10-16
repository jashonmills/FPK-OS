import { WizardConfig } from '@/lib/wizards/types';
import { Lightbulb } from 'lucide-react';

export const casWizardConfig: WizardConfig = {
  type: 'cas',
  name: 'FPX-CAS™',
  description: 'Cognitive Abilities Screener - Non-diagnostic cognitive skills assessment for educational planning',
  icon: Lightbulb,
  flagKey: 'enable-assessment-cas',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 45,
  requiresSubscription: 'pro',
  category: 'developmental',
};
