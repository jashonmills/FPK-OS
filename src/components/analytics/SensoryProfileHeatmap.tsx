import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface SensoryProfileHeatmapProps {
  studentId: string;
  familyId: string;
  sampleData?: any;
}

export const SensoryProfileHeatmap = ({ studentId, familyId, sampleData }: SensoryProfileHeatmapProps) => {
  const { data: sensoryData, isLoading } = useQuery({
    queryKey: ["sensory-profile-data", studentId, familyId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_sensory_profile_data", {
        p_family_id: familyId,
        p_student_id: studentId
      });
      if (error) throw error;
      return data;
    },
    enabled: !sampleData,
  });

  const processHeatmapData = () => {
    const rawData = sampleData || sensoryData;
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return { triggers: [], intensityLevels: [], heatmap: {}, maxCount: 0 };
    }

    const triggers = [...new Set(rawData.map((d: any) => d.sensory_category))];
    const intensityLevels = ["Low", "Moderate", "High"];
    const heatmap: Record<string, Record<string, number>> = {};

    triggers.forEach((trigger) => {
      heatmap[trigger] = { Low: 0, Moderate: 0, High: 0 };
    });

    rawData.forEach((item: any) => {
      if (heatmap[item.sensory_category]) {
        heatmap[item.sensory_category][item.intensity_level] = Number(item.frequency);
      }
    });

    const maxCount = Math.max(...triggers.flatMap((t) => intensityLevels.map((level) => heatmap[t][level])), 0);

    return { triggers, intensityLevels, heatmap, maxCount };
  };

  const getIntensityColor = (count: number, max: number): string => {
    if (count === 0) return "bg-muted";
    const intensity = count / max;
    if (intensity > 0.7) return "bg-destructive";
    if (intensity > 0.4) return "bg-chart-3";
    return "bg-chart-1";
  };

  const { triggers, intensityLevels, heatmap, maxCount } = processHeatmapData();

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sensory Profile Heatmap</CardTitle>
              <CardDescription>Sensory trigger patterns by time of day</CardDescription>
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

  if (maxCount === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sensory Profile Heatmap</CardTitle>
              <CardDescription>Sensory trigger patterns by time of day</CardDescription>
            </div>
            <Badge variant="secondary">AI Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No sensory data available yet</p>
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
            <CardTitle>Sensory Profile Heatmap</CardTitle>
            <CardDescription>Sensory trigger patterns by time of day</CardDescription>
          </div>
          <Badge variant="secondary">AI Recommended</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left font-semibold">Category</th>
                {intensityLevels.map((level) => (
                  <th key={level} className="border p-2 text-center font-semibold">
                    {level}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {triggers.map((trigger) => (
                <tr key={trigger}>
                  <td className="border p-2 font-medium">{trigger}</td>
                  {intensityLevels.map((level) => {
                    const count = heatmap[trigger][level];
                    return (
                      <td key={level} className="border p-0">
                        <div className={`h-12 flex items-center justify-center ${getIntensityColor(count, maxCount)} transition-colors`}>
                          <span className="font-semibold">{count > 0 ? count : ""}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center gap-4 justify-center text-sm">
          <span>Intensity:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted border" />
            <span>None</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-chart-1" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-chart-3" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-destructive" />
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
