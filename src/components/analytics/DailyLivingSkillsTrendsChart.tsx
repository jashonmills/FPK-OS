import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Home } from "lucide-react";
import { format } from "date-fns";

interface DailyLivingSkillsTrendsChartProps {
  familyId: string;
  studentId: string;
  days?: number;
}

export const DailyLivingSkillsTrendsChart = ({ familyId, studentId, days = 30 }: DailyLivingSkillsTrendsChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["dls-trends", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_dls_trends_data", {
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
            <Home className="h-5 w-5" />
            Daily Living Skills Trends
          </CardTitle>
          <CardDescription>Independence in self-care routines</CardDescription>
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
            <Home className="h-5 w-5" />
            Daily Living Skills Trends
          </CardTitle>
          <CardDescription>Independence in self-care routines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No daily living skills data available. Data appears when adaptive behavior assessments are analyzed.
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item: any) => ({
    date: format(new Date(item.log_date), "MMM dd"),
    teethBrushing: item.teeth_brushing ? Number(item.teeth_brushing) : null,
    dressing: item.dressing ? Number(item.dressing) : null,
    toileting: item.toileting ? Number(item.toileting) : null,
    handWashing: item.hand_washing ? Number(item.hand_washing) : null,
    mealPrep: item.meal_prep ? Number(item.meal_prep) : null,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Daily Living Skills Trends
        </CardTitle>
        <CardDescription>
          Self-care independence over the last {days} days
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
              dataKey="teethBrushing" 
              stroke="hsl(var(--chart-1))" 
              name="Teeth Brushing"
              strokeWidth={2}
              connectNulls
            />
            <Line 
              type="monotone" 
              dataKey="dressing" 
              stroke="hsl(var(--chart-2))" 
              name="Dressing"
              strokeWidth={2}
              connectNulls
            />
            <Line 
              type="monotone" 
              dataKey="toileting" 
              stroke="hsl(var(--chart-3))" 
              name="Toileting"
              strokeWidth={2}
              connectNulls
            />
            <Line 
              type="monotone" 
              dataKey="handWashing" 
              stroke="hsl(var(--chart-4))" 
              name="Hand Washing"
              strokeWidth={2}
              connectNulls
            />
            <Line 
              type="monotone" 
              dataKey="mealPrep" 
              stroke="hsl(var(--chart-5))" 
              name="Meal Prep"
              strokeWidth={2}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
