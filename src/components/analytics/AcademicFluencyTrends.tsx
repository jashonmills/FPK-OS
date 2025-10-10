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
}

export const AcademicFluencyTrends = ({ studentId, familyId, dateRange }: AcademicFluencyTrendsProps) => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["document_metrics_fluency", studentId, dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_metrics")
        .select("*")
        .eq("student_id", studentId)
        .eq("family_id", familyId)
        .in("metric_name", ["Reading Fluency", "Math Fact Fluency"])
        .gte("measurement_date", format(dateRange.from, "yyyy-MM-dd"))
        .lte("measurement_date", format(dateRange.to, "yyyy-MM-dd"))
        .order("measurement_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const processChartData = () => {
    if (!metrics) return { data: [], readingTarget: 0, mathTarget: 0 };

    const grouped: Record<string, { reading?: number; math?: number; date: string }> = {};
    let readingTarget = 0;
    let mathTarget = 0;

    metrics.forEach((metric) => {
      const date = metric.measurement_date || "";
      if (!grouped[date]) {
        grouped[date] = { date };
      }

      if (metric.metric_name === "Reading Fluency") {
        grouped[date].reading = metric.metric_value;
        if (metric.target_value && !readingTarget) readingTarget = metric.target_value;
      } else if (metric.metric_name === "Math Fact Fluency") {
        grouped[date].math = metric.metric_value;
        if (metric.target_value && !mathTarget) mathTarget = metric.target_value;
      }
    });

    const data = Object.values(grouped).map((item) => ({
      ...item,
      formattedDate: item.date ? format(new Date(item.date), "MMM dd") : "",
    }));

    return { data, readingTarget, mathTarget };
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
