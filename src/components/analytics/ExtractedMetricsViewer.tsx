import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText, TrendingUp, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExtractedMetricsViewerProps {
  clientId: string;
}

export const ExtractedMetricsViewer = ({ clientId }: ExtractedMetricsViewerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMetricType, setSelectedMetricType] = useState<string>("all");

  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['extracted-metrics', clientId, selectedMetricType],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_extracted_metrics', {
        p_client_id: clientId,
        p_metric_type: selectedMetricType === 'all' ? null : selectedMetricType,
      });
      
      if (error) throw error;
      return data;
    },
  });

  // Get unique metric types for filter
  const metricTypes = Array.from(
    new Set(metrics?.map((m: any) => m.metric_type) || [])
  );

  // Filter metrics by search term
  const filteredMetrics = metrics?.filter((metric: any) =>
    metric.metric_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metric.source_document_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMetricTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'behavior_frequency': 'bg-destructive/10 text-destructive',
      'behavioral_incident': 'bg-destructive/10 text-destructive',
      'academic_fluency': 'bg-primary/10 text-primary',
      'academic_performance': 'bg-primary/10 text-primary',
      'communication': 'bg-blue-500/10 text-blue-700',
      'goal_progress': 'bg-green-500/10 text-green-700',
      'skill_acquisition': 'bg-purple-500/10 text-purple-700',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load extracted metrics: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Metrics Extracted Yet</h3>
        <p className="text-muted-foreground">
          Upload documents to see AI-extracted metrics here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search metrics or documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedMetricType} onValueChange={setSelectedMetricType}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {metricTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Metrics count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredMetrics?.length || 0} of {metrics.length} metrics
        </p>
      </div>

      {/* Metrics table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">Document</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Metric</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Current</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Target</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMetrics?.map((metric: any) => (
                <tr key={metric.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {metric.source_document_name}
                        </p>
                        {metric.document_category && (
                          <p className="text-xs text-muted-foreground">
                            {metric.document_category}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{metric.metric_name}</p>
                    {metric.context && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {metric.context}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={getMetricTypeColor(metric.metric_type)}>
                      {metric.metric_type.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-semibold">
                        {metric.metric_value !== null ? metric.metric_value : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-muted-foreground">
                      {metric.target_value !== null ? metric.target_value : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(metric.measurement_date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
