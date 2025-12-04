import { ComponentType } from "react";
import { ActivityLogChart } from "@/components/analytics/ActivityLogChart";
import { SleepChart } from "@/components/analytics/SleepChart";
import { MoodDistributionChart } from "@/components/analytics/MoodDistributionChart";
import { IncidentFrequencyChart } from "@/components/analytics/IncidentFrequencyChart";
import { InterventionEffectivenessChart } from "@/components/analytics/InterventionEffectivenessChart";
import { TopPriorityGoalsChart } from "@/components/analytics/TopPriorityGoalsChart";
import { StrategySuccessRatesChart } from "@/components/analytics/StrategySuccessRatesChart";
import { BehaviorFunctionAnalysis } from "@/components/analytics/BehaviorFunctionAnalysis";
import { PromptingLevelFading } from "@/components/analytics/PromptingLevelFading";
import { SleepBehaviorCorrelation } from "@/components/analytics/SleepBehaviorCorrelation";
import { EnvironmentalImpactChart } from "@/components/analytics/EnvironmentalImpactChart";
import { TransitionSuccessChart } from "@/components/analytics/TransitionSuccessChart";
import { IEPGoalServiceTracker } from "@/components/analytics/IEPGoalServiceTracker";
import { AcademicFluencyTrends } from "@/components/analytics/AcademicFluencyTrends";
import { ReadingErrorAnalysisChart } from "@/components/analytics/ReadingErrorAnalysisChart";
import { TaskInitiationLatencyChart } from "@/components/analytics/TaskInitiationLatencyChart";
import { WorkingMemorySuccessChart } from "@/components/analytics/WorkingMemorySuccessChart";
import { DailyLivingSkillsTrendsChart } from "@/components/analytics/DailyLivingSkillsTrendsChart";
import { SocialInteractionFunnel } from "@/components/analytics/SocialInteractionFunnel";
import { CommunicationProgressChart } from "@/components/analytics/CommunicationProgressChart";
import { PeerInteractionChart } from "@/components/analytics/PeerInteractionChart";
import { SelfRegulationChart } from "@/components/analytics/SelfRegulationChart";
import { AttentionSpanChart } from "@/components/analytics/AttentionSpanChart";
import { ExecutiveFunctionDashboard } from "@/components/analytics/ExecutiveFunctionDashboard";
import { SensoryProfileHeatmap } from "@/components/analytics/SensoryProfileHeatmap";
import { SensoryIntegrationChart } from "@/components/analytics/SensoryIntegrationChart";
import { FineMotorSkillMasteryChart } from "@/components/analytics/FineMotorSkillMasteryChart";
import { GrossMotorPlanningChart } from "@/components/analytics/GrossMotorPlanningChart";

export type ChartMode = "live" | "demo" | "locked";

export type SubscriptionTier = "free" | "team" | "pro";

export interface ChartWidgetProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: ChartMode;
  sampleData?: any;
}

export interface ChartConfig {
  chartId: string;
  title: string;
  description: string;
  tier: "standard" | "specialized" | "clinical";
  tab: "overall" | "behavioral" | "academic" | "social" | "sensory";
  component: ComponentType<ChartWidgetProps>;
  requiredDocuments: string[];
  rpcFunction?: string;
  mockDataGenerator: string;
  subscriptionTier: SubscriptionTier;
  gridSpan?: { cols?: number; rows?: number };
}

