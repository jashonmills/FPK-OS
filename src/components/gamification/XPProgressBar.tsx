
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star } from 'lucide-react';

interface XPProgressBarProps {
  totalXP: number;
  level: number;
  xpToNext: number;
  className?: string;
  showDetails?: boolean;
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({
  totalXP,
  level,
  xpToNext,
  className = '',
  showDetails = true
}) => {
  // Calculate XP needed for current level
  const xpForCurrentLevel = 100 + (level - 2) * 50; // Level 1->2 = 100, 2->3 = 150, etc.
  const xpInCurrentLevel = xpForCurrentLevel - xpToNext;
  const progressPercentage = (xpInCurrentLevel / xpForCurrentLevel) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold">Level {level}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="h-3 w-3" />
            <span>{totalXP.toLocaleString()} XP</span>
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        <Progress value={progressPercentage} className="h-2" />
        {showDetails && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{xpInCurrentLevel} XP</span>
            <span>{xpToNext} XP to next level</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default XPProgressBar;
