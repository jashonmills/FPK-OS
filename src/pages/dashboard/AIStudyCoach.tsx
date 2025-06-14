
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Brain, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useStudyInsights } from '@/hooks/useStudyInsights';
import { useProactiveCoaching } from '@/hooks/useProactiveCoaching';
import ChatInterface from '@/components/ai-coach/ChatInterface';
import FileUploadCard from '@/components/ai-coach/FileUploadCard';
import StudyPlanCard from '@/components/ai-coach/StudyPlanCard';
import QuickChallengesCard from '@/components/ai-coach/QuickChallengesCard';
import LearningStatsCard from '@/components/ai-coach/LearningStatsCard';
import { calculateStudyStreak, generateTodaysFocus, generateQuickChallenges } from '@/utils/studyDataUtils';

const AIStudyCoach = () => {
  const { user } = useAuth();
  const { sessions } = useStudySessions();
  const { flashcards } = useFlashcards();
  const { insights } = useStudyInsights();

  // Enable proactive coaching
  useProactiveCoaching();

  // Calculate live stats
  const completedSessions = sessions?.filter(s => s.completed_at) || [];
  const totalXP = completedSessions.reduce((sum, s) => sum + (s.correct_answers || 0) * 10, 0);
  const currentStreak = calculateStudyStreak(completedSessions);
  const progressToNextLevel = (totalXP % 1000) / 10; // Each level = 1000 XP

  // Calculate performance metrics
  const totalCorrect = completedSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
  const totalAnswered = completedSessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Generate dynamic content
  const todaysFocus = generateTodaysFocus(insights, flashcards, completedSessions);
  const quickChallenges = generateQuickChallenges(flashcards, completedSessions);

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6 overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4 max-w-full overflow-hidden">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-foreground px-2 break-words">
          AI Learning Coach
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-2xl mx-auto px-3 sm:px-4 leading-relaxed break-words">
          Your personalized AI coach analyzes your learning patterns, identifies strengths and weaknesses, 
          and provides tailored guidance to accelerate your educational journey.
        </p>
        <div className="hidden sm:flex justify-center gap-4 lg:gap-6 text-xs sm:text-sm text-muted-foreground flex-wrap px-4">
          <span className="break-words">• Personalized learning analysis from your study data</span>
          <span className="break-words">• Proactive guidance to build strengths from weaknesses</span>
          <span className="break-words">• Continuous support and motivation on your learning path</span>
        </div>
        {/* Mobile-friendly feature list */}
        <div className="sm:hidden space-y-1 text-xs text-muted-foreground px-4">
          <div className="break-words">• Personalized learning analysis</div>
          <div className="break-words">• Proactive guidance and support</div>
          <div className="break-words">• Continuous motivation</div>
        </div>
      </div>

      {/* AI Coach Status Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 overflow-hidden">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0 overflow-hidden">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 flex-shrink-0" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <h2 className="text-base sm:text-lg lg:text-2xl font-bold truncate">AI Learning Coach</h2>
                <p className="text-purple-100 text-xs sm:text-sm lg:text-base leading-relaxed break-words">
                  {completedSessions.length > 0 ? 
                    `Analyzing your ${completedSessions.length} study sessions and ${flashcards?.length || 0} flashcards` :
                    'Ready to analyze your learning patterns once you start studying'
                  }
                </p>
              </div>
            </div>
            {completedSessions.length > 0 && (
              <div className="w-full sm:w-auto sm:text-right flex-shrink-0 overflow-hidden">
                <div className="flex items-center justify-between sm:justify-end gap-2 text-sm sm:text-base lg:text-lg font-semibold mb-1">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                  <span className="truncate">{overallAccuracy}% Overall Accuracy</span>
                </div>
                <p className="text-purple-200 text-xs sm:text-sm leading-relaxed break-words">
                  {currentStreak > 0 ? `${currentStreak} day learning streak!` : 'Start your learning streak today'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Study Challenges Section */}
      <QuickChallengesCard challenges={quickChallenges} flashcards={flashcards} />

      {/* Main Content Layout */}
      <div className="space-y-3 sm:space-y-4 lg:space-y-6 lg:grid lg:grid-cols-3 lg:gap-4 xl:gap-6 lg:space-y-0 overflow-hidden">
        {/* Chat Interface - Full width on mobile, 2/3 on desktop */}
        <div className="lg:col-span-2 order-2 lg:order-1 min-w-0">
          <ChatInterface
            user={user}
            completedSessions={completedSessions}
            flashcards={flashcards}
            insights={insights}
          />
        </div>

        {/* Right Sidebar - Stack on mobile, sidebar on desktop */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6 order-1 lg:order-2 min-w-0 max-w-full">
          <FileUploadCard />
          <StudyPlanCard todaysFocus={todaysFocus} />
          <LearningStatsCard
            totalXP={totalXP}
            currentStreak={currentStreak}
            progressToNextLevel={progressToNextLevel}
          />
        </div>
      </div>
    </div>
  );
};

export default AIStudyCoach;
