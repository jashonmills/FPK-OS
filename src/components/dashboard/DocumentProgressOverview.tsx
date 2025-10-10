import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const DocumentProgressOverview = () => {
  const { selectedStudent } = useFamily();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["document-metrics", selectedStudent?.id],
    queryFn: async () => {
      if (!selectedStudent?.id) return [];
      const { data, error } = await supabase
        .from("document_metrics")
        .select("*")
        .eq("student_id", selectedStudent.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStudent?.id,
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["progress-tracking", selectedStudent?.id],
    queryFn: async () => {
      if (!selectedStudent?.id) return [];
      const { data, error } = await supabase
        .from("progress_tracking")
        .select("*")
        .eq("student_id", selectedStudent.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStudent?.id,
  });

  if (!selectedStudent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Analysis Progress</CardTitle>
          <CardDescription>Select a student to view progress</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (metricsLoading || progressLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Analysis Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading progress data...</div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Tracking */}
      {progress && progress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>Goals and progress from analyzed documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {progress.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{item.metric_type?.replace(/_/g, " ")}</span>
                    {item.trend && getTrendIcon(item.trend)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.current_value} / {item.target_value || "—"}
                  </div>
                </div>
                {item.progress_percentage !== null && (
                  <Progress value={item.progress_percentage} className="h-2" />
                )}
                {item.notes && (
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Metrics */}
      {metrics && metrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Metrics</CardTitle>
            <CardDescription>Data extracted from documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.map((metric) => (
                <div key={metric.id} className="flex items-start justify-between pb-3 border-b last:border-0">
                  <div className="space-y-1">
                    <div className="font-medium">{metric.metric_name}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {metric.metric_type}
                      </Badge>
                      {metric.measurement_date && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(metric.measurement_date).toLocaleDateString()}
                        </span>
                      )}
                      {metric.start_time && metric.end_time && (
                        <span className="text-xs text-muted-foreground">
                          {metric.start_time} - {metric.end_time}
                        </span>
                      )}
                    </div>
                    {metric.context && (
                      <p className="text-sm text-muted-foreground">{metric.context}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {metric.metric_value} {metric.metric_unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!metrics || metrics.length === 0) && (!progress || progress.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Document Analysis Progress</CardTitle>
            <CardDescription>No analyzed documents yet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Upload and analyze documents to see progress metrics here
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};