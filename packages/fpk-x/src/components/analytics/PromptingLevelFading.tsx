import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface PromptingLevelFadingProps {
  familyId: string;
  studentId: string;
  sampleData?: any;
}

export const PromptingLevelFading = ({ familyId, studentId, sampleData }: PromptingLevelFadingProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["prompting-trend-data", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_prompting_trend_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: null // All time
      });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !sampleData,
  });

  const displayData = sampleData || data;

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!displayData || displayData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No prompting level data yet. Educator logs with prompting levels will appear here!
      </div>
    );
  }

  const processedData = Array.isArray(displayData)
    ? displayData.map((item: any) => ({
        date: format(new Date(item.log_date), "MMM dd"),
        "Independent": Number(item.independent_count),
        "Gestural": Number(item.gestural_count),
        "Verbal": Number(item.verbal_count),
        "Physical": Number(item.physical_count),
        "Full Prompt": Number(item.full_prompt_count),
      }))
    : [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="date" 
          className="text-xs"
          tick={{ fill: "hsl(var(--foreground))" }}
        />
        <YAxis 
          tick={{ fill: "hsl(var(--foreground))" }}
          label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)"
          }}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="Full Prompt" 
          stackId="1"
          stroke="hsl(var(--destructive))" 
          fill="hsl(var(--destructive))" 
          fillOpacity={0.6}
        />
        <Area 
          type="monotone" 
          dataKey="Physical" 
          stackId="1"
          stroke="hsl(var(--chart-1))" 
          fill="hsl(var(--chart-1))" 
          fillOpacity={0.6}
        />
        <Area 
          type="monotone" 
          dataKey="Verbal" 
          stackId="1"
          stroke="hsl(var(--chart-3))" 
          fill="hsl(var(--chart-3))" 
          fillOpacity={0.6}
        />
        <Area 
          type="monotone" 
          dataKey="Gestural" 
          stackId="1"
          stroke="hsl(var(--chart-4))" 
          fill="hsl(var(--chart-4))" 
          fillOpacity={0.6}
        />
        <Area 
          type="monotone" 
          dataKey="Independent" 
          stackId="1"
          stroke="hsl(var(--primary))" 
          fill="hsl(var(--primary))" 
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};