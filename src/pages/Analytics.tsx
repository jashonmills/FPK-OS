import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import confetti from "canvas-confetti";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Sparkles } from "lucide-react";
import { ActivityLogChart } from "@/components/analytics/ActivityLogChart";
import { SleepChart } from "@/components/analytics/SleepChart";
import { MoodDistributionChart } from "@/components/analytics/MoodDistributionChart";
import { IncidentFrequencyChart } from "@/components/analytics/IncidentFrequencyChart";
import { GoalProgressCards } from "@/components/analytics/GoalProgressCards";
import { InterventionEffectivenessChart } from "@/components/analytics/InterventionEffectivenessChart";
import { BehaviorFunctionAnalysis } from "@/components/analytics/BehaviorFunctionAnalysis";
import { IEPGoalServiceTracker } from "@/components/analytics/IEPGoalServiceTracker";
import { AcademicFluencyTrends } from "@/components/analytics/AcademicFluencyTrends";
import { SensoryProfileHeatmap } from "@/components/analytics/SensoryProfileHeatmap";
import { SocialInteractionFunnel } from "@/components/analytics/SocialInteractionFunnel";
import { StrategyEffectiveness } from "@/components/analytics/StrategyEffectiveness";
import { AnalyticsEmptyState } from "@/components/analytics/AnalyticsEmptyState";
import { ProductTour } from "@/components/onboarding/ProductTour";
import { analyticsTourSteps } from "@/components/onboarding/tourConfigs";
import { useTourProgress } from "@/hooks/useTourProgress";
import { FeatureFlag } from "@/components/shared/FeatureFlag";

