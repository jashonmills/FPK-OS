
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Target, Clock, CheckCircle } from 'lucide-react';
import { useXPTracking } from '@/hooks/useXPTracking';
import { useAchievements } from '@/hooks/useAchievements';

interface ActiveGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  type: 'daily' | 'weekly' | 'monthly';
  xpReward: number;
  completed: boolean;
}

export const ActiveGoalsList = () => {
  const { addXP } = useXPTracking();
  const { unlockAchievement } = useAchievements();
  const { t } = useTranslation();

  // Sample Learning State course goals
  const activeGoals: ActiveGoal[] = [
    {
      id: '1',
      title: 'goals.activeGoalsList.completeIntro',
      description: 'goals.goalDescriptions.completeIntro',
      progress: 75,
      type: 'daily',
      xpReward: 100,
      completed: false
    },
    {
      id: '2',
      title: 'goals.activeGoalsList.studyHour',
      description: 'goals.goalDescriptions.studyHour',
      progress: 60,
      type: 'daily',
      xpReward: 50,
      completed: false
    },
    {
      id: '3',
      title: 'goals.activeGoalsList.cognitiveLoad',
      description: 'goals.goalDescriptions.cognitiveLoad',
      progress: 30,
      type: 'weekly',
      xpReward: 150,
      completed: false
    },
    {
      id: '4',
      title: 'goals.activeGoalsList.studyStreak',
      description: 'goals.goalDescriptions.studyStreak',
      progress: 100,
      type: 'weekly',
      xpReward: 200,
      completed: true
    }
  ];

  const handleCompleteGoal = async (goal: ActiveGoal) => {
    if (goal.completed) return;
    
    await addXP(goal.xpReward, `Completed: ${goal.title}`);
    
    // Unlock relevant achievements
    if (goal.id === '1') {
      await unlockAchievement('first_module');
    }
    if (goal.id === '4') {
      await unlockAchievement('study_streak_3');
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'daily': return 'default';
      case 'weekly': return 'secondary';
      case 'monthly': return 'outline';
      default: return 'default';
    }
  };

  return (
    <Card className="fpk-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          {t('goals.sections.activeGoals')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeGoals.map((goal) => (
          <Card key={goal.id} className="border border-gray-100">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">
                      {t(goal.title)}
                    </h4>
                    <Badge variant={getBadgeVariant(goal.type)} className="text-xs">
                      {t(`goals.goalTypes.${goal.type}`)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {t(goal.description)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-purple-600 font-semibold">
                    {t(goal.xpReward >= 150 ? "goals.xpRewards.large" : goal.xpReward >= 100 ? "goals.xpRewards.medium" : "goals.xpRewards.small")}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {goal.completed ? 'Completed' : 'In Progress'}
                  </div>
                  
                  {goal.completed ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs"
                      onClick={() => handleCompleteGoal(goal)}
                      disabled={goal.progress < 100}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
