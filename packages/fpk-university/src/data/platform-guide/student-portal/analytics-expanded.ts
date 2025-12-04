/**
 * Student Portal - Analytics Section
 * Comprehensive documentation for student analytics features
 */

import { GuideEntry } from '@/types/platform-guide';

export const studentAnalyticsGuide: GuideEntry[] = [
  {
    id: 'student-analytics-dashboard',
    section: 'analytics',
    title: 'Learning Analytics Dashboard - Complete View',
    description: 'Comprehensive analytics interface showing personal learning statistics, time spent, course performance, strengths, and areas for improvement.',
    userPurpose: 'Gain self-awareness about learning patterns, identify strong subjects, find areas needing focus, and optimize study strategies.',
    route: '/dashboard/learner/analytics',
    component: 'LearningAnalytics.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Analytics Overview Cards',
        action: 'Display key metrics in card format',
        outcome: 'At-a-glance view of learning stats',
        technicalDetails: 'Card grid with metrics from useStudentAnalytics hook'
      },
      {
        element: 'Time Period Selector',
        action: 'Choose date range (week, month, quarter, year, all time)',
        outcome: 'Filters analytics data to selected period',
        technicalDetails: 'State-based filtering of analytics queries'
      },
      {
        element: 'Export Data Button',
        action: 'Download analytics as CSV or PDF',
        outcome: 'Generates report file',
        technicalDetails: 'Client-side data export using papaparse or PDF generation'
      },
      {
        element: 'Refresh Analytics',
        action: 'Manually refresh data',
        outcome: 'Queries latest analytics from database',
        technicalDetails: 'Triggers refetch on useQuery hook'
      }
    ],
    dataDisplayed: [
      {
        field: 'Total Learning Time',
        source: 'session_analytics',
        calculation: 'SUM(session_duration) for selected period',
        refreshRate: 'Real-time (updated after each session)',
        significance: 'Overall engagement metric'
      },
      {
        field: 'Average Daily Study Time',
        source: 'session_analytics',
        calculation: 'SUM(session_duration) / number_of_days',
        significance: 'Consistency indicator'
      },
      {
        field: 'Active Courses',
        source: 'course_enrollments WHERE status=\'active\'',
        calculation: 'COUNT(*)',
        significance: 'Current course load'
      },
      {
        field: 'Completed Courses',
        source: 'course_enrollments WHERE status=\'completed\'',
        calculation: 'COUNT(*)',
        significance: 'Achievement count'
      }
    ],
    relatedFeatures: ['Study Sessions', 'Performance Reports', 'Time Management', 'Course Analytics']
  },
  {
    id: 'student-time-analytics',
    section: 'analytics',
    subsection: 'Time Tracking',
    title: 'Study Time Analytics and Charts',
    description: 'Visual charts showing study time distribution over days, weeks, and months with pattern analysis.',
    userPurpose: 'Understand when and how much time is spent learning to optimize study schedule.',
    route: '/dashboard/learner/analytics',
    component: 'TimeChartsSection',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Daily Time Chart',
        action: 'Bar chart showing hours per day',
        outcome: 'Visualizes daily study patterns',
        technicalDetails: 'Recharts BarChart with session_analytics grouped by date'
      },
      {
        element: 'Weekly Time Chart',
        action: 'Shows study time by day of week',
        outcome: 'Identifies which days student studies most',
        technicalDetails: 'BarChart grouped by weekday'
      },
      {
        element: 'Time by Course',
        action: 'Pie or bar chart showing time distribution across courses',
        outcome: 'See which courses get most attention',
        technicalDetails: 'PieChart or BarChart with session_analytics grouped by course_id'
      },
      {
        element: 'Study Session History',
        action: 'List of recent study sessions',
        outcome: 'Detailed view of when and what was studied',
        technicalDetails: 'Table with session_analytics records'
      },
      {
        element: 'Peak Study Times',
        action: 'Heatmap or chart showing best performing time of day',
        outcome: 'Identifies optimal study hours',
        technicalDetails: 'Analysis of session_analytics.start_time hour distribution'
      }
    ],
    dataDisplayed: [
      {
        field: 'Session Duration',
        source: 'session_analytics.session_duration',
        calculation: 'Duration in minutes per session',
        significance: 'How long each study session lasted'
      },
      {
        field: 'Session Start/End Times',
        source: 'session_analytics.start_time, end_time',
        significance: 'When study sessions occurred'
      },
      {
        field: 'Time by Subject',
        source: 'session_analytics grouped by course',
        calculation: 'SUM(session_duration) per course',
        significance: 'Time allocation across subjects'
      }
    ],
    relatedFeatures: ['Study Session Tracker', 'Time Management', 'Engagement Analytics']
  },
  {
    id: 'student-course-performance',
    section: 'analytics',
    subsection: 'Performance',
    title: 'Course Performance Analytics',
    description: 'Grades, scores, and completion rates by course with trend analysis.',
    userPurpose: 'Identify academic strengths and weaknesses to focus study efforts.',
    route: '/dashboard/learner/analytics',
    component: 'CoursePerformanceSection',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Course Performance Cards',
        action: 'Shows grade/score for each active course',
        outcome: 'At-a-glance performance overview',
        technicalDetails: 'Cards with average_score from assessment_results per course'
      },
      {
        element: 'Performance Trend Chart',
        action: 'Line chart showing score trends over time',
        outcome: 'Visualizes improving or declining performance',
        technicalDetails: 'LineChart with assessment_results.score over time'
      },
      {
        element: 'Strength/Weakness Analysis',
        action: 'Highlights best and worst performing subjects',
        outcome: 'Identifies where to focus improvement efforts',
        technicalDetails: 'AI or statistical analysis of performance data'
      },
      {
        element: 'Compare to Class Average',
        action: 'Shows how student performance compares to peers',
        outcome: 'Context for understanding relative performance',
        technicalDetails: 'AVG(assessment_results.score) for cohort vs. student score'
      }
    ],
    dataDisplayed: [
      {
        field: 'Course Grades',
        source: 'assessment_results grouped by course_id',
        calculation: 'AVG(score) per course',
        significance: 'Overall grade in each course'
      },
      {
        field: 'Quiz/Assessment Scores',
        source: 'assessment_results',
        significance: 'Individual test scores'
      },
      {
        field: 'Completion Rates',
        source: 'course_progress.progress_percentage',
        significance: 'How far through each course'
      },
      {
        field: 'Performance Trends',
        source: 'assessment_results over time',
        calculation: 'Linear regression or moving average of scores',
        significance: 'Whether performance is improving or declining'
      }
    ],
    relatedFeatures: ['Grades', 'Assessment Results', 'Course Progress']
  },
  {
    id: 'student-streak-analytics',
    section: 'analytics',
    subsection: 'Engagement',
    title: 'Study Streak and Consistency Tracking',
    description: 'Daily streak tracking, longest streak records, and consistency metrics.',
    userPurpose: 'Build consistent study habits and stay motivated through streak challenges.',
    route: '/dashboard/learner/analytics',
    component: 'StreakAnalyticsSection',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Current Streak Display',
        action: 'Shows consecutive days of learning activity',
        outcome: 'Motivates daily engagement',
        technicalDetails: 'gamification_stats.current_streak with flame icon'
      },
      {
        element: 'Longest Streak Record',
        action: 'Displays all-time best streak',
        outcome: 'Personal best to aim for',
        technicalDetails: 'gamification_stats.longest_streak'
      },
      {
        element: 'Streak Calendar',
        action: 'Calendar heatmap showing active days',
        outcome: 'Visual pattern of engagement',
        technicalDetails: 'Calendar component with session_analytics dates highlighted'
      },
      {
        element: 'Streak Protection Info',
        action: 'Shows if user has streak freeze/protection',
        outcome: 'Explains how streaks are maintained',
        technicalDetails: 'Display of user_settings.streak_freeze_available'
      }
    ],
    dataDisplayed: [
      {
        field: 'Current Streak',
        source: 'gamification_stats.current_streak',
        calculation: 'Days with consecutive activity',
        refreshRate: 'Updated daily on first login',
        significance: 'Active streak for motivation'
      },
      {
        field: 'Longest Streak',
        source: 'gamification_stats.longest_streak',
        significance: 'Personal best record'
      },
      {
        field: 'Activity Calendar',
        source: 'session_analytics dates',
        calculation: 'Date list of all days with learning activity',
        significance: 'Historical engagement pattern'
      }
    ],
    relatedFeatures: ['Gamification', 'Daily Goals', 'Habit Building']
  },
  {
    id: 'student-reading-progress',
    section: 'analytics',
    subsection: 'Reading',
    title: 'Reading Progress and E-Book Analytics',
    description: 'Tracking for e-book reading progress, pages read, time spent reading, and reading speed.',
    userPurpose: 'Monitor reading assignments and track reading habits.',
    route: '/dashboard/learner/analytics',
    component: 'ReadingProgressWidget',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Books in Progress',
        action: 'List of currently reading e-books',
        outcome: 'Shows reading status for each book',
        technicalDetails: 'ebook_progress WHERE status=\'in_progress\''
      },
      {
        element: 'Pages Read',
        action: 'Total pages read across all books',
        outcome: 'Cumulative reading achievement',
        technicalDetails: 'SUM(pages_read) from ebook_progress'
      },
      {
        element: 'Reading Speed',
        action: 'Calculates pages per hour',
        outcome: 'Reading efficiency metric',
        technicalDetails: 'pages_read / hours_spent'
      },
      {
        element: 'Book Progress Bars',
        action: 'Visual indicators of completion',
        outcome: 'See how far through each book',
        technicalDetails: '(current_page / total_pages) * 100'
      }
    ],
    dataDisplayed: [
      {
        field: 'Reading Progress',
        source: 'ebook_progress',
        calculation: 'current_page, total_pages, percentage complete',
        significance: 'Progress through e-books'
      },
      {
        field: 'Time Spent Reading',
        source: 'ebook_progress.time_spent or session_analytics filtered by reading',
        significance: 'Engagement with reading materials'
      }
    ],
    relatedFeatures: ['E-Books', 'Course Materials', 'Reading Assignments']
  },
  {
    id: 'student-xp-level-analytics',
    section: 'analytics',
    subsection: 'Gamification',
    title: 'XP and Level Progression Analytics',
    description: 'Experience points earned, level progression, XP sources, and advancement rate.',
    userPurpose: 'Understand how XP is earned and track progress toward next level.',
    route: '/dashboard/learner/analytics',
    component: 'XPAnalyticsSection',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'XP Progress Bar',
        action: 'Shows XP toward next level',
        outcome: 'Visual motivation for continued learning',
        technicalDetails: '(current_level_xp / xp_to_next_level) * 100'
      },
      {
        element: 'XP Breakdown',
        action: 'Pie chart showing XP sources (lessons, quizzes, achievements, etc.)',
        outcome: 'Understand what activities earn most XP',
        technicalDetails: 'xp_history grouped by source_type'
      },
      {
        element: 'Level History',
        action: 'Timeline of level-ups',
        outcome: 'See progression over time',
        technicalDetails: 'xp_history WHERE event_type=\'level_up\''
      },
      {
        element: 'XP Earning Rate',
        action: 'Calculates average XP per day/week',
        outcome: 'Shows rate of advancement',
        technicalDetails: 'SUM(xp_earned) / time_period'
      }
    ],
    dataDisplayed: [
      {
        field: 'Total XP',
        source: 'gamification_stats.total_xp',
        significance: 'Lifetime XP earned'
      },
      {
        field: 'Current Level',
        source: 'gamification_stats.level',
        calculation: 'Based on total XP thresholds',
        significance: 'Current progression tier'
      },
      {
        field: 'XP to Next Level',
        source: 'gamification_stats.xp_to_next_level',
        calculation: 'Remaining XP needed',
        significance: 'Distance to next milestone'
      },
      {
        field: 'XP Sources',
        source: 'xp_history.source_type',
        calculation: 'Breakdown by lesson_completion, quiz, achievement, etc.',
        significance: 'What activities are most rewarding'
      }
    ],
    relatedFeatures: ['Gamification', 'Achievements', 'Level System']
  }
];
