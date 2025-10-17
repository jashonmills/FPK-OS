import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { format } from "date-fns";

interface AcademicFluencyTrendsProps {
  studentId: string;
  familyId: string;
  dateRange: { from: Date; to: Date };
  sampleData?: any;
}

export const AcademicFluencyTrends = ({ studentId, familyId, dateRange, sampleData }: AcademicFluencyTrendsProps) => {
  const { data: fluencyData, isLoading } = useQuery({
    queryKey: ["academic-fluency-data", studentId, familyId, dateRange],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_academic_fluency_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_start_date: format(dateRange.from, "yyyy-MM-dd"),
        p_end_date: format(dateRange.to, "yyyy-MM-dd")
      });
      if (error) throw error;
      
      // Log data quality
      if (data && data.length > 0) {
        const nullDates = data.filter((d: any) => !d.measurement_date).length;
        if (nullDates > 0) {
          console.warn(`⚠️ [AcademicFluency] ${nullDates} metrics missing measurement_date`);
        }
      }
      
      return data;
    },
    enabled: !sampleData,
  });

  const processChartData = () => {
    const rawData = sampleData || fluencyData;
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return { data: [], readingTarget: 0, mathTarget: 0 };
    }

    const chartData = rawData.map((item: any) => ({
      formattedDate: format(new Date(item.measurement_date), "MMM dd"),
      reading: item.reading_fluency ? Number(item.reading_fluency) : undefined,
      math: item.math_fluency ? Number(item.math_fluency) : undefined,
    }));

    const readingTarget = rawData.find((d: any) => d.reading_target)?.reading_target || 0;
    const mathTarget = rawData.find((d: any) => d.math_target)?.math_target || 0;

    return { data: chartData, readingTarget: Number(readingTarget), mathTarget: Number(mathTarget) };
  };

  const { data: chartData, readingTarget, mathTarget } = processChartData();

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Academic Fluency Trends</CardTitle>
              <CardDescription>Reading & math fluency over time</CardDescription>
            </div>
            <Badge variant="secondary">AI Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Academic Fluency Trends</CardTitle>
              <CardDescription>Reading & math fluency over time</CardDescription>
            </div>
            <Badge variant="secondary">AI Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No fluency data available for this period</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Academic Fluency Trends</CardTitle>
            <CardDescription>Reading & math fluency over time</CardDescription>
          </div>
          <Badge variant="secondary">AI Recommended</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis yAxisId="left" label={{ value: "Words/Min", angle: -90, position: "insideLeft" }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: "Problems/Min", angle: 90, position: "insideRight" }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="reading" stroke="hsl(var(--primary))" name="Reading Fluency" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="math" stroke="hsl(var(--chart-2))" name="Math Fluency" strokeWidth={2} />
            {readingTarget > 0 && (
              <ReferenceLine yAxisId="left" y={readingTarget} stroke="hsl(var(--primary))" strokeDasharray="3 3" label="Reading Target" />
            )}
            {mathTarget > 0 && (
              <ReferenceLine yAxisId="right" y={mathTarget} stroke="hsl(var(--chart-2))" strokeDasharray="3 3" label="Math Target" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
