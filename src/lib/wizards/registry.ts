import { WizardConfig } from './types';
import { iepWizardConfig } from '@/components/wizards/iep/config';
import { bfaWizardConfig } from '@/components/wizards/bfa/config';

export const WIZARD_REGISTRY: WizardConfig[] = [
  iepWizardConfig,
  bfaWizardConfig,
  // More assessments will be added as they're built
];

export const getWizardByType = (type: string): WizardConfig | undefined => {
  return WIZARD_REGISTRY.find(w => w.type === type);
};

export const getWizardsByCategory = (category: string): WizardConfig[] => {
  return WIZARD_REGISTRY.filter(w => w.category === category);
};
