import { WizardConfig } from '@/lib/wizards/types';
import { GraduationCap } from 'lucide-react';

export const transitionWizardConfig: WizardConfig = {
  type: 'transition-roadmap',
  name: 'FPX-Transition Roadmap™',
  description: 'Plan for post-secondary transition including college, career, and independent living',
  icon: GraduationCap,
  flagKey: 'enable-assessment-transition',
  steps: [
    // Steps will be added in future phases
  ],
  estimatedMinutes: 55,
  requiresSubscription: 'team',
  category: 'educational',
};
