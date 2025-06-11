
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Clock, 
  Award, 
  Target, 
  TrendingUp,
  BookOpen,
  Users,
  Lightbulb,
  User,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';
import GoalCreateForm from '@/components/goals/GoalCreateForm';
import { useGoals } from '@/hooks/useGoals';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AIInsightsSection from '@/components/insights/AIInsightsSection';

const LearnerHome = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { goals, loading: goalsLoading, refetch } = useGoals();
  const { t } = useDualLanguage();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Fetch user profile data for XP and streak - same as Goals page
  const { data: profileData } = useQuery({
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

  // Debug logging
  console.log('Goals data:', goals);
  console.log('Goals loading:', goalsLoading);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Check if this is first time user
  useEffect(() => {
    if (user && !profileLoading) {
      const hasSeenWelcome = localStorage.getItem('fpk_welcome_shown');
      if (!hasSeenWelcome) {
        setShowWelcomeModal(true);
      }
    }
  }, [user, profileLoading]);

  // Refetch goals when component mounts or user changes
  useEffect(() => {
    if (user && !goalsLoading) {
      refetch();
    }
  }, [user, refetch]);

  const handleWelcomeComplete = () => {
    localStorage.setItem('fpk_welcome_shown', 'true');
    setShowWelcomeModal(false);
    navigate('/dashboard/learner/settings');
  };

  const handleRemindLater = () => {
    const remindTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
    localStorage.setItem('fpk_welcome_remind', remindTime.toString());
    setShowWelcomeModal(false);
  };

  // Get display name from profile or fallback to email
  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Get initials for avatar
  const getInitials = () => {
    const displayName = getDisplayName();
    return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Helper function to render dual language text
  const renderDualText = (translationKey: string, fallback?: string, className?: string) => {
    const text = t(translationKey, fallback);
    
    if (typeof text === 'string') {
      return <span className={className}>{text}</span>;
    }
    
    return (
      <span className={className}>
        <span className="block font-medium">{text.primary}</span>
        <span className="block text-sm text-gray-500 italic">{text.english}</span>
      </span>
    );
  };

  // Filter active goals - same logic as Goals page
  const activeGoals = goals.filter(goal => goal.status === 'active') || [];
  const completedGoals = goals.filter(goal => goal.status === 'completed') || [];
  const goalCompletionRate = goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;

  console.log('Active goals:', activeGoals);
  console.log('All goals:', goals);

  // Get XP data - same as Goals page
  const totalXP = profileData?.total_xp || 0;
  const currentStreak = profileData?.current_streak || 0;

  // Empty state data - will be replaced with real Supabase data
  const timeSpentData = [];
  const progressData = [];
  const courseData = [];
  
  const EmptyChart = ({ titleKey, descKey }: { titleKey: string; descKey: string }) => (
    <div className="h-40 md:h-48 lg:h-64 flex flex-col items-center justify-center text-center p-3 md:p-4 lg:p-6">
      <BarChart className="h-6 w-6 md:h-8 md:w-8 lg:h-12 lg:w-12 text-gray-300 mb-2 md:mb-3 lg:mb-4" />
      {renderDualText(titleKey, '', 'font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base')}
      {renderDualText(descKey, '', 'text-xs md:text-sm text-gray-500')}
    </div>
  );

  const EmptyPieChart = ({ titleKey, descKey }: { titleKey: string; descKey: string }) => (
    <div className="h-40 md:h-48 lg:h-64 flex flex-col items-center justify-center text-center p-3 md:p-4 lg:p-6">
      <div className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full border-4 border-gray-200 border-dashed mb-2 md:mb-3 lg:mb-4 flex items-center justify-center">
        <Target className="h-3 w-3 md:h-4 md:w-4 lg:h-6 lg:w-6 text-gray-300" />
      </div>
      {renderDualText(titleKey, '', 'font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base')}
      {renderDualText(descKey, '', 'text-xs md:text-sm text-gray-500')}
    </div>
  );

  if (authLoading || profileLoading) {
    return (
      <div className="p-2 md:p-4 lg:p-6 flex items-center justify-center">
        <div className="text-gray-500">{renderDualText('common.loading')}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = getDisplayName();

  return (
    <>
      {/* Welcome Modal - Mobile Optimized */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="mx-2 w-[calc(100vw-16px)] max-w-md md:mx-4 md:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 fpk-gradient rounded-xl flex items-center justify-center">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <DialogTitle className="text-lg md:text-xl">
                <DualLanguageText translationKey="dashboard.welcomeModal.title" />
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm md:text-base leading-relaxed">
              Hey {displayName}! Before you dive into your learning journey, please complete your profile so we can personalize your experience and tailor content just for you.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-purple-50 rounded-lg p-3 md:p-4 my-3 md:my-4">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 md:h-5 md:w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900 mb-1 text-sm md:text-base">
                  <DualLanguageText translationKey="dashboard.welcomeModal.quickSetup" />
                </h4>
                <p className="text-xs md:text-sm text-purple-700">
                  <DualLanguageText translationKey="dashboard.welcomeModal.quickSetupDesc" />
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 md:flex-row">
            <Button 
              onClick={handleWelcomeComplete}
              className="fpk-gradient text-white w-full md:w-auto text-sm"
            >
              <DualLanguageText translationKey="dashboard.welcomeModal.completeProfile" />
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRemindLater}
              className="w-full md:w-auto text-sm"
            >
              <DualLanguageText translationKey="dashboard.welcomeModal.remindLater" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Container - Optimized for mobile width */}
      <div className="px-2 py-2 md:p-4 lg:p-6 space-y-3 md:space-y-4 lg:space-y-6 w-full max-w-7xl mx-auto">
        {/* Profile Header - Mobile Optimized */}
        <div className="fpk-card rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Avatar className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16">
                <AvatarImage src={profile?.avatar_url || ""} alt={displayName} />
                <AvatarFallback className="fpk-gradient text-white text-sm md:text-lg lg:text-xl font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="text-base md:text-lg lg:text-2xl font-bold text-gray-900 truncate">
                  Welcome back, {displayName}!
                </h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge className="fpk-gradient text-white text-xs">
                    <DualLanguageText translationKey="dashboard.badges.learner" />
                  </Badge>
                  <Badge variant="outline" className="border-amber-200 text-amber-700 text-xs">
                    <DualLanguageText translationKey="dashboard.badges.level1" />
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs md:text-sm text-gray-500">
                <DualLanguageText translationKey="dashboard.stats.totalXP" />
              </p>
              <p className="text-lg md:text-xl lg:text-2xl font-bold fpk-text-gradient">{totalXP.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats - Mobile Grid Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
          <Card className="fpk-card border-0 shadow-md">
            <CardContent className="p-2.5 md:p-3 lg:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1 md:p-1.5 lg:p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-gray-500 truncate">
                    <DualLanguageText translationKey="dashboard.stats.activeCourses" />
                  </p>
                  <p className="text-sm md:text-lg lg:text-xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="fpk-card border-0 shadow-md">
            <CardContent className="p-2.5 md:p-3 lg:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1 md:p-1.5 lg:p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-gray-500 truncate">
                    Current Streak
                  </p>
                  <p className="text-sm md:text-lg lg:text-xl font-bold">{currentStreak}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="fpk-card border-0 shadow-md">
            <CardContent className="p-2.5 md:p-3 lg:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1 md:p-1.5 lg:p-2 bg-green-100 rounded-lg">
                  <Target className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-gray-500 truncate">Active Goals</p>
                  <p className="text-sm md:text-lg lg:text-xl font-bold">{activeGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="fpk-card border-0 shadow-md">
            <CardContent className="p-2.5 md:p-3 lg:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1 md:p-1.5 lg:p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-gray-500 truncate">Goal Progress</p>
                  <p className="text-sm md:text-lg lg:text-xl font-bold">{goalCompletionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts - Mobile Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
          {/* Course Progress Chart */}
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader className="pb-2 md:pb-3 lg:pb-4">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base lg:text-lg">
                <Target className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-purple-600" />
                <DualLanguageText translationKey="dashboard.charts.courseProgress" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {progressData.length === 0 ? (
                <EmptyPieChart 
                  titleKey="dashboard.charts.noCourseProgress"
                  descKey="dashboard.charts.noCourseProgressDesc"
                />
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#7F1D9C" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Time Spent Chart */}
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader className="pb-2 md:pb-3 lg:pb-4">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base lg:text-lg">
                <Clock className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-amber-600" />
                <DualLanguageText translationKey="dashboard.charts.weeklyTime" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {timeSpentData.length === 0 ? (
                <EmptyChart 
                  titleKey="dashboard.charts.noStudyTime"
                  descKey="dashboard.charts.noStudyTimeDesc"
                />
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={timeSpentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Bar dataKey="hours" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights - Mobile Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          <AIInsightsSection />

          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader className="pb-2 md:pb-3 lg:pb-4">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base lg:text-lg">
                <Target className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-blue-500" />
                <DualLanguageText translationKey="dashboard.insights.personalGoals" fallback="Personal Goals" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {goalsLoading ? (
                <div className="text-center py-4 md:py-6 lg:py-8">
                  <div className="text-sm text-gray-500">Loading goals...</div>
                </div>
              ) : activeGoals.length === 0 ? (
                <div className="text-center py-4 md:py-6 lg:py-8">
                  <Target className="h-6 w-6 md:h-8 md:w-8 lg:h-12 lg:w-12 text-gray-300 mx-auto mb-2 md:mb-3 lg:mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">No active goals</h3>
                  <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3 lg:mb-4 px-2">
                    Create your first Learning State goal to start tracking your progress
                  </p>
                  <GoalCreateForm />
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm font-medium">Active Goals</span>
                    <span className="text-xs md:text-sm text-gray-600">{activeGoals.length} total</span>
                  </div>
                  <div className="space-y-2">
                    {activeGoals.slice(0, 3).map((goal) => (
                      <div key={goal.id} className="p-2 md:p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1 md:mb-2">
                          <span className="text-xs md:text-sm font-medium truncate flex-1">{goal.title}</span>
                          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                            <Badge variant="secondary" className="text-xs">
                              {goal.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{goal.progress}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="fpk-gradient h-1 rounded-full transition-all" 
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        {goal.target_date && (
                          <div className="text-xs text-gray-500 mt-1">
                            Due: {new Date(goal.target_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-3 md:mt-4 text-xs md:text-sm"
                    onClick={() => navigate('/dashboard/learner/goals')}
                  >
                    View All Goals
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader className="pb-2 md:pb-3 lg:pb-4">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base lg:text-lg">
                <Users className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-green-500" />
                <DualLanguageText translationKey="dashboard.insights.communityActivity" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center py-4 md:py-6 lg:py-8">
                <Users className="h-6 w-6 md:h-8 md:w-8 lg:h-12 lg:w-12 text-gray-300 mx-auto mb-2 md:mb-3 lg:mb-4" />
                {renderDualText('dashboard.insights.joinCommunity', '', 'font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base')}
                <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3 lg:mb-4 px-2">
                  <DualLanguageText translationKey="dashboard.insights.joinCommunityDesc" />
                </p>
                <Button variant="outline" className="border-purple-200 text-purple-700 text-xs md:text-sm">
                  <DualLanguageText translationKey="dashboard.insights.exploreCommunity" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LearnerHome;
