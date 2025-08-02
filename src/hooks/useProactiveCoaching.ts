
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useToast } from '@/hooks/use-toast';

interface CoachingSuggestion {
  type: 'study_reminder' | 'improvement_tip' | 'celebration' | 'goal_check';
  title: string;
  message: string;
  action?: string;
}

export const useProactiveCoaching = () => {
  const { user } = useAuth();
  const { sessions } = useStudySessions();
  const { flashcards } = useFlashcards();
  const { toast } = useToast();
  const [lastActivityCheck, setLastActivityCheck] = useState<Date | null>(null);

  // Check for proactive coaching opportunities
  useEffect(() => {
    if (!user || !sessions) return;

    try {

    const checkForCoachingOpportunities = () => {
      const now = new Date();
      const today = now.toDateString();
      
      // Check if we've already done proactive coaching today
      if (lastActivityCheck?.toDateString() === today) return;

      const completedSessions = sessions.filter(s => s.completed_at);
      const todaySessions = completedSessions.filter(s => 
        new Date(s.completed_at!).toDateString() === today
      );
      
      const lastSession = completedSessions[0];
      const daysSinceLastSession = lastSession ? 
        Math.floor((now.getTime() - new Date(lastSession.completed_at!).getTime()) / (1000 * 60 * 60 * 24)) : 0;

      // Generate proactive suggestions
      let suggestion: CoachingSuggestion | null = null;

      if (todaySessions.length === 0 && daysSinceLastSession <= 1) {
        // Daily study reminder
        suggestion = {
          type: 'study_reminder',
          title: 'Ready for today\'s learning session?',
          message: 'You\'ve been consistent with your studies! A quick 10-minute session can help maintain your momentum.',
          action: 'Start Study Session'
        };
      } else if (daysSinceLastSession >= 3) {
        // Re-engagement message
        suggestion = {
          type: 'study_reminder',
          title: 'Your AI coach misses you!',
          message: `It's been ${daysSinceLastSession} days since your last session. Even a short review can help retain what you've learned.`,
          action: 'Resume Learning'
        };
      } else if (todaySessions.length >= 3) {
        // Celebration message
        suggestion = {
          type: 'celebration',
          title: 'Amazing dedication today!',
          message: `You've completed ${todaySessions.length} study sessions today. Your commitment to learning is inspiring!`,
        };
      } else if (completedSessions.length > 0) {
        // Calculate recent performance for improvement tips
        const recentSessions = completedSessions.slice(0, 5);
        const recentAccuracy = recentSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0) / 
                              recentSessions.reduce((sum, s) => sum + (s.total_cards || 0), 1) * 100;
        
        if (recentAccuracy < 60 && recentSessions.length >= 3) {
          suggestion = {
            type: 'improvement_tip',
            title: 'Let\'s boost your performance!',
            message: 'I notice your recent accuracy could improve. Try active recall: cover the answer and test yourself before checking!',
            action: 'Chat with AI Coach'
          };
        }
      }

      if (suggestion) {
        // Show proactive coaching toast
        toast({
          title: suggestion.title,
          description: suggestion.message,
          duration: 8000,
        });
        
        setLastActivityCheck(now);
      }
    };

    // Check for opportunities every 30 minutes when active
    const interval = setInterval(checkForCoachingOpportunities, 30 * 60 * 1000);
    
    // Initial check after 5 seconds
    const timeout = setTimeout(checkForCoachingOpportunities, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
    } catch (error) {
      console.error('Error in proactive coaching:', error);
    }
  }, [user, sessions, flashcards, toast, lastActivityCheck]);

  return {
    // This hook primarily works in the background
    // Could expose methods for manual coaching triggers if needed
  };
};
