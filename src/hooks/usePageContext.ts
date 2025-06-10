
import { useLocation } from 'react-router-dom';

export const usePageContext = () => {
  const location = useLocation();

  const getPageContext = () => {
    const path = location.pathname;
    
    if (path.includes('/notes')) {
      return 'Notes Page - You can upload files, create flashcards, and organize study materials here.';
    } else if (path.includes('/my-courses')) {
      return 'My Courses - Browse and access your enrolled courses and learning materials.';
    } else if (path.includes('/analytics') || path.includes('/learning-analytics')) {
      return 'Learning Analytics - View your study progress, performance metrics, and insights.';
    } else if (path.includes('/goals')) {
      return 'Goals Page - Set, track, and manage your learning objectives and milestones.';
    } else if (path.includes('/study')) {
      return 'Study Page - Access different study modes like flashcards, quizzes, and memory tests.';
    } else if (path.includes('/ai-coach') || path.includes('/ai-study-coach')) {
      return 'AI Study Coach - Get personalized learning guidance and study strategies.';
    } else if (path.includes('/live-hub') || path.includes('/live-learning-hub')) {
      return 'Live Learning Hub - Join live sessions and connect with instructors and peers.';
    } else if (path.includes('/settings')) {
      return 'Settings - Manage your profile, preferences, and account settings.';
    } else if (path.includes('/course/')) {
      return 'Course Content - You are viewing course materials and modules.';
    } else if (path.includes('/learner')) {
      return 'Dashboard Home - Your main learning dashboard with overview and quick access to features.';
    }
    
    return 'Learning Platform - Navigate through courses, study materials, and track your progress.';
  };

  const getQuickActions = () => {
    const path = location.pathname;
    
    if (path.includes('/notes')) {
      return [
        'How do I upload files?',
        'How to create flashcards?',
        'Organize my study materials'
      ];
    } else if (path.includes('/my-courses')) {
      return [
        'How to enroll in courses?',
        'Track course progress',
        'Access course materials'
      ];
    } else if (path.includes('/study')) {
      return [
        'Best study techniques',
        'How to improve retention?',
        'Study session tips'
      ];
    } else if (path.includes('/analytics')) {
      return [
        'Understand my progress',
        'Improve my performance',
        'Set learning goals'
      ];
    }
    
    return [
      'How to get started?',
      'Platform navigation help',
      'Study tips and strategies'
    ];
  };

  return {
    getPageContext,
    getQuickActions
  };
};
