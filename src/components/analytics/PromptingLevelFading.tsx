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
    queryKey: ["prompting-levels", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("educator_logs")
        .select("log_date, prompting_level")
        .eq("family_id", familyId)
        .eq("student_id", studentId)
        .not("prompting_level", "is", null)
        .order("log_date", { ascending: true })
        .limit(30);

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

  // Process data to show prompting level distribution over time
  const processedData = displayData.reduce((acc: any[], log: any) => {
    // Skip logs with invalid dates
    if (!log.log_date) return acc;
    
    const dateObj = new Date(log.log_date);
    if (isNaN(dateObj.getTime())) return acc;
    
    const date = format(dateObj, "MMM dd");
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      existing[log.prompting_level] = (existing[log.prompting_level] || 0) + 1;
    } else {
      acc.push({
        date,
        [log.prompting_level]: 1,
        "Hand-over-Hand": 0,
        "Physical": 0,
        "Model": 0,
        "Verbal": 0,
        "Gestural": 0,
        "Independent": 0,
      });
    }
    return acc;
  }, []);

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
          dataKey="Hand-over-Hand" 
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
          dataKey="Model" 
          stackId="1"
          stroke="hsl(var(--chart-2))" 
          fill="hsl(var(--chart-2))" 
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