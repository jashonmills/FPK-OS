import React from 'react';
import { useFamily } from '@/contexts/FamilyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EducatorLogsSection } from '@/components/EducatorLogsSection';
import { ProgressMetricsSection } from '@/components/ProgressMetricsSection';
import { StudentOverview } from '@/components/StudentOverview';
import { Plus, TrendingUp, BookOpen, Activity } from 'lucide-react';

const Dashboard = () => {
  const { selectedStudent, isLoading } = useFamily();

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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-4">
        <p className="text-muted-foreground">
          Tracking progress for {selectedStudent.student_name}
        </p>
      </div>

        {/* Student Overview Cards */}
        <StudentOverview />

        {/* Main Content Tabs */}
        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="logs">
              <BookOpen className="w-4 h-4 mr-2" />
              Educator Logs
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Progress Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <EducatorLogsSection />
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <ProgressMetricsSection />
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default Dashboard;
