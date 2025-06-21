
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import DualLanguageText from '@/components/DualLanguageText';
import { useTranslation } from 'react-i18next';
import QuoteOfTheDayCard from '@/components/dashboard/QuoteOfTheDayCard';
import WeatherScienceLabCard from '@/components/dashboard/WeatherScienceLabCard';
import APODCard from '@/components/dashboard/APODCard';
import NotificationDemo from '@/components/notifications/NotificationDemo';
import APODGalleryModal from '@/components/dashboard/APODGalleryModal';
import LearningAnalyticsOverview from '@/components/dashboard/LearningAnalyticsOverview';
import GamificationOverview from '@/components/dashboard/GamificationOverview';
import GoalsOverview from '@/components/dashboard/GoalsOverview';
import QuickNavigationGrid from '@/components/dashboard/QuickNavigationGrid';
import RecentActivityFeed from '@/components/dashboard/RecentActivityFeed';
import AIInsightsSection from '@/components/dashboard/AIInsightsSection';

const LearnerHome = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { t } = useTranslation();
  const [isAPODModalOpen, setIsAPODModalOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 18) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return t('dashboard.learner');
  };

  const handleAPODGalleryOpen = () => {
    setIsAPODModalOpen(true);
  };

  const handleAPODGalleryClose = () => {
    setIsAPODModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <DualLanguageText 
            translationKey="dashboard.greeting"
            fallback={`${getGreeting()}, ${getDisplayName()}!`}
          />
        </h1>
        <p className="text-muted-foreground text-lg">
          <DualLanguageText 
            translationKey="dashboard.welcomeMessage"
            fallback="Ready to continue your learning journey today?"
          />
        </p>
      </div>

      {/* Quick Navigation Grid */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <QuickNavigationGrid />
      </section>

      {/* Learning Analytics Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
        <LearningAnalyticsOverview />
      </section>

      {/* Gamification Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Achievements & Progress</h2>
        <GamificationOverview />
      </section>

      {/* Goals Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Current Goals</h2>
        <GoalsOverview />
      </section>

      {/* Main Content Grid - Daily Cards */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Daily Learning</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Quote of the Day */}
          <div className="lg:col-span-1">
            <QuoteOfTheDayCard />
          </div>

          {/* Weather Science Lab */}
          <div className="lg:col-span-1">
            <WeatherScienceLabCard />
          </div>

          {/* Notification Demo */}
          <div className="lg:col-span-1">
            <NotificationDemo />
          </div>
        </div>
      </section>

      {/* APOD Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Space Discovery</h2>
        <APODCard onOpenGallery={handleAPODGalleryOpen} />
      </section>

      {/* AI Insights Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">AI Learning Insights</h2>
        <AIInsightsSection />
      </section>

      {/* Recent Activity Feed */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <RecentActivityFeed />
      </section>

      {/* APOD Gallery Modal */}
      <APODGalleryModal
        isOpen={isAPODModalOpen}
        onClose={handleAPODGalleryClose}
      />
    </div>
  );
};

export default LearnerHome;
