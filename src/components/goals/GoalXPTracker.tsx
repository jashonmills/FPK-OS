
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Zap, Trophy } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { useGamificationContext } from '@/contexts/GamificationContext';

const GoalXPTracker = () => {
  const { goals = [], loading, error, refetch } = useGoals();
  const { userStats } = useGamificationContext();
  const [lastRefresh, setLastRefresh] = React.useState(Date.now());

  // Force refresh on mount and periodically to ensure data sync
  React.useEffect(() => {
    const refresh = () => {
      console.log('🔄 GoalXPTracker: Refreshing goals data');
      refetch();
      setLastRefresh(Date.now());
    };

    refresh();
    
    // Set up periodic refresh every 30 seconds as fallback
    const interval = setInterval(refresh, 30000);
    
    return () => clearInterval(interval);
  }, [refetch]);

  // Debug logging
  React.useEffect(() => {
    console.log('🎯 GoalXPTracker: Goals data updated:', {
      goalsCount: goals?.length || 0,
      goals: goals,
      loading,
      error,
      lastRefresh: new Date(lastRefresh).toLocaleTimeString()
    });
  }, [goals, loading, error, lastRefresh]);

  if (loading) {
    return (
      <Card className="fpk-gradient text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-3/4 mb-6"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center">
                  <div className="h-8 bg-white/20 rounded mb-2"></div>
                  <div className="h-4 bg-white/20 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="fpk-gradient text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-white/80 mb-4">Unable to load goals data</p>
            <button 
              onClick={() => refetch()}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Safe data access with fallbacks and detailed logging
  const safeGoals = Array.isArray(goals) ? goals : [];
  const activeGoals = safeGoals.filter(goal => {
    const isActive = goal?.status === 'active';
    if (isActive) {
      console.log('🎯 Active goal found:', goal);
    }
    return isActive;
  });
  const completedGoals = safeGoals.filter(goal => goal?.status === 'completed');
  
  console.log('🎯 GoalXPTracker calculations:', {
    totalGoals: safeGoals.length,
    activeGoals: activeGoals.length,
    completedGoals: completedGoals.length,
    activeGoalDetails: activeGoals.map(g => ({ id: g.id, title: g.title, status: g.status, category: g.category }))
  });
  const totalXP = userStats?.xp?.total_xp || 0;
  const currentLevel = userStats?.xp?.level || 1;
  const xpToNext = userStats?.xp?.next_level_xp || 100;

  // Calculate overall goal progress safely
  const totalProgress = activeGoals.length > 0 
    ? Math.round(activeGoals.reduce((sum, goal) => sum + (goal?.progress || 0), 0) / activeGoals.length)
    : 0;

  return (
    <Card className="fpk-gradient text-white border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Goal & XP Tracker</h3>
              <p className="text-white/80 text-sm">Your learning progress at a glance</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            Level {currentLevel}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{activeGoals.length}</div>
            <div className="text-white/80 text-sm">Active Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalProgress}%</div>
            <div className="text-white/80 text-sm">Avg Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{completedGoals.length}</div>
            <div className="text-white/80 text-sm">Completed</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              XP Progress
            </span>
            <span>{totalXP.toLocaleString()} XP</span>
          </div>
          <Progress value={(totalXP / (totalXP + xpToNext)) * 100} className="h-2 bg-white/20" />
          <div className="flex justify-between text-xs text-white/80">
            <span>Level {currentLevel}</span>
            <span>{xpToNext} XP to next level</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalXPTracker;
