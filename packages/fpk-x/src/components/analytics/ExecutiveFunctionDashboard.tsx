import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ExecutiveFunctionDashboardProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
}

export const ExecutiveFunctionDashboard = ({ familyId, studentId, sampleData, mode }: ExecutiveFunctionDashboardProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["executive-function", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_executive_function_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: null // All time
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !sampleData && mode !== "demo",
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-cyan-400/50" />;
    }
  };

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
        <p className="text-sm text-cyan-300/60">No executive function data available</p>
      </div>
    );
  }

  // Transform mock data if needed
  const skillsData = Array.isArray(displayData) ? displayData : [
    { skill_area: "Planning", current_score: displayData.planning / 10, trend: "improving", data_points: 12 },
    { skill_area: "Organization", current_score: displayData.organization / 10, trend: "stable", data_points: 10 },
    { skill_area: "Working Memory", current_score: displayData.working_memory / 10, trend: "improving", data_points: 15 },
    { skill_area: "Task Initiation", current_score: displayData.task_initiation / 10, trend: "improving", data_points: 8 },
    { skill_area: "Self-Monitoring", current_score: displayData.self_monitoring / 10, trend: "stable", data_points: 11 }
  ];

  return (
    <div className="h-full w-full p-4 space-y-3 overflow-auto">
      {skillsData.map((skill) => (
        <div key={skill.skill_area} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-cyan-100">{skill.skill_area}</span>
              {getTrendIcon(skill.trend)}
            </div>
            <Badge variant="outline" className="text-[10px] border-cyan-400/30 text-cyan-300">
              {skill.data_points} pts
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={Number(skill.current_score) * 10} className="flex-1" />
            <span className="text-sm font-medium min-w-12 text-right text-cyan-200">
              {Number(skill.current_score).toFixed(1)}/10
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};