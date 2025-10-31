import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface IEPGoalServiceTrackerProps {
  studentId: string;
  familyId: string;
  sampleData?: any;
  mode?: 'live' | 'demo';
}

export const IEPGoalServiceTracker = ({ studentId, familyId, sampleData, mode }: IEPGoalServiceTrackerProps) => {
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
    enabled: !sampleData && mode !== 'demo',
  });

  const categoryData = Array.isArray(sampleData || goalProgress)
    ? (sampleData || goalProgress).map((item: any) => ({
        category: item.goal_category || item.category,
        progress: Math.round(Number(item.avg_progress || item.progress)),
        goalCount: Number(item.goal_count || item.goalCount || 1),
      }))
    : [];

  if (isLoading && !sampleData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (categoryData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-sm text-cyan-300/60">No IEP goal data available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-3">
      <div className="space-y-4">
        {categoryData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-cyan-100 text-sm">{item.category}</h4>
                <p className="text-xs text-cyan-300/60">{item.goalCount} {item.goalCount === 1 ? 'goal' : 'goals'}</p>
              </div>
              <span className="text-xl font-bold text-cyan-400">{item.progress}%</span>
            </div>
            <Progress value={item.progress} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
