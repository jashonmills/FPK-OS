
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import DualLanguageText from '@/components/DualLanguageText';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import { HomeVideoModal } from '@/components/dashboard/HomeVideoModal';
import { useHomeVideoStorage } from '@/hooks/useHomeVideoStorage';
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
import BetaOnboarding from '@/components/beta/BetaOnboarding';
import FeedbackSystem from '@/components/beta/FeedbackSystem';

const LearnerHome = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { t } = useTranslation('dashboard');
  const [isAPODModalOpen, setIsAPODModalOpen] = useState(false);

  // Video guide storage and modal state
  const { shouldShowAuto, markVideoAsSeen } = useHomeVideoStorage();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Show video modal automatically on first visit
  useEffect(() => {
    if (shouldShowAuto()) {
      setIsVideoModalOpen(true);
    }
  }, [shouldShowAuto]);

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    markVideoAsSeen();
  };

  const handleShowVideoManually = () => {
    setIsVideoModalOpen(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('goodAfternoon');
    return t('goodEvening');
  };

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return t('learner');
  };

  const handleAPODGalleryOpen = () => {
    setIsAPODModalOpen(true);
  };

  const handleAPODGalleryClose = () => {
    setIsAPODModalOpen(false);
  };

  return (
    <div className="mobile-section-spacing">
      {/* Beta Onboarding */}
      <BetaOnboarding autoShow={true} />
      
      {/* Mobile-Optimized Header Section */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="mobile-heading-xl mb-2 text-center">
            <DualLanguageText 
              translationKey="greeting"
              fallback={`${getGreeting()}, ${getDisplayName()}!`}
            />
          </h1>
          <button
            onClick={handleShowVideoManually}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
            aria-label="Watch video guide about how this page works"
          >
            <HelpCircle className="h-4 w-4" />
            How this page works
          </button>
        </div>
        <p className="text-muted-foreground mobile-text-base text-center mt-2">
          <DualLanguageText 
            translationKey="welcomeMessage"
            fallback="Ready to continue your learning journey today?"
          />
        </p>
      </div>

      {/* Today's Highlights - Custom Layout */}
      <section className="mb-6 sm:mb-8">
        <h2 className="mobile-heading-md mb-3 sm:mb-4">Today's Highlights</h2>
        <div className="flex flex-col gap-6 lg:gap-8">
          {/* 2-column header zone */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left column: Quote + NASA APOD */}
            <div className="flex flex-col flex-1 gap-6 lg:gap-8 min-h-[420px]">
              <div className="flex-1">
                <QuoteOfTheDayCard className="h-full" />
              </div>
              <div className="flex-1">
                <APODCard onOpenGallery={handleAPODGalleryOpen} className="h-full" />
              </div>
            </div>

            {/* Right column: Weather */}
            <div className="flex-1 min-h-[420px]">
              <WeatherScienceLabCard />
            </div>
          </div>

          {/* Full-width AI Insights */}
          <div className="w-full">
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

      {/* Beta Feedback Section */}
      <section>
        <FeedbackSystem currentPage="/dashboard/learner" />
      </section>

      {/* APOD Gallery Modal */}
      <APODGalleryModal
        isOpen={isAPODModalOpen}
        onClose={handleAPODGalleryClose}
      />

      {/* Video Guide Modal */}
      <HomeVideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
      />
    </div>
  );
};

export default LearnerHome;
