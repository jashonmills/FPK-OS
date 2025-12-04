import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface SensoryProfileHeatmapProps {
  studentId: string;
  familyId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
}

export const SensoryProfileHeatmap = ({ studentId, familyId, sampleData, mode }: SensoryProfileHeatmapProps) => {
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
    enabled: !sampleData && mode !== "demo",
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
    if (count === 0) return "bg-cyan-950/20";
    const intensity = count / max;
    if (intensity > 0.7) return "bg-gradient-to-br from-red-500/60 to-orange-500/60";
    if (intensity > 0.4) return "bg-gradient-to-br from-amber-500/60 to-yellow-500/60";
    return "bg-gradient-to-br from-green-500/60 to-emerald-500/60";
  };

  const { triggers, intensityLevels, heatmap, maxCount } = processHeatmapData();

  if (isLoading && !sampleData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Skeleton className="h-full w-full bg-cyan-900/20" />
      </div>
    );
  }

  if (maxCount === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-sm text-cyan-300/60">No sensory data available yet</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-3 overflow-auto">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-cyan-500/20 p-1.5 text-left font-semibold text-cyan-100 text-xs bg-cyan-950/30">Category</th>
              {intensityLevels.map((level) => (
                <th key={level} className="border border-cyan-500/20 p-1.5 text-center font-semibold text-cyan-100 text-xs bg-cyan-950/30">
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {triggers.map((trigger) => (
              <tr key={trigger}>
                <td className="border border-cyan-500/20 p-1.5 font-medium text-cyan-200 text-xs">{trigger}</td>
                {intensityLevels.map((level) => {
                  const count = heatmap[trigger][level];
                  return (
                    <td key={level} className="border border-cyan-500/20 p-0">
                      <div className={`h-10 flex items-center justify-center ${getIntensityColor(count, maxCount)} transition-colors`}>
                        <span className="font-semibold text-white text-xs">{count > 0 ? count : ""}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center gap-3 justify-center text-[10px]">
        <span className="text-cyan-300">Intensity:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-cyan-950/20 border border-cyan-500/20 rounded" />
          <span className="text-cyan-300/70">None</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-gradient-to-br from-green-500/60 to-emerald-500/60 rounded" />
          <span className="text-cyan-300/70">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-gradient-to-br from-amber-500/60 to-yellow-500/60 rounded" />
          <span className="text-cyan-300/70">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-gradient-to-br from-red-500/60 to-orange-500/60 rounded" />
          <span className="text-cyan-300/70">High</span>
        </div>
      </div>
    </div>
  );
};
