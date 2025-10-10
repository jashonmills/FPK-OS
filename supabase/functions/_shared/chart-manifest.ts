// Chart Manifest - Single Source of Truth for All Smart Charts

export interface ChartManifestItem {
  chartId: string;
  title: string;
  description: string;
  requiredDocuments: string[];
}

export const CHART_MANIFEST: ChartManifestItem[] = [
  // --- Behavioral Analysis ---
  {
    chartId: "behavior_function_analysis",
    title: "Behavior & Function Analysis",
    description: "Connects behaviors to their 'why' (e.g., escape, sensory).",
    requiredDocuments: ["FBA", "BIP", "Disciplinary Report", "Behavior Intervention Plan"],
  },
  {
    chartId: "incident_trigger_heatmap",
    title: "Incident Trigger Heatmap",
    description: "Visualizes correlations between incidents and triggers like time, location, or environment.",
    requiredDocuments: ["FBA", "Allergy Test Results", "GI Report", "Medical Records"],
  },
  {
    chartId: "strategy_effectiveness_tracker",
    title: "Strategy Effectiveness Tracker",
    description: "Ranks the success rate of different interventions used to de-escalate behaviors.",
    requiredDocuments: ["BIP", "ABA Re-authorization Report", "Parent Training Summary", "Intervention Data"],
  },
  
  // --- Academic & Educational ---
  {
    chartId: "iep_goal_service_tracker",
    title: "IEP Goal & Service Tracker",
    description: "Tracks progress toward IEP goals and associated services.",
    requiredDocuments: ["IEP", "IEP Progress Report", "Report Card", "Service Logs"],
  },
  {
    chartId: "academic_fluency_trends",
    title: "Academic Fluency Trends",
    description: "Tracks core academic skills like reading and math fluency over time.",
    requiredDocuments: ["Academic Achievement Test", "Report Card", "IEP Progress Report", "CBM Data"],
  },
  {
    chartId: "prompting_level_fading",
    title: "Prompting Level Fading",
    description: "Shows the transition from intrusive prompts (e.g., 'Hand-over-Hand') to independence.",
    requiredDocuments: ["ABA Session Notes", "Educator Logs", "OT Notes", "Skills Acquisition Data"],
  },
  
  // --- Health & Wellness ---
  {
    chartId: "sleep_behavior_correlation",
    title: "Sleep & Behavior Correlation",
    description: "Shows the relationship between sleep quality and next-day behavior.",
    requiredDocuments: ["Neurology Report", "Parent Journal", "Sleep Study", "Behavioral Data"],
  },
  {
    chartId: "medication_symptom_tracker",
    title: "Medication & Symptom Tracker",
    description: "Plots medication changes against key symptoms to track effectiveness.",
    requiredDocuments: ["Medication Prescription", "Neurology Report", "Psychiatry Report", "Medical Records"],
  },
  {
    chartId: "seizure_frequency_chart",
    title: "Seizure Frequency & Type",
    description: "Tracks the frequency and type of seizures over time.",
    requiredDocuments: ["Neurology Report", "EEG Results", "Hospital Discharge Summary", "Seizure Log"],
  },
  
  // --- Social & Communication ---
  {
    chartId: "social_interaction_funnel",
    title: "Social Interaction Funnel",
    description: "Visualizes the hierarchy of social skills, from responses to initiations.",
    requiredDocuments: ["Speech-Language Evaluation", "Social Skills Group Report", "ABA Session Notes", "Pragmatic Language Assessment"],
  },
  {
    chartId: "communication_method_pie",
    title: "Communication Method Breakdown",
    description: "Shows the percentage of communication attempts made via different methods (AAC, verbal, etc.).",
    requiredDocuments: ["Speech-Language Evaluation", "AAC Evaluation", "Parent Observations", "Communication Data"],
  },
  {
    chartId: "sensory_profile_heatmap",
    title: "Sensory Profile Heatmap",
    description: "Identifies patterns in sensory-seeking or sensory-avoiding behaviors.",
    requiredDocuments: ["OT Evaluation", "Sensory Profile", "Parent's Letter of Concern", "Sensory Processing Assessment"],
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
