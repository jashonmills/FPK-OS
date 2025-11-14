import React from 'react';
import { useFamily } from '@/contexts/FamilyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EducatorLogsSection } from '@/components/EducatorLogsSection';
import { StudentOverview } from '@/components/StudentOverview';
import { AnalysisQueueStatus } from '@/components/dashboard/AnalysisQueueStatus';
import { ProductTour } from '@/components/onboarding/ProductTour';
import { dashboardTourSteps } from '@/components/onboarding/tourConfigs';
import { useTourProgress } from '@/hooks/useTourProgress';
import { TeamDiscussion } from '@/components/shared/TeamDiscussion';
import { AIInsightsDashboard } from '@/components/dashboard/AIInsightsDashboard';
import { CICDBadge } from '@/components/dashboard/CICDBadge';
import { BookOpen, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { selectedStudent, selectedFamily, isLoading } = useFamily();
  const { shouldRunTour, markTourAsSeen } = useTourProgress('has_seen_dashboard_tour');
  const navigate = useNavigate();

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

        <AnalysisQueueStatus />

        <CICDBadge />

        <StudentOverview />

        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 gap-1 h-auto sm:h-10 p-1">
            <TabsTrigger value="logs" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate">Logs</span>
            </TabsTrigger>
            <TabsTrigger value="discussion" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5">
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate">Team</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <EducatorLogsSection />
            
            <AIInsightsDashboard 
              studentId={selectedStudent.id}
              familyId={selectedFamily.id}
              onViewDocument={(docId) => {
                navigate(`/documents?doc=${docId}`);
              }}
            />
          </TabsContent>

          <TabsContent value="discussion" className="space-y-4">
            <TeamDiscussion 
              entityType="student"
              entityId={selectedStudent.id}
              familyId={selectedFamily.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;
