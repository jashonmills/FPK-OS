
import { useLocation } from 'react-router-dom';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useGoals } from '@/hooks/useGoals';

export const usePageContext = () => {
  const location = useLocation();
  const { flashcards } = useFlashcards();
  const { sessions } = useStudySessions();
  const { goals } = useGoals();

  const getPageContext = () => {
    const path = location.pathname;
    let context = '';

    // Base context about current page
    if (path.includes('/ai-study-coach')) {
      context = 'User is on the AI Study Coach page, looking for personalized learning guidance and coaching.';
    } else if (path.includes('/notes')) {
      context = 'User is on the Notes page, working with their study materials and flashcards.';
    } else if (path.includes('/study')) {
      context = 'User is on the Study page, actively engaged in study sessions or practice.';
    } else if (path.includes('/goals')) {
      context = 'User is on the Goals page, managing their learning objectives and progress tracking.';
    } else if (path.includes('/analytics')) {
      context = 'User is on the Learning Analytics page, reviewing their study performance and insights.';
    } else if (path.includes('/my-courses')) {
      context = 'User is on the My Courses page, exploring their enrolled courses and learning paths.';
    } else {
      context = 'User is on the main dashboard, getting an overview of their learning journey.';
    }

    // Add recent activity context
    const recentSessions = sessions?.slice(0, 3) || [];
    if (recentSessions.length > 0) {
      const sessionTypes = recentSessions.map(s => s.session_type).join(', ');
      context += ` Recent study activity includes: ${sessionTypes} sessions.`;
    }

    // Add flashcard context
    if (flashcards && flashcards.length > 0) {
      const totalCards = flashcards.length;
      const strugglingCards = flashcards.filter(card => {
        const successRate = card.times_reviewed > 0 ? (card.times_correct / card.times_reviewed) : 0;
        return card.times_reviewed >= 2 && successRate < 0.6;
      }).length;
      
      context += ` User has ${totalCards} flashcards total`;
      if (strugglingCards > 0) {
        context += `, with ${strugglingCards} cards that need more practice`;
      }
      context += '.';
    }

    // Add goals context
    if (goals && goals.length > 0) {
      const activeGoals = goals.filter(g => g.status === 'active').length;
      if (activeGoals > 0) {
        context += ` User has ${activeGoals} active learning goals they're working towards.`;
      }
    }

    return context;
  };

  return { getPageContext };
};
