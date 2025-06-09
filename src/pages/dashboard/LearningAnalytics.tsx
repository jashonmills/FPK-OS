
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Award, Target, BookOpen, Activity } from 'lucide-react';
import { useEnrolledCourses } from '@/hooks/useEnrolledCourses';
import { useTranslation } from 'react-i18next';

const LearningAnalytics = () => {
  const { t } = useTranslation();
  const { courses, loading, error } = useEnrolledCourses();

  // Find the Learning State course
  const learningStateCourse = courses.find(course => 
    course.title.toLowerCase().includes('learning state')
  );

  // Mock data structure for when we have real data
  const weeklyEngagementData = [
    { day: 'Mon', mathematics: 0, science: 0, languageArts: 0 },
    { day: 'Tue', mathematics: 0, science: 0, languageArts: 0 },
    { day: 'Wed', mathematics: 0, science: 0, languageArts: 0 },
    { day: 'Thu', mathematics: 0, science: 0, languageArts: 0 },
    { day: 'Fri', mathematics: 0, science: 0, languageArts: 0 },
  ];

  const progressData = [
    { subject: 'Cognitive Load Theory', progress: 0, color: '#8B5CF6' },
    { subject: 'Attention and Focus', progress: 0, color: '#F59E0B' },
    { subject: 'Memory and Retention', progress: 0, color: '#EF4444' },
    { subject: 'Metacognition', progress: 0, color: '#3B82F6' },
  ];

  const activityDistribution = [
    { name: 'Video Lectures', value: 0, color: '#8B5CF6' },
    { name: 'Interactive Quizzes', value: 0, color: '#F59E0B' },
    { name: 'Practice Assignments', value: 0, color: '#3B82F6' },
  ];

  const chartConfig = {
    mathematics: {
      label: 'Cognitive Load Theory',
      color: '#8B5CF6',
    },
    science: {
      label: 'Attention & Focus',
      color: '#F59E0B',
    },
    languageArts: {
      label: 'Memory & Retention',
      color: '#3B82F6',
    },
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-gray-600">Loading your learning analytics...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="fpk-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-red-600">Error loading analytics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
        <p className="text-gray-600">
          Track your progress, view insights, and analyze your learning patterns with AI-powered analytics to optimize your learning journey.
        </p>
        
        {/* Key Points */}
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>Monitor your learning progress and achievements in detail</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>View comprehensive performance metrics and trends</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>Get personalized AI-powered study recommendations</span>
          </div>
        </div>
      </div>

      {/* Course Banner */}
      {learningStateCourse && (
        <Card className="fpk-gradient text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Learning Analytics</h2>
            </div>
            <p className="text-white/90">
              Track your progress, view insights, and analyze your learning patterns with AI-powered analytics.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Overall Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Course Completion</span>
              <span className="text-sm text-gray-500">0% of learning goals completed</span>
            </div>
            <Progress value={0} className="h-3" />
            <p className="text-center text-gray-600 mt-4">
              Start learning to see your progress! Complete modules in the Learning State course to track your advancement.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-purple-600" />
              Experience Points (XP)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
              <p className="text-gray-500">Total XP</p>
              <p className="text-sm text-gray-400 mt-2">Complete lessons and quizzes to earn XP</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-amber-600" />
              Learning Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">0</div>
              <p className="text-gray-500">Day Streak</p>
              <p className="text-sm text-gray-400 mt-2">Study daily to build your streak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Engagement Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Weekly Engagement by Subject
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="mathematics" fill="var(--color-mathematics)" />
                <Bar dataKey="science" fill="var(--color-science)" />
                <Bar dataKey="languageArts" fill="var(--color-languageArts)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="text-center text-gray-500 mt-4">
            No engagement data yet. Start learning to see your weekly activity patterns.
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview and Activity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress Overview */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Learning Progress Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{item.subject}</span>
                  <span>{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
            <p className="text-sm text-gray-500 mt-4">
              Progress will update as you complete modules in the Learning State course.
            </p>
          </CardContent>
        </Card>

        {/* Learning Activity Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Learning Activity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">Last 7 Days • Total: 0 hours</p>
            </div>
            <div className="h-[200px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No activity data yet</p>
                <p className="text-sm">Start learning to see your activity distribution</p>
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-4 text-sm">
              {activityDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Study Recommendations */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            AI Study Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Based on your learning patterns, consider:</p>
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <span className="text-gray-700">Starting with the Introduction to Learning State module</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <span className="text-gray-700">Setting aside 30 minutes daily for focused learning</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <span className="text-gray-700">Engaging with interactive elements to maximize retention</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningAnalytics;
