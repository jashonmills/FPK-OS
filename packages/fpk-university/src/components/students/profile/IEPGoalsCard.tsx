import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Target, Calendar, BarChart3 } from 'lucide-react';
import { IEPGoal } from '@/hooks/useStudentIEP';

interface IEPGoalsCardProps {
  goals: IEPGoal[];
}

export function IEPGoalsCard({ goals }: IEPGoalsCardProps) {
  const isMobile = useIsMobile();
  if (!goals || goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            IEP Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No goals defined yet.</p>
        </CardContent>
      </Card>
    );
  }

  const groupedGoals = goals.reduce((acc, goal) => {
    const category = goal.domain;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(goal);
    return acc;
  }, {} as Record<string, IEPGoal[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          IEP Goals ({goals.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedGoals).map(([category, categoryGoals]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">{category}</Badge>
              <span className="text-sm text-muted-foreground">
                {categoryGoals.length} goal{categoryGoals.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-4">
              {categoryGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Annual Goal</h4>
                    <p className="text-sm text-muted-foreground">{goal.annual_goal}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-1">Success Criterion</h4>
                    <p className="text-sm text-muted-foreground">{goal.success_criterion}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-1">Baseline</h4>
                    <p className="text-sm text-muted-foreground">{goal.baseline}</p>
                  </div>
                  
                  <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Method:</span> {goal.measurement_method}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Schedule:</span> {goal.progress_schedule}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{goal.goal_type}</Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {Object.keys(groupedGoals).length > 1 && category !== Object.keys(groupedGoals)[Object.keys(groupedGoals).length - 1] && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}