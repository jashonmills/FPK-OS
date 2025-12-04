import { WizardConfig } from '@/lib/wizards/types';
import { FileText } from 'lucide-react';
import { JurisdictionConsentStep } from './steps/JurisdictionConsentStep';
import { StudentOverviewStep } from './steps/StudentOverviewStep';
import { TeamMembersStep } from './steps/TeamMembersStep';
import { ConcernsReferralStep } from './steps/ConcernsReferralStep';
import { ScreeningEligibilityStep } from './steps/ScreeningEligibilityStep';
import { PresentLevelsStep } from './steps/PresentLevelsStep';
import { GoalsObjectivesStep } from './steps/GoalsObjectivesStep';
import { ServicesSupportsStep } from './steps/ServicesSupportsStep';
import { LREPlacementStep } from './steps/LREPlacementStep';
import { TransitionPlanningStep } from './steps/TransitionPlanningStep';
import { AssessmentParticipationStep } from './steps/AssessmentParticipationStep';
import { ParentStudentInputStep } from './steps/ParentStudentInputStep';
import { ProgressMonitoringStep } from './steps/ProgressMonitoringStep';
import { ReviewFinalizeStep } from './steps/ReviewFinalizeStep';

export const iepWizardConfig: WizardConfig = {
  type: 'iep-blueprint',
  name: 'FPX-IEP Blueprint™',
  description: 'Create a comprehensive, jurisdiction-aware IEP with AI-powered insights and data integration',
  icon: FileText,
  flagKey: 'enable-assessment-iep',
  steps: [
    {
      id: 'student-profile',
      title: 'Student Profile',
      description: 'Student and family demographics',
      component: StudentOverviewStep,
      validation: (data) => {
        return !!(
          data?.firstName?.trim() && 
          data?.lastName?.trim() &&
          data?.dateOfBirth && 
          data?.gradeLevel &&
          data?.schoolName?.trim() &&
          data?.parentGuardianName?.trim()
        );
      },
    },
    {
      id: 'jurisdiction-consent',
      title: 'Jurisdiction & Consent',
      description: 'Select legal jurisdiction and obtain consents',
      component: JurisdictionConsentStep,
      validation: (data) => {
        if (!data?.jurisdiction) return false;
        const requiredConsents = data.jurisdiction === 'US' ? 3 : 2;
        const consents = data?.consents || [];
        return consents.length >= requiredConsents && !!data?.electronicSignature?.trim();
      },
    },
    {
      id: 'concerns-referral',
      title: 'Concerns & Referral',
      description: 'Document reasons for referral and concerns',
      component: ConcernsReferralStep,
      validation: (data) => {
        return !!(
          data?.areasOfConcern?.length > 0 &&
          data?.referralSource &&
          data?.referralDate &&
          data?.primaryConcerns?.trim()
        );
      },
    },
    {
      id: 'screening-eligibility',
      title: 'Screening & Eligibility',
      description: 'Document evaluations and determine eligibility',
      component: ScreeningEligibilityStep,
      validation: (data) => {
        return !!(
          data?.eligibilityStatus &&
          data?.determinationDate
        );
      },
    },
    {
      id: 'present-levels',
      title: 'Present Levels (PLAAFP)',
      description: 'Current academic and functional performance',
      component: PresentLevelsStep,
      validation: (data) => {
        return !!(
          data?.reading?.performanceLevel?.trim() ||
          data?.mathematics?.performanceLevel?.trim() ||
          data?.communication?.performanceLevel?.trim()
        );
      },
    },
    {
      id: 'goals-objectives',
      title: 'Goals & Objectives',
      description: 'Measurable annual goals and short-term objectives',
      component: GoalsObjectivesStep,
      validation: (data) => Array.isArray(data?.goals) && data.goals.length > 0,
    },
    {
      id: 'services-supports',
      title: 'Services & Supports',
      description: 'Special education and related services',
      component: ServicesSupportsStep,
      validation: (data) => Array.isArray(data?.services) && data.services.length > 0,
    },
    {
      id: 'lre-placement',
      title: 'LRE & Placement',
      description: 'Least Restrictive Environment determination',
      component: LREPlacementStep,
      validation: (data) => {
        return !!(
          data?.placement &&
          data?.placementJustification?.trim() &&
          data?.generalEdParticipation
        );
      },
    },
    {
      id: 'transition-planning',
      title: 'Transition Planning',
      description: 'Post-secondary transition services (age 14+)',
      component: TransitionPlanningStep,
    },
    {
      id: 'assessment-participation',
      title: 'Assessment Participation',
      description: 'State and district-wide assessment participation',
      component: AssessmentParticipationStep,
    },
    {
      id: 'parent-student-input',
      title: 'Parent & Student Input',
      description: 'Capture family vision and student voice',
      component: ParentStudentInputStep,
      validation: (data) => !!data?.familyVision?.trim(),
    },
    {
      id: 'progress-monitoring',
      title: 'Progress Monitoring',
      description: 'Data collection and reporting plan',
      component: ProgressMonitoringStep,
      validation: (data) => Array.isArray(data?.dataCollectionMethods) && data.dataCollectionMethods.length > 0,
    },
    {
      id: 'review-finalize',
      title: 'Review & Finalize',
      description: 'Review complete IEP and obtain signatures',
      component: ReviewFinalizeStep,
    },
  ],
  estimatedMinutes: 90,
  requiresSubscription: 'team',
  category: 'educational',
};
