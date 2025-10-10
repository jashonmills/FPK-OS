import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFamily } from "@/contexts/FamilyContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import sample data
import {
  sampleBehaviorData,
  sampleIEPGoals,
  sampleAcademicFluency,
  sampleSocialSkills,
  sampleSensoryProfile,
  sampleActivityLogs,
  sampleSleepData,
  sampleMoodData,
  sampleIncidentData,
  sampleInterventionData,
  sampleGoalProgress,
  sampleStrategyData,
  samplePromptingData,
  sampleSleepBehaviorData,
} from "@/lib/sample-chart-data";

// Import all chart components
import { BehaviorFunctionAnalysis } from "@/components/analytics/BehaviorFunctionAnalysis";
import { IEPGoalServiceTracker } from "@/components/analytics/IEPGoalServiceTracker";
import { AcademicFluencyTrends } from "@/components/analytics/AcademicFluencyTrends";
import { SensoryProfileHeatmap } from "@/components/analytics/SensoryProfileHeatmap";
import { SocialInteractionFunnel } from "@/components/analytics/SocialInteractionFunnel";
import { ActivityLogChart } from "@/components/analytics/ActivityLogChart";
import { SleepChart } from "@/components/analytics/SleepChart";
import { MoodDistributionChart } from "@/components/analytics/MoodDistributionChart";
import { IncidentFrequencyChart } from "@/components/analytics/IncidentFrequencyChart";
import { InterventionEffectivenessChart } from "@/components/analytics/InterventionEffectivenessChart";
import { GoalProgressCards } from "@/components/analytics/GoalProgressCards";
import { StrategyEffectiveness } from "@/components/analytics/StrategyEffectiveness";
import { PromptingLevelFading } from "@/components/analytics/PromptingLevelFading";
import { SleepBehaviorCorrelation } from "@/components/analytics/SleepBehaviorCorrelation";

const CHART_INFO = [
  {
    id: "behavior_function_analysis",
    title: "Behavior Function Analysis",
    description: "Understand the 'why' behind challenging behaviors. Maps behaviors to their underlying functions (Escape, Attention, Tangible, Sensory).",
    unlockedBy: "Functional Behavior Assessments (FBAs), Behavior Intervention Plans (BIPs)",
    tier: "pro",
    component: BehaviorFunctionAnalysis,
  },
  {
    id: "iep_goal_service_tracker",
    title: "IEP Goal & Service Tracker",
    description: "Track progress toward IEP goals across all domains. Monitor service delivery and goal attainment.",
    unlockedBy: "Individualized Education Programs (IEPs), Progress Reports",
    tier: "pro",
    component: IEPGoalServiceTracker,
  },
  {
    id: "academic_fluency_trends",
    title: "Academic Fluency Trends",
    description: "Visualize reading and math fluency over time. Track Words Per Minute (WPM) and math problem completion rates.",
    unlockedBy: "Academic Assessments, Curriculum-Based Measurements (CBM), Progress Monitoring Reports",
    tier: "pro",
    component: AcademicFluencyTrends,
  },
  {
    id: "social_interaction_funnel",
    title: "Social Interaction Funnel",
    description: "Measure success rates across social skills. Identify which social competencies need support.",
    unlockedBy: "Social Skills Assessments, Pragmatic Language Evaluations, Social Communication Observations",
    tier: "pro",
    component: SocialInteractionFunnel,
  },
  {
    id: "sensory_profile_heatmap",
    title: "Sensory Profile Heatmap",
    description: "Visualize sensory sensitivities and preferences across all sensory systems. Identify patterns in sensory processing.",
    unlockedBy: "Sensory Profile Assessments, Occupational Therapy Evaluations, Sensory Processing Disorder (SPD) Reports",
    tier: "pro",
    component: SensoryProfileHeatmap,
  },
  {
    id: "prompting_level_fading",
    title: "Prompting Level Fading",
    description: "Shows the transition from intrusive prompts (e.g., 'Hand-over-Hand') to independence.",
    unlockedBy: "ABA Session Notes, Educator Logs, OT Notes",
    tier: "pro",
    component: PromptingLevelFading,
  },
  {
    id: "sleep_behavior_correlation",
    title: "Sleep & Behavior Correlation",
    description: "Shows the relationship between sleep quality and next-day behavior.",
    unlockedBy: "Neurology Report, Parent Journal, Sleep Logs",
    tier: "pro",
    component: SleepBehaviorCorrelation,
  },
  {
    id: "activity_log_chart",
    title: "Daily Activity Trends",
    description: "See all logging activity at a glance. Track incident logs, parent logs, and educator logs over time.",
    unlockedBy: "Available with all plans - populated by your daily logs",
    tier: "free",
    component: ActivityLogChart,
  },
  {
    id: "sleep_chart",
    title: "Sleep Quality Analysis",
    description: "Monitor sleep patterns and quality ratings. Identify correlations between sleep and behavior.",
    unlockedBy: "Sleep Logs, Daily Parent Logs",
    tier: "free",
    component: SleepChart,
  },
  {
    id: "mood_distribution",
    title: "Weekly Mood Distribution",
    description: "Track mood patterns throughout the week. Identify high-stress days and emotional trends.",
    unlockedBy: "Parent Logs with mood tracking",
    tier: "free",
    component: MoodDistributionChart,
  },
  {
    id: "incident_frequency",
    title: "Incident Frequency Tracker",
    description: "Monitor behavioral incident patterns over time. Identify triggers and peak incident periods.",
    unlockedBy: "Incident Logs",
    tier: "free",
    component: IncidentFrequencyChart,
  },
  {
    id: "intervention_effectiveness",
    title: "Intervention Effectiveness",
    description: "Measure correlation between interventions used and incident reduction. Determine which strategies work best.",
    unlockedBy: "Incident Logs with intervention data",
    tier: "free",
    component: InterventionEffectivenessChart,
  },
  {
    id: "goal_progress_cards",
    title: "Top Priority Goals",
    description: "Quick visual snapshot of your highest-priority goals and current progress.",
    unlockedBy: "IEP Goals entered in the system",
    tier: "free",
    component: GoalProgressCards,
  },
  {
    id: "strategy_effectiveness",
    title: "Strategy Success Rates",
    description: "Compare success rates of different intervention strategies. Data-driven strategy selection.",
    unlockedBy: "Incident Logs with strategies/interventions documented",
    tier: "free",
    component: StrategyEffectiveness,
  },
];

