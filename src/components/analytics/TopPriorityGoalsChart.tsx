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
      <div 
        className="relative overflow-hidden rounded-xl border h-full"
        style={{
          backgroundColor: 'rgba(10, 25, 47, 0.15)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          borderColor: 'rgba(6, 182, 212, 0.4)',
          boxShadow: '0 0 15px rgba(0, 180, 255, 0.15)'
        }}
      >
        <Skeleton className="h-full w-full bg-cyan-900/20" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div 
        className="relative overflow-hidden rounded-xl border h-full flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(10, 25, 47, 0.15)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          borderColor: 'rgba(6, 182, 212, 0.4)',
          boxShadow: '0 0 15px rgba(0, 180, 255, 0.15)'
        }}
      >
        <div className="text-muted-foreground text-xs">
          No active goals found. Create goals to track progress!
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative overflow-hidden rounded-xl border h-full"
      style={{
        backgroundColor: 'rgba(10, 25, 47, 0.15)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        borderColor: 'rgba(6, 182, 212, 0.4)',
        boxShadow: '0 0 15px rgba(0, 180, 255, 0.15)'
      }}
    >
      <div className="absolute top-1 left-1.5 z-20">
        <h3 
          className="text-[9px] font-bold text-cyan-400/90"
          style={{ textShadow: '0 0 8px rgba(6, 182, 212, 0.4)' }}
        >
          Top Priority Goals
        </h3>
      </div>
      <div className="pt-5 px-2 pb-2 h-full overflow-auto">
        <div className="space-y-2">
          {data.map((goal: any, index: number) => (
            <div key={index} className="space-y-1 p-2 rounded-lg" style={{ backgroundColor: 'rgba(6, 182, 212, 0.05)' }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-[10px] text-cyan-200">{goal.goal_title}</h4>
                  <p className="text-[8px] text-cyan-400/60 capitalize">{goal.goal_type}</p>
                </div>
                <div className="flex items-center gap-1 text-[8px] text-cyan-400/60">
                  <Calendar className="h-2 w-2" />
                  {goal.target_date ? format(new Date(goal.target_date), 'MMM dd') : 'No date'}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[8px]">
                  <span className="text-cyan-400/60">
                    {goal.current_value} / {goal.target_value}
                  </span>
                  <span className="font-semibold flex items-center gap-1 text-cyan-300">
                    <TrendingUp className="h-2 w-2" />
                    {goal.progress_percentage}%
                  </span>
                </div>
                <Progress value={goal.progress_percentage} className="h-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
