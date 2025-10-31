// Sample data for Chart Library showcase
// This data is designed to make each chart look impressive and easy to understand

// For Behavior Function Analysis chart
export const sampleBehaviorData = [
  {
    behavior_type: "Elopement",
    frequency: 8,
    common_antecedent: "difficult task demand",
    common_consequence: "allowed to escape/avoid work",
  },
  {
    behavior_type: "Verbal Outbursts",
    frequency: 12,
    common_antecedent: "peer nearby or teacher attention on others",
    common_consequence: "gains adult or peer attention",
  },
  {
    behavior_type: "Property Destruction",
    frequency: 5,
    common_antecedent: "denied access to preferred item",
    common_consequence: "obtains desired tangible item",
  },
  {
    behavior_type: "Self-Stimulation",
    frequency: 15,
    common_antecedent: "low stimulation environment",
    common_consequence: "provides sensory stimulation/input",
  },
  {
    behavior_type: "Non-Compliance",
    frequency: 10,
    common_antecedent: "transition time or change in routine",
    common_consequence: "escapes or avoids transition",
  },
];

// For IEP Goal & Service Tracker
export const sampleIEPGoals = [
  {
    goal_category: "Life Skills",
    goal_count: 2,
    avg_progress: 75,
  },
  {
    goal_category: "Behavioral",
    goal_count: 3,
    avg_progress: 45,
  },
  {
    goal_category: "Academic",
    goal_count: 4,
    avg_progress: 60,
  },
  {
    goal_category: "Social Communication",
    goal_count: 2,
    avg_progress: 30,
  },
];

// For Academic Fluency Trends
export const sampleAcademicFluency = [
  { measurement_date: "2025-09-01", reading_fluency: 25, math_fluency: 12, reading_target: 40, math_target: 25 },
  { measurement_date: "2025-09-08", reading_fluency: 28, math_fluency: 14, reading_target: 40, math_target: 25 },
  { measurement_date: "2025-09-15", reading_fluency: 30, math_fluency: 15, reading_target: 40, math_target: 25 },
  { measurement_date: "2025-09-22", reading_fluency: 32, math_fluency: 16, reading_target: 40, math_target: 25 },
  { measurement_date: "2025-09-29", reading_fluency: 35, math_fluency: 18, reading_target: 40, math_target: 25 },
  { measurement_date: "2025-10-06", reading_fluency: 38, math_fluency: 20, reading_target: 40, math_target: 25 },
];

// For Social Interaction Funnel
export const sampleSocialSkills = [
  { skill_name: "Task Initiation", success_rate: 75, total_attempts: 45 },
  { skill_name: "Social Reciprocity", success_rate: 60, total_attempts: 38 },
  { skill_name: "Peer Play Initiation", success_rate: 45, total_attempts: 30 },
  { skill_name: "Social Referencing", success_rate: 55, total_attempts: 25 },
  { skill_name: "Turn-Taking", success_rate: 70, total_attempts: 42 },
];

export const sampleSensoryProfile = [
  { sensory_category: "Auditory", intensity_level: "High", frequency: 8 },
  { sensory_category: "Auditory", intensity_level: "Moderate", frequency: 3 },
  { sensory_category: "Visual", intensity_level: "Low", frequency: 2 },
  { sensory_category: "Visual", intensity_level: "Moderate", frequency: 5 },
  { sensory_category: "Tactile", intensity_level: "High", frequency: 12 },
  { sensory_category: "Tactile", intensity_level: "Moderate", frequency: 4 },
  { sensory_category: "Vestibular", intensity_level: "Low", frequency: 6 },
  { sensory_category: "Vestibular", intensity_level: "High", frequency: 2 },
  { sensory_category: "Proprioceptive", intensity_level: "Moderate", frequency: 7 },
  { sensory_category: "Proprioceptive", intensity_level: "High", frequency: 3 },
  { sensory_category: "Gustatory", intensity_level: "High", frequency: 9 },
  { sensory_category: "Gustatory", intensity_level: "Low", frequency: 2 },
  { sensory_category: "Olfactory", intensity_level: "Moderate", frequency: 6 },
  { sensory_category: "Olfactory", intensity_level: "High", frequency: 4 },
];

