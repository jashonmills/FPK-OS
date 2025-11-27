/**
 * Student Portal - Dashboard Section
 * Comprehensive documentation for student dashboard features
 */

import { GuideEntry } from '@/types/platform-guide';

export const studentDashboardGuide: GuideEntry[] = [
  {
    id: 'student-dashboard-overview',
    section: 'dashboard',
    title: 'Student Dashboard Overview',
    description: 'Personal learning dashboard showing progress, achievements, and assigned courses with quick access to all learning tools.',
    userPurpose: 'Central hub for students to track their learning journey, see achievements, access courses, and get AI-powered insights.',
    route: '/dashboard/learner',
    component: 'LearnerHome.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Welcome Header',
        action: 'Shows personalized greeting with student name and time-based greeting',
        outcome: 'Creates welcoming, personalized experience that adapts throughout the day',
        technicalDetails: 'Uses DualLanguageText component with getGreeting() function for time-based messages (Good Morning/Afternoon/Evening)'
      },
      {
        element: 'Organization Banner',
        action: 'Displays school/organization branding',
        outcome: 'Shows student which organization they belong to with custom branding',
        technicalDetails: 'OrgBanner component pulls org_id from user metadata and displays organization info'
      },
      {
        element: 'Quick Access Bar',
        action: 'Provides one-click navigation to main features',
        outcome: 'Fast access to frequently used tools',
        technicalDetails: 'QuickAccessBar component with predefined routes to courses, goals, analytics, etc.'
      },
      {
        element: 'Page Help Trigger',
        action: 'Click to show tutorial/help video',
        outcome: 'Opens first-visit video modal or help content',
        technicalDetails: 'Uses useFirstVisitVideo hook to track if user has seen intro, stores in localStorage'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Name',
        source: 'auth.users.user_metadata OR student_profiles',
        significance: 'Personalizes the interface'
      },
      {
        field: 'Organization Affiliation',
        source: 'user_metadata.org_id -> organizations table',
        significance: 'Shows which school/org the student belongs to'
      }
    ],
    relatedFeatures: ['Quick Access Bar', 'AI Study Chat', 'Learning Analytics', 'Gamification Overview', 'Goals Overview', 'Recent Activity Feed']
  },
  {
    id: 'student-quick-access-bar',
    section: 'dashboard',
    subsection: 'Navigation',
    title: 'Quick Access Navigation Bar',
    description: 'Icon-based navigation bar providing instant access to the most commonly used student portal features.',
    userPurpose: 'Navigate quickly between courses, notes, goals, analytics, and other key features without using the main menu.',
    route: '/dashboard/learner',
    component: 'QuickAccessBar.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Quick Access Icons',
        action: 'Click icon to navigate to specific feature',
        outcome: 'Direct navigation to My Courses, Notes, Goals, Analytics, etc.',
        technicalDetails: 'Grid of icon buttons with react-router-dom navigation'
      },
      {
        element: 'Icon Hover States',
        action: 'Hover over icon',
        outcome: 'Shows tooltip with feature name',
        technicalDetails: 'Tooltip component displays feature description'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Dashboard Navigation', 'My Courses', 'Notes & Flashcards', 'Goals', 'Learning Analytics']
  },
  {
    id: 'student-ai-study-chat',
    section: 'dashboard',
    subsection: 'AI Assistant',
    title: 'AI Study Chat Interface',
    description: 'Real-time AI-powered chat interface embedded in dashboard for instant homework help and study guidance.',
    userPurpose: 'Get immediate help with learning questions, concept explanations, and study strategies without leaving the dashboard.',
    route: '/dashboard/learner',
    component: 'AIStudyChatInterface.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Chat Input Field',
        action: 'Type question or learning topic',
        outcome: 'AI responds with personalized explanations and guidance',
        technicalDetails: 'Uses Lovable AI with student context, course materials, and Socratic method prompting'
      },
      {
        element: 'Chat History',
        action: 'Scroll through previous conversations',
        outcome: 'Review past Q&A sessions',
        technicalDetails: 'Stores chat history in ai_chat_sessions table'
      },
      {
        element: 'Expand/Collapse Toggle',
        action: 'Click to expand chat to full view',
        outcome: 'Maximizes chat interface for focused conversation',
        technicalDetails: 'State-based UI expansion'
      }
    ],
    dataDisplayed: [
      {
        field: 'Chat Messages',
        source: 'ai_chat_sessions WHERE student_id=:userId',
        significance: 'Conversation history for context continuity'
      },
      {
        field: 'Student Context',
        source: 'Current courses, recent lessons, student profile',
        significance: 'Enables personalized AI responses based on learning context'
      }
    ],
    relatedFeatures: ['AI Study Coach', 'Course Materials', 'Notes']
  },
  {
    id: 'student-ai-insights',
    section: 'dashboard',
    subsection: 'AI Insights',
    title: 'AI-Powered Learning Insights',
    description: 'Intelligent analysis of student learning patterns with personalized recommendations and study tips.',
    userPurpose: 'Receive data-driven insights about study habits, learning efficiency, and areas for improvement.',
    route: '/dashboard/learner',
    component: 'AIInsightsSection.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Insight Cards',
        action: 'View AI-generated insights',
        outcome: 'Shows personalized learning recommendations',
        technicalDetails: 'AI analyzes session_analytics, course_progress, and study patterns'
      },
      {
        element: 'Refresh Insights Button',
        action: 'Click to regenerate insights',
        outcome: 'Gets latest analysis based on current data',
        technicalDetails: 'Triggers new AI analysis query'
      },
      {
        element: 'Action Suggestions',
        action: 'View recommended next steps',
        outcome: 'Provides specific actions to improve learning',
        technicalDetails: 'AI-generated suggestions based on performance data'
      }
    ],
    dataDisplayed: [
      {
        field: 'Study Pattern Analysis',
        source: 'session_analytics aggregated by time/course',
        calculation: 'AI identifies patterns in study frequency, duration, time-of-day',
        significance: 'Reveals optimal study times and consistency issues'
      },
      {
        field: 'Performance Trends',
        source: 'lesson_progress, assessment_results over time',
        calculation: 'AI detects improving/declining performance areas',
        significance: 'Early warning system for struggling subjects'
      },
      {
        field: 'Personalized Recommendations',
        source: 'AI analysis of all student data',
        significance: 'Actionable advice for better learning outcomes'
      }
    ],
    relatedFeatures: ['Learning Analytics', 'AI Study Coach', 'Study Sessions']
  },
  {
    id: 'student-learning-analytics-overview',
    section: 'dashboard',
    subsection: 'Analytics',
    title: 'Learning Analytics Overview Cards',
    description: 'Snapshot of key learning metrics displayed in card format on the dashboard.',
    userPurpose: 'Quick view of learning time, course progress, streaks, and XP without navigating to full analytics page.',
    route: '/dashboard/learner',
    component: 'LearningAnalyticsOverview.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Analytics Cards',
        action: 'View metrics at a glance',
        outcome: 'Shows Learning Time, Active Courses, Current Streak, Total XP, Level Progress',
        technicalDetails: 'Card grid with data from useStudentAnalytics and useGamificationContext hooks'
      },
      {
        element: 'Progress Bars',
        action: 'Visual completion indicators',
        outcome: 'Shows percentage progress for courses and level advancement',
        technicalDetails: 'Progress component with calculated percentages'
      },
      {
        element: 'Click Card for Details',
        action: 'Click analytics card',
        outcome: 'Navigates to full Learning Analytics page',
        technicalDetails: 'Router link to /dashboard/learner/analytics'
      }
    ],
    dataDisplayed: [
      {
        field: 'Learning Time This Week',
        source: 'session_analytics WHERE date >= :weekStart',
        calculation: 'SUM(session_duration) in hours',
        significance: 'Shows weekly engagement level'
      },
      {
        field: 'Active Courses Count',
        source: 'course_enrollments WHERE status=\'active\'',
        calculation: 'COUNT(*)',
        significance: 'Current course load'
      },
      {
        field: 'Average Course Progress',
        source: 'course_progress table',
        calculation: 'AVG((completed_lessons / total_lessons) * 100)',
        significance: 'Overall completion percentage across all courses'
      },
      {
        field: 'Current Study Streak',
        source: 'gamification_stats.current_streak',
        calculation: 'Days with consecutive learning activity',
        significance: 'Measures consistency and daily engagement'
      },
      {
        field: 'Total XP',
        source: 'gamification_stats.total_xp',
        significance: 'Cumulative experience points earned'
      },
      {
        field: 'Level Progress',
        source: 'gamification_stats',
        calculation: '(current_xp_in_level / xp_to_next_level) * 100',
        significance: 'Progress toward next level milestone'
      }
    ],
    relatedFeatures: ['Learning Analytics', 'Gamification', 'Study Sessions']
  },
  {
    id: 'student-gamification-overview',
    section: 'dashboard',
    subsection: 'Gamification',
    title: 'Gamification Overview Cards',
    description: 'Display of level, XP, study streak, and recent badges earned.',
    userPurpose: 'See game-like rewards and progression at a glance to maintain motivation.',
    route: '/dashboard/learner',
    component: 'GamificationOverview.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Level & XP Display',
        action: 'Shows current level and total XP',
        outcome: 'Visual representation of overall progress',
        technicalDetails: 'Data from gamification_stats table'
      },
      {
        element: 'Study Streak Counter',
        action: 'Displays consecutive days of learning',
        outcome: 'Flame icon with streak number encourages daily login',
        technicalDetails: 'current_streak field updated daily by backend'
      },
      {
        element: 'Recent Badges Display',
        action: 'Shows first 3 recently earned badges',
        outcome: 'Visual trophy display of recent achievements',
        technicalDetails: 'Query student_achievements ordered by earned_date DESC LIMIT 3'
      },
      {
        element: 'View All Link',
        action: 'Click to see full gamification page',
        outcome: 'Navigates to complete achievements page',
        technicalDetails: 'Router link to /dashboard/learner/gamification'
      }
    ],
    dataDisplayed: [
      {
        field: 'Current Level',
        source: 'gamification_stats.level',
        calculation: 'Based on total XP thresholds (level = floor(totalXP / 1000))',
        significance: 'Overall progression indicator'
      },
      {
        field: 'Total XP',
        source: 'gamification_stats.total_xp',
        calculation: 'Sum of all earned XP from lessons, quizzes, activities',
        significance: 'Cumulative achievement metric'
      },
      {
        field: 'Current Streak',
        source: 'gamification_stats.current_streak',
        calculation: 'Consecutive days with learning activity',
        refreshRate: 'Updated daily at first login',
        significance: 'Consistency and habit formation metric'
      },
      {
        field: 'Recent Badges',
        source: 'student_achievements JOIN achievement_definitions',
        calculation: 'Most recent 3 earned achievements',
        significance: 'Recognition of recent accomplishments'
      }
    ],
    relatedFeatures: ['Gamification Dashboard', 'Achievements', 'XP System', 'Leaderboards']
  },
  {
    id: 'student-goals-overview',
    section: 'dashboard',
    subsection: 'Goals',
    title: 'Goals Overview Cards',
    description: 'Summary of active learning goals with progress indicators displayed on dashboard.',
    userPurpose: 'Quick view of goals and their progress without navigating to full goals page.',
    route: '/dashboard/learner',
    component: 'GoalsOverview.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Active Goals List',
        action: 'Shows first 3 active goals',
        outcome: 'Displays goal title, category, progress bar, target date',
        technicalDetails: 'Filters organization_goals WHERE status=\'active\' AND visible_to_student=true LIMIT 3'
      },
      {
        element: 'Goal Progress Bar',
        action: 'Visual indicator of completion percentage',
        outcome: 'Shows how close student is to achieving goal',
        technicalDetails: 'Progress component with (current_value / target_value) * 100'
      },
      {
        element: 'View All Goals Button',
        action: 'Click to open full goals page',
        outcome: 'Navigates to complete goals dashboard',
        technicalDetails: 'Router link to /dashboard/learner/goals'
      },
      {
        element: 'Create First Goal (Empty State)',
        action: 'If no goals exist, shows button to create first goal',
        outcome: 'Navigates to goals page to create new goal',
        technicalDetails: 'Conditional rendering based on goals.length === 0'
      }
    ],
    dataDisplayed: [
      {
        field: 'Active Goals',
        source: 'organization_goals WHERE student_id=:userId AND status=\'active\' AND visible_to_student=true',
        calculation: 'First 3 goals ordered by target_date',
        significance: 'Current learning objectives student is working toward'
      },
      {
        field: 'Goal Progress',
        source: 'organization_goals.current_value and target_value',
        calculation: '(current_value / target_value) * 100',
        significance: 'Percentage completion for each goal'
      },
      {
        field: 'Target Date',
        source: 'organization_goals.target_date',
        significance: 'Deadline for goal completion'
      },
      {
        field: 'Goal Category',
        source: 'organization_goals.category',
        significance: 'Type of goal (Academic, Behavioral, Social, etc.)'
      }
    ],
    relatedFeatures: ['Goals Dashboard', 'Goal Tracking', 'Progress Monitoring']
  },
  {
    id: 'student-recent-activity-feed',
    section: 'dashboard',
    subsection: 'Activity',
    title: 'Recent Activity Feed',
    description: 'Chronological list of recent learning activities, achievements, and course interactions.',
    userPurpose: 'Review recent learning history to see what has been accomplished and maintain awareness of progress.',
    route: '/dashboard/learner',
    component: 'RecentActivityFeed.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Activity Timeline',
        action: 'Scroll through recent activities',
        outcome: 'Shows lessons completed, achievements earned, goals updated, etc.',
        technicalDetails: 'Aggregates data from multiple tables (course_progress, student_achievements, goal_progress) ordered by timestamp'
      },
      {
        element: 'Activity Item Click',
        action: 'Click on activity item',
        outcome: 'Navigates to related content (course, goal, achievement)',
        technicalDetails: 'Dynamic routing based on activity type'
      },
      {
        element: 'Activity Type Icons',
        action: 'Visual indicators for activity type',
        outcome: 'Quickly identify type of activity (lesson, badge, goal, etc.)',
        technicalDetails: 'Icon mapping based on activity_type field'
      }
    ],
    dataDisplayed: [
      {
        field: 'Activity Entries',
        source: 'Aggregated from course_progress, student_achievements, organization_goals',
        calculation: 'Recent 10-20 activities ordered by timestamp DESC',
        significance: 'Comprehensive view of recent learning engagement'
      },
      {
        field: 'Activity Timestamps',
        source: 'created_at or updated_at fields',
        calculation: 'Relative time display (e.g., "2 hours ago")',
        significance: 'Shows recency of engagement'
      }
    ],
    relatedFeatures: ['Activity History', 'Progress Tracking', 'Achievements']
  },
  {
    id: 'student-beta-feedback',
    section: 'dashboard',
    subsection: 'Feedback',
    title: 'Beta Feedback System',
    description: 'In-dashboard feedback collection system for beta users to report issues and suggest improvements.',
    userPurpose: 'Provide feedback directly from dashboard to help improve the platform.',
    route: '/dashboard/learner',
    component: 'FeedbackSystem.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Feedback Button',
        action: 'Click to open feedback form',
        outcome: 'Opens modal or panel for submitting feedback',
        technicalDetails: 'Conditional rendering for beta users only'
      },
      {
        element: 'Feedback Form',
        action: 'Submit bug report, feature request, or general feedback',
        outcome: 'Sends feedback to feedback_submissions table',
        technicalDetails: 'Form validation and submission via Supabase'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Support System', 'Bug Reporting']
  },
  {
    id: 'student-first-visit-video',
    section: 'dashboard',
    subsection: 'Onboarding',
    title: 'First Visit Tutorial Video',
    description: 'Introductory video modal that appears on first dashboard visit to orient new students.',
    userPurpose: 'Help new students understand how to use the dashboard and where to find key features.',
    route: '/dashboard/learner',
    component: 'FirstVisitVideoModal',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Video Modal',
        action: 'Automatically opens on first visit',
        outcome: 'Plays tutorial video explaining dashboard features',
        technicalDetails: 'useFirstVisitVideo hook checks localStorage for has_seen_dashboard_video'
      },
      {
        element: 'Skip/Close Button',
        action: 'Close video modal',
        outcome: 'Dismisses video and marks as seen',
        technicalDetails: 'Sets localStorage flag to prevent showing again'
      },
      {
        element: 'Help Trigger Button',
        action: 'Click help icon in header',
        outcome: 'Manually reopens tutorial video',
        technicalDetails: 'PageHelpTrigger component allows re-watching video'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Platform Guide', 'Help System', 'Onboarding']
  }
];
