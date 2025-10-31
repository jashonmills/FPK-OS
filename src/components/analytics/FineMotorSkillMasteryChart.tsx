import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface FineMotorSkillMasteryChartProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
  days?: number;
}

export const FineMotorSkillMasteryChart = ({ familyId, studentId, sampleData, mode, days = 30 }: FineMotorSkillMasteryChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["fine-motor", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_fine_motor_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: days,
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
        <Skeleton className="h-full w-full bg-cyan-900/20" />
      </div>
    );
  }

  if (!displayData || displayData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-sm text-cyan-300/60">No fine motor data available</p>
      </div>
    );
  }

  // Group by skill name to get latest measurement
  const skillMap = new Map();
  (Array.isArray(displayData) ? displayData : [displayData]).forEach((item: any) => {
    const skillName = item.skill || item.skill_name;
    const proficiency = item.proficiency || item.mastery_percentage;
    const target = item.target || item.target_level || 100;
    
    if (skillName && !skillMap.has(skillName)) {
      skillMap.set(skillName, {
        skill_name: skillName,
        mastery_percentage: proficiency,
        target_level: target
      });
    }
  });

  const skills = Array.from(skillMap.values());

  return (
    <div className="h-full w-full p-4 space-y-3 overflow-auto">
      {skills.map((skill: any, index: number) => (
        <div key={index} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-cyan-100">{skill.skill_name}</span>
            <span className="text-cyan-300/70">
              {skill.mastery_percentage}%
              {skill.target_level && ` / ${skill.target_level}`}
            </span>
          </div>
          <Progress value={skill.mastery_percentage} className="h-2" />
        </div>
      ))}
    </div>
  );
};
