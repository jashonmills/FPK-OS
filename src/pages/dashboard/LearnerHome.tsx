
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import DualLanguageText from '@/components/DualLanguageText';
import { useTranslation } from 'react-i18next';
import QuoteOfTheDayCard from '@/components/dashboard/QuoteOfTheDayCard';
import WeatherScienceLabCard from '@/components/dashboard/WeatherScienceLabCard';
import APODCard from '@/components/dashboard/APODCard';
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
    <div className="mobile-section-spacing">
      {/* Mobile-Optimized Header Section */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="mobile-heading-xl mb-2">
          <DualLanguageText 
            translationKey="dashboard.greeting"
            fallback={`${getGreeting()}, ${getDisplayName()}!`}
          />
        </h1>
        <p className="text-muted-foreground mobile-text-base">
          <DualLanguageText 
            translationKey="dashboard.welcomeMessage"
            fallback="Ready to continue your learning journey today?"
          />
        </p>
      </div>

      {/* Today's Highlights - Priority Content at Top */}
      <section>
        <h2 className="mobile-heading-md mb-3 sm:mb-4">Today's Highlights</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-2">
          <div className="order-1">
            <QuoteOfTheDayCard />
          </div>
          <div className="order-2">
            <WeatherScienceLabCard />
          </div>
          <div className="order-3">
            <APODCard onOpenGallery={handleAPODGalleryOpen} />
          </div>
          <div className="order-4">
            <AIInsightsSection />
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Quick Navigation */}
      <section>
        <h2 className="mobile-heading-md mb-3 sm:mb-4">Quick Access</h2>
        <QuickNavigationGrid />
      </section>

      {/* Mobile-Optimized Learning Analytics */}
      <section>
        <h2 className="mobile-heading-md mb-3 sm:mb-4">Learning Progress</h2>
        <LearningAnalyticsOverview />
      </section>

      {/* Mobile-Optimized Achievements Section */}
      <section>
        <h2 className="mobile-heading-md mb-3 sm:mb-4">Achievements & Progress</h2>
        <GamificationOverview />
      </section>

      {/* Mobile-Optimized Goals Section */}
      <section>
        <h2 className="mobile-heading-md mb-3 sm:mb-4">Current Goals</h2>
        <GoalsOverview />
      </section>

      {/* Mobile-Optimized Recent Activity */}
      <section>
        <h2 className="mobile-heading-md mb-3 sm:mb-4">Recent Activity</h2>
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