export const sampleActivityLogs = [
  { log_date: "2025-10-01", incident_count: 2, parent_count: 3, educator_count: 4, total_count: 9 },
  { log_date: "2025-10-02", incident_count: 1, parent_count: 2, educator_count: 3, total_count: 6 },
  { log_date: "2025-10-03", incident_count: 3, parent_count: 4, educator_count: 5, total_count: 12 },
  { log_date: "2025-10-04", incident_count: 1, parent_count: 2, educator_count: 4, total_count: 7 },
  { log_date: "2025-10-05", incident_count: 0, parent_count: 3, educator_count: 3, total_count: 6 },
  { log_date: "2025-10-06", incident_count: 2, parent_count: 2, educator_count: 4, total_count: 8 },
  { log_date: "2025-10-07", incident_count: 4, parent_count: 3, educator_count: 5, total_count: 12 },
];

export const sampleSleepData = [
  { sleep_date: "2025-10-01", total_sleep_hours: 8.5, sleep_quality_rating: 4, nap_taken: false },
  { sleep_date: "2025-10-02", total_sleep_hours: 6.5, sleep_quality_rating: 2, nap_taken: true },
  { sleep_date: "2025-10-03", total_sleep_hours: 7.0, sleep_quality_rating: 3, nap_taken: false },
  { sleep_date: "2025-10-04", total_sleep_hours: 9.0, sleep_quality_rating: 5, nap_taken: false },
  { sleep_date: "2025-10-05", total_sleep_hours: 5.5, sleep_quality_rating: 2, nap_taken: true },
  { sleep_date: "2025-10-06", total_sleep_hours: 8.0, sleep_quality_rating: 4, nap_taken: false },
  { sleep_date: "2025-10-07", total_sleep_hours: 7.5, sleep_quality_rating: 3, nap_taken: false },
];

export const sampleMoodData = [
  { day_of_week: "Monday", day_order: 2, mood: "calm", count: 8 },
  { day_of_week: "Monday", day_order: 2, mood: "anxious", count: 3 },
  { day_of_week: "Tuesday", day_order: 3, mood: "happy", count: 10 },
  { day_of_week: "Tuesday", day_order: 3, mood: "calm", count: 6 },
  { day_of_week: "Wednesday", day_order: 4, mood: "calm", count: 7 },
  { day_of_week: "Wednesday", day_order: 4, mood: "tired", count: 5 },
  { day_of_week: "Thursday", day_order: 5, mood: "happy", count: 9 },
  { day_of_week: "Thursday", day_order: 5, mood: "agitated", count: 2 },
  { day_of_week: "Friday", day_order: 6, mood: "happy", count: 12 },
  { day_of_week: "Friday", day_order: 6, mood: "calm", count: 8 },
];

export const sampleIncidentData = [
  { log_date: "2025-10-01", incident_count: 2 },
  { log_date: "2025-10-02", incident_count: 1 },
  { log_date: "2025-10-03", incident_count: 4 },
  { log_date: "2025-10-04", incident_count: 1 },
  { log_date: "2025-10-05", incident_count: 0 },
  { log_date: "2025-10-06", incident_count: 2 },
  { log_date: "2025-10-07", incident_count: 5 },
];

export const sampleInterventionData = [
  { log_date: "2025-10-01", incident_count: 2, intervention_count: 2 },
  { log_date: "2025-10-02", incident_count: 1, intervention_count: 1 },
  { log_date: "2025-10-03", incident_count: 4, intervention_count: 3 },
  { log_date: "2025-10-04", incident_count: 1, intervention_count: 1 },
  { log_date: "2025-10-05", incident_count: 0, intervention_count: 0 },
  { log_date: "2025-10-06", incident_count: 2, intervention_count: 2 },
  { log_date: "2025-10-07", incident_count: 5, intervention_count: 4 },
];

