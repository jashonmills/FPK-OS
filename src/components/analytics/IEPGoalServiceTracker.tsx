import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface IEPGoalServiceTrackerProps {
  studentId: string;
  familyId: string;
  sampleData?: any;
}

export const IEPGoalServiceTracker = ({ studentId, familyId, sampleData }: IEPGoalServiceTrackerProps) => {
  const { data: goalProgress, isLoading } = useQuery({
    queryKey: ["iep-goal-progress", studentId, familyId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_iep_goal_progress", {
        p_family_id: familyId,
        p_student_id: studentId
      });
      if (error) throw error;
      return data;
    },
    enabled: !sampleData,
  });

  const categoryData = Array.isArray(sampleData || goalProgress)
    ? (sampleData || goalProgress).map((item: any) => ({
        category: item.goal_category,
        progress: Math.round(Number(item.avg_progress)),
        goalCount: Number(item.goal_count),
      }))
    : [];

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
