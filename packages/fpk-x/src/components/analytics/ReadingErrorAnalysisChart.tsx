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
  sampleData?: any;
  mode?: 'live' | 'demo';
}

const ERROR_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const ReadingErrorAnalysisChart = ({ familyId, studentId, days = 90, sampleData, mode }: ReadingErrorAnalysisChartProps) => {
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
    enabled: !sampleData && mode !== 'demo',
    staleTime: 5 * 60 * 1000,
  });

  const displayData = sampleData || data;

  if (isLoading && !sampleData) {
    return (
      <Card className="bg-transparent border-0">
        <CardContent className="p-4">
          <Skeleton className="h-full w-full bg-cyan-900/20" />
        </CardContent>
      </Card>
    );
  }

  const chartData = displayData?.map((item: any) => ({
    name: item.error_type,
    value: Number(item.frequency || item.value),
    percentage: Number(item.percentage),
  })) || [];

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius="70%"
            fill="#06B6D4"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={ERROR_COLORS[index % ERROR_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(10, 25, 47, 0.95)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              borderRadius: "8px",
              color: "#E0E0E0"
            }}
          />
          <Legend wrapperStyle={{ color: "#E0E0E0", fontSize: 10 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
