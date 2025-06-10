
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">AI Learning Coach</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your personalized AI coach analyzes your learning patterns, identifies strengths and weaknesses, 
          and provides tailored guidance to accelerate your educational journey.
        </p>
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <span>• Personalized learning analysis from your study data</span>
          <span>• Proactive guidance to build strengths from weaknesses</span>
          <span>• Continuous support and motivation on your learning path</span>
        </div>
      </div>

      {/* AI Coach Status Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">AI Learning Coach</h2>
                <p className="text-purple-100">
                  {completedSessions.length > 0 ? 
                    `Analyzing your ${completedSessions.length} study sessions and ${flashcards?.length || 0} flashcards` :
                    'Ready to analyze your learning patterns once you start studying'
                  }
                </p>
              </div>
            </div>
            {completedSessions.length > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-2 text-lg font-semibold mb-1">
                  <TrendingUp className="h-5 w-5" />
                  {overallAccuracy}% Overall Accuracy
                </div>
                <p className="text-purple-200 text-sm">
                  {currentStreak > 0 ? `${currentStreak} day learning streak!` : 'Start your learning streak today'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <ChatInterface
            user={user}
            completedSessions={completedSessions}
            flashcards={flashcards}
            insights={insights}
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
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
