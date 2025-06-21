
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { useWeeklyActivity } from '@/hooks/useWeeklyActivity';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';

const LearningAnalyticsOverview = () => {
  const { userStats, isLoading } = useGamificationContext();
  const { weeklyActivity } = useWeeklyActivity();

  const totalXP = userStats?.xp?.total_xp || 0;
  const currentLevel = userStats?.xp?.level || 1;
  const xpToNext = userStats?.xp?.next_level_xp || 100;
  const currentLevelXP = totalXP % 100; // Simplified calculation
  const levelProgress = (currentLevelXP / xpToNext) * 100;

  const weeklyStudyTime = weeklyActivity.reduce((total, day) => total + day.studyTime, 0);
  const weeklyGoal = 300; // 5 hours in minutes
  const weeklyProgress = Math.min((weeklyStudyTime / weeklyGoal) * 100, 100);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total XP */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-muted-foreground">Total XP</span>
          </div>
          <div className="text-2xl font-bold mb-2">{totalXP.toLocaleString()}</div>
          <Progress value={levelProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Level {currentLevel} • {Math.round(xpToNext - currentLevelXP)} XP to next
          </p>
        </CardContent>
      </Card>

      {/* Weekly Study Time */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-muted-foreground">This Week</span>
          </div>
          <div className="text-2xl font-bold mb-2">{Math.round(weeklyStudyTime / 60)}h {weeklyStudyTime % 60}m</div>
          <Progress value={weeklyProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(weeklyProgress)}% of weekly goal
          </p>
        </CardContent>
      </Card>

      {/* Study Streak */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-muted-foreground">Study Streak</span>
          </div>
          <div className="text-2xl font-bold mb-2">
            {userStats?.streaks?.find(s => s.streak_type === 'study')?.current_count || 0} days
          </div>
          <p className="text-xs text-muted-foreground">
            Best: {userStats?.streaks?.find(s => s.streak_type === 'study')?.best_count || 0} days
          </p>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-muted-foreground">Achievements</span>
          </div>
          <div className="text-2xl font-bold mb-2">{userStats?.badges?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Badges earned</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningAnalyticsOverview;
