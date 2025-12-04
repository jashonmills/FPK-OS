
import { BookOpen, Target, Zap, Brain } from 'lucide-react';

export const calculateStudyStreak = (completedSessions: any[]) => {
  if (!completedSessions?.length) return 0;
  
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    
    const hasSessionOnDate = completedSessions.some(session => {
      const sessionDate = new Date(session.created_at);
      return sessionDate.toDateString() === checkDate.toDateString();
    });
    
    if (hasSessionOnDate) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
};

export const generateTodaysFocus = (insights: any[], flashcards: any[], completedSessions: any[]) => {
  // First try to use insights recommendations
  const insightRecommendations = insights
    .filter(insight => insight.type === 'recommendation')
    .slice(0, 2)
    .map(insight => insight.title);

  if (insightRecommendations.length > 0) {
    return insightRecommendations;
  }

  // If no insights, generate from flashcard categories and session patterns
  const focusAreas = [];
  
  if (flashcards && flashcards.length > 0) {
    // Get cards that haven't been reviewed recently
    const unreviewed = flashcards.filter(card => 
      !card.last_reviewed_at || 
      new Date(card.last_reviewed_at) < new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    if (unreviewed.length > 0) {
      focusAreas.push(`Review ${Math.min(5, unreviewed.length)} flashcards`);
    }

    // Get cards with low accuracy (if review data exists)
    const difficultCards = flashcards.filter(card => 
      card.times_reviewed > 0 && 
      (card.times_correct / card.times_reviewed) < 0.7
    );
    
    if (difficultCards.length > 0) {
      focusAreas.push(`Practice ${difficultCards.length} challenging concepts`);
    }
  }

  if (completedSessions.length > 0) {
    const recentAccuracy = completedSessions.slice(0, 5).reduce((sum, s) => {
      const total = s.total_cards || 1;
      return sum + (s.correct_answers || 0) / total;
    }, 0) / Math.min(5, completedSessions.length);

    if (recentAccuracy < 0.75) {
      focusAreas.push('Focus on accuracy improvement');
    }
  }

  return focusAreas.slice(0, 2);
};

export const generateQuickChallenges = (flashcards: any[], completedSessions: any[]) => {
  const challenges = [];

  if (flashcards && flashcards.length >= 3) {
    challenges.push({
      text: `Quick review: 3 random flashcards`,
      icon: BookOpen,
      action: () => console.log('Starting flashcard review')
    });
  }

  if (completedSessions.length > 0) {
    const avgAccuracy = completedSessions.reduce((sum, s) => {
      const total = s.total_cards || 1;
      return sum + (s.correct_answers || 0) / total;
    }, 0) / completedSessions.length;

    if (avgAccuracy < 0.8) {
      challenges.push({
        text: 'Accuracy challenge: Score 90%+ on 5 cards',
        icon: Target,
        action: () => console.log('Starting accuracy challenge')
      });
    }
  }

  if (flashcards && flashcards.length >= 5) {
    challenges.push({
      text: 'Speed test: Answer 5 cards in 2 minutes',
      icon: Zap,
      action: () => console.log('Starting speed test')
    });
  }

  // Default challenges if no specific data
  if (challenges.length === 0) {
    challenges.push(
      {
        text: 'Create your first flashcard to unlock challenges',
        icon: Brain,
        action: () => console.log('Navigate to create flashcard')
      }
    );
  }

  return challenges.slice(0, 3);
};
