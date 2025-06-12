
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold fpk-gradient-text">
              <DualLanguageText translationKey="nav.goals" fallback="Goals & Progress" />
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Set, track, and achieve your learning goals with our comprehensive goal management system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <Target className="h-4 w-4 text-primary" />
              <span>Create personalized learning goals</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <Trophy className="h-4 w-4 text-primary" />
              <span>Track progress with visualizations</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <Flame className="h-4 w-4 text-primary" />
              <span>Earn rewards and achievements</span>
            </div>
          </div>
        </div>

        {/* Goal & XP Tracker Hero Banner */}
        <Card className="fpk-enhanced-card border-0 overflow-hidden">
          <div className="fpk-gradient p-6 sm:p-8 text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Target className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Goal & XP Tracker</h2>
            <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
              Set your study goals, track XP, and unlock achievements on your learning journey!
            </p>
          </div>
        </Card>

        {/* Goals Dashboard Component - This is the main goals management interface */}
        <GoalsDashboard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Learning Goals */}
          <div className="lg:col-span-2">
            <Card className="fpk-enhanced-card border-0">
              <CardHeader className="border-b border-border/20">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="fpk-gradient-text">Active Learning Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {goalsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading goals...</p>
                  </div>
                ) : activeGoals.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 rounded-full bg-muted/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Target className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No active goals yet</h3>
                    <p className="text-sm text-muted-foreground">Create your first learning goal to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activeGoals.map((goal) => (
                      <div key={goal.id} className="p-4 rounded-lg bg-gradient-to-r from-card to-secondary/20 border border-border/30 hover:shadow-md transition-all duration-200">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-foreground">{goal.title}</h4>
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                              {goal.category}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <Progress 
                              value={goal.progress} 
                              className="h-2 bg-muted"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span className="font-medium">{goal.progress}% complete</span>
                              {goal.target_date && (
                                <span>Due: {new Date(goal.target_date).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Achievements & Rewards */}
            <Card className="fpk-enhanced-card border-0">
              <CardHeader className="border-b border-border/20">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Trophy className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="fpk-gradient-text">Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {achievements.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="p-3 rounded-full bg-muted/30 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium mb-1">No achievements yet</p>
                    <p className="text-xs text-muted-foreground">Complete goals to earn rewards!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {achievements.slice(0, 5).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
                        <span className="text-lg">🏆</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{achievement.achievement_name}</p>
                          <p className="text-xs text-amber-700">+{achievement.xp_reward} XP</p>
                        </div>
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Goal Reminders */}
            <Card className="fpk-enhanced-card border-0">
              <CardHeader className="border-b border-border/20">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Bell className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="fpk-gradient-text">Reminders</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-secondary/20 to-secondary/10 border border-border/30">
                      <CheckSquare className={`h-4 w-4 ${reminder.enabled ? 'text-green-600' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-medium flex-1">{reminder.title}</span>
                      <div className={`w-2 h-2 rounded-full ${reminder.enabled ? 'bg-green-500' : 'bg-muted-foreground'}`}></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* XP & Milestones Section */}
        <Card className="fpk-enhanced-card border-0">
          <CardHeader className="border-b border-border/20">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              <span className="fpk-gradient-text">XP & Milestones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Total XP */}
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-amber-50 via-amber-50 to-orange-50 border border-amber-200/50 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-amber-500/10 rounded-full">
                    <Trophy className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl sm:text-3xl font-bold text-amber-800">{totalXP.toLocaleString()}</span>
                  <p className="text-amber-700 font-medium">Total XP</p>
                  {totalXP === 0 && (
                    <p className="text-xs text-amber-600">Complete activities to earn XP!</p>
                  )}
                </div>
              </div>

              {/* Day Streak */}
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-50 via-red-50 to-pink-50 border border-red-200/50 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <Flame className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl sm:text-3xl font-bold text-red-800">{currentStreak}</span>
                  <p className="text-red-700 font-medium">Day Streak</p>
                  {currentStreak === 0 && (
                    <p className="text-xs text-red-600">Start your learning streak today!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Progress to {targetXP.toLocaleString()} XP
                </span>
                <span className="text-sm font-bold fpk-gradient-text">{xpProgress}%</span>
              </div>
              <div className="relative">
                <Progress value={xpProgress} className="h-3 bg-muted" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full"></div>
              </div>
              {totalXP === 0 && (
                <p className="text-xs text-muted-foreground text-center bg-muted/30 p-3 rounded-lg">
                  Complete Learning State modules and activities to start earning XP!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Goals;
