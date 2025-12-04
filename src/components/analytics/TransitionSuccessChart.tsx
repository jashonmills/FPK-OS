import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Loader2 } from "lucide-react";

interface TransitionSuccessChartProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
}

export const TransitionSuccessChart = ({ familyId, studentId, sampleData, mode }: TransitionSuccessChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["transition-success", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_transition_success_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: 60
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !sampleData && mode !== "demo",
  });

  const displayData = sampleData || data;

  const getColor = (value: number) => {
    if (value >= 80) return "rgba(16, 185, 129, 0.8)";
    if (value >= 60) return "rgba(245, 158, 11, 0.8)";
    return "rgba(239, 68, 68, 0.8)";
  };

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
        <p className="text-sm text-cyan-300/60">No transition data available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={displayData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#a5f3fc', fontSize: 10 }} />
          <YAxis dataKey="transition_type" type="category" width={150} tick={{ fill: '#a5f3fc', fontSize: 10 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(10, 25, 47, 0.9)', borderColor: 'rgba(6, 182, 212, 0.3)', borderRadius: '8px' }}
            labelStyle={{ color: '#a5f3fc' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#a5f3fc' }} />
          <Bar dataKey="success_rate" name="Success Rate (%)" radius={[0, 4, 4, 0]}>
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(Number(entry.success_rate))} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};