const ChartLibrary = () => {
  const { selectedFamily, selectedStudent } = useFamily();
  const navigate = useNavigate();

  // Check subscription tier
  const { data: family } = useQuery({
    queryKey: ["family-subscription", selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;
      const { data, error } = await supabase
        .from("families")
        .select("subscription_tier")
        .eq("id", selectedFamily.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id,
  });

  // Check if user is owner
  const { data: userRole } = useQuery({
    queryKey: ["user-family-role", selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase.rpc("get_user_family_role", {
        _user_id: user.id,
        _family_id: selectedFamily.id,
      });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id,
  });

  const isProUser = family?.subscription_tier === "pro";
  const isOwner = userRole === "owner";

  if (!isOwner) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Only family owners can access the Chart Library. Please contact your family owner for access.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!selectedStudent) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a student to view the Chart Library.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const freeCharts = CHART_INFO.filter(c => c.tier === "free");
  const proCharts = CHART_INFO.filter(c => c.tier === "pro");

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Premium Chart Library</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Explore the full suite of AI-powered analytics available in our platform.
        </p>
      </div>

      {/* Upgrade CTA - only show if not Pro */}
      {!isProUser && (
        <Card className="border-2 border-primary bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Unlock the Full Picture with Our Pro Plan
                </h3>
                <p className="text-muted-foreground">
                  Gain access to all 7 specialized AI-recommended charts, plus unlimited document analysis and the full power of our AI co-pilot. See patterns and insights you're missing.
                </p>
              </div>
              <Button 
                size="lg" 
                className="shrink-0"
                onClick={() => navigate("/pricing")}
              >
                Upgrade to Pro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Free Charts Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">INCLUDED IN ALL PLANS</Badge>
          <h2 className="text-2xl font-bold">Core Analytics ({freeCharts.length} charts)</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {freeCharts.map((chart) => {
            const sampleData = 
              chart.id === "activity_log_chart" ? sampleActivityLogs :
              chart.id === "sleep_chart" ? sampleSleepData :
              chart.id === "mood_distribution" ? sampleMoodData :
              chart.id === "incident_frequency" ? sampleIncidentData :
              chart.id === "intervention_effectiveness" ? sampleInterventionData :
              chart.id === "goal_progress_cards" ? sampleGoalProgress :
              chart.id === "strategy_effectiveness" ? sampleStrategyData :
              null;
            
            return (
              <ChartCard
                key={chart.id}
                chart={chart}
                isLocked={false}
                studentId={selectedStudent.id}
                familyId={selectedFamily!.id}
                sampleData={sampleData}
              />
            );
          })}
        </div>
      </div>

      {/* Pro Charts Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="text-sm">PRO PLAN</Badge>
          <h2 className="text-2xl font-bold">AI-Recommended Specialized Charts ({proCharts.length} charts)</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {proCharts.map((chart) => {
            const sampleData = 
              chart.id === "behavior_function_analysis" ? sampleBehaviorData :
              chart.id === "iep_goal_service_tracker" ? sampleIEPGoals :
              chart.id === "academic_fluency_trends" ? sampleAcademicFluency :
              chart.id === "social_interaction_funnel" ? sampleSocialSkills :
              chart.id === "sensory_profile_heatmap" ? sampleSensoryProfile :
              chart.id === "prompting_level_fading" ? samplePromptingData :
              chart.id === "sleep_behavior_correlation" ? sampleSleepBehaviorData :
              null;
            
            return (
              <ChartCard
                key={chart.id}
                chart={chart}
                isLocked={false}
                studentId={selectedStudent.id}
                familyId={selectedFamily!.id}
                sampleData={sampleData}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Chart Card Component
interface ChartCardProps {
  chart: typeof CHART_INFO[0];
  isLocked: boolean;
  studentId: string;
  familyId: string;
  sampleData: any;
}

const ChartCard = ({ chart, isLocked, studentId, familyId, sampleData }: ChartCardProps) => {
  const navigate = useNavigate();
  const ChartComponent = chart.component;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {chart.title}
              {chart.tier === "pro" && <Badge variant="secondary">Pro</Badge>}
            </CardTitle>
            <CardDescription className="mt-2">{chart.description}</CardDescription>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Unlocked by:</strong> {chart.unlockedBy}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Render chart with sample data for full interactive showroom */}
        <div className="min-h-64">
            {chart.id === "academic_fluency_trends" && (
              <AcademicFluencyTrends 
                studentId={studentId} 
                familyId={familyId}
                dateRange={{ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() }}
                sampleData={sampleData}
              />
            )}
            {chart.id === "behavior_function_analysis" && (
              <BehaviorFunctionAnalysis studentId={studentId} familyId={familyId} sampleData={sampleData} />
            )}
            {chart.id === "iep_goal_service_tracker" && (
              <IEPGoalServiceTracker studentId={studentId} familyId={familyId} sampleData={sampleData} />
            )}
            {chart.id === "social_interaction_funnel" && (
              <SocialInteractionFunnel studentId={studentId} familyId={familyId} sampleData={sampleData} />
            )}
            {chart.id === "sensory_profile_heatmap" && (
              <SensoryProfileHeatmap studentId={studentId} familyId={familyId} sampleData={sampleData} />
            )}
            {chart.id === "activity_log_chart" && (
              <ActivityLogChart familyId={familyId} studentId={studentId} days={30} sampleData={sampleData} />
            )}
            {chart.id === "sleep_chart" && (
              <SleepChart familyId={familyId} studentId={studentId} days={30} sampleData={sampleData} />
            )}
            {chart.id === "mood_distribution" && (
              <MoodDistributionChart familyId={familyId} studentId={studentId} sampleData={sampleData} />
            )}
            {chart.id === "incident_frequency" && (
              <IncidentFrequencyChart familyId={familyId} studentId={studentId} days={30} sampleData={sampleData} />
            )}
            {chart.id === "intervention_effectiveness" && (
              <InterventionEffectivenessChart familyId={familyId} studentId={studentId} days={30} sampleData={sampleData} />
            )}
            {chart.id === "goal_progress_cards" && (
              <GoalProgressCards familyId={familyId} studentId={studentId} sampleData={sampleData} />
            )}
          {chart.id === "strategy_effectiveness" && (
            <StrategyEffectiveness sampleData={sampleData} />
          )}
          {chart.id === "prompting_level_fading" && (
            <PromptingLevelFading familyId={familyId} studentId={studentId} sampleData={sampleData} />
          )}
          {chart.id === "sleep_behavior_correlation" && (
            <SleepBehaviorCorrelation familyId={familyId} studentId={studentId} sampleData={sampleData} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartLibrary;
