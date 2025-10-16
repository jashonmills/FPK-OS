import { WizardConfig } from '@/lib/wizards/types';
import { Brain } from 'lucide-react';
import { BehaviorDefinitionStep } from './steps/BehaviorDefinitionStep';
import { IndirectAssessmentStep } from './steps/IndirectAssessmentStep';
import { DirectObservationStep } from './steps/DirectObservationStep';
import { HypothesisStep } from './steps/HypothesisStep';
import { SummaryReportStep } from './steps/SummaryReportStep';

export const bfaWizardConfig: WizardConfig = {
  type: 'bfa',
  name: 'FPX-BFA™',
  description: 'Gold Standard Behavioral Function Analysis with AI-powered data synthesis',
  icon: Brain,
  flagKey: 'enable-assessment-fba',
  steps: [
    {
      id: 'behavior-definition',
      title: 'Target Behavior Definition',
      description: 'Define the behavior with clinical precision',
      component: BehaviorDefinitionStep,
      validation: (data) => {
        return !!(
          data?.behaviorName?.trim() && 
          data?.operationalDefinition?.trim() && 
          data.operationalDefinition.length >= 50
        );
      },
    },
    {
      id: 'indirect-assessment',
      title: 'Indirect Assessment',
      description: 'Structured interview and checklists',
      component: IndirectAssessmentStep,
      validation: (data) => {
        const hasAntecedents = (
          (data?.antecedentDemands?.length || 0) +
          (data?.antecedentSocial?.length || 0) +
          (data?.antecedentEnvironmental?.length || 0) +
          (data?.antecedentInternal?.length || 0)
        ) >= 3;
        
        const hasConsequences = (
          (data?.consequenceAttention?.length || 0) +
          (data?.consequenceEscape?.length || 0) +
          (data?.consequenceTangible?.length || 0) +
          (data?.consequenceSensory?.length || 0)
        ) >= 2;

        const skillsAssessed = data?.skillsDeficit && Object.keys(data.skillsDeficit).length >= 8;

        return hasAntecedents && hasConsequences && skillsAssessed;
      },
    },
    {
      id: 'direct-observation',
      title: 'Direct Observation',
      description: 'AI-powered data synthesis from incident logs',
      component: DirectObservationStep,
    },
    {
      id: 'hypothesis',
      title: 'Functional Hypothesis',
      description: 'Synthesized ABC analysis',
      component: HypothesisStep,
      validation: (data) => !!data?.hypothesisConfirmed,
    },
    {
      id: 'summary-report',
      title: 'Summary & Report',
      description: 'Generate professional PDF report',
      component: SummaryReportStep,
    },
  ],
  estimatedMinutes: 45,
  requiresSubscription: 'team',
  category: 'behavioral',
};
