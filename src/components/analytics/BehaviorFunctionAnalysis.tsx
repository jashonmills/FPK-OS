import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { InfoTooltip } from '@/components/shared/InfoTooltip';

interface BehaviorFunctionAnalysisProps {
  studentId: string;
  familyId: string;
  sampleData?: any;
}

export const BehaviorFunctionAnalysis = ({ studentId, familyId, sampleData }: BehaviorFunctionAnalysisProps) => {
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
    enabled: !sampleData,
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
      Escape: "hsl(var(--destructive))",
      Tangible: "hsl(var(--primary))",
      Sensory: "hsl(var(--chart-2))",
      Attention: "hsl(var(--chart-3))",
      Unknown: "hsl(var(--muted-foreground))",
    };
    return colorMap[func] || colorMap.Unknown;
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Behavior Function Analysis</CardTitle>
              <CardDescription>Understanding the "why" behind behaviors</CardDescription>
            </div>
            <Badge variant="secondary">AI Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Behavior Function Analysis</CardTitle>
              <CardDescription>Understanding the "why" behind behaviors</CardDescription>
            </div>
            <Badge variant="secondary">AI Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No behavioral data available yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Behavior Function Analysis
              <InfoTooltip content="This chart categorizes behaviors by their hypothesized function: Escape (avoiding something), Tangible (getting something), Sensory (seeking stimulation), or Attention (seeking interaction). Understanding function helps target effective interventions." />
            </CardTitle>
            <CardDescription>Understanding the "why" behind behaviors</CardDescription>
          </div>
          <Badge variant="secondary">AI Recommended</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" hide />
            <YAxis type="number" dataKey="y" hide />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{data.name}</p>
                      <p className="text-sm text-muted-foreground">Function: {data.function}</p>
                      <p className="text-sm text-muted-foreground">Frequency: {data.frequency}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={chartData} fill="hsl(var(--primary))">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getFunctionColor(entry.function)} r={entry.frequency * 8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--destructive))" }} />
            <span className="text-sm">Escape</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--primary))" }} />
            <span className="text-sm">Tangible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
            <span className="text-sm">Sensory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-3))" }} />
            <span className="text-sm">Attention</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
