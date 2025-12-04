import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface WorkingMemorySuccessChartProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
  days?: number;
}

export const WorkingMemorySuccessChart = ({ familyId, studentId, sampleData, mode, days = 30 }: WorkingMemorySuccessChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["working-memory", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_working_memory_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: days,
      });

      if (error) throw error;
      return data;
    },
    enabled: !sampleData && mode !== "demo",
    staleTime: 5 * 60 * 1000,
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
        <p className="text-sm text-cyan-300/60">No working memory data available</p>
      </div>
    );
  }

  // Transform data into format suitable for multi-line chart
  const dateMap = new Map();
  displayData.forEach((item: any) => {
    if (!item.measurement_date) return; // Skip invalid dates
    const parsedDate = new Date(item.measurement_date);
    if (isNaN(parsedDate.getTime())) return; // Skip invalid dates
    
    const date = format(parsedDate, "MMM dd");
    if (!dateMap.has(date)) {
      dateMap.set(date, { date });
    }
    const stepKey = item.step_count.replace(/[^a-zA-Z0-9]/g, '');
    dateMap.get(date)[stepKey] = Number(item.success_rate);
  });

  const chartData = Array.from(dateMap.values());

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#a5f3fc', fontSize: 10 }}
          />
          <YAxis 
            tick={{ fill: '#a5f3fc', fontSize: 10 }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(10, 25, 47, 0.9)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              borderRadius: "8px"
            }}
            labelStyle={{ color: '#a5f3fc' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#a5f3fc' }} />
          <Line 
            type="monotone" 
            dataKey="1Step" 
            stroke="rgba(96, 165, 250, 0.9)" 
            name="1-Step Tasks"
            strokeWidth={2}
            dot={{ fill: "rgba(96, 165, 250, 0.9)" }}
          />
          <Line 
            type="monotone" 
            dataKey="2Step" 
            stroke="rgba(168, 85, 247, 0.9)" 
            name="2-Step Tasks"
            strokeWidth={2}
            dot={{ fill: "rgba(168, 85, 247, 0.9)" }}
          />
          <Line 
            type="monotone" 
            dataKey="3Step" 
            stroke="rgba(251, 191, 36, 0.9)" 
            name="3+ Step Tasks"
            strokeWidth={2}
            dot={{ fill: "rgba(251, 191, 36, 0.9)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
