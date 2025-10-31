import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

interface CommunicationProgressChartProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
}

export const CommunicationProgressChart = ({ familyId, studentId, sampleData, mode }: CommunicationProgressChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["communication-progress", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_communication_progress_data", {
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
        <p className="text-sm text-cyan-300/60">No communication data available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
          <XAxis dataKey="measurement_date" tick={{ fill: '#a5f3fc', fontSize: 10 }} />
          <YAxis tick={{ fill: '#a5f3fc', fontSize: 10 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(10, 25, 47, 0.9)', borderColor: 'rgba(6, 182, 212, 0.3)', borderRadius: '8px' }}
            labelStyle={{ color: '#a5f3fc' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#a5f3fc' }} />
          <Line type="monotone" dataKey="expressive_language" stroke="rgba(139, 92, 246, 0.9)" strokeWidth={2} name="Expressive" />
          <Line type="monotone" dataKey="receptive_language" stroke="rgba(59, 130, 246, 0.9)" strokeWidth={2} name="Receptive" />
          <Line type="monotone" dataKey="pragmatic_skills" stroke="rgba(16, 185, 129, 0.9)" strokeWidth={2} name="Pragmatic" />
          <Line type="monotone" dataKey="articulation" stroke="rgba(245, 158, 11, 0.9)" strokeWidth={2} name="Articulation" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};