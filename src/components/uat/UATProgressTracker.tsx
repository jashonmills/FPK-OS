import { useUATSession } from '@/hooks/useUATSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Target } from 'lucide-react';

const goalDescriptions = {
  enroll_in_course: 'Enroll in a course',
  complete_2_modules: 'Complete 2 modules',
  create_goal: 'Create a personal goal',
  complete_goal: 'Complete a goal',
  submit_feedback: 'Submit feedback'
};

export function UATProgressTracker() {
  const { session, getProgress } = useUATSession();
  const progress = getProgress();

  if (!session) return null;

  const sessionGoals = Array.isArray(session.session_goals) ? session.session_goals : [];
  const completedGoals = Array.isArray(session.completed_goals) ? session.completed_goals : [];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Testing Progress</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span>{progress.completed}/{progress.total}</span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {progress.percentage}% complete
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Testing Goals</h4>
          {sessionGoals.map((goal: string) => {
            const isCompleted = completedGoals.includes(goal);
            const description = goalDescriptions[goal as keyof typeof goalDescriptions] || goal;
            
            return (
              <div key={goal} className="flex items-center gap-3">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={`text-sm flex-1 ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                  {description}
                </span>
                {isCompleted && (
                  <Badge variant="outline" className="text-xs">
                    ✓
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {progress.percentage === 100 && (
          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <p className="text-sm text-success font-medium">
              🎉 All testing goals completed! Thank you for your feedback.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}