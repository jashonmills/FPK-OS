import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Loader2 } from "lucide-react";

interface BehaviorFunctionAnalysisProps {
  studentId: string;
  familyId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
}

export const BehaviorFunctionAnalysis = ({ studentId, familyId, sampleData, mode }: BehaviorFunctionAnalysisProps) => {
  // DEMO MODE: Return hardcoded chart immediately
  if (sampleData) {
    console.log('BehaviorFunctionAnalysis rendering with sampleData');
    const demoData = [
      { name: 'Yelling', frequency: 4, function: 'Escape', x: 25, y: 70 },
      { name: 'Hitting', frequency: 3, function: 'Attention', x: 50, y: 55 },
      { name: 'Tantrums', frequency: 5, function: 'Tangible', x: 75, y: 65 },
      { name: 'Hand Flapping', frequency: 2, function: 'Sensory', x: 40, y: 85 },
      { name: 'Refusal', frequency: 3, function: 'Escape', x: 65, y: 45 },
    ];

    const getFunctionColor = (func: string) => {
      const colorMap: Record<string, string> = {
        Escape: "rgba(239, 68, 68, 0.8)",
        Tangible: "rgba(6, 182, 212, 0.8)",
        Sensory: "rgba(168, 85, 247, 0.8)",
        Attention: "rgba(251, 191, 36, 0.8)",
        Unknown: "rgba(156, 163, 175, 0.6)",
      };
      return colorMap[func] || colorMap.Unknown;
    };

    return (
      <div className="w-full h-full min-h-[300px] p-2">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
            <XAxis type="number" dataKey="x" hide />
            <YAxis type="number" dataKey="y" hide />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background/95 border border-cyan-400/30 rounded-lg p-3 shadow-lg">
                      <p className="font-semibold text-cyan-100">{data.name}</p>
                      <p className="text-sm text-cyan-300/70">Function: {data.function}</p>
                      <p className="text-sm text-cyan-300/70">Frequency: {data.frequency}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={demoData}>
              {demoData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getFunctionColor(entry.function)} r={entry.frequency * 8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-2 flex flex-wrap gap-2 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(239, 68, 68, 0.8)" }} />
            <span className="text-[9px] text-cyan-300/80">Escape</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(6, 182, 212, 0.8)" }} />
            <span className="text-[9px] text-cyan-300/80">Tangible</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(168, 85, 247, 0.8)" }} />
            <span className="text-[9px] text-cyan-300/80">Sensory</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(251, 191, 36, 0.8)" }} />
            <span className="text-[9px] text-cyan-300/80">Attention</span>
          </div>
        </div>
      </div>
    );
  }

  const { data: behaviorData, isLoading } = useQuery({
    queryKey: ["behavior-function-data", studentId, familyId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_behavior_function_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: null // All time
      });
      if (error) throw error;
      return data;
    },
    enabled: !sampleData && mode !== "demo",
  });

  // Transform RPC data for bubble chart format
  const chartData = Array.isArray(sampleData || behaviorData)
    ? (sampleData || behaviorData).map((item: any, index: number) => ({
        name: item.behavior_type,
        frequency: Number(item.frequency),
        function: determineBehaviorFunction(item.common_antecedent, item.common_consequence),
        x: (index * 20) + Math.random() * 15,
        y: 50 + Math.random() * 40,
      }))
    : [];

  // Helper to infer function from antecedents/consequences
  function determineBehaviorFunction(antecedent: string | null, consequence: string | null): string {
    const text = `${antecedent || ''} ${consequence || ''}`.toLowerCase();
    if (text.includes('escape') || text.includes('avoid')) return 'Escape';
    if (text.includes('tangible') || text.includes('obtain')) return 'Tangible';
    if (text.includes('sensory') || text.includes('stimulation')) return 'Sensory';
    if (text.includes('attention') || text.includes('social')) return 'Attention';
    return 'Unknown';
  }

  const getFunctionColor = (func: string) => {
    const colorMap: Record<string, string> = {
      Escape: "rgba(239, 68, 68, 0.8)",
      Tangible: "rgba(6, 182, 212, 0.8)",
      Sensory: "rgba(168, 85, 247, 0.8)",
      Attention: "rgba(251, 191, 36, 0.8)",
      Unknown: "rgba(156, 163, 175, 0.6)",
    };
    return colorMap[func] || colorMap.Unknown;
  };

  if (isLoading && !sampleData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-sm text-cyan-300/60">No behavioral data available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
          <XAxis type="number" dataKey="x" hide />
          <YAxis type="number" dataKey="y" hide />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background/95 border border-cyan-400/30 rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-cyan-100">{data.name}</p>
                    <p className="text-sm text-cyan-300/70">Function: {data.function}</p>
                    <p className="text-sm text-cyan-300/70">Frequency: {data.frequency}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter data={chartData}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getFunctionColor(entry.function)} r={entry.frequency * 8} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(239, 68, 68, 0.8)" }} />
          <span className="text-[9px] text-cyan-300/80">Escape</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(6, 182, 212, 0.8)" }} />
          <span className="text-[9px] text-cyan-300/80">Tangible</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(168, 85, 247, 0.8)" }} />
          <span className="text-[9px] text-cyan-300/80">Sensory</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(251, 191, 36, 0.8)" }} />
          <span className="text-[9px] text-cyan-300/80">Attention</span>
        </div>
      </div>
    </div>
  );
};
