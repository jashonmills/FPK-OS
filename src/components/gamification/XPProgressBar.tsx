
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

interface XPProgressBarProps {
  totalXP: number;
  level: number;
  xpToNext: number;
  showDetails?: boolean;
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({
  totalXP,
  level,
  xpToNext,
  showDetails = false
}) => {
  const currentLevelXP = totalXP % 100;
  const progressPercentage = (currentLevelXP / xpToNext) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold">Level {level}</span>
        </div>
        {showDetails && (
          <span className="text-sm text-muted-foreground">
            {currentLevelXP}/{xpToNext} XP
          </span>
        )}
      </div>
      
      <Progress value={progressPercentage} className="h-3" />
      
      {showDetails && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {xpToNext - currentLevelXP} XP to next level
          </p>
        </div>
      )}
    </div>
  );
};

export default XPProgressBar;
