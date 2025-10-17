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

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Strategy Success Rates
          </CardTitle>
          <CardDescription>How often each intervention leads to positive outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Strategy Success Rates
          </CardTitle>
          <CardDescription>How often each intervention leads to positive outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No intervention data available. Log incidents with interventions to see success rates!
          </div>
        </CardContent>
      </Card>
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
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Strategy Success Rates
        </CardTitle>
        <CardDescription>
          Ranked by effectiveness over the last {days} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
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
              tick={{ fill: "hsl(var(--foreground))" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft' }}
              tick={{ fill: "hsl(var(--foreground))" }}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
              formatter={(value: any, name: string, props: any) => {
                if (name === 'successRate') {
                  return [
                    <div key="tooltip" className="space-y-1">
                      <div>{props.payload.fullStrategy}</div>
                      <div>Success Rate: {value}%</div>
                      <div className="text-xs text-muted-foreground">
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
      </CardContent>
    </Card>
  );
};
