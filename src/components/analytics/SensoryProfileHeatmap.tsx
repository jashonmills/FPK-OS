import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface SensoryProfileHeatmapProps {
  studentId: string;
  familyId: string;
}

export const SensoryProfileHeatmap = ({ studentId, familyId }: SensoryProfileHeatmapProps) => {
  const { data: parentLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["parent_logs_sensory", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parent_logs")
        .select("*")
        .eq("student_id", studentId)
        .eq("family_id", familyId);
      if (error) throw error;
      return data;
    },
  });

  const { data: incidents, isLoading: incidentsLoading } = useQuery({
    queryKey: ["incident_logs_sensory", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incident_logs")
        .select("*")
        .eq("student_id", studentId)
        .eq("family_id", familyId);
      if (error) throw error;
      return data;
    },
  });

  const isLoading = logsLoading || incidentsLoading;

  const processHeatmapData = () => {
    const triggers = ["Loud Noises", "Bright Lights", "Crowded Spaces", "Textures", "Transitions"];
    const times = ["Morning", "Afternoon", "Evening"];
    const heatmap: Record<string, Record<string, number>> = {};

    triggers.forEach((trigger) => {
      heatmap[trigger] = { Morning: 0, Afternoon: 0, Evening: 0 };
    });

    // Process parent logs
    parentLogs?.forEach((log) => {
      const sensoryFactors = log.sensory_factors || [];
      const logTime = log.log_time || "";
      const timeOfDay = getTimeOfDay(logTime);

      sensoryFactors.forEach((factor: string) => {
        const matchedTrigger = triggers.find((t) => factor.toLowerCase().includes(t.toLowerCase()));
        if (matchedTrigger) {
          heatmap[matchedTrigger][timeOfDay]++;
        }
      });
    });

    // Process incidents
    incidents?.forEach((incident) => {
      const incidentTime = incident.incident_time || "";
      const timeOfDay = getTimeOfDay(incidentTime);
      const envFactors = incident.environmental_factors || [];

      envFactors.forEach((factor: string) => {
        const matchedTrigger = triggers.find((t) => factor.toLowerCase().includes(t.toLowerCase()));
        if (matchedTrigger) {
          heatmap[matchedTrigger][timeOfDay]++;
        }
      });
    });

    return { triggers, times, heatmap };
  };

  const getTimeOfDay = (time: string): string => {
    if (!time) return "Afternoon";
    const hour = parseInt(time.split(":")[0]);
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  const getIntensityColor = (count: number, max: number): string => {
    if (count === 0) return "bg-muted";
    const intensity = count / max;
    if (intensity > 0.7) return "bg-destructive";
    if (intensity > 0.4) return "bg-chart-3";
    return "bg-chart-1";
  };

  const { triggers, times, heatmap } = processHeatmapData();
  const maxCount = Math.max(...triggers.flatMap((t) => times.map((time) => heatmap[t][time])));

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
                <th className="border p-2 text-left font-semibold">Trigger</th>
                {times.map((time) => (
                  <th key={time} className="border p-2 text-center font-semibold">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {triggers.map((trigger) => (
                <tr key={trigger}>
                  <td className="border p-2 font-medium">{trigger}</td>
                  {times.map((time) => {
                    const count = heatmap[trigger][time];
                    return (
                      <td key={time} className="border p-0">
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
