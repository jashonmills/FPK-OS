import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const ProgressTrackingSection = () => {
  const { selectedStudent } = useFamily();

  const { data: progress, isLoading } = useQuery({
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
          <CardTitle>Progress Tracking</CardTitle>
          <CardDescription>Select a student to view progress</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Tracking</CardTitle>
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

  if (!progress || progress.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Tracking</CardTitle>
          <CardDescription>No progress data yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Analyze documents to see progress tracking here
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
  );
};
