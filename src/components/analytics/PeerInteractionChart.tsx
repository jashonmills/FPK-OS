import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

interface PeerInteractionChartProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
}

export const PeerInteractionChart = ({ familyId, studentId, sampleData, mode }: PeerInteractionChartProps) => {

  const { data, isLoading } = useQuery({
    queryKey: ["peer-interaction", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_peer_interaction_data", {
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
        <p className="text-sm text-cyan-300/60">No peer interaction data available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
          <XAxis dataKey="log_date" tick={{ fill: '#a5f3fc', fontSize: 10 }} />
          <YAxis tick={{ fill: '#a5f3fc', fontSize: 10 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(10, 25, 47, 0.9)', borderColor: 'rgba(6, 182, 212, 0.3)', borderRadius: '8px' }}
            labelStyle={{ color: '#a5f3fc' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#a5f3fc' }} />
          <Bar dataKey="positive_interactions" fill="#10b981" name="Positive" stackId="a" />
          <Bar dataKey="negative_interactions" fill="#ef4444" name="Negative" stackId="a" />
          <Bar dataKey="initiated_interactions" fill="#8b5cf6" name="Initiated" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};