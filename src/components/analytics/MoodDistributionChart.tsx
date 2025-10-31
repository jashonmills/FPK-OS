import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface MoodDistributionChartProps {
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
}

// FPX Vibrant Color Palette - No Grays/Blacks!
const FPX_VIBRANT_PALETTE = {
  happy: { from: "rgb(251, 191, 36)", to: "rgb(245, 158, 11)" },     // Amber
  calm: { from: "rgb(96, 165, 250)", to: "rgb(59, 130, 246)" },      // Blue
  anxious: { from: "rgb(168, 85, 247)", to: "rgb(147, 51, 234)" },   // Purple
  agitated: { from: "rgb(248, 113, 113)", to: "rgb(239, 68, 68)" },  // Red
  tired: { from: "rgb(34, 211, 238)", to: "rgb(6, 182, 212)" },      // Cyan (was gray!)
  irritable: { from: "rgb(251, 113, 133)", to: "rgb(236, 72, 153)" } // Pink
};

const MOOD_COLORS: Record<string, string> = {
  "happy": "url(#happyGradient)",
  "calm": "url(#calmGradient)",
  "anxious": "url(#anxiousGradient)",
  "agitated": "url(#agitatedGradient)",
  "tired": "url(#tiredGradient)",
  "irritable": "url(#irritableGradient)",
};

export const MoodDistributionChart = ({ familyId, studentId, sampleData, mode }: MoodDistributionChartProps) => {
  // DEMO MODE: Return hardcoded chart immediately
  if (sampleData) {
    return (
      <div className="h-full w-full p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[
            { day: 'Sunday', Happy: 6, Calm: 3, Anxious: 1, Agitated: 0, Tired: 0 },
            { day: 'Monday', Happy: 5, Calm: 3, Anxious: 1, Agitated: 0, Tired: 1 },
            { day: 'Tuesday', Happy: 6, Calm: 2, Anxious: 2, Agitated: 0, Tired: 0 },
            { day: 'Wednesday', Happy: 4, Calm: 4, Anxious: 1, Agitated: 1, Tired: 0 },
            { day: 'Thursday', Happy: 7, Calm: 2, Anxious: 0, Agitated: 1, Tired: 0 },
            { day: 'Friday', Happy: 8, Calm: 1, Anxious: 1, Agitated: 0, Tired: 0 },
            { day: 'Saturday', Happy: 5, Calm: 3, Anxious: 0, Agitated: 1, Tired: 1 },
          ]}>
            <defs>
              <linearGradient id="happyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={FPX_VIBRANT_PALETTE.happy.from} stopOpacity={0.95} />
                <stop offset="100%" stopColor={FPX_VIBRANT_PALETTE.happy.to} stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="calmGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={FPX_VIBRANT_PALETTE.calm.from} stopOpacity={0.95} />
                <stop offset="100%" stopColor={FPX_VIBRANT_PALETTE.calm.to} stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="anxiousGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={FPX_VIBRANT_PALETTE.anxious.from} stopOpacity={0.95} />
                <stop offset="100%" stopColor={FPX_VIBRANT_PALETTE.anxious.to} stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="agitatedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={FPX_VIBRANT_PALETTE.agitated.from} stopOpacity={0.95} />
                <stop offset="100%" stopColor={FPX_VIBRANT_PALETTE.agitated.to} stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="tiredGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={FPX_VIBRANT_PALETTE.tired.from} stopOpacity={0.95} />
                <stop offset="100%" stopColor={FPX_VIBRANT_PALETTE.tired.to} stopOpacity={0.85} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
            <XAxis dataKey="day" tick={{ fill: '#a5f3fc', fontSize: 10 }} />
            <YAxis tick={{ fill: '#a5f3fc', fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(10, 25, 47, 0.9)', borderColor: 'rgba(6, 182, 212, 0.3)', borderRadius: '8px' }}
              labelStyle={{ color: '#a5f3fc' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', color: '#a5f3fc' }} />
            <Bar dataKey="Happy" stackId="a" fill="url(#happyGradient)" />
            <Bar dataKey="Calm" stackId="a" fill="url(#calmGradient)" />
            <Bar dataKey="Anxious" stackId="a" fill="url(#anxiousGradient)" />
            <Bar dataKey="Agitated" stackId="a" fill="url(#agitatedGradient)" />
            <Bar dataKey="Tired" stackId="a" fill="url(#tiredGradient)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  

  const { data, isLoading } = useQuery({
    queryKey: ["weekly-mood", familyId, studentId],
    queryFn: async () => {
      // Try parent_logs first (manual daily logging)
      const { data: logs, error: logsError } = await supabase.rpc("get_weekly_mood_counts", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: 7
      });

      if (!logsError && logs && logs.length > 0) {
        return { source: 'logs', data: logs };
      }
      
      // Fallback to document_metrics (historical mood data)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const { data: metrics, error: metricsError } = await supabase
        .from("document_metrics")
        .select("measurement_date, metric_name, metric_value")
        .eq("family_id", familyId)
        .eq("student_id", studentId)
        .eq("metric_type", "mood_tracking")
        .not("measurement_date", "is", null)
        .gte("measurement_date", sevenDaysAgo)
        .order("measurement_date", { ascending: true });
      
      if (metricsError) throw metricsError;
      
      // Transform metrics to mood count format
      const transformedData = metrics?.map(m => ({
        day_of_week: format(new Date(m.measurement_date), 'EEEE'),
        day_order: new Date(m.measurement_date).getDay() + 1,
        mood: m.metric_name.toLowerCase(),
        count: 1
      })) || [];
      
      return { source: 'documents', data: transformedData };
    },
    staleTime: 5 * 60 * 1000,
    enabled: !sampleData && mode !== "demo",
  });

  const displayData = sampleData || data?.data;
  const dataSource = data?.source || 'unknown';

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
        <p className="text-sm text-cyan-300/60">No mood data available</p>
      </div>
    );
  }

  // Transform data for stacked bar chart
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const moods = [...new Set(displayData.map((item: any) => item.mood))] as string[];
  
  const chartData = daysOfWeek.map((day, index) => {
    const dayData: any = { day };
    const dayOrder = index + 1;
    
    moods.forEach((mood: string) => {
      const moodEntry = displayData.find((item: any) => 
        item.day_of_week.trim() === day && item.mood === mood
      );
      dayData[mood] = moodEntry ? Number(moodEntry.count) : 0;
    });
    
    return dayData;
  });

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <defs>
            <linearGradient id="happyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(251, 191, 36)" stopOpacity={1} />
              <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="calmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(96, 165, 250)" stopOpacity={1} />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="anxiousGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity={1} />
              <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="agitatedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(248, 113, 113)" stopOpacity={1} />
              <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="tiredGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(34, 211, 238)" stopOpacity={1} />
              <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="irritableGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={1} />
              <stop offset="100%" stopColor="rgb(220, 38, 38)" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
          <XAxis 
            dataKey="day" 
            tick={{ fill: '#a5f3fc', fontSize: 9 }}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fill: '#a5f3fc', fontSize: 10 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(10, 25, 47, 0.9)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              borderRadius: "8px"
            }}
            labelStyle={{ color: '#a5f3fc' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#a5f3fc' }} />
          {moods.map((mood: string) => (
            <Bar 
              key={mood} 
              dataKey={mood as string} 
              stackId="a" 
              fill={MOOD_COLORS[mood] || "rgba(100, 100, 100, 0.5)"}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
