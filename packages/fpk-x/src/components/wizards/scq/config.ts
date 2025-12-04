import { WizardConfig } from '@/lib/wizards/types';
import { MessageSquare } from 'lucide-react';

export const scqWizardConfig: WizardConfig = {
  type: 'scq',
  name: 'FPX-SCQ™',
  description: 'Social Communication Questionnaire - Screen for autism spectrum characteristics',
  icon: MessageSquare,
  flagKey: 'enable-assessment-scq',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 20,
  requiresSubscription: 'pro',
  category: 'autism',
};
