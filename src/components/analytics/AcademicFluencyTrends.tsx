import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface AcademicFluencyTrendsProps {
  studentId: string;
  familyId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
}

export const AcademicFluencyTrends = ({ studentId, familyId, dateRange, sampleData, mode }: AcademicFluencyTrendsProps) => {
  // DEMO MODE: Return hardcoded chart immediately
  if (sampleData) {
    return (
      <div className="h-full w-full p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[
            { formattedDate: 'Sep 01', reading: 25, math: 12 },
            { formattedDate: 'Sep 08', reading: 28, math: 14 },
            { formattedDate: 'Sep 15', reading: 30, math: 15 },
            { formattedDate: 'Sep 22', reading: 32, math: 16 },
            { formattedDate: 'Sep 29', reading: 35, math: 18 },
            { formattedDate: 'Oct 06', reading: 38, math: 20 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
            <XAxis dataKey="formattedDate" tick={{ fill: '#a5f3fc', fontSize: 10 }} />
            <YAxis yAxisId="left" tick={{ fill: '#a5f3fc', fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#a5f3fc', fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(10, 25, 47, 0.9)', borderColor: 'rgba(6, 182, 212, 0.3)', borderRadius: '8px' }}
              labelStyle={{ color: '#a5f3fc' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', color: '#a5f3fc' }} />
            <Line yAxisId="left" type="monotone" dataKey="reading" stroke="rgba(6, 182, 212, 0.9)" name="Reading" strokeWidth={2} connectNulls={false} dot={{ r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="math" stroke="rgba(168, 85, 247, 0.9)" name="Math" strokeWidth={2} connectNulls={false} dot={{ r: 3 }} />
            <ReferenceLine yAxisId="left" y={40} stroke="rgba(6, 182, 212, 0.6)" strokeDasharray="3 3" />
            <ReferenceLine yAxisId="right" y={25} stroke="rgba(168, 85, 247, 0.6)" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }


  const { data: fluencyData, isLoading } = useQuery({
    queryKey: ["academic-fluency-data", studentId, familyId, dateRange],
    queryFn: async () => {
      if (!dateRange) return [];
      
      const { data, error } = await supabase.rpc("get_academic_fluency_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_start_date: format(dateRange.from, "yyyy-MM-dd"),
        p_end_date: format(dateRange.to, "yyyy-MM-dd")
      });
      if (error) throw error;
      return data;
    },
    enabled: !sampleData && mode !== "demo" && !!dateRange,
  });

  const processChartData = () => {
    // If sampleData is provided (demo mode), show hardcoded demo data
    if (sampleData) {
      return {
        data: [
          { formattedDate: 'Jan 10', reading: 45, math: 38 },
          { formattedDate: 'Jan 12', reading: 52, math: 42 },
          { formattedDate: 'Jan 15', reading: 58, math: 45 },
          { formattedDate: 'Jan 18', reading: 61, math: 50 },
          { formattedDate: 'Jan 22', reading: 67, math: 53 },
          { formattedDate: 'Jan 25', reading: 72, math: 58 },
        ],
        readingTarget: 80,
        mathTarget: 65,
      };
    }

    const rawData = fluencyData;
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return { data: [], readingTarget: 0, mathTarget: 0 };
    }

    const chartData = rawData.map((item: any) => {
      const parsedDate = new Date(item.measurement_date);
      return {
        formattedDate: isNaN(parsedDate.getTime()) ? 'Invalid' : format(parsedDate, "MMM dd"),
        reading: item.reading_fluency ? Number(item.reading_fluency) : undefined,
        math: item.math_fluency ? Number(item.math_fluency) : undefined,
      };
    }).filter(item => item.formattedDate !== 'Invalid');

    const readingTarget = rawData.find((d: any) => d.reading_target)?.reading_target || 0;
    const mathTarget = rawData.find((d: any) => d.math_target)?.math_target || 0;

    return { data: chartData, readingTarget: Number(readingTarget), mathTarget: Number(mathTarget) };
  };

  const { data: chartData, readingTarget, mathTarget } = processChartData();

  if (isLoading && !sampleData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (chartData.length === 0 && !sampleData) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-sm text-cyan-300/60">No fluency data available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
          <XAxis dataKey="formattedDate" tick={{ fill: '#a5f3fc', fontSize: 10 }} />
          <YAxis yAxisId="left" tick={{ fill: '#a5f3fc', fontSize: 10 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#a5f3fc', fontSize: 10 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(10, 25, 47, 0.9)', borderColor: 'rgba(6, 182, 212, 0.3)', borderRadius: '8px' }}
            labelStyle={{ color: '#a5f3fc' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#a5f3fc' }} />
          <Line yAxisId="left" type="monotone" dataKey="reading" stroke="rgba(6, 182, 212, 0.9)" name="Reading" strokeWidth={2} connectNulls={false} dot={{ r: 3 }} />
          <Line yAxisId="right" type="monotone" dataKey="math" stroke="rgba(168, 85, 247, 0.9)" name="Math" strokeWidth={2} connectNulls={false} dot={{ r: 3 }} />
          {readingTarget > 0 && (
            <ReferenceLine yAxisId="left" y={readingTarget} stroke="rgba(6, 182, 212, 0.6)" strokeDasharray="3 3" />
          )}
          {mathTarget > 0 && (
            <ReferenceLine yAxisId="right" y={mathTarget} stroke="rgba(168, 85, 247, 0.6)" strokeDasharray="3 3" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
