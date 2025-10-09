import { useState } from 'react';
import { FamilyStudentSelector } from '@/components/FamilyStudentSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IncidentForm } from '@/components/incident-log/IncidentForm';
import { ParentLogForm } from '@/components/parent-log/ParentLogForm';
import { SleepLogForm } from '@/components/sleep-log/SleepLogForm';
import { IncidentTimeline } from '@/components/incident-log/IncidentTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle, Heart, Moon } from 'lucide-react';

const ActivityLog = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Activity Logs</h1>
            <p className="text-muted-foreground mt-2">Track incidents, observations, and sleep patterns</p>
          </div>
          <FamilyStudentSelector />
        </div>

        <Tabs defaultValue="add-logs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-logs">Add Logs</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="add-logs" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Incident Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <IncidentForm onSuccess={handleLogCreated} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Parent Observation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ParentLogForm onSuccess={handleLogCreated} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-primary" />
                    Sleep Record
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SleepLogForm onSuccess={handleLogCreated} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Tabs defaultValue="incidents" className="w-full">
              <TabsList>
                <TabsTrigger value="incidents">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Incidents
                </TabsTrigger>
                <TabsTrigger value="parent">
                  <Heart className="h-4 w-4 mr-2" />
                  Parent Logs
                </TabsTrigger>
                <TabsTrigger value="sleep">
                  <Moon className="h-4 w-4 mr-2" />
                  Sleep Logs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="incidents" className="mt-6">
                <IncidentTimeline refreshKey={refreshKey} />
              </TabsContent>

              <TabsContent value="parent" className="mt-6">
                <div className="text-center py-12 text-muted-foreground">
                  Parent log timeline coming soon
                </div>
              </TabsContent>

              <TabsContent value="sleep" className="mt-6">
                <div className="text-center py-12 text-muted-foreground">
                  Sleep log timeline coming soon
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ActivityLog;
