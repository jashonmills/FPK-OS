
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Target, 
  BookOpen, 
  Trophy, 
  TrendingUp,
  Clock,
  Award,
  Brain
} from 'lucide-react';
import { useQuickStats } from '@/hooks/useQuickStats';
import { useGamification } from '@/hooks/useGamification';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { useXPIntegration } from '@/hooks/useXPIntegration';
import XPProgressBar from '@/components/gamification/XPProgressBar';
import StreakDisplay from '@/components/gamification/StreakDisplay';
import BadgeDisplay from '@/components/gamification/BadgeDisplay';
import ReadingProgressWidget from '@/components/goals/ReadingProgressWidget';
import APODCard from '@/components/dashboard/APODCard';
import APODGalleryModal from '@/components/dashboard/APODGalleryModal';
import QuoteOfTheDayCard from '@/components/dashboard/QuoteOfTheDayCard';
import { featureFlagService } from '@/services/FeatureFlagService';

const LearnerHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useQuickStats();
  const { userStats, isLoading: gamificationLoading } = useGamification();
  const { flashcards, isLoading: flashcardsLoading } = useFlashcards();
  const { data: readingProgress, isLoading: readingLoading } = useReadingProgress();
  const [isAPODModalOpen, setIsAPODModalOpen] = useState(false);

  const isNASAEnabled = featureFlagService.isEnabled('enableNASAImageExplorer');
  const isQuotesEnabled = featureFlagService.isEnabled('quotesWidget');

  const handleOpenAPODGallery = () => {
    setIsAPODModalOpen(true);
  };

  const handleCloseAPODGallery = () => {
    setIsAPODModalOpen(false);
  };

  const handleContinueReading = () => {
    if (readingLoading) return;
    
    if (readingProgress && readingProgress.length > 0) {
      // Navigate to the most recent book being read
      const mostRecent = readingProgress[0];
      navigate(`/dashboard/learner/library?book=${mostRecent.book_id}`);
    } else {
      // Navigate to library to start reading
      navigate('/dashboard/learner/library');
    }
  };

  const handleStartStudy = () => {
    if (flashcardsLoading) return;
    
    if (flashcards && flashcards.length > 0) {
      // Navigate to notes page with flashcards section
      navigate('/dashboard/learner/notes');
    } else {
      // Navigate to notes to create flashcards
      navigate('/dashboard/learner/notes');
    }
  };

  const handleViewProgress = () => {
    navigate('/dashboard/learner/analytics');
  };

  const getRecentActivities = () => {
    const activities = [];
    
    // Add recent XP activities if available
    if (userStats?.recent_activities) {
      userStats.recent_activities.slice(0, 3).forEach(activity => {
        activities.push({
          type: 'xp',
          icon: Award,
          title: activity.description || 'XP Earned',
          subtitle: `+${activity.xp_amount} XP • ${formatTimeAgo(activity.created_at)}`,
          color: 'text-yellow-500'
        });
      });
    }
    
    // Add reading progress if available
    if (readingProgress && readingProgress.length > 0) {
      const recentReading = readingProgress[0];
      activities.push({
        type: 'reading',
        icon: BookOpen,
        title: `Reading Progress: ${recentReading.progress}%`,
        subtitle: formatTimeAgo(recentReading.updated_at),
        color: 'text-blue-500'
      });
    }
    
    // Add study streak if available
    const studyStreak = userStats?.streaks?.find(s => s.streak_type === 'study');
    if (studyStreak && studyStreak.current_count > 0) {
      activities.push({
        type: 'streak',
        icon: Trophy,
        title: `Study Streak: ${studyStreak.current_count} days`,
        subtitle: 'Keep it going!',
        color: 'text-orange-500'
      });
    }
    
    return activities;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const recentActivities = getRecentActivities();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {greeting}, {user?.user_metadata?.full_name || 'Learner'}! 👋
        </h1>
        <p className="text-gray-600">Ready to continue your learning journey?</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* NASA APOD Card - Only render if feature flag is enabled */}
        {isNASAEnabled && (
          <APODCard onOpenGallery={handleOpenAPODGallery} />
        )}

        {/* Quote of the Day Card - Only render if feature flag is enabled */}
        {isQuotesEnabled && (
          <QuoteOfTheDayCard />
        )}

        {/* Reading Progress */}
        <ReadingProgressWidget />
      </div>

      {/* Goals and Streak Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Goals */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Today's Goals</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {statsLoading ? '...' : '0'}
            </div>
            <p className="text-xs text-green-700">
              of {statsLoading ? '...' : '3'} completed
            </p>
          </CardContent>
        </Card>

        {/* Empty space to push Study Streak to the right */}
        <div className="hidden lg:block"></div>
        <div className="hidden lg:block"></div>

        {/* Study Streak */}
        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Study Streak</CardTitle>
            <Trophy className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {gamificationLoading ? '...' : userStats?.streaks?.find(s => s.streak_type === 'study')?.current_count || 0}
            </div>
            <p className="text-xs text-orange-700">days in a row</p>
          </CardContent>
        </Card>
      </div>

      {/* Gamification Section */}
      {!gamificationLoading && userStats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <XPProgressBar 
            totalXP={userStats.xp?.total_xp || 0}
            level={userStats.xp?.level || 1}
            xpToNext={userStats.xp?.next_level_xp || 100}
          />
          <StreakDisplay 
            streaks={userStats.streaks || []}
          />
          <BadgeDisplay badges={userStats.badges || []} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Continue Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {readingLoading 
                ? 'Loading your reading progress...' 
                : readingProgress && readingProgress.length > 0
                  ? 'Pick up where you left off in your current book.'
                  : 'Start reading from our library collection.'
              }
            </p>
            <Button 
              className="w-full" 
              onClick={handleContinueReading}
              disabled={readingLoading}
            >
              {readingLoading ? 'Loading...' : readingProgress && readingProgress.length > 0 ? 'Resume' : 'Start Reading'}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Study Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {flashcardsLoading 
                ? 'Loading your flashcards...' 
                : flashcards && flashcards.length > 0
                  ? 'Review flashcards and test your knowledge.'
                  : 'Create flashcards to start studying.'
              }
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleStartStudy}
              disabled={flashcardsLoading}
            >
              {flashcardsLoading ? 'Loading...' : flashcards && flashcards.length > 0 ? 'Start Study' : 'Create Flashcards'}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              View Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Check your learning analytics and achievements.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleViewProgress}
            >
              Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.subtitle}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm mb-2">No recent activity</p>
                <p className="text-xs text-gray-400">
                  Start reading, studying, or completing goals to see your activity here
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* NASA APOD Gallery Modal */}
      {isNASAEnabled && (
        <APODGalleryModal
          isOpen={isAPODModalOpen}
          onClose={handleCloseAPODGallery}
        />
      )}
    </div>
  );
};

export default LearnerHome;