const Analytics = () => {
  const { selectedFamily, selectedStudent } = useFamily();
  const [dateRange, setDateRange] = useState<"30" | "60" | "90">("30");
  const { shouldRunTour, markTourAsSeen } = useTourProgress('has_seen_analytics_tour');

  // Fetch family data to check for trial charts
  const { data: familyData } = useQuery({
    queryKey: ["family-trial", selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;
      const { data, error } = await supabase
        .from("families")
        .select("suggested_charts_config, special_chart_trial_ends_at")
        .eq("id", selectedFamily.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id,
  });

  const hasActiveTrial = familyData?.special_chart_trial_ends_at 
    && new Date(familyData.special_chart_trial_ends_at) > new Date();

  const suggestedCharts = (familyData?.suggested_charts_config as any[]) || [];

  // Check if there's enough data to show analytics - MUST wait for all queries to complete
  const { data: hasData, isLoading: isCheckingData } = useQuery({
    queryKey: ["analytics-data", selectedFamily?.id, selectedStudent?.id],
    queryFn: async () => {
      if (!selectedFamily?.id || !selectedStudent?.id) return false;
      
      console.log('🔍 Checking analytics data for:', { 
        family: selectedFamily.id, 
        student: selectedStudent.id,
        studentName: selectedStudent.student_name 
      });

      // Check for document-based data FIRST (primary data source)
      const { count: documentMetricsCount } = await supabase
        .from("document_metrics")
        .select("*", { count: "exact", head: true })
        .eq("family_id", selectedFamily.id)
        .eq("student_id", selectedStudent.id);

      console.log('📊 Document metrics count:', documentMetricsCount);

      const { count: progressTrackingCount } = await supabase
        .from("progress_tracking")
        .select("*", { count: "exact", head: true })
        .eq("family_id", selectedFamily.id)
        .eq("student_id", selectedStudent.id);

      console.log('📈 Progress tracking count:', progressTrackingCount);

      // Document-based data alone is sufficient to show analytics
      if ((documentMetricsCount || 0) > 0 || (progressTrackingCount || 0) > 0) {
        console.log('✅ Found document-based data, showing analytics');
        return true;
      }

      // Fallback: Check for daily log entries
      const { count: parentLogCount } = await supabase
        .from("parent_logs")
        .select("*", { count: "exact", head: true })
        .eq("family_id", selectedFamily.id)
        .eq("student_id", selectedStudent.id);

      const { count: educatorLogCount } = await supabase
        .from("educator_logs")
        .select("*", { count: "exact", head: true })
        .eq("family_id", selectedFamily.id)
        .eq("student_id", selectedStudent.id);

      const { count: goalsCount } = await supabase
        .from("goals")
        .select("*", { count: "exact", head: true })
        .eq("family_id", selectedFamily.id)
        .eq("student_id", selectedStudent.id)
        .eq("is_active", true);

      const logCount = (parentLogCount || 0) + (educatorLogCount || 0) + (goalsCount || 0);
      
      return logCount > 0;
    },
    enabled: !!selectedFamily?.id && !!selectedStudent?.id,
  });

  const getDaysUntilTrialEnds = () => {
    if (!familyData?.special_chart_trial_ends_at) return 0;
    const endDate = new Date(familyData.special_chart_trial_ends_at);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Confetti celebration effect when charts are unlocked
  useEffect(() => {
    const shouldCelebrate = sessionStorage.getItem('showChartsCelebration') === 'true';
    
    if (shouldCelebrate && hasActiveTrial && suggestedCharts.length > 0) {
      sessionStorage.removeItem('showChartsCelebration');
      
      const duration = 3000;
      const end = Date.now() + duration;
      
      const colors = ['#a855f7', '#ec4899', '#f59e0b', '#10b981'];
      
      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [hasActiveTrial, suggestedCharts]);

  if (!selectedStudent) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a student to view analytics.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading state while checking
  if (isCheckingData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Checking available data...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no data (but wait for the query to complete)
  if (hasData === false) {
    return (
      <div className="container mx-auto p-6">
        <AnalyticsEmptyState />
      </div>
    );
  }

  return (
    <>
      <ProductTour 
        run={shouldRunTour} 
        onComplete={markTourAsSeen}
        tourSteps={analyticsTourSteps}
        tourTitle="Welcome to Analytics"
        tourDescription="Visualize trends and unlock insights from your data. Let me show you the key features!"
      />
      
      <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-6" data-tour="chart-tabs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Insights and progress tracking for {selectedStudent.student_name}
          </p>
        </div>
        
        <Select value={dateRange} onValueChange={(value: "30" | "60" | "90") => setDateRange(value)}>
          <SelectTrigger className="w-full sm:w-[180px] text-xs sm:text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="60">Last 60 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trial Banner */}
      {hasActiveTrial && suggestedCharts.length > 0 && (
        <Alert className="border-2 border-primary bg-primary/5 shadow-[0_0_20px_hsl(var(--primary)/0.5)] animate-pulse">
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            <strong>🎉 AI Discovery!</strong> We've unlocked {suggestedCharts.length} specialized charts for you based on your documents. 
            This free preview ends in {getDaysUntilTrialEnds()} days.
          </AlertDescription>
        </Alert>
      )}

      {/* Goal Progress Cards - Top Priority */}
      <FeatureFlag flag="enable-goal-progress-cards">
        <GoalProgressCards 
          familyId={selectedFamily!.id} 
          studentId={selectedStudent.id} 
        />
      </FeatureFlag>

      {/* Primary Charts - 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureFlag flag="enable-activity-log-chart">
          <Card>
            <CardHeader>
              <CardTitle>Overall Activity Log</CardTitle>
              <CardDescription>Daily logging engagement and data collection trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityLogChart 
                familyId={selectedFamily!.id}
                studentId={selectedStudent.id}
                days={parseInt(dateRange)}
              />
            </CardContent>
          </Card>
        </FeatureFlag>

        <FeatureFlag flag="enable-sleep-chart">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Duration & Quality</CardTitle>
              <CardDescription>Sleep patterns and quality over time</CardDescription>
            </CardHeader>
            <CardContent>
              <SleepChart 
                familyId={selectedFamily!.id}
                studentId={selectedStudent.id}
                days={parseInt(dateRange)}
              />
            </CardContent>
          </Card>
        </FeatureFlag>

        <FeatureFlag flag="enable-mood-distribution-chart">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Mood Distribution</CardTitle>
              <CardDescription>Emotional well-being summary for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <MoodDistributionChart 
                familyId={selectedFamily!.id}
                studentId={selectedStudent.id}
              />
            </CardContent>
          </Card>
        </FeatureFlag>

        <FeatureFlag flag="enable-incident-frequency-chart">
          <Card>
            <CardHeader>
              <CardTitle>Incident Frequency</CardTitle>
              <CardDescription>Challenging behavior occurrences over time</CardDescription>
            </CardHeader>
            <CardContent>
              <IncidentFrequencyChart 
                familyId={selectedFamily!.id}
                studentId={selectedStudent.id}
                days={parseInt(dateRange)}
              />
            </CardContent>
          </Card>
        </FeatureFlag>
      </div>

      {/* Intervention Effectiveness - Full Width */}
      <FeatureFlag flag="enable-intervention-effectiveness-chart">
        <Card>
          <CardHeader>
            <CardTitle>Intervention Effectiveness</CardTitle>
            <CardDescription>Correlation between incidents and interventions used</CardDescription>
          </CardHeader>
          <CardContent>
            <InterventionEffectivenessChart 
              familyId={selectedFamily!.id}
              studentId={selectedStudent.id}
              days={parseInt(dateRange)}
            />
          </CardContent>
        </Card>
      </FeatureFlag>

      {/* Strategy Effectiveness */}
      <FeatureFlag flag="enable-strategy-effectiveness">
        <StrategyEffectiveness />
      </FeatureFlag>

      {/* Specialized Trial Charts */}
      {hasActiveTrial && suggestedCharts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">AI-Recommended Specialized Charts</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {suggestedCharts.map((chart: any, index: number) => {
              const chartMap: Record<string, React.ReactNode> = {
                behavior_function_analysis: <BehaviorFunctionAnalysis studentId={selectedStudent.id} familyId={selectedFamily!.id} />,
                iep_goal_service_tracker: <IEPGoalServiceTracker studentId={selectedStudent.id} familyId={selectedFamily!.id} />,
                academic_fluency_trends: <AcademicFluencyTrends studentId={selectedStudent.id} familyId={selectedFamily!.id} dateRange={{ from: new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000), to: new Date() }} />,
                sensory_profile_heatmap: <SensoryProfileHeatmap studentId={selectedStudent.id} familyId={selectedFamily!.id} />,
                social_interaction_funnel: <SocialInteractionFunnel studentId={selectedStudent.id} familyId={selectedFamily!.id} />,
              };
              
              return chartMap[chart.chart_type] ? <div key={index}>{chartMap[chart.chart_type]}</div> : null;
            })}
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Analytics;
