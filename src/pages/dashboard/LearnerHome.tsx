
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
      
      {/* Mobile-Optimized Header Section */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col items-center gap-2">
            <h1 className="mobile-heading-xl mb-2 text-center text-gray-900 font-bold drop-shadow-sm">
              <DualLanguageText 
                translationKey="greeting"
                fallback={`${getGreeting()}, ${getDisplayName()}!`}
              />
            </h1>
            <PageHelpTrigger onOpen={handleShowVideoManually} />
          </div>
          <p className="text-gray-800 mobile-text-base text-center mt-2 font-medium drop-shadow-sm">
            <DualLanguageText 
              translationKey="welcomeMessage"
              fallback="Ready to continue your learning journey today?"
            />
          </p>
        </div>
      </div>
      
      {/* Organization Banner - Shows when user has no organizations */}
      <div className="mb-6">
        <OrgBanner />
      </div>

      {/* AI Learning Assistant */}
      <section className="mb-6 sm:mb-8">
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-1 border border-white/20 shadow-lg">
          <h2 className="mobile-heading-md mb-3 sm:mb-4 text-gray-900 font-bold px-3 pt-2 drop-shadow-sm">AI Learning Assistant</h2>
          <div className="h-[600px] rounded-xl overflow-hidden">
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
        </div>
      </section>

      {/* AI Insights Section */}
      <section className="mb-6 sm:mb-8">
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <AIInsightsSection />
        </div>
      </section>

      {/* Mobile-Optimized Quick Navigation */}
      <section>
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <h2 className="mobile-heading-md mb-3 sm:mb-4 text-gray-900 font-bold drop-shadow-sm">Quick Access</h2>
          <QuickNavigationGrid />
        </div>
      </section>

      {/* Mobile-Optimized Learning Analytics */}
      <section>
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <h2 className="mobile-heading-md mb-3 sm:mb-4 text-gray-900 font-bold drop-shadow-sm">Learning Progress</h2>
          <LearningAnalyticsOverview />
        </div>
      </section>

      {/* Mobile-Optimized Achievements Section */}
      <section>
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <h2 className="mobile-heading-md mb-3 sm:mb-4 text-gray-900 font-bold drop-shadow-sm">Achievements & Progress</h2>
          <GamificationOverview />
        </div>
      </section>

      {/* Mobile-Optimized Goals Section */}
      <section>
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <h2 className="mobile-heading-md mb-3 sm:mb-4 text-gray-900 font-bold drop-shadow-sm">Current Goals</h2>
          <GoalsOverview />
        </div>
      </section>

      {/* Mobile-Optimized Recent Activity */}
      <section>
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <h2 className="mobile-heading-md mb-3 sm:mb-4 text-gray-900 font-bold drop-shadow-sm">Recent Activity</h2>
          <RecentActivityFeed />
        </div>
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
