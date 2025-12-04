import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb } from "lucide-react";

interface StrategySuccessRatesChartProps {
  familyId: string;
  studentId: string;
  days?: number;
}

export const StrategySuccessRatesChart = ({ familyId, studentId, days = 30 }: StrategySuccessRatesChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["strategy-success-rates", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_strategy_success_rates_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: days,
      });

      if (error) {
        console.error(`[StrategySuccessRates] RPC Error:`, error);
        throw error;
      }
      console.log(`[StrategySuccessRates] Found ${data?.length || 0} strategies`, data);
      if (data && data.length > 0) {
        console.log(`[StrategySuccessRates] Sample data:`, {
          strategy: data[0].strategy_name,
          totalUses: data[0].total_uses,
          successfulUses: data[0].successful_uses,
          successRate: data[0].success_rate
        });
      }
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div 
        className="relative overflow-hidden rounded-xl border h-full"
        style={{
          backgroundColor: 'rgba(10, 25, 47, 0.15)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          borderColor: 'rgba(6, 182, 212, 0.4)',
          boxShadow: '0 0 15px rgba(0, 180, 255, 0.15)'
        }}
      >
        <Skeleton className="h-full w-full bg-cyan-900/20" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div 
        className="relative overflow-hidden rounded-xl border h-full flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(10, 25, 47, 0.15)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          borderColor: 'rgba(6, 182, 212, 0.4)',
          boxShadow: '0 0 15px rgba(0, 180, 255, 0.15)'
        }}
      >
        <div className="text-muted-foreground text-xs">
          No intervention data available. Log incidents with interventions to see success rates!
        </div>
      </div>
    );
  }

  const getBarColor = (successRate: number) => {
    if (successRate >= 70) return "url(#greenGradient)";
    if (successRate >= 50) return "url(#yellowGradient)";
    return "url(#redGradient)";
  };

  const chartData = data.map((item: any) => ({
    strategy: item.strategy_name.length > 20 
      ? item.strategy_name.substring(0, 20) + '...' 
      : item.strategy_name,
    fullStrategy: item.strategy_name,
    successRate: Number(item.success_rate),
    totalUses: Number(item.total_uses),
    successfulUses: Number(item.successful_uses),
  }));

  return (
    <div 
      className="relative overflow-hidden rounded-xl border h-full"
      style={{
        backgroundColor: 'rgba(10, 25, 47, 0.15)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        borderColor: 'rgba(6, 182, 212, 0.4)',
        boxShadow: '0 0 15px rgba(0, 180, 255, 0.15)'
      }}
    >
      <div className="absolute top-1 left-1.5 z-20">
        <h3 
          className="text-[9px] font-bold text-cyan-400/90"
          style={{ textShadow: '0 0 8px rgba(6, 182, 212, 0.4)' }}
        >
          Strategy Success Rates
        </h3>
      </div>
      <div className="pt-5 px-1 pb-1 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity={1} />
                <stop offset="100%" stopColor="rgb(22, 163, 74)" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(234, 179, 8)" stopOpacity={1} />
                <stop offset="100%" stopColor="rgb(202, 138, 4)" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={1} />
                <stop offset="100%" stopColor="rgb(220, 38, 38)" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="strategy" 
              className="text-xs"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 8 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--foreground))", fontSize: 8 }}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(10, 25, 47, 0.8)",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(0, 180, 255, 0.3)",
                borderRadius: "8px",
                boxShadow: "0 0 15px rgba(0, 180, 255, 0.2)"
              }}
              labelStyle={{ color: "#E0E0E0", fontSize: "0.8rem" }}
              itemStyle={{ color: "#FFFFFF", fontWeight: 600 }}
              formatter={(value: any, name: string, props: any) => {
                if (name === 'successRate') {
                  return [
                    <div key="tooltip" className="space-y-1">
                      <div>{props.payload.fullStrategy}</div>
                      <div>Success Rate: {value}%</div>
                      <div className="text-xs" style={{ color: "#E0E0E0" }}>
                        {props.payload.successfulUses} / {props.payload.totalUses} uses
                      </div>
                    </div>,
                    ''
                  ];
                }
                return [value, name];
              }}
            />
            <Bar dataKey="successRate" name="Success Rate (%)">
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.successRate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