export const sampleGoalProgress = [
  {
    id: "1",
    goal_title: "Independent Toileting",
    goal_type: "life_skill",
    current_value: 65,
    target_value: 90,
    unit: "percent",
  },
  {
    id: "2",
    goal_title: "Self-Regulation During Transitions",
    goal_type: "behavioral",
    current_value: 45,
    target_value: 80,
    unit: "percent",
  },
  {
    id: "3",
    goal_title: "Reading Comprehension",
    goal_type: "academic",
    current_value: 72,
    target_value: 85,
    unit: "percent",
  },
];

// Generate individual intervention outcomes for StrategyEffectiveness component
const generateInterventionOutcomes = () => {
  const strategies = [
    { name: "Visual Schedule", successCount: 18, totalUses: 20 },
    { name: "Deep Pressure", successCount: 14, totalUses: 18 },
    { name: "Break Card", successCount: 12, totalUses: 15 },
    { name: "First-Then Board", successCount: 16, totalUses: 22 },
    { name: "Sensory Bin", successCount: 9, totalUses: 12 },
  ];

  const outcomes: Array<{ intervention_name: string; outcome_success: boolean }> = [];
  
  strategies.forEach(strategy => {
    // Add successful outcomes
    for (let i = 0; i < strategy.successCount; i++) {
      outcomes.push({ intervention_name: strategy.name, outcome_success: true });
    }
    // Add unsuccessful outcomes
    for (let i = 0; i < strategy.totalUses - strategy.successCount; i++) {
      outcomes.push({ intervention_name: strategy.name, outcome_success: false });
    }
  });

  return outcomes;
};

export const sampleStrategyData = generateInterventionOutcomes();

// For Prompting Level Fading chart
export const samplePromptingData = [
  { log_date: "2025-09-01", independent_count: 0, gestural_count: 0, verbal_count: 0, physical_count: 2, full_prompt_count: 5 },
  { log_date: "2025-09-08", independent_count: 0, gestural_count: 0, verbal_count: 1, physical_count: 3, full_prompt_count: 4 },
  { log_date: "2025-09-15", independent_count: 0, gestural_count: 1, verbal_count: 2, physical_count: 4, full_prompt_count: 2 },
  { log_date: "2025-09-22", independent_count: 1, gestural_count: 2, verbal_count: 3, physical_count: 3, full_prompt_count: 1 },
  { log_date: "2025-09-29", independent_count: 2, gestural_count: 3, verbal_count: 5, physical_count: 2, full_prompt_count: 0 },
  { log_date: "2025-10-06", independent_count: 4, gestural_count: 5, verbal_count: 4, physical_count: 1, full_prompt_count: 0 },
];

// For Sleep & Behavior Correlation chart
export const sampleSleepBehaviorData = [
  { date: "Sep 25", sleep_hours: 9.5, next_day_incidents: 0 },
  { date: "Sep 26", sleep_hours: 8.0, next_day_incidents: 1 },
  { date: "Sep 27", sleep_hours: 6.5, next_day_incidents: 3 },
  { date: "Sep 28", sleep_hours: 7.0, next_day_incidents: 2 },
  { date: "Sep 29", sleep_hours: 9.0, next_day_incidents: 0 },
  { date: "Sep 30", sleep_hours: 8.5, next_day_incidents: 1 },
  { date: "Oct 01", sleep_hours: 7.5, next_day_incidents: 1 },
  { date: "Oct 02", sleep_hours: 5.5, next_day_incidents: 4 },
  { date: "Oct 03", sleep_hours: 6.0, next_day_incidents: 3 },
  { date: "Oct 04", sleep_hours: 8.5, next_day_incidents: 1 },
  { date: "Oct 05", sleep_hours: 9.5, next_day_incidents: 0 },
  { date: "Oct 06", sleep_hours: 9.0, next_day_incidents: 0 },
];
