import { LucideIcon } from 'lucide-react';

export interface WizardConfig {
  type: string;
  name: string;
  description: string;
  icon: LucideIcon;
  flagKey: string;
  steps: WizardStepConfig[];
  estimatedMinutes: number;
  requiresSubscription?: 'team' | 'pro';
  category: 'educational' | 'behavioral' | 'autism' | 'adhd' | 'learning' | 'developmental';
}

export interface WizardStepConfig {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<WizardStepProps>;
  validation?: (data: any) => boolean;
}

export interface WizardStepProps {
  data: Record<string, any>;
  onUpdate: (data: Record<string, any>) => void;
}

export interface WizardSession {
  id: string;
  family_id: string;
  student_id: string;
  wizard_type: string;
  current_step: number;
  total_steps: number;
  session_data: Record<string, any>;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
  last_updated: string;
  created_by: string;
  created_at: string;
}

export interface WizardCompletion {
  id: string;
  sessionId: string;
  familyId: string;
  studentId: string;
  wizardType: string;
  generatedReport: {
    summary: string;
    sections: ReportSection[];
    recommendations: string[];
    nextSteps: string[];
    resources?: Array<{ title: string; url: string }>;
    generatedAt: string;
  };
  pdfUrl?: string;
  completedAt: string;
}

export interface ReportSection {
  title: string;
  content: string;
  subsections?: Array<{ title: string; content: string }>;
}
