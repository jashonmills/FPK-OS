import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface SocialInteractionFunnelProps {
  studentId: string;
  familyId: string;
  sampleData?: any;
}

export const SocialInteractionFunnel = ({ studentId, familyId, sampleData }: SocialInteractionFunnelProps) => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["document_metrics_social", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_metrics")
        .select("*")
        .eq("student_id", studentId)
        .eq("family_id", familyId)
        .eq("metric_type", "social_skill");
      if (error) throw error;
      return data;
    },
    enabled: !sampleData,
  });

  const processFunnelData = () => {
    const displayMetrics = sampleData || metrics;
    if (!displayMetrics) return [];

    const skillStats: Record<string, { total: number; success: number }> = {};

    displayMetrics.forEach((metric) => {
      const skillName = metric.metric_name;
      if (!skillStats[skillName]) {
        skillStats[skillName] = { total: 0, success: 0 };
      }
      skillStats[skillName].total++;
      if (metric.metric_value >= (metric.target_value || 0.8)) {
        skillStats[skillName].success++;
      }
    });

    const funnelData = Object.entries(skillStats)
      .map(([skill, stats]) => ({
        skill,
        successRate: stats.total > 0 ? (stats.success / stats.total) * 100 : 0,
        totalAttempts: stats.total,
      }))
      .sort((a, b) => b.successRate - a.successRate);

    return funnelData;
  };

  const funnelData = processFunnelData();

  const getBarColor = (index: number): string => {
    const colors = ["bg-primary", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-muted-foreground"];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Social Interaction Funnel</CardTitle>
              <CardDescription>Success rates across social skills</CardDescription>
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

  if (funnelData.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Social Interaction Funnel</CardTitle>
              <CardDescription>Success rates across social skills</CardDescription>
            </div>
            <Badge variant="secondary">AI Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No social skills data available yet</p>
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
            <CardTitle>Social Interaction Funnel</CardTitle>
            <CardDescription>Success rates across social skills</CardDescription>
          </div>
          <Badge variant="secondary">AI Recommended</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funnelData.map((item, index) => {
            const maxWidth = 100;
            const barWidth = (item.successRate / 100) * maxWidth;

            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{item.skill}</span>
                  <span className="text-muted-foreground">{Math.round(item.successRate)}% ({item.totalAttempts} attempts)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-8 overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(index)} flex items-center justify-end px-3 text-white text-sm font-semibold transition-all duration-500`}
                    style={{ width: `${barWidth}%` }}
                  >
                    {item.successRate > 15 && `${Math.round(item.successRate)}%`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
