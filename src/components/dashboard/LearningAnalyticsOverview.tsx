
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useStudentAnalytics } from '@/hooks/useStudentAnalytics';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { TrendingUp, Clock, Target, Award, BookOpen, CheckCircle2 } from 'lucide-react';

const LearningAnalyticsOverview = () => {
  const { analytics, isLoading: analyticsLoading } = useStudentAnalytics();
  const { userStats, isLoading: gamificationLoading } = useGamificationContext();

  const isLoading = analyticsLoading || gamificationLoading;

  const totalXP = analytics?.totalXP || userStats?.xp?.total_xp || 0;
  const currentLevel = userStats?.xp?.level || 1;
  const xpToNext = userStats?.xp?.next_level_xp || 100;
  const currentLevelXP = totalXP % 100;
  const levelProgress = (currentLevelXP / xpToNext) * 100;

  const totalLearningHours = analytics?.totalLearningHours || 0;
  const completedCourses = analytics?.completedCourses || 0;
  const totalCourses = analytics?.totalCourses || 0;
  const averageProgress = analytics?.averageProgress || 0;
  const lessonsCompleted = analytics?.lessonsCompleted || 0;
  const currentStreak = analytics?.currentStreak || userStats?.streaks?.find(s => s.streak_type === 'study')?.current_count || 0;

  if (isLoading) {
    return (
      <div className="mobile-analytics-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="mobile-card-compact">
              <div className="animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-1.5 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="mobile-analytics-grid">
      {/* Total Learning Hours Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="mobile-card-compact">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Learning Time</span>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
            {totalLearningHours.toFixed(1)}h
          </div>
          <p className="text-xs text-muted-foreground mobile-safe-text">
            Total study time
          </p>
        </CardContent>
      </Card>

      {/* Active Courses Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="mobile-card-compact">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Active Courses</span>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{totalCourses}</div>
          <Progress value={totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0} className="h-1.5 sm:h-2" />
          <p className="text-xs text-muted-foreground mt-1 mobile-safe-text">
            {completedCourses} completed
          </p>
        </CardContent>
      </Card>

      {/* Average Progress Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="mobile-card-compact">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Avg Progress</span>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{averageProgress.toFixed(0)}%</div>
          <Progress value={averageProgress} className="h-1.5 sm:h-2" />
          <p className="text-xs text-muted-foreground mt-1 mobile-safe-text">
            Across all courses
          </p>
        </CardContent>
      </Card>

      {/* Lessons Completed Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="mobile-card-compact">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Lessons Done</span>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{lessonsCompleted}</div>
          <p className="text-xs text-muted-foreground mobile-safe-text">
            Lessons completed
          </p>
        </CardContent>
      </Card>

      {/* Study Streak Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="mobile-card-compact">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Study Streak</span>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
            {currentStreak} days
          </div>
          <p className="text-xs text-muted-foreground mobile-safe-text">
            Keep it going!
          </p>
        </CardContent>
      </Card>

      {/* Total XP Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="mobile-card-compact">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Total XP</span>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{totalXP.toLocaleString()}</div>
          <Progress value={levelProgress} className="h-1.5 sm:h-2" />
          <p className="text-xs text-muted-foreground mt-1 mobile-safe-text">
            Level {currentLevel} • {Math.round(xpToNext - currentLevelXP)} XP to next
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningAnalyticsOverview;
