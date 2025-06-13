
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Trophy, Flame, Calendar, CheckSquare, Bell } from 'lucide-react';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';
import { useGoals } from '@/hooks/useGoals';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GoalsDashboard } from '@/components/goals/GoalsDashboard';

const Goals = () => {
  const { t } = useDualLanguage();
  const { goals, loading: goalsLoading } = useGoals();
  const { user } = useAuth();

  // Fetch user profile data for XP and streak
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('total_xp, current_streak')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return { total_xp: 0, current_streak: 0 };
      }
      return data || { total_xp: 0, current_streak: 0 };
    },
    enabled: !!user,
  });

  // Fetch achievements data
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching achievements:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user,
  });

  // Filter active goals
  const activeGoals = goals.filter(goal => goal.status === 'active') || [];

  // Calculate progress data from real goals
  const totalXP = profile?.total_xp || 0;
  const targetXP = 4000; // This could be made dynamic based on user level
  const currentStreak = profile?.current_streak || 0;
  const xpProgress = totalXP > 0 ? Math.round((totalXP / targetXP) * 100) : 0;

  // Goal reminders - these could be stored in database later
  const reminders = [
    { id: 1, title: "Daily check-in", enabled: true },
    { id: 2, title: "Weekly progress update", enabled: true },
    { id: 3, title: "Motivational messages", enabled: false }
  ];

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto overflow-x-hidden">
      {/* Header Section - Improved tablet layout */}
      <div className="text-center space-y-2 sm:space-y-4 px-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
          <DualLanguageText translationKey="nav.goals" fallback="Goals & Progress" />
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Set, track, and achieve your learning goals with our comprehensive goal management system.
        </p>
        <div className="text-xs sm:text-sm text-gray-500 space-y-1 hidden md:block">
          <p className="break-words">Create and manage personalized learning goals</p>
          <p className="break-words">Track your progress with interactive visualizations</p>
          <p className="break-words">Earn rewards and achievements as you reach milestones</p>
        </div>
      </div>

      {/* Goal & XP Tracker Hero Banner - Responsive padding */}
      <Card className="fpk-gradient text-white border-0">
        <CardContent className="p-3 sm:p-6 md:p-8 text-center">
          <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 mr-2 sm:mr-3 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold break-words">Goal & XP Tracker</h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg opacity-90 break-words leading-relaxed">
            Set your study goals, track XP, and unlock achievements!
          </p>
        </CardContent>
      </Card>

      {/* Goals Dashboard Component - This is the main goals management interface */}
      <GoalsDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Active Learning Goals - Improved tablet responsive */}
        <div className="lg:col-span-2">
          <Card className="fpk-card border-0 shadow-md">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                <span className="truncate">Active Learning Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
              {goalsLoading ? (
                <div className="text-center py-6 sm:py-8 text-gray-500 text-sm">
                  Loading goals...
                </div>
              ) : activeGoals.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Target className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                  <p className="text-base sm:text-lg font-medium mb-2">No active goals yet</p>
                  <p className="text-xs sm:text-sm">Create your first learning goal to get started!</p>
                </div>
              ) : (
                activeGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2 break-inside-avoid">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-gray-900 text-sm sm:text-base truncate flex-1">
                        {goal.title}
                      </span>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {goal.category}
                      </Badge>
                    </div>
                    <div className="w-full">
                      <Progress 
                        value={goal.progress} 
                        className="h-2 sm:h-3 bg-gray-200"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{goal.progress}% complete</span>
                        {goal.target_date && (
                          <span className="truncate ml-2">
                            Due: {new Date(goal.target_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Improved tablet responsive */}
        <div className="space-y-4 sm:space-y-6">
          {/* Achievements & Rewards */}
          <Card className="fpk-card border-0 shadow-md">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
                <span className="truncate">Achievements & Rewards</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 md:p-6 pt-0">
              {achievements.length === 0 ? (
                <div className="text-center py-3 sm:py-4 text-gray-500">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs sm:text-sm">No achievements yet</p>
                  <p className="text-xs">Complete goals to earn rewards!</p>
                </div>
              ) : (
                achievements.slice(0, 5).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-2 sm:gap-3">
                    <span className="text-base sm:text-xl flex-shrink-0">🏆</span>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="font-medium text-xs sm:text-sm truncate">
                        {achievement.achievement_name}
                      </p>
                      <p className="text-xs text-gray-500">+{achievement.xp_reward} XP</p>
                    </div>
                    <span className="text-gray-500 text-xs flex-shrink-0">✓</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Goal Reminders */}
          <Card className="fpk-card border-0 shadow-md">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                <span className="truncate">Goal Reminders</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 md:p-6 pt-0">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center gap-2 sm:gap-3">
                  <CheckSquare className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${reminder.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-xs sm:text-sm font-medium truncate">{reminder.title}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* XP & Milestones Section - Improved tablet responsive */}
      <Card className="fpk-card border-0 shadow-md">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            <span className="truncate">XP & Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6">
            {/* Total XP */}
            <div className="text-center p-3 sm:p-4 md:p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-amber-600 mr-2 flex-shrink-0" />
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800 truncate">
                  {totalXP.toLocaleString()}
                </span>
              </div>
              <p className="text-amber-700 font-medium text-sm sm:text-base">Total XP</p>
              {totalXP === 0 && (
                <p className="text-xs text-amber-600 mt-1 break-words">
                  Complete activities to earn XP!
                </p>
              )}
            </div>

            {/* Day Streak */}
            <div className="text-center p-3 sm:p-4 md:p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Flame className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-600 mr-2 flex-shrink-0" />
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-red-800 truncate">
                  {currentStreak}
                </span>
              </div>
              <p className="text-red-700 font-medium text-sm sm:text-base">Day Streak</p>
              {currentStreak === 0 && (
                <p className="text-xs text-red-600 mt-1 break-words">
                  Start your learning streak today!
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700 truncate flex-1">
                Progress to {targetXP.toLocaleString()} XP
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 flex-shrink-0">
                {xpProgress}%
              </span>
            </div>
            <Progress value={xpProgress} className="h-3 sm:h-4 bg-gray-200" />
            {totalXP === 0 && (
              <p className="text-xs text-gray-500 text-center break-words leading-relaxed">
                Complete Learning State modules and activities to start earning XP!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;
