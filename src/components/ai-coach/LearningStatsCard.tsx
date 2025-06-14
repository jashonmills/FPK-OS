
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import XPProgressBar from '@/components/gamification/XPProgressBar';

interface LearningStatsCardProps {
  totalXP?: number;
  currentStreak?: number;
  progressToNextLevel?: number;
}

const LearningStatsCard: React.FC<LearningStatsCardProps> = ({
  totalXP: propTotalXP,
  currentStreak: propCurrentStreak,
  progressToNextLevel: propProgressToNextLevel
}) => {
  const { userStats, fetchUserStats, isLoading } = useGamification();

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  // Use data from gamification system if available, otherwise fall back to props
  const xpData = userStats?.xp || { total_xp: propTotalXP || 0, level: 1, next_level_xp: 100 };
  const streaks = userStats?.streaks || [];
  const currentStreak = streaks.find(s => s.streak_type === 'study')?.current_count || propCurrentStreak || 0;
  
  // Calculate progress percentage
  const xpForCurrentLevel = 100 + (xpData.level - 2) * 50;
  const xpInCurrentLevel = xpForCurrentLevel - xpData.next_level_xp;
  const progressToNextLevel = (xpInCurrentLevel / xpForCurrentLevel) * 100;

  if (isLoading) {
    return (
      <Card className="w-full overflow-hidden">
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            <span className="truncate">Learning Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6 pt-0">
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              <div className="text-center">
                <div className="h-6 sm:h-8 bg-muted rounded w-16 mx-auto mb-1"></div>
                <div className="h-3 bg-muted rounded w-12 mx-auto"></div>
              </div>
              <div className="text-center">
                <div className="h-6 sm:h-8 bg-muted rounded w-8 mx-auto mb-1"></div>
                <div className="h-3 bg-muted rounded w-16 mx-auto"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-32"></div>
              <div className="h-2 bg-muted rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
          <span className="truncate">Learning Progress & XP</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6 pt-0">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
          <div className="text-center min-w-0 overflow-hidden">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 truncate">
              {xpData.total_xp.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground truncate">Total XP</div>
          </div>
          <div className="text-center min-w-0 overflow-hidden">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 truncate">
              {currentStreak}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground truncate">Day Streak</div>
          </div>
        </div>
        
        <div className="w-full overflow-hidden">
          <XPProgressBar
            totalXP={xpData.total_xp}
            level={xpData.level}
            xpToNext={xpData.next_level_xp}
            showDetails={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningStatsCard;
