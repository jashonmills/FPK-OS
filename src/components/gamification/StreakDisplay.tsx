
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Target } from 'lucide-react';

interface StreakItem {
  streak_type: 'study' | 'login';
  current_count: number;
  best_count: number;
  id?: string;
  start_date?: string;
  last_activity_date?: string;
}

interface StreakDisplayProps {
  streaks: StreakItem[];
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ streaks }) => {
  if (streaks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No active streaks</p>
        <p className="text-sm">Start learning to build your streak!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {streaks.map((streak, index) => (
        <Card key={`${streak.streak_type}-${index}`} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                {streak.streak_type === 'study' ? (
                  <Flame className="h-5 w-5 text-orange-600" />
                ) : (
                  <Target className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold capitalize">{streak.streak_type} Streak</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Current: {streak.current_count} days</span>
                  <span>Best: {streak.best_count} days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StreakDisplay;
