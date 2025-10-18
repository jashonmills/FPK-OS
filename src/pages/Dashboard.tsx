import React from 'react';
import { useFamily } from '@/contexts/FamilyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EducatorLogsSection } from '@/components/EducatorLogsSection';
import { StudentOverview } from '@/components/StudentOverview';
import { ProgressTrackingSection } from '@/components/dashboard/ProgressTrackingSection';
import { DocumentMetricsSection } from '@/components/dashboard/DocumentMetricsSection';
import { AIInsightsWidget } from '@/components/dashboard/AIInsightsWidget';
import { DailyBriefingWidget } from '@/components/dashboard/DailyBriefingWidget';
import { AnalysisQueueStatus } from '@/components/dashboard/AnalysisQueueStatus';
import { MetricConnectionStatus } from '@/components/analytics/MetricConnectionStatus';
import { ProductTour } from '@/components/onboarding/ProductTour';
import { dashboardTourSteps } from '@/components/onboarding/tourConfigs';
import { useTourProgress } from '@/hooks/useTourProgress';
import { Plus, TrendingUp, BookOpen, Activity, FileText, Sparkles } from 'lucide-react';
import { FeatureFlag } from '@/components/shared/FeatureFlag';

const Dashboard = () => {
  const { selectedStudent, selectedFamily, isLoading } = useFamily();
  const { shouldRunTour, markTourAsSeen } = useTourProgress('has_seen_dashboard_tour');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!selectedStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Student Selected</CardTitle>
            <CardDescription>
              Please select a student or add a new one to get started
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ProductTour 
        run={shouldRunTour} 
        onComplete={markTourAsSeen}
        tourSteps={dashboardTourSteps}
      />
      
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-4">
          <p className="text-muted-foreground">
            Tracking progress for {selectedStudent.student_name}
          </p>
        </div>

        {/* Real-Time Processing Status */}
        <AnalysisQueueStatus />
        {selectedFamily && (
          <MetricConnectionStatus 
            familyId={selectedFamily.id} 
            studentId={selectedStudent.id} 
          />
        )}

        {/* Daily Briefing - Top Priority */}
        <FeatureFlag flag="enable-ai-daily-briefing">
          <DailyBriefingWidget />
        </FeatureFlag>

        {/* Student Overview Cards */}
        <StudentOverview />

          {/* Main Content Tabs */}
          <Tabs defaultValue="logs" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto sm:h-10 p-1">
              <TabsTrigger value="logs" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="truncate">Logs</span>
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="truncate">Metrics</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="truncate">Docs</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="truncate">Insights</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="logs" className="space-y-4">
              <EducatorLogsSection />
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <ProgressTrackingSection />
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <DocumentMetricsSection />
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <FeatureFlag flag="enable-ai-document-analysis">
                <AIInsightsWidget />
              </FeatureFlag>
            </TabsContent>
          </Tabs>
      </div>
    </>
  );
};

export default Dashboard;
