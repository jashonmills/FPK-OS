
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
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-foreground">AI Learning Coach</h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
          Your personalized AI coach analyzes your learning patterns, identifies strengths and weaknesses, 
          and provides tailored guidance to accelerate your educational journey.
        </p>
        <div className="hidden sm:flex justify-center gap-6 text-sm text-muted-foreground">
          <span>• Personalized learning analysis from your study data</span>
          <span>• Proactive guidance to build strengths from weaknesses</span>
          <span>• Continuous support and motivation on your learning path</span>
        </div>
        {/* Mobile-friendly feature list */}
        <div className="sm:hidden space-y-1 text-xs text-muted-foreground px-4">
          <div>• Personalized learning analysis</div>
          <div>• Proactive guidance and support</div>
          <div>• Continuous motivation</div>
        </div>
      </div>

      {/* AI Coach Status Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-bold">AI Learning Coach</h2>
                <p className="text-purple-100 text-sm sm:text-base">
                  {completedSessions.length > 0 ? 
                    `Analyzing your ${completedSessions.length} study sessions and ${flashcards?.length || 0} flashcards` :
                    'Ready to analyze your learning patterns once you start studying'
                  }
                </p>
              </div>
            </div>
            {completedSessions.length > 0 && (
              <div className="w-full sm:w-auto sm:text-right">
                <div className="flex items-center justify-between sm:justify-end gap-2 text-base sm:text-lg font-semibold mb-1">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{overallAccuracy}% Overall Accuracy</span>
                </div>
                <p className="text-purple-200 text-xs sm:text-sm">
                  {currentStreak > 0 ? `${currentStreak} day learning streak!` : 'Start your learning streak today'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Layout */}
      <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
        {/* Chat Interface - Full width on mobile, 2/3 on desktop */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <ChatInterface
            user={user}
            completedSessions={completedSessions}
            flashcards={flashcards}
            insights={insights}
          />
        </div>

        {/* Right Sidebar - Stack on mobile, sidebar on desktop */}
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          <FileUploadCard />
          <StudyPlanCard todaysFocus={todaysFocus} />
          <QuickChallengesCard challenges={quickChallenges} />
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
