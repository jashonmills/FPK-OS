
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Calendar, Target } from 'lucide-react';

interface Streak {
  id: string;
  streak_type: string;
  current_count: number;
  best_count: number;
  start_date: string;
  last_activity_date: string;
}

interface StreakDisplayProps {
  streaks: Streak[];
  className?: string;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({
  streaks,
  className = ''
}) => {
  const getStreakIcon = (type: string) => {
    switch (type) {
      case 'study': return <Flame className="h-5 w-5 text-orange-500" />;
      case 'login': return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'reading': return <Target className="h-5 w-5 text-green-500" />;
      default: return <Flame className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStreakTitle = (type: string) => {
    switch (type) {
      case 'study': return 'Study Streak';
      case 'login': return 'Login Streak';
      case 'reading': return 'Reading Streak';
      default: return 'Streak';
    }
  };

  if (streaks.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Start your first streak!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {streaks.map((streak) => (
        <Card key={streak.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {getStreakIcon(streak.streak_type)}
              {getStreakTitle(streak.streak_type)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {streak.current_count}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Streak
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <div className="font-semibold">{streak.best_count}</div>
                  <div className="text-muted-foreground">Best</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    {Math.floor((new Date().getTime() - new Date(streak.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1}
                  </div>
                  <div className="text-muted-foreground">Days</div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Last activity: {new Date(streak.last_activity_date).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StreakDisplay;
