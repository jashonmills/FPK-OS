import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface GrossMotorPlanningChartProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
  days?: number;
}

export const GrossMotorPlanningChart = ({ familyId, studentId, sampleData, mode, days = 30 }: GrossMotorPlanningChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["gross-motor", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_gross_motor_data", {
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
        <p className="text-sm text-cyan-300/60">No gross motor data available</p>
      </div>
    );
  }

  // Group by skill name
  const skillMap = new Map();
  (Array.isArray(displayData) ? displayData : [displayData]).forEach((item: any) => {
    const skillName = item.skill || item.skill_name;
    const coordinationScore = item.coordination_score || item.success_rate || 0;
    
    if (skillName && !skillMap.has(skillName)) {
      skillMap.set(skillName, {
        skill_name: skillName,
        coordination_score: Number(coordinationScore) * 10, // Convert to percentage if needed
      });
    }
  });

  const chartData = Array.from(skillMap.values()).map(skill => ({
    ...skill,
    skill: skill.skill_name.length > 12 
      ? skill.skill_name.substring(0, 12) + '...' 
      : skill.skill_name,
  }));

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
          <XAxis 
            dataKey="skill" 
            tick={{ fill: '#a5f3fc', fontSize: 9 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fill: '#a5f3fc', fontSize: 10 }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(10, 25, 47, 0.9)',
              borderColor: 'rgba(6, 182, 212, 0.3)',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#a5f3fc' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#a5f3fc' }} />
          <Bar 
            dataKey="coordination_score" 
            fill="rgba(139, 92, 246, 0.7)" 
            name="Coordination"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
