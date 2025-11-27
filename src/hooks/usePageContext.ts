
import { useLocation } from 'react-router-dom';

export const usePageContext = () => {
  const location = useLocation();

  const getPageContext = () => {
    const path = location.pathname;
    
    // Map routes to user-friendly context
    const contextMap: Record<string, string> = {
      '/dashboard/learner': 'Dashboard Overview',
      '/dashboard/learner/notes': 'Notes & Study Materials',
      '/dashboard/learner/flashcards': 'Flashcard Management',
      '/dashboard/learner/study': 'Study Sessions',
      '/dashboard/learner/ai-coach': 'AI Learning Coach',
      '/dashboard/learner/goals': 'Learning Goals',
      '/dashboard/learner/goals-notes': 'Goals & Study Materials',
      '/dashboard/learner/analytics': 'Learning Analytics & Achievements',
      '/dashboard/learner/gamification': 'Achievements & XP',
      '/dashboard/learner/settings': 'Settings',
      '/dashboard/learner/courses': 'Course Library'
    };

    // Extract course or module context if present
    const courseMatch = path.match(/\/courses\/([^\/]+)/);
    const moduleMatch = path.match(/\/modules\/([^\/]+)/);
    
    if (courseMatch) {
      return `Course: ${courseMatch[1].replace(/-/g, ' ')}`;
    }
    
    if (moduleMatch) {
      return `Module: ${moduleMatch[1].replace(/-/g, ' ')}`;
    }

    return contextMap[path] || 'FPK University Platform';
  };

  return { getPageContext };
};
