/**
 * Analytics Chart → Document Metric Mapping
 * 
 * This file documents which metric_type values each analytics chart expects,
 * and which document types should generate those metrics.
 */

export const CHART_METRIC_MAPPING = {
  // BEHAVIORAL TAB
  behavior_function_analysis: {
    requiredMetrics: [
      { type: 'behavioral_incident', fields: ['metric_name', 'frequency', 'context', 'intervention_used'] },
      { type: 'behavior_frequency', fields: ['metric_name', 'frequency', 'context', 'intervention_used'] }
    ],
    sourceDocuments: ['BFA', 'Incident Log', 'Psychoeducational Evaluation', 'BIP'],
    rpcFunction: 'get_behavior_function_data'
  },

  prompting_level_fading: {
    requiredMetrics: [
      { type: 'prompting_level', fields: ['metric_name', 'metric_value', 'measurement_date'] }
    ],
    sourceDocuments: ['Educator Log', 'BIP', 'Progress Report'],
    rpcFunction: 'get_prompting_trend_data'
  },

  environmental_impact: {
    requiredMetrics: [
      { type: 'environmental_factor', fields: ['metric_name', 'metric_value', 'context'] }
    ],
    sourceDocuments: ['Incident Log with Weather', 'Educator Log'],
    rpcFunction: 'get_environmental_impact_data'
  },

  transition_success_rates: {
    requiredMetrics: [
      { type: 'transition', fields: ['metric_name', 'metric_value', 'context', 'intervention_used'] }
    ],
    sourceDocuments: ['Educator Log', 'Parent Log', 'BIP'],
    rpcFunction: 'get_transition_success_data'
  },

  // ACADEMIC TAB
  iep_goal_service_tracker: {
    requiredMetrics: [
      { type: 'goal_progress', fields: ['metric_name', 'metric_value', 'target_value'] },
      { type: 'service_hours', fields: ['metric_name', 'metric_value'] }
    ],
    sourceDocuments: ['IEP', 'Progress Report', 'Service Log'],
    rpcFunction: 'get_iep_goal_progress'
  },

  academic_fluency_trends: {
    requiredMetrics: [
      { type: 'academic_fluency', fields: ['metric_name', 'metric_value', 'target_value', 'measurement_date'] },
      { type: 'academic_performance', fields: ['metric_name', 'metric_value', 'target_value', 'measurement_date'] }
    ],
    sourceDocuments: ['Psychoeducational Evaluation', 'Progress Report', 'Academic Assessment'],
    rpcFunction: 'get_academic_fluency_data',
    expectedMetrics: [
      'Reading Fluency (WPM)',
      'Math Fluency (Problems/Min)',
      'Reading Comprehension',
      'Math Calculation Speed'
    ]
  },

  reading_error_analysis: {
    requiredMetrics: [
      { type: 'reading_error', fields: ['metric_name', 'frequency', 'context'] }
    ],
    sourceDocuments: ['Reading Assessment', 'Psychoeducational Evaluation'],
    expectedMetrics: [
      'Decoding Errors',
      'Fluency Errors',
      'Comprehension Errors',
      'Word Recognition Errors'
    ]
  },

  task_initiation_latency: {
    requiredMetrics: [
      { type: 'task_initiation', fields: ['metric_value', 'context', 'intervention_used', 'measurement_date'] }
    ],
    sourceDocuments: ['Educator Log', 'Executive Function Assessment'],
    rpcFunction: 'get_task_initiation_data'
  },

  working_memory_success: {
    requiredMetrics: [
      { type: 'working_memory', fields: ['metric_name', 'metric_value', 'target_value'] }
    ],
    sourceDocuments: ['Psychoeducational Evaluation', 'Educator Log', 'Cognitive Assessment']
  },

  daily_living_skills_trends: {
    requiredMetrics: [
      { type: 'daily_living_skill', fields: ['metric_name', 'metric_value', 'measurement_date'] },
      { type: 'adaptive_behavior', fields: ['metric_name', 'metric_value', 'measurement_date'] }
    ],
    sourceDocuments: ['Adaptive Behavior Assessment', 'Parent Log', 'OT Evaluation']
  },

  // SOCIAL TAB
  social_interaction_funnel: {
    requiredMetrics: [
      { type: 'social_skill', fields: ['metric_name', 'metric_value', 'target_value'] }
    ],
    sourceDocuments: ['Social Skills Assessment', 'Educator Log'],
    rpcFunction: 'get_social_skills_data',
    expectedMetrics: [
      'Peer Interaction Initiation',
      'Conversation Skills',
      'Social Problem Solving',
      'Perspective Taking'
    ]
  },

  communication_progress: {
    requiredMetrics: [
      { type: 'communication', fields: ['metric_name', 'metric_value', 'measurement_date'] },
      { type: 'language_development', fields: ['metric_name', 'metric_value', 'measurement_date'] }
    ],
    sourceDocuments: ['Speech-Language Evaluation', 'Parent Log']
  },

  peer_interaction_quality: {
    requiredMetrics: [
      { type: 'peer_interaction', fields: ['metric_name', 'metric_value', 'context'] }
    ],
    sourceDocuments: ['Social Skills Assessment', 'Educator Log'],
    rpcFunction: 'get_peer_interaction_data'
  },

  self_regulation_skills: {
    requiredMetrics: [
      { type: 'self_regulation', fields: ['metric_name', 'metric_value', 'measurement_date'] },
      { type: 'emotional_regulation', fields: ['metric_name', 'metric_value', 'measurement_date'] }
    ],
    sourceDocuments: ['Social-Emotional Assessment', 'Incident Log']
  },

  attention_span_tracking: {
    requiredMetrics: [
      { type: 'attention_span', fields: ['metric_name', 'metric_value', 'duration_minutes', 'context'] }
    ],
    sourceDocuments: ['Educator Log', 'ADHD Assessment'],
    rpcFunction: 'get_attention_span_data',
    expectedMetrics: [
      'Sustained Attention (Academic)',
      'Sustained Attention (Play)',
      'Selective Attention',
      'Divided Attention'
    ]
  },

  // SENSORY TAB
  executive_function_dashboard: {
    requiredMetrics: [
      { type: 'executive_function', fields: ['metric_name', 'metric_value'] }
    ],
    sourceDocuments: ['Executive Function Assessment', 'Psychoeducational Evaluation']
  },

  sensory_profile_heatmap: {
    requiredMetrics: [
      { type: 'sensory_profile', fields: ['metric_name', 'metric_value', 'frequency'] }
    ],
    sourceDocuments: ['OT Evaluation', 'Sensory Profile', 'Parent Log'],
    rpcFunction: 'get_sensory_profile_data',
    expectedMetrics: [
      'Auditory Sensitivity',
      'Visual Sensitivity',
      'Tactile Sensitivity',
      'Proprioceptive Seeking',
      'Vestibular Seeking'
    ]
  },

  sensory_integration_patterns: {
    requiredMetrics: [
      { type: 'sensory_integration', fields: ['metric_name', 'metric_value'] }
    ],
    sourceDocuments: ['OT Evaluation', 'Sensory Profile'],
    rpcFunction: 'get_sensory_integration_data'
  },

  fine_motor_skill_mastery: {
    requiredMetrics: [
      { type: 'fine_motor', fields: ['metric_name', 'metric_value', 'measurement_date'] }
    ],
    sourceDocuments: ['OT Evaluation', 'Educator Log']
  },

  gross_motor_planning: {
    requiredMetrics: [
      { type: 'gross_motor', fields: ['metric_name', 'metric_value', 'measurement_date'] }
    ],
    sourceDocuments: ['PT Evaluation', 'OT Evaluation']
  }
};

