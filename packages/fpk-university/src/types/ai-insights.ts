export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ActionCTA {
  action: string;
  label?: string;
  params?: Record<string, any>;
}

export interface AIInboxCard {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  severity: SeverityLevel;
  confidence: number;
  why?: string[];
  cta: ActionCTA;
  dismissed?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AIInboxResponse {
  data: AIInboxCard[];
  next_cursor?: string | null;
}

export interface AIInsightsOptions {
  org_id?: string;
  cohort_id?: string;
  course_id?: string;
  window?: string;
  limit?: number;
  role?: 'instructor' | 'owner' | 'admin';
  top_k?: number;
}