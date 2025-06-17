import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { 
  BookOpen, 
  Target, 
  Award, 
  TrendingUp, 
  Users, 
  Brain,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import WelcomeModal from '@/components/dashboard/WelcomeModal';

const LearnerHome = () => {
  const { t, renderText, tString } = useGlobalTranslation('dashboard');
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { getAccessibilityClasses } = useAccessibility();
  const [showWelcome, setShowWelcome] = useState(false);

  // Apply accessibility classes
  const containerClasses = getAccessibilityClasses('container');
  const textClasses = getAccessibilityClasses('text');
  const cardClasses = getAccessibilityClasses('card');

  // Mock data for demonstration
  const mockWeeklyData = [
    { day: 'Mon', hours: 3 },
    { day: 'Tue', hours: 4 },
    { day: 'Wed', hours: 2 },
    { day: 'Thu', hours: 5 },
    { day: 'Fri', hours: 4 },
    { day: 'Sat', hours: 1 },
    { day: 'Sun', hours: 0 },
  ];

  const mockCourses = [
    { id: 1, title: 'React Fundamentals', progress: 60, status: 'in-progress', duration: '8h' },
    { id: 2, title: 'Node.js Mastery', progress: 90, status: 'in-progress', duration: '12h' },
    { id: 3, title: 'Advanced JavaScript', progress: 100, status: 'completed', duration: '10h' },
  ];

  const mockGoals = [
    { id: 1, title: 'Complete React Course', isCompleted: true },
    { id: 2, title: 'Study 30 minutes daily', isCompleted: true },
    { id: 3, title: 'Finish Node.js project', isCompleted: false },
  ];

  return (
    <div className={`p-3 md:p-6 space-y-4 md:space-y-6 ${containerClasses}`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-amber-600 bg-clip-text text-transparent ${textClasses}`}>
            {profile?.display_name ? `Welcome back, ${profile.display_name}!` : 'Welcome to Your Learning Journey!'}
          </h1>
          <p className={`text-gray-600 mt-1 text-sm md:text-base ${textClasses}`}>
            {renderText(t('myCourses.description'))}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className={`${textClasses} bg-purple-100 text-purple-700`}>
            <Zap className="h-3 w-3 mr-1" />
            {renderText(t('badges.learner'))}
          </Badge>
          <Badge variant="outline" className={textClasses}>
            {renderText(t('badges.level1'))}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className={`fpk-card ${cardClasses}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium text-gray-600 ${textClasses}`}>
                  {renderText(t('stats.activeCourses'))}
                </p>
                <p className={`text-xl md:text-2xl font-bold ${textClasses}`}>3</p>
              </div>
              <BookOpen className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`fpk-card ${cardClasses}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium text-gray-600 ${textClasses}`}>
                  {renderText(t('stats.currentStreak'))}
                </p>
                <p className={`text-xl md:text-2xl font-bold ${textClasses}`}>7 days</p>
              </div>
              <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`fpk-card ${cardClasses}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium text-gray-600 ${textClasses}`}>
                  {renderText(t('stats.totalXP'))}
                </p>
                <p className={`text-xl md:text-2xl font-bold ${textClasses}`}>1,247</p>
              </div>
              <Star className="h-4 w-4 md:h-6 md:w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`fpk-card ${cardClasses}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium text-gray-600 ${textClasses}`}>
                  {renderText(t('stats.achievements'))}
                </p>
                <p className={`text-xl md:text-2xl font-bold ${textClasses}`}>12</p>
              </div>
              <Award className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Progress Charts */}
          <Card className={`fpk-card ${cardClasses}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
                <TrendingUp className="h-5 w-5 text-blue-600" />
                {renderText(t('charts.weeklyTime'))}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockWeeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card className={`fpk-card ${cardClasses}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
                <BookOpen className="h-5 w-5 text-green-600" />
                {renderText(t('charts.courseProgress'))}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCourses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${textClasses}`}>{course.title}</h4>
                    <Badge variant="outline" className={textClasses}>
                      {course.progress}% complete
                    </Badge>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Goals Card */}
          <Card className={`fpk-card ${cardClasses}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
                <Target className="h-5 w-5 text-purple-600" />
                {renderText(t('insights.personalGoals'))}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockGoals.map((goal) => (
                <div key={goal.id} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className={`text-sm ${textClasses}`}>{goal.title}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className={`w-full mt-3 ${textClasses}`}>
                View All Goals
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className={`fpk-card ${cardClasses}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
                <Brain className="h-5 w-5 text-amber-600" />
                {renderText(t('insights.aiInsights'))}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm text-gray-600 mb-3 ${textClasses}`}>
                Based on your learning pattern, you're most productive in the mornings. 
                Consider scheduling challenging topics during your peak hours.
              </p>
              <Button variant="outline" size="sm" className={`w-full ${textClasses}`}>
                Get More Insights
              </Button>
            </CardContent>
          </Card>

          {/* Community Activity */}
          <Card className={`fpk-card ${cardClasses}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
                <Users className="h-5 w-5 text-blue-600" />
                {renderText(t('insights.communityActivity'))}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm text-gray-600 mb-3 ${textClasses}`}>
                {renderText(t('insights.joinCommunityDesc'))}
              </p>
              <Button variant="outline" size="sm" className={`w-full ${textClasses}`}>
                {renderText(t('insights.exploreCommunity'))}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
    </div>
  );
};

export default LearnerHome;
