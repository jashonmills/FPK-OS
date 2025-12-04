import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChartIcon } from "lucide-react";
import { format } from "date-fns";

interface SessionActivityBreakdownChartProps {
  familyId: string;
  studentId: string;
  days?: number;
}

export const SessionActivityBreakdownChart = ({ familyId, studentId, days = 30 }: SessionActivityBreakdownChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["session-activity", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_session_activity_data", {
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
            <PieChartIcon className="h-5 w-5" />
            Session Activity Breakdown
          </CardTitle>
          <CardDescription>How time is allocated within sessions</CardDescription>
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
            <PieChartIcon className="h-5 w-5" />
            Session Activity Breakdown
          </CardTitle>
          <CardDescription>How time is allocated within sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No session activity data available. Data appears when educator logs include activity details.
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item: any) => ({
    date: format(new Date(item.log_date), "MMM dd"),
    academic: Number(item.academic_count || 0),
    movement: Number(item.movement_count || 0),
    sensory: Number(item.sensory_count || 0),
    social: Number(item.social_count || 0),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Session Activity Breakdown
        </CardTitle>
        <CardDescription>
          Activity distribution across the last {days} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <YAxis 
              label={{ value: 'Activity Count', angle: -90, position: 'insideLeft' }}
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
            />
            <Legend />
            <Bar 
              dataKey="academic" 
              stackId="a" 
              fill="hsl(var(--chart-1))" 
              name="Academic"
            />
            <Bar 
              dataKey="movement" 
              stackId="a" 
              fill="hsl(var(--chart-2))" 
              name="Movement"
            />
            <Bar 
              dataKey="sensory" 
              stackId="a" 
              fill="hsl(var(--chart-3))" 
              name="Sensory"
            />
            <Bar 
              dataKey="social" 
              stackId="a" 
              fill="hsl(var(--chart-4))" 
              name="Social"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
