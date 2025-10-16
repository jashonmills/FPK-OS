import { WizardConfig } from './types';
import { iepWizardConfig } from '@/components/wizards/iep/config';
import { bfaWizardConfig } from '@/components/wizards/bfa/config';
import { plan504WizardConfig } from '@/components/wizards/504/config';
import { ifspWizardConfig } from '@/components/wizards/ifsp/config';
import { transitionWizardConfig } from '@/components/wizards/transition/config';
import { bipWizardConfig } from '@/components/wizards/bip/config';
import { afsWizardConfig } from '@/components/wizards/afs/config';
import { scqWizardConfig } from '@/components/wizards/scq/config';
import { srsWizardConfig } from '@/components/wizards/srs/config';
import { efsWizardConfig } from '@/components/wizards/efs/config';
import { crsWizardConfig } from '@/components/wizards/crs/config';
import { atpWizardConfig } from '@/components/wizards/atp/config';
import { pasWizardConfig } from '@/components/wizards/pas/config';
import { rlsWizardConfig } from '@/components/wizards/rls/config';
import { elsWizardConfig } from '@/components/wizards/els/config';
import { casWizardConfig } from '@/components/wizards/cas/config';
import { dlsWizardConfig } from '@/components/wizards/dls/config';

export const WIZARD_REGISTRY: WizardConfig[] = [
  // Educational & Planning Suite
  iepWizardConfig,
  plan504WizardConfig,
  ifspWizardConfig,
  transitionWizardConfig,
  
  // Behavioral Suite
  bfaWizardConfig,
  bipWizardConfig,
  
  // Autism & Social Communication Suite
  afsWizardConfig,
  scqWizardConfig,
  srsWizardConfig,
  
  // ADHD & Executive Function Suite
  efsWizardConfig,
  crsWizardConfig,
  atpWizardConfig,
  
  // Learning & Language Suite
  pasWizardConfig,
  rlsWizardConfig,
  elsWizardConfig,
  
  // Developmental Suite
  casWizardConfig,
  dlsWizardConfig,
];

export const getWizardByType = (type: string): WizardConfig | undefined => {
  return WIZARD_REGISTRY.find(w => w.type === type);
};

export const getWizardsByCategory = (category: string): WizardConfig[] => {
  return WIZARD_REGISTRY.filter(w => w.category === category);
};

export const getEnabledWizards = (flags: Record<string, boolean>): WizardConfig[] => {
  return WIZARD_REGISTRY.filter(w => flags[w.flagKey]);
};
