import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IncidentForm } from '@/components/incident-log/IncidentForm';
import { ParentLogForm } from '@/components/parent-log/ParentLogForm';
import { SleepLogForm } from '@/components/sleep-log/SleepLogForm';
import { IncidentTimeline } from '@/components/incident-log/IncidentTimeline';
import { ParentLogTimeline } from '@/components/parent-log/ParentLogTimeline';
import { EducatorLogTimeline } from '@/components/educator-log/EducatorLogTimeline';
import { EducatorLogFormComplete } from '@/components/educator-log/EducatorLogFormComplete';
import { ActivityStatsCards } from '@/components/activity-log/ActivityStatsCards';
import { LiveWeatherDisplay } from '@/components/weather/LiveWeatherDisplay';
import { AlertCircle, Heart, Moon, GraduationCap, BarChart, Activity } from 'lucide-react';
import { useFamily } from '@/contexts/FamilyContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { ClearTestDataButton } from '@/components/admin/ClearTestDataButton';

const ActivityLog = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { currentUserRole, familyMembership } = useFamily();

  const handleLogCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-muted-foreground">Track incidents, observations, and sleep patterns</p>
        {familyMembership?.role === 'owner' && <ClearTestDataButton />}
      </div>

      <LiveWeatherDisplay />

      <ActivityStatsCards />

      {currentUserRole === 'viewer' && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You have view-only access. Contact the family owner to request contributor access if you need to add or edit logs.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={currentUserRole === 'viewer' ? 'recent-activity' : 'new-incident'} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {(currentUserRole === 'owner' || currentUserRole === 'contributor') && (
            <>
              <TabsTrigger value="new-incident">
                <AlertCircle className="h-4 w-4 mr-2" />
                New Incident
              </TabsTrigger>
              <TabsTrigger value="parent-log">
                <Heart className="h-4 w-4 mr-2" />
                Parent Log
              </TabsTrigger>
              <TabsTrigger value="educator-log">
                <GraduationCap className="h-4 w-4 mr-2" />
                Educator Log
              </TabsTrigger>
              <TabsTrigger value="sleep-log">
                <Moon className="h-4 w-4 mr-2" />
                Sleep Log
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="analytics">
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="recent-activity">
            <Activity className="h-4 w-4 mr-2" />
            Recent Activity
          </TabsTrigger>
        </TabsList>

        {(currentUserRole === 'owner' || currentUserRole === 'contributor') && (
          <>
            <TabsContent value="new-incident" className="mt-6">
              <IncidentForm onSuccess={handleLogCreated} />
            </TabsContent>

            <TabsContent value="parent-log" className="mt-6">
              <ParentLogForm onSuccess={handleLogCreated} />
            </TabsContent>

            <TabsContent value="educator-log" className="mt-6">
              <EducatorLogFormComplete onSuccess={handleLogCreated} />
            </TabsContent>

            <TabsContent value="sleep-log" className="mt-6">
              <SleepLogForm onSuccess={handleLogCreated} />
            </TabsContent>
          </>
        )}

        <TabsContent value="analytics" className="mt-6">
          <div className="text-center py-12">
            <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Analytics dashboard coming soon</p>
            <p className="text-sm text-muted-foreground mt-2">
              Track trends, patterns, and insights across all logs
            </p>
          </div>
        </TabsContent>

        <TabsContent value="recent-activity" className="mt-6">
          <Tabs defaultValue="incidents" className="w-full">
            <TabsList>
              <TabsTrigger value="incidents">
                <AlertCircle className="h-4 w-4 mr-2" />
                Incidents
              </TabsTrigger>
              <TabsTrigger value="parent-logs">
                <Heart className="h-4 w-4 mr-2" />
                Parent Logs
              </TabsTrigger>
              <TabsTrigger value="educator-logs">
                <GraduationCap className="h-4 w-4 mr-2" />
                Educator Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="incidents" className="mt-6">
              <IncidentTimeline refreshKey={refreshKey} />
            </TabsContent>

            <TabsContent value="parent-logs" className="mt-6">
              <ParentLogTimeline refreshKey={refreshKey} />
            </TabsContent>

            <TabsContent value="educator-logs" className="mt-6">
              <EducatorLogTimeline refreshKey={refreshKey} />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivityLog;