/**
 * Document Type → Expected Metrics Mapping
 */
export const DOCUMENT_METRIC_EXTRACTION = {
  'IEP': [
    { type: 'goal_progress', examples: ['Reading goal: 80% → 85%', 'Math goal: 65% → 75%'] },
    { type: 'service_hours', examples: ['Speech therapy: 2 hrs/week', 'OT: 1.5 hrs/week'] },
    { type: 'academic_performance', examples: ['Reading level: Grade 2.5', 'Math computation: 75%'] }
  ],
  
  'Progress Report': [
    { type: 'academic_fluency', examples: ['Reading fluency: 85 WPM', 'Math fluency: 12 problems/min'] },
    { type: 'academic_performance', examples: ['Reading comprehension: 80%', 'Math accuracy: 85%'] },
    { type: 'goal_progress', examples: ['Behavior goal: 75% success', 'Academic goal: 80% mastery'] }
  ],

  'Psychoeducational Evaluation': [
    { type: 'academic_fluency', examples: ['Reading speed: 90 WPM', 'Processing speed: 85th percentile'] },
    { type: 'cognitive_ability', examples: ['FSIQ: 105', 'Working memory: 95'] },
    { type: 'academic_performance', examples: ['Math reasoning: 25th percentile', 'Reading comprehension: 50th percentile'] }
  ],

  'BFA': [
    { type: 'behavioral_incident', examples: ['Aggression frequency: 3/day', 'Task refusal: 5/day'] },
    { type: 'behavior_frequency', examples: ['Escape-maintained: 60%', 'Attention-seeking: 30%'] }
  ],

  'BIP': [
    { type: 'behavioral_incident', examples: ['Baseline aggression: 5/day', 'Target: 1/day'] },
    { type: 'prompting_level', examples: ['Independence: 40%', 'Verbal prompt: 35%'] },
    { type: 'transition', examples: ['Transition success: 65%', 'Visual support needed: 80%'] }
  ],

  'OT Evaluation': [
    { type: 'sensory_profile', examples: ['Auditory sensitivity: 8/10', 'Tactile seeking: 7/10'] },
    { type: 'fine_motor', examples: ['Handwriting legibility: 6/10', 'Grasp strength: 4/10'] },
    { type: 'sensory_integration', examples: ['Vestibular processing: Low', 'Proprioceptive: Moderate'] }
  ],

  'Speech-Language Evaluation': [
    { type: 'communication', examples: ['Expressive language: 75th percentile', 'MLU: 4.2 words'] },
    { type: 'language_development', examples: ['Receptive vocabulary: 80th percentile', 'Articulation: 60%'] }
  ],

  'Social Skills Assessment': [
    { type: 'social_skill', examples: ['Peer initiation: 3/10 opportunities', 'Turn-taking: 7/10'] },
    { type: 'peer_interaction', examples: ['Play engagement: 15 min/session', 'Conflict resolution: 50%'] }
  ],

  'Executive Function Assessment': [
    { type: 'executive_function', examples: ['Planning: 40th percentile', 'Inhibition: 25th percentile'] },
    { type: 'task_initiation', examples: ['Avg latency: 45 seconds', 'Complex tasks: 90 seconds'] },
    { type: 'working_memory', examples: ['Digit span: 5', 'Visual WM: 35th percentile'] }
  ],

  'Educator Log': [
    { type: 'prompting_level', examples: ['Independent: 12 tasks', 'Verbal prompt: 8 tasks'] },
    { type: 'task_initiation', examples: ['Task start latency: 30 sec', 'With visual: 10 sec'] },
    { type: 'attention_span', examples: ['Academic tasks: 12 min', 'Preferred activity: 25 min'] },
    { type: 'transition', examples: ['Smooth transitions: 4/6', 'Support needed: 2/6'] }
  ]
};
