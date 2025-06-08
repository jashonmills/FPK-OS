
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

const LearnerHome = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

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

  // Empty state data - will be replaced with real Supabase data
  const timeSpentData = [];
  const progressData = [];
  const courseData = [];
  
  const EmptyChart = ({ title, description }: { title: string; description: string }) => (
    <div className="h-64 flex flex-col items-center justify-center text-center p-6">
      <BarChart className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );

  const EmptyPieChart = ({ title, description }: { title: string; description: string }) => (
    <div className="h-64 flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-dashed mb-4 flex items-center justify-center">
        <Target className="h-6 w-6 text-gray-300" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );

  if (authLoading || profileLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Welcome Modal */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 fpk-gradient rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-xl">Welcome to FPK University!</DialogTitle>
            </div>
            <DialogDescription className="text-base leading-relaxed">
              Hey {getDisplayName()}! Before you dive into your learning journey, please complete your profile 
              so we can personalize your experience and tailor content just for you.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-purple-50 rounded-lg p-4 my-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900 mb-1">Quick Setup</h4>
                <p className="text-sm text-purple-700">
                  Add your learning preferences, goals, and interests to unlock personalized course recommendations.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleWelcomeComplete}
              className="fpk-gradient text-white w-full sm:w-auto"
            >
              Complete Profile Setup
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRemindLater}
              className="w-full sm:w-auto"
            >
              Remind me in 24h
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <div className="fpk-card rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url || ""} alt={getDisplayName()} />
                <AvatarFallback className="fpk-gradient text-white text-xl font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {getDisplayName()}!</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="fpk-gradient text-white">Learner</Badge>
                  <Badge variant="outline" className="border-amber-200 text-amber-700">Level 1</Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total XP</p>
              <p className="text-2xl font-bold fpk-text-gradient">0</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="fpk-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Courses</p>
                  <p className="text-xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="fpk-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hours This Week</p>
                  <p className="text-xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="fpk-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Certificates</p>
                  <p className="text-xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="fpk-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Streak Days</p>
                  <p className="text-xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Progress Chart */}
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Course Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {progressData.length === 0 ? (
                <EmptyPieChart 
                  title="No Course Progress Yet" 
                  description="Start a course to see your progress visualization here"
                />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Weekly Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timeSpentData.length === 0 ? (
                <EmptyChart 
                  title="No Study Time Recorded" 
                  description="Your weekly study time will appear here once you start learning"
                />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
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

        {/* AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                AI Study Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No Insights Yet</h3>
                <p className="text-sm text-gray-500">AI insights will appear here based on your learning patterns</p>
              </div>
            </CardContent>
          </Card>

          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Recommended Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Set Your First Goal</h3>
                <p className="text-sm text-gray-500 mb-4">AI will suggest personalized learning goals</p>
                <Button className="fpk-gradient text-white">
                  Create Goal
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Community Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Join the Community</h3>
                <p className="text-sm text-gray-500 mb-4">Connect with fellow learners</p>
                <Button variant="outline" className="border-purple-200 text-purple-700">
                  Explore Community
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
