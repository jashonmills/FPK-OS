import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Footprints } from "lucide-react";

interface GrossMotorPlanningChartProps {
  familyId: string;
  studentId: string;
  days?: number;
}

export const GrossMotorPlanningChart = ({ familyId, studentId, days = 30 }: GrossMotorPlanningChartProps) => {
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
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Footprints className="h-5 w-5" />
            Gross Motor Planning
          </CardTitle>
          <CardDescription>Multi-step physical action success rates</CardDescription>
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
            <Footprints className="h-5 w-5" />
            Gross Motor Planning
          </CardTitle>
          <CardDescription>Multi-step physical action success rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No gross motor data available. Data appears when PT/APE evaluations are analyzed.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group by skill name to get average success rate
  const skillMap = new Map();
  data.forEach((item: any) => {
    if (!skillMap.has(item.skill_name)) {
      skillMap.set(item.skill_name, {
        skill_name: item.skill_name,
        success_rate: Number(item.success_rate),
        trial_count: Number(item.trial_count),
      });
    }
  });

  const chartData = Array.from(skillMap.values()).map(skill => ({
    ...skill,
    skill: skill.skill_name.length > 15 
      ? skill.skill_name.substring(0, 15) + '...' 
      : skill.skill_name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Footprints className="h-5 w-5" />
          Gross Motor Planning
        </CardTitle>
        <CardDescription>
          Success rates for motor sequences and physical actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="skill" 
              className="text-xs"
              tick={{ fill: "hsl(var(--foreground))" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft' }}
              tick={{ fill: "hsl(var(--foreground))" }}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
              formatter={(value: any, name: string, props: any) => {
                if (name === 'success_rate') {
                  return [
                    <div key="tooltip">
                      <div>{props.payload.skill_name}</div>
                      <div>Success Rate: {value}%</div>
                      <div className="text-xs text-muted-foreground">
                        {props.payload.trial_count} trials
                      </div>
                    </div>,
                    ''
                  ];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar 
              dataKey="success_rate" 
              fill="hsl(var(--chart-2))" 
              name="Success Rate (%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
