import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Target, Lightbulb } from "lucide-react";
import { GoalActivitiesModal } from "@/components/goals/GoalActivitiesModal";

interface GoalProgressCardsProps {
  familyId: string;
  studentId: string;
  sampleData?: any;
}

export const GoalProgressCards = ({ familyId, studentId, sampleData }: GoalProgressCardsProps) => {
  const [selectedGoal, setSelectedGoal] = useState<{ id: string; title: string } | null>(null);
  
  const { data: goals, isLoading } = useQuery({
    queryKey: ["active-goals", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("family_id", familyId)
        .eq("student_id", studentId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !sampleData,
  });

  const displayGoals = sampleData || goals;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[180px]" />
        ))}
      </div>
    );
  }

  if (!displayGoals || displayGoals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Active Goals
          </CardTitle>
          <CardDescription>
            No active goals yet. Complete onboarding or create goals to track progress!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Target className="h-6 w-6" />
        Active Goals
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayGoals.map((goal: any) => {
          const progress = goal.target_value 
            ? Math.min(Math.round((goal.current_value / goal.target_value) * 100), 100)
            : 0;

          return (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="text-lg">{goal.goal_title}</CardTitle>
                <CardDescription className="capitalize">{goal.goal_type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {goal.goal_description && (
                  <p className="text-sm text-muted-foreground">{goal.goal_description}</p>
                )}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  {goal.target_value && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Current: {goal.current_value} {goal.unit}</span>
                      <span>Target: {goal.target_value} {goal.unit}</span>
                    </div>
                  )}
                </div>
                {goal.target_date && (
                  <p className="text-xs text-muted-foreground">
                    Target Date: {new Date(goal.target_date).toLocaleDateString()}
                  </p>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedGoal({ id: goal.id, title: goal.goal_title })}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Get Activity Ideas
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedGoal && (
        <GoalActivitiesModal
          open={!!selectedGoal}
          onOpenChange={(open) => !open && setSelectedGoal(null)}
          goalId={selectedGoal.id}
          goalTitle={selectedGoal.title}
        />
      )}
    </div>
  );
};
