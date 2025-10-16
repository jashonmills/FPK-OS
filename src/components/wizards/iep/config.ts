import { WizardConfig } from '@/lib/wizards/types';
import { FileText } from 'lucide-react';
import { JurisdictionConsentStep } from './steps/JurisdictionConsentStep';
import { StudentOverviewStep } from './steps/StudentOverviewStep';
import { TeamMembersStep } from './steps/TeamMembersStep';
import { ConcernsReferralStep } from './steps/ConcernsReferralStep';
import { AcademicStrengthsStep } from './steps/AcademicStrengthsStep';
import { AcademicPerformanceStep } from './steps/AcademicPerformanceStep';

console.log('📚 IEP Config Loading - Components:', {
  JurisdictionConsentStep: !!JurisdictionConsentStep,
  StudentOverviewStep: !!StudentOverviewStep,
  TeamMembersStep: !!TeamMembersStep,
  ConcernsReferralStep: !!ConcernsReferralStep,
  AcademicStrengthsStep: !!AcademicStrengthsStep,
  AcademicPerformanceStep: !!AcademicPerformanceStep,
});

export const iepWizardConfig: WizardConfig = {
  type: 'iep-blueprint',
  name: 'FPX-IEP Blueprint™',
  description: 'Create a comprehensive, jurisdiction-aware IEP with AI-powered insights and data integration',
  icon: FileText,
  flagKey: 'enable-assessment-iep',
  steps: [
    {
      id: 'jurisdiction-consent',
      title: 'Jurisdiction & Consent',
      description: 'Select your legal jurisdiction (US or Ireland)',
      component: JurisdictionConsentStep,
      validation: (data) => !!data?.jurisdiction,
    },
    {
      id: 'student-profile',
      title: 'Student Profile',
      description: 'Student and family demographics',
      component: StudentOverviewStep,
      validation: (data) => !!data?.studentName && !!data?.dateOfBirth,
    },
    {
      id: 'team-members',
      title: 'IEP Team Members',
      description: 'Document all team participants',
      component: TeamMembersStep,
      validation: (data) => Array.isArray(data?.teamMembers) && data.teamMembers.length > 0,
    },
    {
      id: 'concerns-referral',
      title: 'Parent Concerns',
      description: 'Your concerns and reasons for referral',
      component: ConcernsReferralStep,
      validation: (data) => !!data?.parentConcerns && data.parentConcerns.length > 20,
    },
    {
      id: 'present-levels',
      title: 'Present Levels (PLOP)',
      description: 'Current academic and functional performance',
      component: AcademicPerformanceStep,
      validation: (data) => !!data?.academicPerformance || !!data?.functionalPerformance,
    },
    {
      id: 'goals-objectives',
      title: 'Goals & Objectives',
      description: 'Measurable annual goals and short-term objectives',
      component: AcademicStrengthsStep, // Placeholder - will be replaced
    },
    {
      id: 'services-supports',
      title: 'Services & Supports',
      description: 'Accommodations, modifications, and service delivery',
      component: AcademicStrengthsStep, // Placeholder - will be replaced
    },
    {
      id: 'lre-placement',
      title: 'LRE & Placement',
      description: 'Least Restrictive Environment determination',
      component: AcademicStrengthsStep, // Placeholder - will be replaced
    },
    {
      id: 'assessment-participation',
      title: 'Assessment Participation',
      description: 'State and district-wide assessment participation',
      component: AcademicStrengthsStep, // Placeholder - will be replaced
    },
    {
      id: 'transition-planning',
      title: 'Transition Planning',
      description: 'Post-secondary transition services (age 14+)',
      component: AcademicStrengthsStep, // Placeholder - will be replaced
    },
    {
      id: 'progress-monitoring',
      title: 'Progress Monitoring',
      description: 'How and when progress will be reported',
      component: AcademicStrengthsStep, // Placeholder - will be replaced
    },
    {
      id: 'review-finalize',
      title: 'Review & Finalize',
      description: 'Review complete IEP and export to PDF',
      component: AcademicStrengthsStep, // Placeholder - will be replaced
    },
  ],
  estimatedMinutes: 60,
  requiresSubscription: 'team',
  category: 'educational',
};
