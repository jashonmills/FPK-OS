
import React, { useState } from 'react';
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
import XPProgressBar from '@/components/gamification/XPProgressBar';
import StreakDisplay from '@/components/gamification/StreakDisplay';
import BadgeDisplay from '@/components/gamification/BadgeDisplay';
import ReadingProgressWidget from '@/components/goals/ReadingProgressWidget';
import APODCard from '@/components/dashboard/APODCard';
import APODGalleryModal from '@/components/dashboard/APODGalleryModal';
import QuoteOfTheDayCard from '@/components/dashboard/QuoteOfTheDayCard';
import { featureFlagService } from '@/services/FeatureFlagService';

const LearnerHome = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useQuickStats();
  const { userStats, isLoading: gamificationLoading } = useGamification();
  const [isAPODModalOpen, setIsAPODModalOpen] = useState(false);

  const isNASAEnabled = featureFlagService.isEnabled('enableNASAImageExplorer');
  const isQuotesEnabled = featureFlagService.isEnabled('quotesWidget');

  const handleOpenAPODGallery = () => {
    setIsAPODModalOpen(true);
  };

  const handleCloseAPODGallery = () => {
    setIsAPODModalOpen(false);
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

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
              Pick up where you left off in your current book.
            </p>
            <Button className="w-full">Resume</Button>
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
              Review flashcards and test your knowledge.
            </p>
            <Button variant="outline" className="w-full">Start Study</Button>
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
            <Button variant="outline" className="w-full">Analytics</Button>
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
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">Reading Achievement Unlocked!</p>
                <p className="text-sm text-gray-600">Completed 10 pages today</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Started "Introduction to Physics"</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
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
