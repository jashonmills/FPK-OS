
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import DualLanguageText from '@/components/DualLanguageText';
import { useTranslation } from 'react-i18next';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { AIStudyChatInterface } from '@/components/chat/AIStudyChatInterface';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useStudyInsights } from '@/hooks/useStudyInsights';
import LearningAnalyticsOverview from '@/components/dashboard/LearningAnalyticsOverview';
import GamificationOverview from '@/components/dashboard/GamificationOverview';
import GoalsOverview from '@/components/dashboard/GoalsOverview';
import QuickNavigationGrid from '@/components/dashboard/QuickNavigationGrid';
import RecentActivityFeed from '@/components/dashboard/RecentActivityFeed';
import AIInsightsSection from '@/components/dashboard/AIInsightsSection';
import BetaOnboarding from '@/components/beta/BetaOnboarding';
import FeedbackSystem from '@/components/beta/FeedbackSystem';
import OrgBanner from '@/components/dashboard/OrgBanner';

const LearnerHome = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { t } = useTranslation('dashboard');
  
  // AI Chat Interface data
  const { sessions: completedSessions } = useStudySessions();
  const { flashcards } = useFlashcards();
  const { insights } = useStudyInsights();

  // Video guide storage and modal state
  const { shouldShowAuto, markVideoAsSeen } = useFirstVisitVideo('home_intro_seen');
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


  return (
    <div className="mobile-section-spacing">
      {/* Beta Onboarding */}
      <BetaOnboarding autoShow={true} />
      
      {/* Organization Banner - Shows when user has no organizations */}
      <div className="mb-6">
        <OrgBanner />
      </div>
      
      {/* Mobile-Optimized Header Section */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="mobile-heading-xl mb-2 text-center">
            <DualLanguageText 
              translationKey="greeting"
              fallback={`${getGreeting()}, ${getDisplayName()}!`}
            />
          </h1>
          <PageHelpTrigger onOpen={handleShowVideoManually} />
        </div>
        <p className="text-muted-foreground mobile-text-base text-center mt-2">
          <DualLanguageText 
            translationKey="welcomeMessage"
            fallback="Ready to continue your learning journey today?"
          />
        </p>
      </div>

      {/* AI Learning Assistant */}
      <section className="mb-6 sm:mb-8">
        <h2 className="mobile-heading-md mb-3 sm:mb-4">AI Learning Assistant</h2>
        <div className="h-[600px]">
          <AIStudyChatInterface
            user={user}
            completedSessions={completedSessions}
            flashcards={flashcards}
            insights={insights}
            fixedHeight={true}
            showHeader={true}
            chatMode="general"
            placeholder="Ask me anything about your studies..."
          />
        </div>
      </section>

      {/* AI Insights Section */}
      <section className="mb-6 sm:mb-8">
        <AIInsightsSection />
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

      {/* Video Guide Modal */}
      <FirstVisitVideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        title="How to Use Home"
        videoUrl="https://www.youtube.com/embed/3ozgiObmM20?si=X7o_saMOz11bX0ha"
      />
    </div>
  );
};

export default LearnerHome;
