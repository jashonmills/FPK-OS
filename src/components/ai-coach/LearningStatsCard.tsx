
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
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
          Learning Streak & XP Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{totalXP.toLocaleString()}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{currentStreak}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Day Streak</div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
            <span>Progress to Next Level</span>
            <span>{Math.round(progressToNextLevel)}%</span>
          </div>
          <Progress value={progressToNextLevel} className="h-1.5 sm:h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningStatsCard;
