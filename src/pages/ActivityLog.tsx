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
import { CleanupFailedExtractionsButton } from '@/components/admin/CleanupFailedExtractionsButton';
import { ProductTour } from '@/components/onboarding/ProductTour';
import { activitiesTourSteps } from '@/components/onboarding/tourConfigs';
import { useTourProgress } from '@/hooks/useTourProgress';

const ActivityLog = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { currentUserRole, familyMembership } = useFamily();
  const { shouldRunTour, markTourAsSeen } = useTourProgress('has_seen_activities_tour');

  const handleLogCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <ProductTour 
        run={shouldRunTour} 
        onComplete={markTourAsSeen}
        tourSteps={activitiesTourSteps}
        tourTitle="Welcome to Activity Logs"
        tourDescription="This is where you'll track all important events. Let me show you around!"
      />
      
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-muted-foreground">Track incidents, observations, and sleep patterns</p>
          {familyMembership?.role === 'owner' && (
            <div className="flex gap-2">
              <CleanupFailedExtractionsButton />
              <ClearTestDataButton />
            </div>
          )}
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
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 h-auto sm:h-10 p-1">
          {(currentUserRole === 'owner' || currentUserRole === 'contributor') && (
            <>
              <TabsTrigger value="new-incident" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2.5 sm:py-1.5">
                <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="truncate">Incident</span>
              </TabsTrigger>
              <TabsTrigger value="parent-log" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2.5 sm:py-1.5">
                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="truncate">Parent</span>
              </TabsTrigger>
              <TabsTrigger value="educator-log" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2.5 sm:py-1.5">
                <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="truncate">Educator</span>
              </TabsTrigger>
              <TabsTrigger value="sleep-log" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2.5 sm:py-1.5">
                <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="truncate">Sleep</span>
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2.5 sm:py-1.5">
            <BarChart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="recent-activity" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2.5 sm:py-1.5">
            <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">Activity</span>
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
            <TabsList className="grid w-full grid-cols-3 gap-1 h-auto sm:h-10 p-1">
              <TabsTrigger value="incidents" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5">
                <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="truncate">Incidents</span>
              </TabsTrigger>
              <TabsTrigger value="parent-logs" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5">
                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="truncate">Parent</span>
              </TabsTrigger>
              <TabsTrigger value="educator-logs" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5">
                <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="truncate">Educator</span>
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
    </>
  );
};

export default ActivityLog;