export const CHART_MANIFEST: ChartConfig[] = [
  // OVERALL TAB (7 charts)
  {
    chartId: "daily_activity_trends",
    title: "Daily Activity Trends",
    description: "Track daily log entries across all categories",
    tier: "standard",
    tab: "overall",
    component: ActivityLogChart,
    requiredDocuments: ["Any Log Entry"],
    rpcFunction: "get_daily_log_counts",
    mockDataGenerator: "generateActivityLogMock",
    subscriptionTier: "free",
    gridSpan: { cols: 2 }
  },
  {
    chartId: "sleep_quality_analysis",
    title: "Sleep Quality",
    description: "Sleep duration and quality patterns",
    tier: "standard",
    tab: "overall",
    component: SleepChart,
    requiredDocuments: ["Sleep Log"],
    rpcFunction: "get_sleep_summary_data",
    mockDataGenerator: "generateSleepMock",
    subscriptionTier: "free"
  },
  {
    chartId: "weekly_mood_distribution",
    title: "Mood Distribution",
    description: "Weekly mood patterns and trends",
    tier: "standard",
    tab: "overall",
    component: MoodDistributionChart,
    requiredDocuments: ["Parent Log"],
    rpcFunction: "get_weekly_mood_counts",
    mockDataGenerator: "generateMoodMock",
    subscriptionTier: "free"
  },
  {
    chartId: "incident_frequency",
    title: "Incident Frequency",
    description: "Track behavioral incident patterns over time",
    tier: "standard",
    tab: "overall",
    component: IncidentFrequencyChart,
    requiredDocuments: ["Incident Log"],
    rpcFunction: "get_incident_frequency_data",
    mockDataGenerator: "generateIncidentMock",
    subscriptionTier: "free"
  },
  {
    chartId: "intervention_effectiveness",
    title: "Intervention Effectiveness",
    description: "Measure impact of interventions on incidents",
    tier: "standard",
    tab: "overall",
    component: InterventionEffectivenessChart,
    requiredDocuments: ["Incident Log"],
    rpcFunction: "get_intervention_effectiveness_data",
    mockDataGenerator: "generateInterventionMock",
    subscriptionTier: "free",
    gridSpan: { cols: 2 }
  },
  {
    chartId: "top_priority_goals",
    title: "Top Priority Goals",
    description: "Highest priority goals requiring attention",
    tier: "standard",
    tab: "overall",
    component: TopPriorityGoalsChart,
    requiredDocuments: ["IEP", "Goal"],
    rpcFunction: "get_top_priority_goals_data",
    mockDataGenerator: "generateTopGoalsMock",
    subscriptionTier: "free"
  },
  {
    chartId: "strategy_success_rates",
    title: "Strategy Success Rates",
    description: "Effectiveness of different intervention strategies",
    tier: "standard",
    tab: "overall",
    component: StrategySuccessRatesChart,
    requiredDocuments: ["Incident Log"],
    rpcFunction: "get_strategy_success_rates_data",
    mockDataGenerator: "generateStrategyMock",
    subscriptionTier: "free"
  },

  // BEHAVIORAL TAB (5 charts)
  {
    chartId: "behavior_function_analysis",
    title: "Behavior Function Analysis",
    description: "Identify behavioral patterns and functions",
    tier: "specialized",
    tab: "behavioral",
    component: BehaviorFunctionAnalysis,
    requiredDocuments: ["BFA", "Incident Log", "Psychoeducational Evaluation"],
    rpcFunction: "get_behavior_function_data",
    mockDataGenerator: "generateBehaviorFunctionMock",
    subscriptionTier: "team"
  },
  {
    chartId: "prompting_level_fading",
    title: "Prompting Level Fading",
    description: "Track independence levels over time",
    tier: "specialized",
    tab: "behavioral",
    component: PromptingLevelFading,
    requiredDocuments: ["Educator Log", "BIP"],
    rpcFunction: "get_prompting_trend_data",
    mockDataGenerator: "generatePromptingMock",
    subscriptionTier: "team"
  },
  {
    chartId: "sleep_behavior_correlation",
    title: "Sleep-Behavior Correlation",
    description: "Relationship between sleep quality and behavior",
    tier: "specialized",
    tab: "behavioral",
    component: SleepBehaviorCorrelation,
    requiredDocuments: ["Sleep Log", "Incident Log"],
    mockDataGenerator: "generateSleepBehaviorMock",
    subscriptionTier: "team",
    gridSpan: { cols: 2 }
  },
  {
    chartId: "environmental_impact",
    title: "Environmental Impact",
    description: "How environment affects behavior and performance",
    tier: "specialized",
    tab: "behavioral",
    component: EnvironmentalImpactChart,
    requiredDocuments: ["Incident Log with Weather"],
    rpcFunction: "get_environmental_impact_data",
    mockDataGenerator: "generateEnvironmentalMock",
    subscriptionTier: "team"
  },
  {
    chartId: "transition_success_rates",
    title: "Transition Success",
    description: "Success rates during transitions and changes",
    tier: "specialized",
    tab: "behavioral",
    component: TransitionSuccessChart,
    requiredDocuments: ["Educator Log", "Parent Log"],
    rpcFunction: "get_transition_success_data",
    mockDataGenerator: "generateTransitionMock",
    subscriptionTier: "team"
  },

  // ACADEMIC TAB (6 charts)
  {
    chartId: "iep_goal_service_tracker",
    title: "IEP Goal & Service Tracker",
    description: "Progress toward IEP goals by domain",
    tier: "standard",
    tab: "academic",
    component: IEPGoalServiceTracker,
    requiredDocuments: ["IEP"],
    rpcFunction: "get_iep_goal_progress",
    mockDataGenerator: "generateIEPGoalMock",
    subscriptionTier: "free",
    gridSpan: { cols: 2 }
  },
  {
    chartId: "academic_fluency_trends",
    title: "Academic Fluency Trends",
    description: "Reading and math fluency over time",
    tier: "specialized",
    tab: "academic",
    component: AcademicFluencyTrends,
    requiredDocuments: ["Psychoeducational Evaluation", "Progress Report"],
    rpcFunction: "get_academic_fluency_data",
    mockDataGenerator: "generateAcademicFluencyMock",
    subscriptionTier: "team"
  },
  {
    chartId: "reading_error_analysis",
    title: "Reading Error Analysis",
    description: "Types and patterns of reading errors",
    tier: "clinical",
    tab: "academic",
    component: ReadingErrorAnalysisChart,
    requiredDocuments: ["Reading Assessment", "Psychoeducational Evaluation"],
    mockDataGenerator: "generateReadingErrorMock",
    subscriptionTier: "pro"
  },
  {
    chartId: "task_initiation_latency",
    title: "Task Initiation Time",
    description: "Time to begin tasks across complexity levels",
    tier: "specialized",
    tab: "academic",
    component: TaskInitiationLatencyChart,
    requiredDocuments: ["Educator Log", "Executive Function Assessment"],
    rpcFunction: "get_task_initiation_data",
    mockDataGenerator: "generateTaskInitiationMock",
    subscriptionTier: "team"
  },
  {
    chartId: "working_memory_success",
    title: "Working Memory Performance",
    description: "Success rates on working memory tasks",
    tier: "specialized",
    tab: "academic",
    component: WorkingMemorySuccessChart,
    requiredDocuments: ["Psychoeducational Evaluation", "Educator Log"],
    mockDataGenerator: "generateWorkingMemoryMock",
    subscriptionTier: "team"
  },
  {
    chartId: "daily_living_skills_trends",
    title: "Daily Living Skills",
    description: "Independence in self-care and daily tasks",
    tier: "standard",
    tab: "academic",
    component: DailyLivingSkillsTrendsChart,
    requiredDocuments: ["Adaptive Behavior Assessment", "Parent Log"],
    mockDataGenerator: "generateDailyLivingMock",
    subscriptionTier: "free"
  },

  // SOCIAL TAB (5 charts)
  {
    chartId: "social_interaction_funnel",
    title: "Social Interaction Funnel",
    description: "Social engagement progression and success",
    tier: "specialized",
    tab: "social",
    component: SocialInteractionFunnel,
    requiredDocuments: ["Social Skills Assessment", "Educator Log"],
    rpcFunction: "get_social_skills_data",
    mockDataGenerator: "generateSocialFunnelMock",
    subscriptionTier: "team",
    gridSpan: { cols: 2 }
  },
  {
    chartId: "communication_progress",
    title: "Communication Progress",
    description: "Expressive and receptive language development",
    tier: "specialized",
    tab: "social",
    component: CommunicationProgressChart,
    requiredDocuments: ["Speech-Language Evaluation", "Parent Log"],
    mockDataGenerator: "generateCommunicationMock",
    subscriptionTier: "team"
  },
  {
    chartId: "peer_interaction_quality",
    title: "Peer Interaction Quality",
    description: "Quality and frequency of peer interactions",
    tier: "specialized",
    tab: "social",
    component: PeerInteractionChart,
    requiredDocuments: ["Social Skills Assessment", "Educator Log"],
    rpcFunction: "get_peer_interaction_data",
    mockDataGenerator: "generatePeerInteractionMock",
    subscriptionTier: "team"
  },
  {
    chartId: "self_regulation_skills",
    title: "Self-Regulation",
    description: "Emotional regulation and coping strategies",
    tier: "specialized",
    tab: "social",
    component: SelfRegulationChart,
    requiredDocuments: ["Social-Emotional Assessment", "Incident Log"],
    mockDataGenerator: "generateSelfRegulationMock",
    subscriptionTier: "team"
  },
  {
    chartId: "attention_span_tracking",
    title: "Attention Span",
    description: "Sustained attention across activities",
    tier: "specialized",
    tab: "social",
    component: AttentionSpanChart,
    requiredDocuments: ["Educator Log", "ADHD Assessment"],
    rpcFunction: "get_attention_span_data",
    mockDataGenerator: "generateAttentionMock",
    subscriptionTier: "team"
  },

  // SENSORY TAB (4 charts)
  {
    chartId: "executive_function_dashboard",
    title: "Executive Function Dashboard",
    description: "Comprehensive view of EF skills",
    tier: "clinical",
    tab: "sensory",
    component: ExecutiveFunctionDashboard,
    requiredDocuments: ["Executive Function Assessment", "Psychoeducational Evaluation"],
    mockDataGenerator: "generateExecutiveFunctionMock",
    subscriptionTier: "pro",
    gridSpan: { cols: 2 }
  },
  {
    chartId: "sensory_profile_heatmap",
    title: "Sensory Profile Heatmap",
    description: "Sensory sensitivities across modalities",
    tier: "specialized",
    tab: "sensory",
    component: SensoryProfileHeatmap,
    requiredDocuments: ["OT Evaluation", "Sensory Profile"],
    rpcFunction: "get_sensory_profile_data",
    mockDataGenerator: "generateSensoryHeatmapMock",
    subscriptionTier: "team"
  },
  {
    chartId: "sensory_integration_patterns",
    title: "Sensory Integration",
    description: "Sensory processing and integration scores",
    tier: "specialized",
    tab: "sensory",
    component: SensoryIntegrationChart,
    requiredDocuments: ["OT Evaluation", "Sensory Profile"],
    rpcFunction: "get_sensory_integration_data",
    mockDataGenerator: "generateSensoryIntegrationMock",
    subscriptionTier: "team"
  },
  {
    chartId: "fine_motor_skill_mastery",
    title: "Fine Motor Skills",
    description: "Fine motor development and precision",
    tier: "specialized",
    tab: "sensory",
    component: FineMotorSkillMasteryChart,
    requiredDocuments: ["OT Evaluation", "Educator Log"],
    mockDataGenerator: "generateFineMotorMock",
    subscriptionTier: "team"
  },
  {
    chartId: "gross_motor_planning",
    title: "Gross Motor Planning",
    description: "Motor planning and coordination skills",
    tier: "specialized",
    tab: "sensory",
    component: GrossMotorPlanningChart,
    requiredDocuments: ["PT Evaluation", "OT Evaluation"],
    mockDataGenerator: "generateGrossMotorMock",
    subscriptionTier: "team"
  }
];

export const getChartsForTab = (tabId: string): ChartConfig[] => {
  return CHART_MANIFEST.filter(chart => chart.tab === tabId);
};

export const getChartById = (chartId: string): ChartConfig | undefined => {
  return CHART_MANIFEST.find(chart => chart.chartId === chartId);
};
