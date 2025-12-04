import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface TopPriorityGoalsChartProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
}

export const TopPriorityGoalsChart = ({ familyId, studentId, sampleData, mode }: TopPriorityGoalsChartProps) => {
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
    enabled: !sampleData && mode !== "demo",
    staleTime: 5 * 60 * 1000,
  });

  const displayData = sampleData || data;

  if (isLoading && !sampleData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!displayData || displayData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-sm text-cyan-300/60">No priority goals data available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full pt-3 px-2 pb-2 overflow-auto">
      <div className="space-y-2">
        {displayData.map((goal: any, index: number) => (
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
  );
};
