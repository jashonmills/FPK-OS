// Chart Manifest - Single Source of Truth for All Smart Charts

export interface ChartManifestItem {
  chartId: string;
  title: string;
  description: string;
  requiredDocuments: string[];
}

export const CHART_MANIFEST: ChartManifestItem[] = [
  // ==================== TIER 1: UNIVERSAL STANDARD CHARTS (7) ====================
  // These are always available to all users via daily logging
  {
    chartId: "daily_activity_trends",
    title: "Daily Activity Trends",
    description: "Tracks how time is spent across academics, breaks, therapy, and other activities.",
    requiredDocuments: ["Daily Log", "Activity Log"],
  },
  {
    chartId: "sleep_quality_analysis",
    title: "Sleep Quality Analysis",
    description: "Monitors sleep duration, interruptions, and quality scores over time.",
    requiredDocuments: ["Sleep Log", "Garmin Data", "Parent Log"],
  },
  {
    chartId: "weekly_mood_distribution",
    title: "Weekly Mood Distribution",
    description: "Shows the frequency of logged emotional states over the past week.",
    requiredDocuments: ["Mood Log", "Daily Log", "Parent Log"],
  },
  {
    chartId: "incident_frequency",
    title: "Incident Frequency",
    description: "Tracks the count of defined challenging behaviors over time.",
    requiredDocuments: ["Incident Log", "Behavioral Data"],
  },
  {
    chartId: "intervention_effectiveness",
    title: "Intervention Effectiveness",
    description: "Correlates logged interventions with changes in incident frequency.",
    requiredDocuments: ["Intervention Log", "Incident Log", "BIP"],
  },
  {
    chartId: "top_priority_goals",
    title: "Top Priority Goals",
    description: "Displays progress on the most critical user-defined goals with current vs. target values.",
    requiredDocuments: ["Goals", "Progress Tracking", "IEP"],
  },
  {
    chartId: "strategy_success_rates",
    title: "Strategy Success Rates",
    description: "Measures how often specific support strategies lead to positive outcomes.",
    requiredDocuments: ["Intervention Log", "Daily Log", "BIP"],
  },

  // ==================== TIER 2: SPECIALIZED DOMAIN CHARTS (12) ====================
  // AI-recommended based on uploaded document analysis
  
  // --- Behavioral Analysis ---
  {
    chartId: "behavior_function_analysis",
    title: "Behavior & Function Analysis",
    description: "Connects behaviors to their 'why' (e.g., escape, sensory, tangible, attention).",
    requiredDocuments: ["FBA", "BIP", "Disciplinary Report", "Behavior Intervention Plan", "ABC Data"],
  },
  
  // --- Academics & Services ---
  {
    chartId: "iep_goal_service_tracker",
    title: "IEP Goal & Service Tracker",
    description: "Tracks required vs. delivered therapy/service minutes and progress toward IEP goals.",
    requiredDocuments: ["IEP", "IEP Progress Report", "Service Logs", "Report Card"],
  },
  {
    chartId: "academic_fluency_trends",
    title: "Academic Fluency Trends",
    description: "Monitors progress in Reading (WPM) and Math (problems per minute) fluency over time.",
    requiredDocuments: ["Psychoeducational Eval", "Report Card", "IEP Progress Report", "CBM Data", "Academic Achievement Test"],
  },

  // --- Executive Function ---
  {
    chartId: "task_initiation_latency",
    title: "Task Initiation & Latency",
    description: "Measures the time it takes to begin a task after a prompt is given.",
    requiredDocuments: ["ADHD Evaluation", "Behavioral Data", "Executive Function Assessment", "Teacher Observations"],
  },
  {
    chartId: "working_memory_success",
    title: "Working Memory Success",
    description: "Tracks success rates with multi-step directions (1-step, 2-step, 3+ step tasks).",
    requiredDocuments: ["Cognitive Assessment", "SLP Report", "Neuropsychological Evaluation", "ADHD Eval"],
  },

  // --- Learning Differences ---
  {
    chartId: "reading_error_analysis",
    title: "Reading Error Analysis",
    description: "Categorizes reading mistakes (visual errors, reversals, phonological errors, etc.).",
    requiredDocuments: ["Dyslexia Assessment", "Reading Specialist Report", "Psychoeducational Eval", "SLP Report"],
  },

  // --- Motor Skills ---
  {
    chartId: "fine_motor_skill_mastery",
    title: "Fine Motor Skill Mastery",
    description: "Provides a holistic view of fine motor skills (grasp patterns, scissor use, writing, etc.).",
    requiredDocuments: ["OT Evaluation", "Motor Skills Assessment", "Dysgraphia Eval"],
  },
  {
    chartId: "gross_motor_planning",
    title: "Gross Motor Planning",
    description: "Measures success in completing multi-step physical actions and motor sequences.",
    requiredDocuments: ["PT Report", "APE Report", "Dyspraxia Evaluation", "Motor Planning Assessment"],
  },

  // --- Adaptive/Daily Living Skills ---
  {
    chartId: "daily_living_skills_trends",
    title: "Daily Living Skills (DLS) Trends",
    description: "Multi-line chart tracking independence in routines like teeth brushing, dressing, hygiene.",
    requiredDocuments: ["OT Report", "Adaptive Behavior Assessment", "ABLLS-R", "VB-MAPP"],
  },

  // --- Social & Communication ---
  {
    chartId: "social_interaction_funnel",
    title: "Social Interaction Funnel",
    description: "Visualizes the hierarchy of social skills, from basic responses to complex initiations.",
    requiredDocuments: ["Speech-Language Evaluation", "Social Skills Group Report", "ABA Session Notes", "Pragmatic Language Assessment"],
  },
  {
    chartId: "sensory_profile_heatmap",
    title: "Sensory Profile Heatmap",
    description: "Identifies patterns in sensory-seeking or sensory-avoiding behaviors across modalities.",
    requiredDocuments: ["OT Evaluation", "Sensory Profile", "Parent's Letter of Concern", "Sensory Processing Assessment"],
  },

  // --- Session Context ---
  {
    chartId: "session_activity_breakdown",
    title: "Session Activity Breakdown",
    description: "Stacked bar chart showing how time is allocated within sessions (academics, breaks, movement, etc.).",
    requiredDocuments: ["Teacher Logs", "Session Notes", "ABA Data Sheets", "Service Provider Logs"],
  },

  // ==================== TIER 3: CLINICAL DEEP-DIVE CORRELATIONAL CHARTS (8) ====================
  // AI-synthesized charts requiring multi-domain data integration
  
  {
    chartId: "behavior_vs_physiological_state",
    title: "Behavior vs. Physiological State",
    description: "Answers: Does behavior worsen when tired, hungry, sick, or under-rested?",
    requiredDocuments: ["Incident Log", "Sleep Log", "Health Log", "Parent Journal", "Medical Records"],
  },
  {
    chartId: "behavior_vs_academic_demand",
    title: "Behavior vs. Academic Demand",
    description: "Pinpoints which academic subjects or task types are the biggest behavioral triggers.",
    requiredDocuments: ["Incident Log", "Academic Data", "Teacher Observations", "IEP Progress Report"],
  },
  {
    chartId: "behavior_vs_social_density",
    title: "Behavior vs. Social Density",
    description: "Determines the optimal social 'dose' (peer count, group size) before overwhelm occurs.",
    requiredDocuments: ["Incident Log", "Daily Log", "Social Context Data", "Teacher Observations"],
  },
  {
    chartId: "intervention_ripple_effect",
    title: "Intervention Ripple Effect",
    description: "Shows if an intervention for one behavior helps or hurts other skills (e.g., do sensory breaks improve focus?).",
    requiredDocuments: ["Intervention Log", "Document Metrics", "Progress Tracking", "Multiple Skill Domains"],
  },
  {
    chartId: "prompting_hierarchy_vs_independence",
    title: "Prompting Hierarchy vs. Independence",
    description: "Visually proves if the support team is successfully fading prompts over time toward independence.",
    requiredDocuments: ["Daily Log", "Progress Tracking", "ABA Data", "Educator Logs"],
  },
  {
    chartId: "medication_titration_analysis",
    title: "Medication & Titration Analysis",
    description: "Overlays medication changes on key metrics (sleep, incidents, focus) to assess impact and side effects.",
    requiredDocuments: ["Medication Log", "Sleep Log", "Incident Log", "Behavioral Data", "Medical Records"],
  },
  {
    chartId: "skill_generalization_matrix",
    title: "Skill Generalization Matrix",
    description: "Shows if a skill is being used across different people, settings, and contexts (home, school, therapy).",
    requiredDocuments: ["Daily Log", "Teacher Log", "Parent Log", "Progress Tracking", "Generalization Data"],
  },
  {
    chartId: "cognitive_load_vs_error_rate",
    title: "Cognitive Load vs. Error Rate",
    description: "Reveals the conditions under which skills break down due to cognitive overload or task complexity.",
    requiredDocuments: ["Document Metrics", "Daily Log", "Academic Data", "Task Analysis", "Error Tracking"],
  },
];

/**
 * Get chart manifest item by ID
 */
export function getChartById(chartId: string): ChartManifestItem | undefined {
  return CHART_MANIFEST.find(chart => chart.chartId === chartId);
}

/**
 * Get all chart IDs
 */
export function getAllChartIds(): string[] {
  return CHART_MANIFEST.map(chart => chart.chartId);
}

/**
 * Format manifest for AI prompt
 */
export function formatManifestForAI(): string {
  return JSON.stringify(
    CHART_MANIFEST.map(chart => ({
      chartId: chart.chartId,
      title: chart.title,
      description: chart.description,
      requiredDocuments: chart.requiredDocuments,
    })),
    null,
    2
  );
}
