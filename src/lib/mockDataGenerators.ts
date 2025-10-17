// Mock Data Generators for Project Polaris
// Each function generates aspirational, beautiful sample data for demo mode

export const generateActivityLogMock = (studentName: string) => [
  { log_date: "2025-01-10", incident_count: 2, parent_count: 3, educator_count: 2, total_count: 7 },
  { log_date: "2025-01-11", incident_count: 1, parent_count: 3, educator_count: 2, total_count: 6 },
  { log_date: "2025-01-12", incident_count: 0, parent_count: 2, educator_count: 3, total_count: 5 },
  { log_date: "2025-01-13", incident_count: 1, parent_count: 3, educator_count: 2, total_count: 6 },
  { log_date: "2025-01-14", incident_count: 0, parent_count: 3, educator_count: 3, total_count: 6 },
];

export const generateSleepMock = (studentName: string) => [
  { sleep_date: "2025-01-10", total_sleep_hours: 8.5, sleep_quality_rating: 4, nap_taken: false },
  { sleep_date: "2025-01-11", total_sleep_hours: 9.0, sleep_quality_rating: 5, nap_taken: false },
  { sleep_date: "2025-01-12", total_sleep_hours: 8.0, sleep_quality_rating: 3, nap_taken: true },
  { sleep_date: "2025-01-13", total_sleep_hours: 9.5, sleep_quality_rating: 5, nap_taken: false },
  { sleep_date: "2025-01-14", total_sleep_hours: 8.5, sleep_quality_rating: 4, nap_taken: false },
];

export const generateMoodMock = (studentName: string) => [
  { day_of_week: "Monday", day_order: 2, mood: "happy", count: 3 },
  { day_of_week: "Monday", day_order: 2, mood: "calm", count: 2 },
  { day_of_week: "Tuesday", day_order: 3, mood: "happy", count: 4 },
  { day_of_week: "Wednesday", day_order: 4, mood: "calm", count: 3 },
  { day_of_week: "Thursday", day_order: 5, mood: "happy", count: 5 },
  { day_of_week: "Friday", day_order: 6, mood: "excited", count: 4 },
];

export const generateIncidentMock = (studentName: string) => [
  { incident_date: "2025-01-01", incident_count: 3 },
  { incident_date: "2025-01-08", incident_count: 2 },
  { incident_date: "2025-01-15", incident_count: 1 },
  { incident_date: "2025-01-22", incident_count: 1 },
  { incident_date: "2025-01-29", incident_count: 0 },
];

export const generateInterventionMock = (studentName: string) => [
  { log_date: "2025-01-10", incident_count: 3, intervention_count: 3 },
  { log_date: "2025-01-11", incident_count: 2, intervention_count: 2 },
  { log_date: "2025-01-12", incident_count: 1, intervention_count: 2 },
  { log_date: "2025-01-13", incident_count: 1, intervention_count: 1 },
  { log_date: "2025-01-14", incident_count: 0, intervention_count: 0 },
];

export const generateTopGoalsMock = (studentName: string) => [
  { goal_title: "Reading Fluency", goal_type: "academic", current_value: 45, target_value: 75, progress_percentage: 60, target_date: "2025-06-01", is_active: true },
  { goal_title: "Peer Interactions", goal_type: "social", current_value: 2, target_value: 5, progress_percentage: 40, target_date: "2025-06-01", is_active: true },
  { goal_title: "Task Initiation", goal_type: "executive", current_value: 3, target_value: 8, progress_percentage: 37.5, target_date: "2025-06-01", is_active: true },
];

export const generateStrategyMock = (studentName: string) => [
  { strategy_name: "Visual Schedule", total_uses: 12, successful_uses: 10, success_rate: 83.3 },
  { strategy_name: "Break Card", total_uses: 8, successful_uses: 7, success_rate: 87.5 },
  { strategy_name: "Deep Breathing", total_uses: 15, successful_uses: 11, success_rate: 73.3 },
];

