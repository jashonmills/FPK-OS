// Sample data for Chart Library showcase
// This data is designed to make each chart look impressive and easy to understand

export const sampleBehaviorData = [
  {
    name: "Elopement",
    frequency: 8,
    function: "Escape",
    x: 30,
    y: 70,
  },
  {
    name: "Verbal Outbursts",
    frequency: 12,
    function: "Attention",
    x: 70,
    y: 50,
  },
  {
    name: "Property Destruction",
    frequency: 5,
    function: "Tangible",
    x: 50,
    y: 30,
  },
  {
    name: "Self-Stimulation",
    frequency: 15,
    function: "Sensory",
    x: 20,
    y: 40,
  },
  {
    name: "Non-Compliance",
    frequency: 10,
    function: "Escape",
    x: 60,
    y: 80,
  },
];

export const sampleIEPGoals = [
  {
    category: "life_skill",
    activeGoals: 2,
    avgProgress: 75,
  },
  {
    category: "behavioral",
    activeGoals: 3,
    avgProgress: 45,
  },
  {
    category: "academic",
    activeGoals: 4,
    avgProgress: 60,
  },
  {
    category: "social",
    activeGoals: 2,
    avgProgress: 30,
  },
];

export const sampleAcademicFluency = [
  { date: "2025-09-01", reading: 25, math: 12 },
  { date: "2025-09-08", reading: 28, math: 14 },
  { date: "2025-09-15", reading: 30, math: 15 },
  { date: "2025-09-22", reading: 32, math: 16 },
  { date: "2025-09-29", reading: 35, math: 18 },
  { date: "2025-10-06", reading: 38, math: 20 },
];

export const sampleSocialSkills = [
  { skill: "Task Initiation", successRate: 75, totalAttempts: 45 },
  { skill: "Social Reciprocity", successRate: 60, totalAttempts: 38 },
  { skill: "Peer Play Initiation", successRate: 45, totalAttempts: 30 },
  { skill: "Social Referencing", successRate: 55, totalAttempts: 25 },
  { skill: "Turn-Taking", successRate: 70, totalAttempts: 42 },
];

export const sampleSensoryProfile = [
  { sensory_input: "Auditory", tolerance_level: 2, frequency: 8, notes: "Covers ears during loud noises" },
  { sensory_input: "Visual", tolerance_level: 4, frequency: 3, notes: "Prefers dimmed lighting" },
  { sensory_input: "Tactile", tolerance_level: 1, frequency: 12, notes: "Avoids certain textures" },
  { sensory_input: "Vestibular", tolerance_level: 5, frequency: 2, notes: "Seeks spinning activities" },
  { sensory_input: "Proprioceptive", tolerance_level: 4, frequency: 6, notes: "Enjoys deep pressure" },
  { sensory_input: "Gustatory", tolerance_level: 2, frequency: 7, notes: "Limited food preferences" },
  { sensory_input: "Olfactory", tolerance_level: 3, frequency: 5, notes: "Sensitive to strong smells" },
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
  { incident_date: "2025-10-01", count: 2 },
  { incident_date: "2025-10-02", count: 1 },
  { incident_date: "2025-10-03", count: 4 },
  { incident_date: "2025-10-04", count: 1 },
  { incident_date: "2025-10-05", count: 0 },
  { incident_date: "2025-10-06", count: 2 },
  { incident_date: "2025-10-07", count: 5 },
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

export const sampleStrategyData = [
  { strategy_name: "Visual Schedule", success_count: 18, total_uses: 20, success_rate: 90 },
  { strategy_name: "Deep Pressure", success_count: 14, total_uses: 18, success_rate: 78 },
  { strategy_name: "Break Card", success_count: 12, total_uses: 15, success_rate: 80 },
  { strategy_name: "First-Then Board", success_count: 16, total_uses: 22, success_rate: 73 },
  { strategy_name: "Sensory Bin", success_count: 9, total_uses: 12, success_rate: 75 },
];
