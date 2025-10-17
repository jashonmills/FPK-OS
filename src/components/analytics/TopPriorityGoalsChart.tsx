import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

interface TopPriorityGoalsChartProps {
  familyId: string;
  studentId: string;
}

export const TopPriorityGoalsChart = ({ familyId, studentId }: TopPriorityGoalsChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["top-priority-goals", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_top_priority_goals_data", {
        p_family_id: familyId,
        p_student_id: studentId,
      });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Top Priority Goals
          </CardTitle>
          <CardDescription>Most urgent goals requiring focus</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Top Priority Goals
          </CardTitle>
          <CardDescription>Most urgent goals requiring focus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No active goals found. Create goals to track progress!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Top Priority Goals
        </CardTitle>
        <CardDescription>
          {data.length} goal{data.length !== 1 ? 's' : ''} prioritized by progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((goal: any, index: number) => (
          <div key={index} className="space-y-2 p-3 rounded-lg bg-muted/30">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{goal.goal_title}</h4>
                <p className="text-xs text-muted-foreground capitalize">{goal.goal_type}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {goal.target_date ? format(new Date(goal.target_date), 'MMM dd') : 'No date'}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {goal.current_value} / {goal.target_value}
                </span>
                <span className="font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {goal.progress_percentage}%
                </span>
              </div>
              <Progress value={goal.progress_percentage} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
