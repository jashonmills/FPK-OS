
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface LeaderboardCardProps {
  limit?: number;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ limit = 10 }) => {
  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: 'You', xp: 1250, level: 5 },
    { rank: 2, name: 'Alice Johnson', xp: 1180, level: 5 },
    { rank: 3, name: 'Bob Smith', xp: 1050, level: 4 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboardData.slice(0, limit).map((entry) => (
            <div key={entry.rank} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                  {entry.rank}
                </div>
                <div>
                  <p className="font-medium">{entry.name}</p>
                  <p className="text-sm text-muted-foreground">Level {entry.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{entry.xp.toLocaleString()} XP</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
