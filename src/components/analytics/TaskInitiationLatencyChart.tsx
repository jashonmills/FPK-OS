import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import { format } from "date-fns";

interface TaskInitiationLatencyChartProps {
  familyId: string;
  studentId: string;
  days?: number;
}

export const TaskInitiationLatencyChart = ({ familyId, studentId, days = 30 }: TaskInitiationLatencyChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["task-initiation", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_task_initiation_data", {
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
            <Clock className="h-5 w-5" />
            Task Initiation & Latency
          </CardTitle>
          <CardDescription>Time to begin tasks after prompts</CardDescription>
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
            <Clock className="h-5 w-5" />
            Task Initiation & Latency
          </CardTitle>
          <CardDescription>Time to begin tasks after prompts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No task initiation data available yet. Data appears when documents with this metric are analyzed.
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item: any) => ({
    date: format(new Date(item.measurement_date), "MMM dd"),
    latency: Number(item.avg_latency_seconds),
    complexity: item.task_complexity || 'Standard',
    promptLevel: item.prompt_level || 'None',
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Task Initiation & Latency
        </CardTitle>
        <CardDescription>
          Average time (seconds) to begin tasks after prompts
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
              label={{ value: 'Latency (seconds)', angle: -90, position: 'insideLeft' }}
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
              formatter={(value: any, name: string, props: any) => {
                if (name === 'latency') {
                  return [
                    <div key="tooltip" className="space-y-1">
                      <div>Latency: {value}s</div>
                      <div className="text-xs text-muted-foreground">
                        Complexity: {props.payload.complexity}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Prompt: {props.payload.promptLevel}
                      </div>
                    </div>,
                    ''
                  ];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="latency" 
              stroke="hsl(var(--chart-1))" 
              name="Avg Latency (s)"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-1))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
