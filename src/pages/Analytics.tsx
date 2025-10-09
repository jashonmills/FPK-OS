import { useState } from "react";
import { useFamily } from "@/contexts/FamilyContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ActivityLogChart } from "@/components/analytics/ActivityLogChart";
import { SleepChart } from "@/components/analytics/SleepChart";
import { MoodDistributionChart } from "@/components/analytics/MoodDistributionChart";
import { IncidentFrequencyChart } from "@/components/analytics/IncidentFrequencyChart";
import { GoalProgressCards } from "@/components/analytics/GoalProgressCards";
import { InterventionEffectivenessChart } from "@/components/analytics/InterventionEffectivenessChart";

const Analytics = () => {
  const { selectedFamily, selectedStudent } = useFamily();
  const [dateRange, setDateRange] = useState<"30" | "60" | "90">("30");

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Insights and progress tracking for {selectedStudent.student_name}
          </p>
        </div>
        
        <Select value={dateRange} onValueChange={(value: "30" | "60" | "90") => setDateRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="60">Last 60 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Goal Progress Cards - Top Priority */}
      <GoalProgressCards 
        familyId={selectedFamily!.id} 
        studentId={selectedStudent.id} 
      />

      {/* Primary Charts - 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>

      {/* Intervention Effectiveness - Full Width */}
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
    </div>
  );
};

export default Analytics;