export const generateBehaviorFunctionMock = (studentName: string) => [
  { behavior_type: "Task Refusal", frequency: 8, avg_duration: 12.5, common_antecedent: "Difficult Work", common_consequence: "Break Provided" },
  { behavior_type: "Vocal Protest", frequency: 5, avg_duration: 8.0, common_antecedent: "Transition", common_consequence: "Visual Support" },
];

export const generatePromptingMock = (studentName: string) => [
  { log_date: "2025-01-10", independent_count: 2, gestural_count: 3, verbal_count: 2, physical_count: 1, full_prompt_count: 0 },
  { log_date: "2025-01-11", independent_count: 3, gestural_count: 2, verbal_count: 2, physical_count: 0, full_prompt_count: 0 },
  { log_date: "2025-01-12", independent_count: 4, gestural_count: 2, verbal_count: 1, physical_count: 0, full_prompt_count: 0 },
];

export const generateSleepBehaviorMock = (studentName: string) => [
  { sleep_hours: 7.5, behavior_score: 6 },
  { sleep_hours: 8.0, behavior_score: 7 },
  { sleep_hours: 9.0, behavior_score: 9 },
  { sleep_hours: 8.5, behavior_score: 8 },
];

export const generateEnvironmentalMock = (studentName: string) => [
  { factor_category: "Weather Conditions", positive_correlation: 0.65, negative_correlation: -0.45, sample_size: 20 },
  { factor_category: "Air Quality", positive_correlation: 0.52, negative_correlation: -0.38, sample_size: 18 },
];

export const generateTransitionMock = (studentName: string) => [
  { transition_type: "Class to Lunch", total_transitions: 15, successful_transitions: 12, success_rate: 80, avg_support_level: 2.1 },
  { transition_type: "Arrival", total_transitions: 12, successful_transitions: 11, success_rate: 91.7, avg_support_level: 1.5 },
];

export const generateIEPGoalMock = (studentName: string) => [
  { goal_category: "reading", goal_count: 3, avg_progress: 68.5, active_goals: 3 },
  { goal_category: "math", goal_count: 2, avg_progress: 55.0, active_goals: 2 },
  { goal_category: "social_skills", goal_count: 2, avg_progress: 42.0, active_goals: 2 },
];

export const generateAcademicFluencyMock = (studentName: string) => [
  { measurement_date: "2024-09-01", reading_fluency: 45, math_fluency: 32, reading_target: 75, math_target: 50 },
  { measurement_date: "2024-10-01", reading_fluency: 52, math_fluency: 38, reading_target: 75, math_target: 50 },
  { measurement_date: "2024-11-01", reading_fluency: 61, math_fluency: 44, reading_target: 75, math_target: 50 },
  { measurement_date: "2024-12-01", reading_fluency: 68, math_fluency: 48, reading_target: 75, math_target: 50 },
];

export const generateReadingErrorMock = (studentName: string) => [
  { error_type: "Substitution", frequency: 12, percentage: 40 },
  { error_type: "Omission", frequency: 8, percentage: 27 },
  { error_type: "Insertion", frequency: 5, percentage: 17 },
  { error_type: "Reversal", frequency: 5, percentage: 17 },
];

export const generateTaskInitiationMock = (studentName: string) => [
  { measurement_date: "2025-01-10", avg_latency_seconds: 45, task_complexity: "Simple", prompt_level: "Verbal" },
  { measurement_date: "2025-01-11", avg_latency_seconds: 38, task_complexity: "Simple", prompt_level: "Gestural" },
  { measurement_date: "2025-01-12", avg_latency_seconds: 65, task_complexity: "Moderate", prompt_level: "Verbal" },
];

export const generateWorkingMemoryMock = (studentName: string) => [
  { task_length: "2-step", success_rate: 85, total_attempts: 20 },
  { task_length: "3-step", success_rate: 65, total_attempts: 18 },
  { task_length: "4-step", success_rate: 45, total_attempts: 15 },
];

export const generateDailyLivingMock = (studentName: string) => [
  { skill_category: "Self-Care", independence_level: 7, target_level: 9 },
  { skill_category: "Meal Prep", independence_level: 5, target_level: 8 },
  { skill_category: "Organization", independence_level: 6, target_level: 9 },
];

