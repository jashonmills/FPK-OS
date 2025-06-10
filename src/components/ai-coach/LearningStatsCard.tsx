
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-purple-600" />
          Learning Streak & XP Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{totalXP.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to Next Level</span>
            <span>{Math.round(progressToNextLevel)}%</span>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningStatsCard;
