
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { Trophy, Star, Flame } from 'lucide-react';

const GamificationOverview = () => {
  const { userStats, isLoading } = useGamificationContext();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentBadges = userStats?.badges?.slice(0, 3) || [];
  const currentStreak = userStats?.streaks?.find(s => s.streak_type === 'study')?.current_count || 0;
  const totalXP = userStats?.xp?.total_xp || 0;
  const currentLevel = userStats?.xp?.level || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Your Progress Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Level & XP */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold">Level {currentLevel}</h3>
            <p className="text-sm text-muted-foreground">{totalXP.toLocaleString()} XP</p>
          </div>

          {/* Study Streak */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-3">
              <Flame className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold">{currentStreak} Day Streak</h3>
            <p className="text-sm text-muted-foreground">Study consistency</p>
          </div>

          {/* Recent Badges */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold">{userStats?.badges?.length || 0} Badges</h3>
            <div className="flex gap-1 justify-center mt-2">
              {recentBadges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {badge.icon} {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationOverview;