export const generateSocialFunnelMock = (studentName: string) => [
  { skill_name: "Peer Approach", success_rate: 75, total_attempts: 20 },
  { skill_name: "Conversation Initiation", success_rate: 60, total_attempts: 15 },
  { skill_name: "Turn-Taking", success_rate: 45, total_attempts: 12 },
];

export const generateCommunicationMock = (studentName: string) => [
  { date: "2024-09-01", expressive: 65, receptive: 72 },
  { date: "2024-10-01", expressive: 70, receptive: 76 },
  { date: "2024-11-01", expressive: 75, receptive: 80 },
];

export const generatePeerInteractionMock = (studentName: string) => [
  { log_date: "2025-01-10", positive_interactions: 5, negative_interactions: 1, initiated_interactions: 3 },
  { log_date: "2025-01-11", positive_interactions: 6, negative_interactions: 0, initiated_interactions: 4 },
  { log_date: "2025-01-12", positive_interactions: 7, negative_interactions: 1, initiated_interactions: 5 },
];

export const generateSelfRegulationMock = (studentName: string) => [
  { date: "2025-01-10", regulation_success: 6, dysregulation_events: 2 },
  { date: "2025-01-11", regulation_success: 7, dysregulation_events: 1 },
  { date: "2025-01-12", regulation_success: 8, dysregulation_events: 1 },
];

export const generateAttentionMock = (studentName: string) => [
  { log_date: "2025-01-10", avg_attention_minutes: 12 },
  { log_date: "2025-01-11", avg_attention_minutes: 15 },
  { log_date: "2025-01-12", avg_attention_minutes: 18 },
];

export const generateExecutiveFunctionMock = (studentName: string) => ({
  planning: 65,
  organization: 58,
  working_memory: 62,
  task_initiation: 55,
  self_monitoring: 60
});

export const generateSensoryHeatmapMock = (studentName: string) => [
  { sensory_category: "Auditory", intensity_level: "High", frequency: 15, avg_value: 8 },
  { sensory_category: "Visual", intensity_level: "Moderate", frequency: 10, avg_value: 5 },
  { sensory_category: "Tactile", intensity_level: "Low", frequency: 8, avg_value: 3 },
];

export const generateSensoryIntegrationMock = (studentName: string) => [
  { sensory_system: "Vestibular", regulation_score: 7 },
  { sensory_system: "Proprioceptive", regulation_score: 8 },
  { sensory_system: "Tactile", regulation_score: 6 },
];

export const generateFineMotorMock = (studentName: string) => [
  { skill: "Writing", proficiency: 65, target: 85 },
  { skill: "Cutting", proficiency: 72, target: 90 },
  { skill: "Buttoning", proficiency: 80, target: 95 },
];

export const generateGrossMotorMock = (studentName: string) => [
  { skill: "Running", coordination_score: 7 },
  { skill: "Jumping", coordination_score: 6 },
  { skill: "Throwing", coordination_score: 8 },
];

// Export all generators in a map for dynamic lookup
export const MOCK_DATA_GENERATORS: Record<string, (studentName: string) => any> = {
  generateActivityLogMock,
  generateSleepMock,
  generateMoodMock,
  generateIncidentMock,
  generateInterventionMock,
  generateTopGoalsMock,
  generateStrategyMock,
  generateBehaviorFunctionMock,
  generatePromptingMock,
  generateSleepBehaviorMock,
  generateEnvironmentalMock,
  generateTransitionMock,
  generateIEPGoalMock,
  generateAcademicFluencyMock,
  generateReadingErrorMock,
  generateTaskInitiationMock,
  generateWorkingMemoryMock,
  generateDailyLivingMock,
  generateSocialFunnelMock,
  generateCommunicationMock,
  generatePeerInteractionMock,
  generateSelfRegulationMock,
  generateAttentionMock,
  generateExecutiveFunctionMock,
  generateSensoryHeatmapMock,
  generateSensoryIntegrationMock,
  generateFineMotorMock,
  generateGrossMotorMock
};
