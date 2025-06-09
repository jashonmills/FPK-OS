
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Trophy, Flame, Calendar, CheckSquare, Bell } from 'lucide-react';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';

const Goals = () => {
  const { t } = useDualLanguage();

  // Learning State specific goals
  const activeGoals = [
    {
      id: 1,
      title: "Complete 1 course module",
      progress: 75,
      frequency: "Daily",
      type: "learning"
    },
    {
      id: 2,
      title: "Earn 500 XP this week",
      progress: 60,
      frequency: "Daily",
      type: "xp"
    },
    {
      id: 3,
      title: "Study for 5 hours",
      progress: 80,
      frequency: "Daily",
      type: "time"
    },
    {
      id: 4,
      title: "Master 10 flashcards",
      progress: 90,
      frequency: "Daily",
      type: "practice"
    },
    {
      id: 5,
      title: "Finish 3 quizzes",
      progress: 45,
      frequency: "Daily",
      type: "assessment"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "First Course Completed",
      icon: "🎓",
      earned: true
    },
    {
      id: 2,
      title: "500 XP Earned",
      icon: "🏆",
      earned: true
    },
    {
      id: 3,
      title: "Study Streak 7 Days",
      icon: "🔥",
      earned: true
    }
  ];

  const reminders = [
    { id: 1, title: "Daily check-in", enabled: true },
    { id: 2, title: "Weekly progress update", enabled: true },
    { id: 3, title: "Motivational messages", enabled: false }
  ];

  // XP and streak data
  const totalXP = 3500;
  const targetXP = 4000;
  const currentStreak = 10;
  const xpProgress = Math.round((totalXP / targetXP) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          <DualLanguageText translationKey="nav.goals" fallback="Goals & Progress" />
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Set, track, and achieve your learning goals with our comprehensive goal management system.
        </p>
        <div className="text-sm text-gray-500 space-y-1">
          <p>Create and manage personalized learning goals</p>
          <p>Track your progress with interactive visualizations</p>
          <p>Earn rewards and achievements as you reach milestones</p>
        </div>
      </div>

      {/* Goal & XP Tracker Hero Banner */}
      <Card className="fpk-gradient text-white border-0">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Target className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">Goal & XP Tracker</h2>
          </div>
          <p className="text-lg opacity-90">
            Set your study goals, track XP, and unlock achievements!
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Learning Goals */}
        <div className="lg:col-span-2">
          <Card className="fpk-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Active Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{goal.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {goal.frequency}
                    </Badge>
                  </div>
                  <div className="w-full">
                    <Progress 
                      value={goal.progress} 
                      className="h-3 bg-gray-200"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Achievements & Rewards */}
          <Card className="fpk-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-600" />
                Achievements & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3">
                  <span className="text-xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{achievement.title}</p>
                  </div>
                  {achievement.earned && (
                    <span className="text-gray-500 text-xs">✓</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Goal Reminders */}
          <Card className="fpk-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-600" />
                Goal Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center gap-3">
                  <CheckSquare className={`h-4 w-4 ${reminder.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">{reminder.title}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* XP & Milestones Section */}
      <Card className="fpk-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            XP & Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* Total XP */}
            <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 text-amber-600 mr-2" />
                <span className="text-2xl font-bold text-amber-800">{totalXP.toLocaleString()}</span>
              </div>
              <p className="text-amber-700 font-medium">Total XP</p>
            </div>

            {/* Day Streak */}
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Flame className="h-6 w-6 text-red-600 mr-2" />
                <span className="text-2xl font-bold text-red-800">{currentStreak}</span>
              </div>
              <p className="text-red-700 font-medium">Day Streak</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Progress to {targetXP.toLocaleString()} XP
              </span>
              <span className="text-sm font-bold text-gray-900">{xpProgress}%</span>
            </div>
            <Progress value={xpProgress} className="h-4 bg-gray-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;
