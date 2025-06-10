
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useStudyInsights } from '@/hooks/useStudyInsights';
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

  // Calculate live stats
  const completedSessions = sessions?.filter(s => s.completed_at) || [];
  const totalXP = completedSessions.reduce((sum, s) => sum + (s.correct_answers || 0) * 10, 0);
  const currentStreak = calculateStudyStreak(completedSessions);
  const progressToNextLevel = (totalXP % 1000) / 10; // Each level = 1000 XP

  // Generate dynamic content
  const todaysFocus = generateTodaysFocus(insights, flashcards, completedSessions);
  const quickChallenges = generateQuickChallenges(flashcards, completedSessions);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">AI Study Coach</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get personalized learning support and guidance from your AI-powered study coach.
        </p>
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <span>• Receive tailored study recommendations and strategies</span>
          <span>• Get instant help with challenging concepts</span>
          <span>• Track your study sessions and optimize your learning</span>
        </div>
      </div>

      {/* AI Study Assistant Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="h-8 w-8" />
            <h2 className="text-2xl font-bold">AI Study Assistant</h2>
          </div>
          <p className="text-purple-100">
            Get personalized learning support and guidance powered by AI.
          </p>
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
