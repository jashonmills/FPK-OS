import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

interface EnvironmentalImpactChartProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
}

export const EnvironmentalImpactChart = ({ familyId, studentId, sampleData, mode }: EnvironmentalImpactChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["environmental-impact", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_environmental_impact_data", {
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
        <p className="text-sm text-cyan-300/60">No environmental data available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
          <XAxis dataKey="factor_category" tick={{ fill: '#a5f3fc', fontSize: 9 }} angle={-30} textAnchor="end" height={60} />
          <YAxis tick={{ fill: '#a5f3fc', fontSize: 10 }} domain={[-1, 1]} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(10, 25, 47, 0.9)', borderColor: 'rgba(6, 182, 212, 0.3)', borderRadius: '8px' }}
            labelStyle={{ color: '#a5f3fc' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#a5f3fc' }} />
          <Bar dataKey="positive_correlation" fill="rgba(16, 185, 129, 0.7)" name="Positive" />
          <Bar dataKey="negative_correlation" fill="rgba(239, 68, 68, 0.7)" name="Negative" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};