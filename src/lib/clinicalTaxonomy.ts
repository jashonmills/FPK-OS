/**
 * Clinical Taxonomy System
 * The "Gold Standard" categorization for FPK-X Analytics
 * 
 * This file standardizes 67+ metric_type values into clinically meaningful categories.
 * It ensures consistent data mapping across the entire analytics pipeline.
 */

export const CLINICAL_CATEGORIES = {
  // Behavioral Metrics
  behavioral_incidents: [
    'behavioral_incident',
    'behavior_frequency',
    'behavioral_frequency',
    'behavior_duration',
    'target_behavior',
    'challenging_behavior',
    'maladaptive_behavior'
  ],
  
  self_injurious_behavior: [
    'self_injurious_behavior',
    'sib',
    'self_injury',
    'self_harm'
  ],
  
  // Sleep Metrics
  sleep_metrics: [
    'sleep_quality',
    'sleep_hours',
    'sleep_quality_rating',
    'sleep_disruptions',
    'sleep_duration_trend',
    'sleep_pattern',
    'sleep_disturbance'
  ],
  
  // Communication & Language
  communication: [
    'communication',
    'communication_frequency',
    'language_development',
    'speech_therapy',
    'language_skills',
    'expressive_language',
    'receptive_language',
    'pragmatic_language',
    'articulation'
  ],
  
  functional_communication: [
    'functional_communication',
    'communication_attempts',
    'requesting_behavior',
    'manding',
    'tacting'
  ],
  
  // Academic Performance
  academic_performance: [
    'academic_fluency',
    'academic_skill',
    'academic_performance',
    'reading_fluency',
    'math_fluency',
    'writing_skill'
  ],
  
  work_avoidance: [
    'work_avoidance',
    'task_refusal',
    'escape_behavior',
    'avoidance_behavior'
  ],
  
  // IEP Goals & Services
  goal_tracking: [
    'goal_progress',
    'service_delivery',
    'service_hours',
    'iep_goal',
    'objective_progress'
  ],
  
  // Motor Skills
  fine_motor: [
    'fine_motor',
    'fine_motor_skill',
    'fine_motor_coordination',
    'hand_eye_coordination',
    'manipulation_skill'
  ],
  
  gross_motor: [
    'gross_motor',
    'gross_motor_skill',
    'motor_planning',
    'coordination',
    'balance'
  ],
  
  // Sensory Processing
  sensory_profile: [
    'sensory_profile',
    'sensory_processing',
    'sensory_integration',
    'sensory_sensitivity',
    'sensory_seeking',
    'sensory_avoiding'
  ],
  
  // Attention & Executive Function
  attention_metrics: [
    'attention_span',
    'attention_duration',
    'engagement_tracking',
    'sustained_attention',
    'selective_attention'
  ],
  
  executive_function: [
    'executive_function',
    'working_memory',
    'cognitive_flexibility',
    'inhibitory_control',
    'task_initiation',
    'planning_organization'
  ],
  
  // Social & Emotional
  social_interaction: [
    'social_interaction',
    'peer_interaction',
    'social_skills',
    'joint_attention',
    'social_reciprocity'
  ],
  
  emotional_regulation: [
    'emotional_regulation',
    'self_regulation',
    'mood',
    'affect',
    'emotional_response'
  ],
  
  // Daily Living & Adaptive
  daily_living: [
    'daily_living',
    'daily_living_skill',
    'adaptive_skill',
    'adaptive_behavior',
    'self_care',
    'independent_living'
  ],
  
  // Risk & Safety
  risk_factors: [
    'risk_assessment',
    'behavioral_risk_assessment',
    'health_risk_assessment',
    'behavioral_risk',
    'safety_concern'
  ],
  
  // Transition & Environment
  transition_success: [
    'transition',
    'transition_success',
    'environmental_change',
    'routine_change'
  ]
} as const;

/**
 * Reverse mapping: metric_type -> clinical category
 */
const METRIC_TO_CATEGORY: Record<string, string> = {};
Object.entries(CLINICAL_CATEGORIES).forEach(([category, metricTypes]) => {
  metricTypes.forEach(metricType => {
    METRIC_TO_CATEGORY[metricType] = category;
  });
});

/**
 * Categorize a metric_type into its clinical category
 * @param metricType - The raw metric_type from the database
 * @returns The clinical category name, or null if uncategorized
 */
export function categorizeMetric(metricType: string): string | null {
  const normalizedType = metricType.toLowerCase().trim();
  const category = METRIC_TO_CATEGORY[normalizedType];
  
  if (!category) {
    console.warn(`[Clinical Taxonomy] Uncategorized metric type: "${metricType}"`);
    return null;
  }
  
  return category;
}

/**
 * Get all metric_type values for a clinical category
 * @param category - The clinical category name
 * @returns Array of metric_type values in that category
 */
export function getAllMetricTypesForCategory(category: keyof typeof CLINICAL_CATEGORIES): string[] {
  return CLINICAL_CATEGORIES[category] ? [...CLINICAL_CATEGORIES[category]] : [];
}

/**
 * Validate if a metric_type exists in the taxonomy
 * @param metricType - The metric_type to validate
 * @returns true if the metric_type is recognized
 */
export function validateMetricType(metricType: string): boolean {
  const normalizedType = metricType.toLowerCase().trim();
  return normalizedType in METRIC_TO_CATEGORY;
}

/**
 * Get all recognized metric types across all categories
 * @returns Array of all valid metric_type values
 */
export function getAllRecognizedMetricTypes(): string[] {
  return Object.keys(METRIC_TO_CATEGORY);
}

/**
 * Get statistics about metric categorization
 * @returns Object with taxonomy statistics
 */
export function getTaxonomyStats() {
  return {
    totalCategories: Object.keys(CLINICAL_CATEGORIES).length,
    totalMetricTypes: Object.keys(METRIC_TO_CATEGORY).length,
    categoriesWithCounts: Object.entries(CLINICAL_CATEGORIES).map(([category, types]) => ({
      category,
      metricTypeCount: types.length
    }))
  };
}

/**
 * Normalize a metric_type to its canonical form
 * Returns the first (canonical) type in the category
 */
export function normalizeMetricType(metricType: string): string {
  const category = categorizeMetric(metricType);
  if (!category) return metricType; // Return original if uncategorized
  
  const categoryTypes = CLINICAL_CATEGORIES[category as keyof typeof CLINICAL_CATEGORIES];
  return categoryTypes[0]; // Return canonical (first) type
}
