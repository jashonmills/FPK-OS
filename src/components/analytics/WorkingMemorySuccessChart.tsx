import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain } from "lucide-react";
import { format } from "date-fns";

interface WorkingMemorySuccessChartProps {
  familyId: string;
  studentId: string;
  days?: number;
}

export const WorkingMemorySuccessChart = ({ familyId, studentId, days = 30 }: WorkingMemorySuccessChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["working-memory", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_working_memory_data", {
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
            <Brain className="h-5 w-5" />
            Working Memory Success
          </CardTitle>
          <CardDescription>Multi-step direction success rates</CardDescription>
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
            <Brain className="h-5 w-5" />
            Working Memory Success
          </CardTitle>
          <CardDescription>Multi-step direction success rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No working memory data available yet. Data appears when cognitive assessments are analyzed.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data into format suitable for multi-line chart
  const dateMap = new Map();
  data.forEach((item: any) => {
    const date = format(new Date(item.measurement_date), "MMM dd");
    if (!dateMap.has(date)) {
      dateMap.set(date, { date });
    }
    const stepKey = item.step_count.replace(/[^a-zA-Z0-9]/g, '');
    dateMap.get(date)[stepKey] = Number(item.success_rate);
  });

  const chartData = Array.from(dateMap.values());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Working Memory Success
        </CardTitle>
        <CardDescription>
          Success rates by task complexity (1-step, 2-step, 3+ step)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: "hsl(var(--foreground))" }}
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
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="1Step" 
              stroke="hsl(var(--chart-2))" 
              name="1-Step Tasks"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-2))" }}
            />
            <Line 
              type="monotone" 
              dataKey="2Step" 
              stroke="hsl(var(--chart-3))" 
              name="2-Step Tasks"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-3))" }}
            />
            <Line 
              type="monotone" 
              dataKey="3Step" 
              stroke="hsl(var(--chart-4))" 
              name="3+ Step Tasks"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-4))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
