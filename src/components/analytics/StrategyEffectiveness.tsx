import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, TrendingUp } from "lucide-react";

export const StrategyEffectiveness = () => {
  const { selectedStudent } = useFamily();

  const { data: outcomes, isLoading } = useQuery({
    queryKey: ["intervention-outcomes", selectedStudent?.id],
    queryFn: async () => {
      if (!selectedStudent?.id) return [];
      const { data, error } = await supabase
        .from("intervention_outcomes")
        .select("*")
        .eq("student_id", selectedStudent.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStudent?.id,
  });

  if (!selectedStudent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Strategy Effectiveness</CardTitle>
          <CardDescription>Select a student to view intervention outcomes</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Strategy Effectiveness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading strategy data...</div>
        </CardContent>
      </Card>
    );
  }

  // Calculate success rates by intervention
  const interventionStats = outcomes?.reduce((acc, outcome) => {
    const name = outcome.intervention_name;
    if (!acc[name]) {
      acc[name] = { total: 0, successful: 0 };
    }
    acc[name].total++;
    if (outcome.outcome_success) {
      acc[name].successful++;
    }
    return acc;
  }, {} as Record<string, { total: number; successful: number }>);

  const rankedInterventions = Object.entries(interventionStats || {})
    .map(([name, stats]) => ({
      name,
      successRate: Math.round((stats.successful / stats.total) * 100),
      total: stats.total,
      successful: stats.successful,
    }))
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Top 5 Most Effective Strategies</CardTitle>
        </div>
        <CardDescription>
          {outcomes && outcomes.length > 0
            ? "Success rates based on recorded outcomes"
            : "No intervention data yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rankedInterventions.length > 0 ? (
          <div className="space-y-4">
            {rankedInterventions.map((intervention, index) => (
              <div key={intervention.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium">{intervention.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {intervention.successRate}%
                    </span>
                    {intervention.successRate >= 70 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
                <Progress value={intervention.successRate} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {intervention.successful} of {intervention.total} times successful
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No intervention outcome data yet.</p>
            <p className="text-xs mt-2">
              Data will appear here as interventions are tracked and outcomes are recorded.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};