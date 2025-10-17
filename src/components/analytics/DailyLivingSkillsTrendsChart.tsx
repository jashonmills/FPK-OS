import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Home } from "lucide-react";
import { format } from "date-fns";

interface DailyLivingSkillsTrendsChartProps {
  familyId: string;
  studentId: string;
  days?: number;
  sampleData?: any;
  mode?: 'live' | 'demo';
}

export const DailyLivingSkillsTrendsChart = ({ familyId, studentId, days = 30, sampleData, mode }: DailyLivingSkillsTrendsChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["dls-trends", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_dls_trends_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: days,
      });

      if (error) throw error;
      return data;
    },
    enabled: !sampleData && mode !== 'demo',
    staleTime: 5 * 60 * 1000,
  });

  // Use sample data if provided, otherwise use live data
  const displayData = sampleData || data;

  if (isLoading && !sampleData) {
    return (
      <Card className="bg-transparent border-0">
        <CardContent className="p-4">
          <Skeleton className="h-full w-full bg-cyan-900/20" />
        </CardContent>
      </Card>
    );
  }

  // ALWAYS render chart if we have sampleData (demo mode)
  const chartData = displayData?.map((item: any) => ({
    date: item.log_date ? format(new Date(item.log_date), "MMM dd") : item.date,
    teethBrushing: item.teeth_brushing ? Number(item.teeth_brushing) : null,
    dressing: item.dressing ? Number(item.dressing) : null,
    toileting: item.toileting ? Number(item.toileting) : null,
    handWashing: item.hand_washing ? Number(item.hand_washing) : null,
    mealPrep: item.meal_prep ? Number(item.meal_prep) : null,
  })) || [];

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: "#E0E0E0", fontSize: 10 }}
            stroke="rgba(6, 182, 212, 0.3)"
          />
          <YAxis 
            tick={{ fill: "#E0E0E0", fontSize: 10 }}
            stroke="rgba(6, 182, 212, 0.3)"
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(10, 25, 47, 0.95)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              borderRadius: "8px",
              color: "#E0E0E0"
            }}
          />
          <Legend wrapperStyle={{ color: "#E0E0E0", fontSize: 10 }} />
          <Line 
            type="monotone" 
            dataKey="teethBrushing" 
            stroke="#06B6D4" 
            name="Teeth"
            strokeWidth={2}
            connectNulls
            dot={{ fill: "#06B6D4", r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="dressing" 
            stroke="#8B5CF6" 
            name="Dressing"
            strokeWidth={2}
            connectNulls
            dot={{ fill: "#8B5CF6", r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="toileting" 
            stroke="#F59E0B" 
            name="Toileting"
            strokeWidth={2}
            connectNulls
            dot={{ fill: "#F59E0B", r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="handWashing" 
            stroke="#10B981" 
            name="Hand Wash"
            strokeWidth={2}
            connectNulls
            dot={{ fill: "#10B981", r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="mealPrep" 
            stroke="#EC4899" 
            name="Meal Prep"
            strokeWidth={2}
            connectNulls
            dot={{ fill: "#EC4899", r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
