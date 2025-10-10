import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface IEPGoalServiceTrackerProps {
  studentId: string;
  familyId: string;
}

export const IEPGoalServiceTracker = ({ studentId, familyId }: IEPGoalServiceTrackerProps) => {
  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ["goals_active", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("student_id", studentId)
        .eq("family_id", familyId)
        .eq("is_active", true);
      if (error) throw error;
      return data;
    },
  });

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["progress_tracking", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("progress_tracking")
        .select("*")
        .eq("student_id", studentId)
        .eq("family_id", familyId);
      if (error) throw error;
      return data;
    },
  });

  const isLoading = goalsLoading || progressLoading;

  const processGoalData = () => {
    if (!goals || !progressData) return [];

    const goalCategories: Record<string, { goals: number; avgProgress: number; services: string[] }> = {};

    goals.forEach((goal) => {
      const category = goal.goal_type || "Other";
      if (!goalCategories[category]) {
        goalCategories[category] = { goals: 0, avgProgress: 0, services: [] };
      }
      goalCategories[category].goals++;

      const relatedProgress = progressData.filter((p) => p.metric_type === category);
      if (relatedProgress.length > 0) {
        const avgProg = relatedProgress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / relatedProgress.length;
        goalCategories[category].avgProgress = avgProg;
      }
    });

    return Object.entries(goalCategories).map(([category, data]) => ({
      category,
      progress: Math.round(data.avgProgress),
      goalCount: data.goals,
    }));
  };

  const categoryData = processGoalData();

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>IEP Goal & Service Tracker</CardTitle>
              <CardDescription>Progress toward goals and service delivery</CardDescription>
            </div>
            <Badge variant="secondary">AI Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (categoryData.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>IEP Goal & Service Tracker</CardTitle>
              <CardDescription>Progress toward goals and service delivery</CardDescription>
            </div>
            <Badge variant="secondary">AI Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No active goals found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>IEP Goal & Service Tracker</CardTitle>
            <CardDescription>Progress toward goals and service delivery</CardDescription>
          </div>
          <Badge variant="secondary">AI Recommended</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categoryData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{item.category}</h4>
                  <p className="text-sm text-muted-foreground">{item.goalCount} active {item.goalCount === 1 ? 'goal' : 'goals'}</p>
                </div>
                <span className="text-2xl font-bold text-primary">{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
