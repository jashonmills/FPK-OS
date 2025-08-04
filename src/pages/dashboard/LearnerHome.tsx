
import React, { useState, Suspense, lazy } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import DualLanguageText from '@/components/DualLanguageText';
import { useTranslation } from 'react-i18next';
import { useProgressiveLoading } from '@/hooks/useProgressiveLoading';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

// Lazy load non-critical components
const QuoteOfTheDayCard = lazy(() => import('@/components/dashboard/QuoteOfTheDayCard'));
const WeatherScienceLabCard = lazy(() => import('@/components/dashboard/WeatherScienceLabCard'));
const APODCard = lazy(() => import('@/components/dashboard/APODCard'));
const APODGalleryModal = lazy(() => import('@/components/dashboard/APODGalleryModal'));
const LearningAnalyticsOverview = lazy(() => import('@/components/dashboard/LearningAnalyticsOverview'));
const GamificationOverview = lazy(() => import('@/components/dashboard/GamificationOverview'));
const GoalsOverview = lazy(() => import('@/components/dashboard/GoalsOverview'));
const RecentActivityFeed = lazy(() => import('@/components/dashboard/RecentActivityFeed'));
const AIInsightsSection = lazy(() => import('@/components/dashboard/AIInsightsSection'));
const FeedbackSystem = lazy(() => import('@/components/beta/FeedbackSystem'));

// Keep critical components loaded immediately
import QuickNavigationGrid from '@/components/dashboard/QuickNavigationGrid';
import BetaOnboarding from '@/components/beta/BetaOnboarding';

const LearnerHome = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { t } = useTranslation('dashboard');
  const [isAPODModalOpen, setIsAPODModalOpen] = useState(false);

  // Progressive loading phases
  const { isPhaseLoaded } = useProgressiveLoading([
    { id: 'critical', priority: 1 }, // Header, navigation
    { id: 'highlights', priority: 2 }, // Today's highlights
    { id: 'analytics', priority: 3 }, // Learning analytics
    { id: 'secondary', priority: 4 }, // Achievements, goals
    { id: 'activity', priority: 5 }, // Recent activity, feedback
  ]);

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
        <h1 className="mobile-heading-xl mb-2">
          <DualLanguageText 
            translationKey="greeting"
            fallback={`${getGreeting()}, ${getDisplayName()}!`}
          />
        </h1>
        <p className="text-muted-foreground mobile-text-base">
          <DualLanguageText 
            translationKey="welcomeMessage"
            fallback="Ready to continue your learning journey today?"
          />
        </p>
      </div>

      {/* Today's Highlights - Custom Layout */}
      {isPhaseLoaded('highlights') && (
        <section className="mb-6 sm:mb-8">
          <h2 className="mobile-heading-md mb-3 sm:mb-4">Today's Highlights</h2>
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* 2-column header zone */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Left column: Quote + NASA APOD */}
              <div className="flex flex-col flex-1 gap-6 lg:gap-8 min-h-[420px]">
                <div className="flex-1">
                  <Suspense fallback={<LoadingSkeleton variant="card" className="h-full" />}>
                    <QuoteOfTheDayCard className="h-full" />
                  </Suspense>
                </div>
                <div className="flex-1">
                  <Suspense fallback={<LoadingSkeleton variant="card" className="h-full" />}>
                    <APODCard onOpenGallery={handleAPODGalleryOpen} className="h-full" />
                  </Suspense>
                </div>
              </div>

              {/* Right column: Weather */}
              <div className="flex-1 min-h-[420px]">
                <Suspense fallback={<LoadingSkeleton variant="card" className="h-full" />}>
                  <WeatherScienceLabCard />
                </Suspense>
              </div>
            </div>

            {/* Full-width AI Insights */}
            <div className="w-full">
              <Suspense fallback={<LoadingSkeleton variant="card" />}>
                <AIInsightsSection />
              </Suspense>
            </div>
          </div>
        </section>
      )}

      {/* Mobile-Optimized Quick Navigation */}
      <section>
        <h2 className="mobile-heading-md mb-3 sm:mb-4">Quick Access</h2>
        <QuickNavigationGrid />
      </section>

      {/* Mobile-Optimized Learning Analytics */}
      {isPhaseLoaded('analytics') && (
        <section>
          <h2 className="mobile-heading-md mb-3 sm:mb-4">Learning Progress</h2>
          <Suspense fallback={<LoadingSkeleton variant="chart" />}>
            <LearningAnalyticsOverview />
          </Suspense>
        </section>
      )}

      {/* Mobile-Optimized Achievements Section */}
      {isPhaseLoaded('secondary') && (
        <section>
          <h2 className="mobile-heading-md mb-3 sm:mb-4">Achievements & Progress</h2>
          <Suspense fallback={<LoadingSkeleton variant="card" />}>
            <GamificationOverview />
          </Suspense>
        </section>
      )}

      {/* Mobile-Optimized Goals Section */}
      {isPhaseLoaded('secondary') && (
        <section>
          <h2 className="mobile-heading-md mb-3 sm:mb-4">Current Goals</h2>
          <Suspense fallback={<LoadingSkeleton variant="card" />}>
            <GoalsOverview />
          </Suspense>
        </section>
      )}

      {/* Mobile-Optimized Recent Activity */}
      {isPhaseLoaded('activity') && (
        <section>
          <h2 className="mobile-heading-md mb-3 sm:mb-4">Recent Activity</h2>
          <Suspense fallback={<LoadingSkeleton variant="card" />}>
            <RecentActivityFeed />
          </Suspense>
        </section>
      )}

      {/* Beta Feedback Section */}
      {isPhaseLoaded('activity') && (
        <section>
          <Suspense fallback={<LoadingSkeleton variant="card" />}>
            <FeedbackSystem currentPage="/dashboard/learner" />
          </Suspense>
        </section>
      )}

      {/* APOD Gallery Modal */}
      <Suspense fallback={null}>
        <APODGalleryModal
          isOpen={isAPODModalOpen}
          onClose={handleAPODGalleryClose}
        />
      </Suspense>
    </div>
  );
};

export default LearnerHome;
