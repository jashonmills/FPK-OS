import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface TaskInitiationLatencyChartProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
  days?: number;
}

export const TaskInitiationLatencyChart = ({ familyId, studentId, sampleData, mode, days = 30 }: TaskInitiationLatencyChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["task-initiation", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_task_initiation_data", {
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
        <p className="text-sm text-cyan-300/60">No task initiation data available</p>
      </div>
    );
  }

  const chartData = displayData.map((item: any) => {
    const parsedDate = new Date(item.measurement_date);
    return {
      date: isNaN(parsedDate.getTime()) ? 'Invalid' : format(parsedDate, "MMM dd"),
      latency: Number(item.avg_latency_seconds),
      complexity: item.task_complexity || 'Standard',
      promptLevel: item.prompt_level || 'None',
    };
  }).filter(item => item.date !== 'Invalid');

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#a5f3fc', fontSize: 10 }}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis 
            tick={{ fill: '#a5f3fc', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(10, 25, 47, 0.9)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              borderRadius: "8px"
            }}
            labelStyle={{ color: '#a5f3fc' }}
            formatter={(value: any, name: string, props: any) => {
              if (name === 'latency') {
                return [
                  <div key="tooltip" className="space-y-1">
                    <div>Latency: {value}s</div>
                    <div className="text-xs text-cyan-300/70">
                      Complexity: {props.payload.complexity}
                    </div>
                    <div className="text-xs text-cyan-300/70">
                      Prompt: {props.payload.promptLevel}
                    </div>
                  </div>,
                  ''
                ];
              }
              return [value, name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#a5f3fc' }} />
          <Line 
            type="monotone" 
            dataKey="latency" 
            stroke="rgba(6, 182, 212, 0.9)" 
            name="Avg Latency (s)"
            strokeWidth={2}
            dot={{ fill: "rgba(6, 182, 212, 0.9)", r: 3 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
