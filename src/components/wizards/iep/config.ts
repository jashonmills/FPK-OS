import { WizardConfig } from '@/lib/wizards/types';
import { FileText } from 'lucide-react';
import { StudentOverviewStep } from './steps/StudentOverviewStep';
import { AcademicStrengthsStep } from './steps/AcademicStrengthsStep';
import { AcademicPerformanceStep } from './steps/AcademicPerformanceStep';

export const iepWizardConfig: WizardConfig = {
  type: 'iep-blueprint',
  name: 'FPX-IEP Blueprint™',
  description: 'Create a comprehensive, data-driven IEP plan with SMART goals and accommodations',
  icon: FileText,
  flagKey: 'enable-assessment-iep',
  steps: [
    {
      id: 'student-overview',
      title: 'Student Overview',
      description: 'Basic information about the student',
      component: StudentOverviewStep,
      validation: (data) => !!data.studentName && !!data.grade && !!data.primaryDisability,
    },
    {
      id: 'academic-strengths',
      title: 'Academic Strengths',
      description: 'Select areas of academic strength',
      component: AcademicStrengthsStep,
    },
    {
      id: 'academic-performance',
      title: 'Academic Performance Details',
      description: 'Detailed academic performance information',
      component: AcademicPerformanceStep,
      validation: (data) => !!data.strengths && !!data.weaknesses,
    },
  ],
  estimatedMinutes: 45,
  requiresSubscription: 'team',
  category: 'educational',
};
