import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

interface ReadingErrorAnalysisChartProps {
  familyId: string;
  studentId: string;
  days?: number;
}

const ERROR_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const ReadingErrorAnalysisChart = ({ familyId, studentId, days = 90 }: ReadingErrorAnalysisChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["reading-errors", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_reading_error_data", {
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
            <BookOpen className="h-5 w-5" />
            Reading Error Analysis
          </CardTitle>
          <CardDescription>Categorized reading mistake patterns</CardDescription>
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
            <BookOpen className="h-5 w-5" />
            Reading Error Analysis
          </CardTitle>
          <CardDescription>Categorized reading mistake patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No reading error data available. Data appears when reading assessments are analyzed.
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item: any) => ({
    name: item.error_type,
    value: Number(item.frequency),
    percentage: Number(item.percentage),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Reading Error Analysis
        </CardTitle>
        <CardDescription>
          Distribution of reading error types over the last {days} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="hsl(var(--chart-1))"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={ERROR_COLORS[index % ERROR_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
              formatter={(value: any, name: string, props: any) => [
                <div key="tooltip">
                  <div>{props.payload.name}</div>
                  <div className="font-semibold">{value} errors ({props.payload.percentage}%)</div>
                </div>,
                ''
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
