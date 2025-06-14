
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/hooks/useGamification';
import XPProgressBar from './XPProgressBar';
import BadgeDisplay from './BadgeDisplay';
import StreakDisplay from './StreakDisplay';
import LeaderboardCard from './LeaderboardCard';
import { Trophy, Star, Target, Gift, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface GamificationDashboardProps {
  className?: string;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  className = ''
}) => {
  const { userStats, isLoading, fetchUserStats, checkBadges } = useGamification();

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const xpData = userStats?.xp || { total_xp: 0, level: 1, next_level_xp: 100 };
  const badges = userStats?.badges || [];
  const streaks = userStats?.streaks || [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* XP Progress Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Your Progress
            </CardTitle>
            <Button variant="outline" size="sm" onClick={checkBadges}>
              <Zap className="h-4 w-4 mr-1" />
              Check Badges
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <XPProgressBar
            totalXP={xpData.total_xp}
            level={xpData.level}
            xpToNext={xpData.next_level_xp}
            showDetails={true}
          />
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{xpData.total_xp.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{xpData.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{badges.length}</div>
              <div className="text-sm text-muted-foreground">Badges</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length > 0 ? (
                  <BadgeDisplay badges={badges.slice(0, 3)} compact={false} />
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No badges earned yet</p>
                    <p className="text-sm text-muted-foreground">Complete activities to earn your first badge!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Active Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StreakDisplay streaks={streaks.slice(0, 2)} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>All Badges</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your collection of earned achievements
              </p>
            </CardHeader>
            <CardContent>
              <BadgeDisplay badges={badges} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="streaks">
          <Card>
            <CardHeader>
              <CardTitle>Streak Tracking</CardTitle>
              <p className="text-sm text-muted-foreground">
                Keep your learning momentum going!
              </p>
            </CardHeader>
            <CardContent>
              <StreakDisplay streaks={streaks} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <LeaderboardCard limit={20} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;
