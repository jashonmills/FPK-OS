import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Hand } from "lucide-react";

interface FineMotorSkillMasteryChartProps {
  familyId: string;
  studentId: string;
  days?: number;
}

export const FineMotorSkillMasteryChart = ({ familyId, studentId, days = 30 }: FineMotorSkillMasteryChartProps) => {
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
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hand className="h-5 w-5" />
            Fine Motor Skill Mastery
          </CardTitle>
          <CardDescription>Grasp, scissors, writing, and manipulation skills</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hand className="h-5 w-5" />
            Fine Motor Skill Mastery
          </CardTitle>
          <CardDescription>Grasp, scissors, writing, and manipulation skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No fine motor data available. Data appears when OT evaluations are analyzed.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group by skill name to get latest measurement
  const skillMap = new Map();
  data.forEach((item: any) => {
    if (!skillMap.has(item.skill_name)) {
      skillMap.set(item.skill_name, item);
    }
  });

  const skills = Array.from(skillMap.values());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand className="h-5 w-5" />
          Fine Motor Skill Mastery
        </CardTitle>
        <CardDescription>
          Current mastery levels for fine motor skills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill: any, index: number) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{skill.skill_name}</span>
              <span className="text-muted-foreground">
                {skill.current_level}
                {skill.target_level && ` / ${skill.target_level}`}
                {' '}({skill.mastery_percentage}%)
              </span>
            </div>
            <Progress value={skill.mastery_percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
