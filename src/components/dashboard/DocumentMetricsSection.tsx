import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const DocumentMetricsSection = () => {
  const { selectedStudent } = useFamily();

  const { data: metrics, isLoading } = useQuery({
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

  if (!selectedStudent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Metrics</CardTitle>
          <CardDescription>Select a student to view metrics</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading metrics data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Metrics</CardTitle>
          <CardDescription>No metrics data yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Upload and analyze documents to see metrics here
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
  );
};
