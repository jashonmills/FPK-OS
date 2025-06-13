
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

interface LearningStatsCardProps {
  totalXP: number;
  currentStreak: number;
  progressToNextLevel: number;
}

const LearningStatsCard: React.FC<LearningStatsCardProps> = ({
  totalXP,
  currentStreak,
  progressToNextLevel
}) => {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
          <span className="truncate">Learning Streak & XP Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6 pt-0">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
          <div className="text-center min-w-0 overflow-hidden">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 truncate">
              {totalXP.toLocaleString()}
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
          <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
            <span className="truncate flex-1 mr-2">Progress to Next Level</span>
            <span className="flex-shrink-0">{Math.round(progressToNextLevel)}%</span>
          </div>
          <Progress value={progressToNextLevel} className="h-1.5 sm:h-2 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningStatsCard;
