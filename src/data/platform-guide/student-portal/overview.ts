/**
 * Student Portal - Complete Feature Guide
 * Route: /dashboard/learner
 */

import { GuideEntry } from '@/types/platform-guide';
import { studentDashboardGuide } from './dashboard-expanded';
import { studentCoursesGuide } from './courses-expanded';
import { studentGoalsGuide } from './goals-expanded';
import { studentAnalyticsGuide } from './analytics-expanded';
import { studentGamificationGuide } from './gamification-expanded';
import { studentAIAssistantGuide } from './ai-assistant-expanded';
import { studentStudyGuide } from './study-expanded';

export const studentPortalGuide: GuideEntry[] = [
  ...studentDashboardGuide,
  ...studentCoursesGuide,
  ...studentGoalsGuide,
  ...studentAnalyticsGuide,
  ...studentGamificationGuide,
  ...studentAIAssistantGuide,
  ...studentStudyGuide
];
  {
    id: 'student-dashboard',
    section: 'dashboard',
    title: 'Student Dashboard Overview',
    description: 'Personal learning dashboard showing progress, achievements, and assigned courses.',
    userPurpose: 'Central hub for students to track their learning journey, see achievements, and access courses.',
    route: '/dashboard/learner',
    component: 'LearnerHome.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Welcome Header',
        action: 'Shows personalized greeting with student name',
        outcome: 'Creates welcoming, personalized experience',
        technicalDetails: 'Uses time-based greeting (Good Morning/Afternoon/Evening) from i18n'
      },
      {
        element: 'Quick Stats Cards',
        action: 'Displays key learning metrics',
        outcome: 'Shows Active Courses, Current Streak, XP, Study Time at a glance',
        technicalDetails: 'Aggregated from student_progress, gamification_stats tables'
      }
    ],
    dataDisplayed: [
      {
        field: 'Active Courses',
        source: 'course_enrollments WHERE status=\'active\'',
        calculation: 'COUNT(*) of enrolled courses',
        significance: 'Shows current course load'
      },
      {
        field: 'Current Streak',
        source: 'gamification_stats.current_streak',
        calculation: 'Days with consecutive activity',
        significance: 'Gamification metric to encourage daily engagement'
      },
      {
        field: 'Total XP',
        source: 'gamification_stats.total_xp',
        calculation: 'Sum of all experience points earned',
        significance: 'Progress indicator and achievement motivator'
      },
      {
        field: 'Study Time',
        source: 'session_analytics',
        calculation: 'SUM(session_duration) for current week/month',
        significance: 'Tracks engagement and time investment'
      }
    ],
    relatedFeatures: ['My Courses', 'Achievements', 'Learning Analytics', 'Goals']
  },
  {
    id: 'student-my-courses',
    section: 'courses',
    title: 'My Courses - Student View',
    description: 'List of courses assigned to the student with progress tracking.',
    userPurpose: 'Access assigned learning content, continue where left off, track completion.',
    route: '/dashboard/learner/courses',
    component: 'MyCourses.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Course Cards',
        action: 'Click to enter course',
        outcome: 'Opens course player/lesson interface',
        technicalDetails: 'Router navigation to /dashboard/learner/course/:courseId'
      },
      {
        element: 'Continue Learning Button',
        action: 'Resume from last completed lesson',
        outcome: 'Deep links to exact lesson student left off',
        technicalDetails: 'Queries course_progress for last_lesson_id'
      },
      {
        element: 'Progress Bar',
        action: 'Visual completion indicator',
        outcome: 'Shows % complete',
        technicalDetails: 'Calculated from lesson_progress'
      }
    ],
    dataDisplayed: [
      {
        field: 'Assigned Courses',
        source: 'course_enrollments WHERE student_id=:userId',
        calculation: 'All courses assigned by instructors',
        significance: 'Student\'s curriculum'
      },
      {
        field: 'Course Progress',
        source: 'course_progress table',
        calculation: '(completed_lessons / total_lessons) * 100',
        significance: 'Completion percentage per course'
      }
    ],
    relatedFeatures: ['Course Player', 'Lesson Progress', 'Certificates']
  },
  {
    id: 'student-goals',
    section: 'goals',
    title: 'Student Goals View',
    description: 'Personal and instructor-assigned goals visible to the student.',
    userPurpose: 'Track learning objectives, see what instructors expect, maintain accountability.',
    route: '/dashboard/learner/goals',
    component: 'Goals.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Goals List',
        action: 'View all active goals',
        outcome: 'Shows goals with progress indicators',
        technicalDetails: 'Query organization_goals WHERE student_id=:userId AND visible_to_student=true'
      },
      {
        element: 'Self-Set Goals',
        action: 'Students can create their own goals (if enabled)',
        outcome: 'Promotes self-directed learning',
        technicalDetails: 'Creates organization_goals with created_by=student_id'
      }
    ],
    dataDisplayed: [
      {
        field: 'Visible Goals',
        source: 'organization_goals WHERE visible_to_student=true',
        significance: 'Goals student can see and work toward'
      }
    ],
    relatedFeatures: ['Goal Progress', 'Instructor Feedback']
  },
  {
    id: 'student-analytics',
    section: 'analytics',
    title: 'Learning Analytics - Student View',
    description: 'Personal learning statistics, time spent, strengths, and areas for improvement.',
    userPurpose: 'Self-awareness about learning patterns, identify strong subjects, find areas needing focus.',
    route: '/dashboard/learner/analytics',
    component: 'LearningAnalytics.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Time Charts',
        action: 'View study time over weeks/months',
        outcome: 'Visualizes engagement patterns',
        technicalDetails: 'Recharts visualization of session_analytics data'
      },
      {
        element: 'Course Performance',
        action: 'See grades/scores by course',
        outcome: 'Identifies strengths and weaknesses',
        technicalDetails: 'Aggregated from lesson_progress and assessment_results'
      }
    ],
    dataDisplayed: [
      {
        field: 'Learning Time',
        source: 'session_analytics',
        calculation: 'SUM(duration) grouped by date/week',
        significance: 'Shows study consistency'
      }
    ],
    relatedFeatures: ['Study Sessions', 'Performance Reports']
  },
  {
    id: 'student-gamification',
    section: 'gamification',
    title: 'XP, Levels & Achievements',
    description: 'Gamification system with experience points, levels, badges, and achievements.',
    userPurpose: 'Motivate through game-like rewards, provide sense of progression beyond grades.',
    route: '/dashboard/learner/gamification',
    component: 'Gamification.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'XP Bar',
        action: 'Shows progress to next level',
        outcome: 'Visual motivation for continued learning',
        technicalDetails: 'gamification_stats.xp_to_next_level calculation'
      },
      {
        element: 'Achievements Grid',
        action: 'Displays unlocked badges',
        outcome: 'Recognition of accomplishments',
        technicalDetails: 'Query student_achievements with badge metadata'
      }
    ],
    dataDisplayed: [
      {
        field: 'Current Level',
        source: 'gamification_stats.level',
        calculation: 'Based on total XP thresholds',
        significance: 'Overall progress indicator'
      }
    ],
    relatedFeatures: ['Achievements', 'Leaderboards', 'Rewards']
  },
  {
    id: 'student-ai-coach',
    section: 'ai-assistant',
    title: 'AI Study Coach - Student Portal',
    description: 'Personal AI tutor for homework help, concept explanations, and study guidance.',
    userPurpose: '24/7 learning support, get help without waiting for instructor, personalized explanations.',
    route: '/dashboard/learner/ai-coach',
    component: 'AIStudyCoach.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Chat Interface',
        action: 'Ask questions in natural language',
        outcome: 'AI provides explanations, hints, and guidance',
        technicalDetails: 'Uses AI with student context and course materials'
      },
      {
        element: 'Socratic Dialogue',
        action: 'AI uses questioning to guide learning',
        outcome: 'Deeper understanding through guided discovery',
        technicalDetails: 'Betty persona with Socratic method prompting'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Course Content', 'Notes', 'Flashcards']
  },
  {
    id: 'student-notes-flashcards',
    section: 'study',
    title: 'Notes & Flashcards',
    description: 'Note-taking and flashcard creation tools for active learning.',
    userPurpose: 'Organize learning materials, create study aids, review for assessments.',
    route: '/dashboard/learner/notes',
    component: 'Notes.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Note Editor',
        action: 'Create and organize notes',
        outcome: 'Rich text notes linked to courses',
        technicalDetails: 'Stores in student_notes table with course associations'
      },
      {
        element: 'Flashcard Creator',
        action: 'Build flashcard decks',
        outcome: 'Spaced repetition study tool',
        technicalDetails: 'student_flashcards with SM-2 algorithm for review scheduling'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Study Sessions', 'Course Materials']
  }
];
