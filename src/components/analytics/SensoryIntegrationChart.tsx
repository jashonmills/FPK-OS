import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";
import { Loader2 } from "lucide-react";

interface SensoryIntegrationChartProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
}

export const SensoryIntegrationChart = ({ familyId, studentId, sampleData, mode }: SensoryIntegrationChartProps) => {

  const { data, isLoading } = useQuery({
    queryKey: ["sensory-integration", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_sensory_integration_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: null // All time
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !sampleData && mode !== "demo",
  });

  const displayData = sampleData || data;

  if (isLoading && !sampleData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!displayData || displayData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-sm text-cyan-300/60">No sensory data available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={displayData}>
          <PolarGrid stroke="rgba(6, 182, 212, 0.2)" />
          <PolarAngleAxis dataKey="sensory_system" tick={{ fill: '#a5f3fc', fontSize: 11 }} />
          <PolarRadiusAxis tick={{ fill: '#a5f3fc', fontSize: 10 }} />
          <Radar 
            name="Regulation Score" 
            dataKey="regulation_score" 
            stroke="rgba(139, 92, 246, 0.8)" 
            fill="rgba(139, 92, 246, 0.4)" 
            fillOpacity={0.6} 
          />
          <Legend wrapperStyle={{ fontSize: '11px', color: '#a5f3fc' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};