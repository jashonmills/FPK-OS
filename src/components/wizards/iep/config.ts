import { WizardConfig } from '@/lib/wizards/types';
import { FileText } from 'lucide-react';

export const iepWizardConfig: WizardConfig = {
  type: 'iep-blueprint',
  name: 'FPX-IEP Blueprint™',
  description: 'Create a comprehensive, data-driven IEP plan with SMART goals and accommodations',
  icon: FileText,
  flagKey: 'enable-assessment-iep',
  steps: [
    // Steps will be added in Phase 3
  ],
  estimatedMinutes: 45,
  requiresSubscription: 'team',
  category: 'educational',
};
