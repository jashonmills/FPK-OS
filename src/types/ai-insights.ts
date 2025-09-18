/**
 * AI Insights System Type Definitions
 * Based on the comprehensive AI insights specification
 */

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type RiskType = 'miss_deadline' | 'drop_mastery' | 'engagement_drop' | 'misconception_pattern';

export interface TopFeature {
  name: string;
  value: number | string;
  contribution: number;
}

export interface ActionCTA {
  action: string;
  label?: string;
  params?: Record<string, any>;
}

export interface AIInboxCard {
  id: string;
  type: 'risk_radar' | 'misconception_cluster' | 'gap_analysis' | 'engagement_alert' | 'content_quality';
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

export interface RiskRadarAlert {
  id: string;
  student_id: string;
  student_mask?: string;
  cohort_id?: string;
  risk_type: RiskType;
  risk_score: number;
  confidence: number;
  next_deadline_at?: string;
  top_features: TopFeature[];
  suggested_actions: ActionCTA[];
  resolved?: boolean;
  resolved_at?: string;
  window_days?: number;
  created_at: string;
  updated_at?: string;
}

export interface MisconceptionCluster {
  id: string;
  cohort_id: string;
  label: string;
  support_count: number;
  confidence: number;
  representative_answers: string[];
  linked_outcomes: string[];
  suggested_actions?: ActionCTA[];
  window_days?: number;
  created_at: string;
  updated_at?: string;
}

export interface GapAnalysisNode {
  id: string;
  course_id: string;
  cohort_id?: string;
  outcome_id: string;
  title: string;
  gap_score: number;
  confidence: number;
  blockers: Array<{
    outcome_id: string;
    title: string;
    contribution: number;
  }>;
  metrics: {
    accuracy?: number;
    avg_hints_tier3?: number;
    [key: string]: any;
  };
  window_days?: number;
  created_at: string;
  updated_at?: string;
}

export interface EngagementMatrix {
  id: string;
  cohort_id: string;
  quadrants: {
    high_eng_high_mastery: number;
    high_eng_low_mastery: number;
    low_eng_high_mastery: number;
    low_eng_low_mastery: number;
  };
  thresholds: {
    engagement: number;
    mastery: number;
  };
  examples?: {
    low_eng_low_mastery?: string[];
    [key: string]: string[] | undefined;
  };
  window_days?: number;
  created_at: string;
  updated_at?: string;
}

// API Response Types
export interface AIInboxResponse {
  data: AIInboxCard[];
  next_cursor?: string | null;
}

export interface RiskRadarResponse {
  cohort_id?: string;
  window: string;
  generated_at: string;
  data: RiskRadarAlert[];
  next_cursor?: string | null;
}

export interface GapAnalysisResponse {
  course_id: string;
  nodes: GapAnalysisNode[];
  edges: Array<{
    from: string;
    to: string;
  }>;
}

export interface MisconceptionResponse {
  cohort_id: string;
  clusters: MisconceptionCluster[];
}

// Hook Options
export interface AIInsightsOptions {
  org_id?: string;
  cohort_id?: string;
  course_id?: string;
  window?: string;
  limit?: number;
  role?: 'instructor' | 'owner' | 'admin';
  top_k?: number;
}

// Action Parameters
export interface AssignCheckpointParams {
  student_ids: string[];
  outcome_id: string;
  item_bank_id?: string;
  count: number;
  due_at: string;
}

export interface ScheduleSmallGroupParams {
  student_ids: string[];
  start_at: string;
  duration_min: number;
  host_id: string;
}

export interface CreatePracticeParams {
  cohort_id?: string;
  cluster_id?: string;
  outcome_ids?: string[];
  count_per_outcome?: number;
  count?: number;
  due_at: string;
}

// Analytics Event Types
export type AIInsightsEvent = 
  | 'ai.inbox.viewed'
  | 'ai.inbox.card.clicked' 
  | 'ai.inbox.card.dismissed'
  | 'ai.inbox.card.action'
  | 'ai.risk.generated'
  | 'ai.risk.student.flagged'
  | 'ai.gaps.generated'
  | 'ai.misconception.clustered'
  | 'actions.assign_checkpoint.created'
  | 'actions.small_group.scheduled'
  | 'actions.practice.created';

export interface AIInsightsEventPayload {
  event: AIInsightsEvent;
  card_id?: string;
  action_type?: string;
  cohort_id?: string;
  student_id?: string;
  [key: string]: any;
}