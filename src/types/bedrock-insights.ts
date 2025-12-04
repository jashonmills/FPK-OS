export interface AnalysisMetric {
  name: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  confidence?: number;
}

export interface Insight {
  type: string;
  content: string;
  priority?: 'high' | 'medium' | 'low';
  timestamp?: string;
}

export interface ProgressTracking {
  metric: string;
  current_value: number;
  target_value: number;
  progress_percentage: number;
  trend?: 'improving' | 'declining' | 'stable';
}

export interface BIPSpecificData {
  behavior_hypothesis?: string;
  target_behavior_description?: string;
  antecedent_modification?: string[];
  consequence_modification?: string[];
  replacement_behavior?: string;
  teaching_strategies?: string[];
  crisis_plan?: string[];
  data_collection_method?: string;
}

export interface AnalysisData {
  insights?: Insight[];
  metrics?: AnalysisMetric[];
  progress_tracking?: ProgressTracking[];
  bip_data?: BIPSpecificData;
  [key: string]: any; // Allow for additional dynamic fields
}
