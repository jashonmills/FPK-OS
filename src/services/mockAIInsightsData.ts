/**
 * Mock AI Insights Data Service
 * Provides sample data for development and testing
 */

import type { 
  AIInboxCard, 
  RiskRadarAlert, 
  MisconceptionCluster, 
  GapAnalysisNode, 
  EngagementMatrix 
} from '@/types/ai-insights';

export const mockInboxCards: AIInboxCard[] = [
  {
    id: '01JINB001',
    type: 'risk_radar',
    title: '3 students at risk in Algebra 1',
    subtitle: 'Next 7 days • 79% avg confidence',
    severity: 'high',
    confidence: 0.79,
    why: ['Inactivity + late streak', 'Tier-3 hint usage rising'],
    cta: { 
      action: 'open_risk_radar', 
      params: { cohort_id: '01JCOH001', window: '7d' } 
    },
    dismissed: false,
    created_at: '2025-09-18T10:02:00Z'
  },
  {
    id: '01JINB002',
    type: 'misconception_cluster',
    title: 'Median vs mean confusion',
    subtitle: 'Affects 18% of cohort',
    severity: 'medium',
    confidence: 0.82,
    cta: { 
      action: 'create_practice_from_cluster', 
      params: { cluster_id: '01JMC001' } 
    },
    dismissed: false,
    created_at: '2025-09-18T10:03:00Z'
  },
  {
    id: '01JINB003',
    type: 'gap_analysis',
    title: 'Prerequisite gaps detected in Unit 3',
    subtitle: 'Integer operations blocking progress',
    severity: 'medium',
    confidence: 0.74,
    why: ['Low accuracy in foundational skills', 'Multiple dependencies affected'],
    cta: { 
      action: 'create_practice_from_gaps', 
      params: { outcome_ids: ['INT.OP.1', 'ALG.CF.1'] } 
    },
    dismissed: false,
    created_at: '2025-09-18T09:45:00Z'
  }
];

export const mockRiskAlerts: RiskRadarAlert[] = [
  {
    id: '01JRSK001',
    student_id: '01JSTU001',
    student_mask: 'S-143',
    cohort_id: '01JCOH001',
    risk_type: 'miss_deadline',
    risk_score: 0.86,
    confidence: 0.81,
    next_deadline_at: '2025-09-21T23:59:59Z',
    top_features: [
      { name: 'days_inactive', value: 5, contribution: 0.32 },
      { name: 'late_ratio_30d', value: 0.4, contribution: 0.28 },
      { name: 'hint_tier3_rate', value: 0.22, contribution: 0.18 }
    ],
    suggested_actions: [
      { 
        action: 'assign_checkpoint', 
        label: 'Assign 3-Q checkpoint', 
        params: { outcome_id: 'ALG.CF.1' } 
      },
      { 
        action: 'schedule_small_group', 
        label: 'Schedule 10-min review', 
        params: { duration_min: 10 } 
      }
    ],
    resolved: false,
    created_at: '2025-09-18T10:00:00Z'
  },
  {
    id: '01JRSK002',
    student_id: '01JSTU003',
    student_mask: 'S-087',
    cohort_id: '01JCOH001',
    risk_type: 'drop_mastery',
    risk_score: 0.73,
    confidence: 0.74,
    next_deadline_at: '2025-09-22T23:59:59Z',
    top_features: [
      { name: 'quiz_drift', value: -0.12, contribution: 0.27 },
      { name: 'time_on_task_delta', value: -0.18, contribution: 0.21 }
    ],
    suggested_actions: [
      { 
        action: 'assign_checkpoint', 
        label: 'Checkpoint on INT.OP.1', 
        params: { outcome_id: 'INT.OP.1' } 
      }
    ],
    resolved: false,
    created_at: '2025-09-18T09:30:00Z'
  }
];

export const mockMisconceptions: MisconceptionCluster[] = [
  {
    id: '01JMC001',
    cohort_id: '01JCOH001',
    label: 'Median vs mean confusion',
    support_count: 8,
    confidence: 0.84,
    representative_answers: ['The average is the middle number…'],
    linked_outcomes: ['STAT.MEAN.1', 'STAT.MED.1'],
    suggested_actions: [
      {
        action: 'create_practice_from_cluster',
        label: 'Targeted practice',
        params: { cluster_id: '01JMC001' }
      }
    ],
    created_at: '2025-09-18T08:15:00Z'
  },
  {
    id: '01JMC002',
    cohort_id: '01JCOH001',
    label: 'Negative number operations',
    support_count: 12,
    confidence: 0.78,
    representative_answers: ['(-3) + (-4) = 1', 'Negative times negative is negative'],
    linked_outcomes: ['INT.OP.1', 'INT.OP.2'],
    suggested_actions: [
      {
        action: 'create_practice_from_cluster',
        label: 'Number line practice',
        params: { cluster_id: '01JMC002' }
      }
    ],
    created_at: '2025-09-18T07:30:00Z'
  }
];

export const mockGapNodes: GapAnalysisNode[] = [
  {
    id: '01JGAP001',
    course_id: '01JCRS001',
    cohort_id: '01JCOH001',
    outcome_id: 'ALG.CF.1',
    title: 'Factor a quadratic (a=1)',
    gap_score: 0.64,
    confidence: 0.77,
    blockers: [
      { 
        outcome_id: 'INT.OP.1', 
        title: 'Integer operations', 
        contribution: 0.41 
      }
    ],
    metrics: { 
      accuracy: 0.58, 
      avg_hints_tier3: 0.19 
    },
    created_at: '2025-09-18T08:00:00Z'
  },
  {
    id: '01JGAP002',
    course_id: '01JCRS001',
    cohort_id: '01JCOH001',
    outcome_id: 'INT.OP.1',
    title: 'Integer operations',
    gap_score: 0.82,
    confidence: 0.89,
    blockers: [],
    metrics: { 
      accuracy: 0.45, 
      avg_hints_tier3: 0.31 
    },
    created_at: '2025-09-18T08:00:00Z'
  }
];

export const mockEngagementMatrix: EngagementMatrix = {
  id: '01JEM001',
  cohort_id: '01JCOH001',
  quadrants: {
    high_eng_high_mastery: 12,
    high_eng_low_mastery: 8,
    low_eng_high_mastery: 6,
    low_eng_low_mastery: 5
  },
  thresholds: { 
    engagement: 0.6, 
    mastery: 0.7 
  },
  examples: { 
    low_eng_low_mastery: ['01JSTU004', '01JSTU007'] 
  },
  created_at: '2025-09-18T06:00:00Z'
};

// Mock service functions
export const getMockInboxCards = (options?: any): Promise<AIInboxCard[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockInboxCards);
    }, 500);
  });
};

export const getMockRiskAlerts = (options?: any): Promise<RiskRadarAlert[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockRiskAlerts);
    }, 600);
  });
};

export const getMockMisconceptions = (options?: any): Promise<MisconceptionCluster[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockMisconceptions);
    }, 400);
  });
};

export const getMockGapAnalysis = (options?: any): Promise<GapAnalysisNode[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockGapNodes);
    }, 700);
  });
};

export const getMockEngagementMatrix = (options?: any): Promise<EngagementMatrix> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockEngagementMatrix);
    }, 300);
  });
};