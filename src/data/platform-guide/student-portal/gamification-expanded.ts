/**
 * Student Portal - Gamification Section
 * Comprehensive documentation for student gamification features
 */

import { GuideEntry } from '@/types/platform-guide';

export const studentGamificationGuide: GuideEntry[] = [
  {
    id: 'student-gamification-dashboard',
    section: 'gamification',
    title: 'Gamification Dashboard - Complete Overview',
    description: 'Central hub for XP, levels, badges, achievements, and gamified learning rewards with goal tracking integration.',
    userPurpose: 'Motivate through game-like rewards, provide sense of progression beyond grades, track achievements, and manage learning goals.',
    route: '/dashboard/learner/gamification',
    component: 'Gamification.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Gamification Tabs',
        action: 'Switch between "My Goals" and "Achievements" tabs',
        outcome: 'Organizes goal tracking and achievement viewing',
        technicalDetails: 'Tabs component with two main sections'
      },
      {
        element: 'Goal XP Tracker',
        action: 'Prominent display of XP and level at top',
        outcome: 'Shows overall progression status',
        technicalDetails: 'GoalXPTracker component with gamification_stats data'
      },
      {
        element: 'First Visit Tutorial',
        action: 'Video modal on first page visit',
        outcome: 'Explains how gamification system works',
        technicalDetails: 'useFirstVisitVideo hook with gamification explainer'
      },
      {
        element: 'Help Button',
        action: 'Click to replay tutorial',
        outcome: 'Manually shows instructional video',
        technicalDetails: 'PageHelpTrigger component'
      }
    ],
    dataDisplayed: [
      {
        field: 'Total XP',
        source: 'gamification_stats.total_xp',
        significance: 'Overall experience points earned'
      },
      {
        field: 'Current Level',
        source: 'gamification_stats.level',
        calculation: 'Based on XP thresholds',
        significance: 'Current tier in progression system'
      }
    ],
    relatedFeatures: ['XP System', 'Achievements', 'Badges', 'Leaderboards', 'Goals']
  },
  {
    id: 'student-goal-xp-tracker',
    section: 'gamification',
    subsection: 'XP System',
    title: 'Goal XP Tracker Widget',
    description: 'Prominent widget showing current level, total XP, and progress bar to next level.',
    userPurpose: 'Visual motivation for continued learning and clear indication of progression.',
    route: '/dashboard/learner/gamification',
    component: 'GoalXPTracker',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Level Display',
        action: 'Shows current level number with badge/icon',
        outcome: 'Clear indication of progression tier',
        technicalDetails: 'Large text display with level icon'
      },
      {
        element: 'XP Progress Bar',
        action: 'Animated progress bar to next level',
        outcome: 'Visual feedback on advancement',
        technicalDetails: 'Progress component with (current_level_xp / xp_to_next_level) * 100'
      },
      {
        element: 'XP Numbers',
        action: 'Shows "X / Y XP to Level Z"',
        outcome: 'Exact progress numbers',
        technicalDetails: 'Text display of current_level_xp, xp_to_next_level, next_level'
      },
      {
        element: 'Recent XP Gains',
        action: 'Shows recent XP awards (optional)',
        outcome: 'Feedback on what actions earned XP',
        technicalDetails: 'Query xp_history recent entries'
      }
    ],
    dataDisplayed: [
      {
        field: 'Current Level',
        source: 'gamification_stats.level',
        significance: 'Current progression tier'
      },
      {
        field: 'Total XP',
        source: 'gamification_stats.total_xp',
        significance: 'Lifetime experience points'
      },
      {
        field: 'XP in Current Level',
        source: 'gamification_stats.current_level_xp',
        calculation: 'XP earned toward current level',
        significance: 'Progress in this tier'
      },
      {
        field: 'XP to Next Level',
        source: 'gamification_stats.xp_to_next_level',
        calculation: 'Remaining XP needed',
        significance: 'Distance to next milestone'
      }
    ],
    relatedFeatures: ['Level System', 'XP Earning', 'Progress Tracking']
  },
  {
    id: 'student-my-goals-tab',
    section: 'gamification',
    subsection: 'Goals Integration',
    title: 'My Goals Tab in Gamification',
    description: 'Goal tracking section within gamification page showing goals overview, active goals, reading progress, and reminders.',
    userPurpose: 'Integrate goal management with gamification system to connect learning objectives with rewards.',
    route: '/dashboard/learner/gamification#my-goals',
    component: 'Gamification.tsx - My Goals tab',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Simple Goals Overview',
        action: 'Quick summary of goal stats',
        outcome: 'Shows active goals count and completion stats',
        technicalDetails: 'SimpleGoalsOverview component with summary metrics'
      },
      {
        element: 'Active Learning Goals',
        action: 'List of current learning goals',
        outcome: 'Displays goals with progress bars',
        technicalDetails: 'ActiveLearningGoals component showing active organization_goals'
      },
      {
        element: 'Reading Progress Widget',
        action: 'Shows e-book reading status',
        outcome: 'Displays books in progress and reading stats',
        technicalDetails: 'ReadingProgressWidget component with ebook_progress data'
      },
      {
        element: 'Goal Reminders',
        action: 'Lists upcoming goal deadlines',
        outcome: 'Alerts student to goals needing attention',
        technicalDetails: 'GoalReminders component with goals near target_date'
      }
    ],
    dataDisplayed: [
      {
        field: 'Active Goals',
        source: 'organization_goals WHERE status=\'active\' AND visible_to_student=true',
        significance: 'Current learning objectives'
      },
      {
        field: 'Goal Progress',
        source: 'organization_goals.current_value, target_value',
        calculation: 'Percentage completion per goal',
        significance: 'Advancement toward objectives'
      },
      {
        field: 'Upcoming Deadlines',
        source: 'organization_goals.target_date',
        significance: 'Goals requiring attention soon'
      }
    ],
    relatedFeatures: ['Goals Dashboard', 'Progress Tracking', 'Reminders']
  },
  {
    id: 'student-achievements-tab',
    section: 'gamification',
    subsection: 'Achievements',
    title: 'Achievements Tab - Complete Dashboard',
    description: 'Comprehensive view of earned badges, achievements, and unlockable rewards.',
    userPurpose: 'View all earned and available achievements, understand how to unlock them, and showcase accomplishments.',
    route: '/dashboard/learner/gamification#achievements',
    component: 'GamificationDashboard',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Achievements Grid',
        action: 'Displays all achievements (earned and locked)',
        outcome: 'Visual collection of badges',
        technicalDetails: 'Grid layout with BadgeDisplay component'
      },
      {
        element: 'Earned Badges',
        action: 'Shows unlocked achievements with color and date',
        outcome: 'Recognition of accomplishments',
        technicalDetails: 'student_achievements with earned badges highlighted'
      },
      {
        element: 'Locked Achievements',
        action: 'Grayed-out badges showing requirements',
        outcome: 'Goals to work toward',
        technicalDetails: 'achievement_definitions WHERE id NOT IN (earned achievements)'
      },
      {
        element: 'Achievement Details',
        action: 'Click badge for full description and unlock criteria',
        outcome: 'Understand how to earn achievement',
        technicalDetails: 'Modal or expandable card with achievement_definitions.description'
      },
      {
        element: 'Filter by Category',
        action: 'Filter achievements by type (Academic, Streak, Social, etc.)',
        outcome: 'Focus on specific achievement categories',
        technicalDetails: 'Client-side filtering by achievement_definitions.category'
      },
      {
        element: 'Rarity Indicators',
        action: 'Shows badge rarity (common, rare, epic, legendary)',
        outcome: 'Highlights special achievements',
        technicalDetails: 'Color-coded badges based on rarity field'
      }
    ],
    dataDisplayed: [
      {
        field: 'Earned Achievements',
        source: 'student_achievements WHERE student_id=:userId',
        significance: 'Badges unlocked by student'
      },
      {
        field: 'Available Achievements',
        source: 'achievement_definitions',
        significance: 'All possible badges in system'
      },
      {
        field: 'Unlock Criteria',
        source: 'achievement_definitions.unlock_criteria',
        significance: 'What student must do to earn badge'
      },
      {
        field: 'Earned Date',
        source: 'student_achievements.earned_at',
        significance: 'When achievement was unlocked'
      },
      {
        field: 'Achievement Rarity',
        source: 'achievement_definitions.rarity',
        significance: 'How difficult/special the achievement is'
      }
    ],
    relatedFeatures: ['Badge System', 'XP System', 'Progress Tracking']
  },
  {
    id: 'student-xp-earning-system',
    section: 'gamification',
    subsection: 'XP Mechanics',
    title: 'XP Earning System',
    description: 'How experience points are awarded for various learning activities.',
    userPurpose: 'Understand what actions earn XP to maximize rewards and progression.',
    route: '/dashboard/learner/gamification',
    component: 'Part of gamification system',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'XP Award Notifications',
        action: 'Toast notifications when XP is earned',
        outcome: 'Immediate feedback for actions',
        technicalDetails: 'Toast component triggered by XP events'
      },
      {
        element: 'XP History Log',
        action: 'View all XP transactions',
        outcome: 'Detailed record of XP earned',
        technicalDetails: 'xp_history table with timestamp, amount, source'
      },
      {
        element: 'XP Multipliers',
        action: 'Special events or achievements that boost XP gain',
        outcome: 'Extra XP during promotions or streaks',
        technicalDetails: 'Multiplier field in user_settings or event_config'
      }
    ],
    dataDisplayed: [
      {
        field: 'XP Sources',
        source: 'xp_history.source_type',
        significance: 'What activities award XP (lesson_completion, quiz, achievement, streak_bonus, etc.)'
      },
      {
        field: 'XP Amounts',
        source: 'xp_history.xp_earned',
        significance: 'How much XP each activity awards'
      },
      {
        field: 'XP Transaction History',
        source: 'xp_history',
        significance: 'Complete log of all XP earned'
      }
    ],
    relatedFeatures: ['Level System', 'Achievements', 'Activity Tracking']
  },
  {
    id: 'student-level-system',
    section: 'gamification',
    subsection: 'Levels',
    title: 'Level Progression System',
    description: 'Tiered level system with increasing XP requirements and level-up rewards.',
    userPurpose: 'Long-term progression metric that showcases learning commitment.',
    route: '/dashboard/learner/gamification',
    component: 'Part of gamification system',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Level-Up Celebration',
        action: 'When reaching new level, shows celebration animation',
        outcome: 'Positive reinforcement for achievement',
        technicalDetails: 'Confetti or modal animation on level_up event'
      },
      {
        element: 'Level Badges',
        action: 'Each level has associated badge/icon',
        outcome: 'Visual representation of level',
        technicalDetails: 'Icon mapping or badge images for each level tier'
      },
      {
        element: 'Level Rewards',
        action: 'Unlocks features or bonuses at certain levels',
        outcome: 'Incentivizes continued progression',
        technicalDetails: 'Feature flags or rewards based on user level'
      }
    ],
    dataDisplayed: [
      {
        field: 'Current Level',
        source: 'gamification_stats.level',
        calculation: 'floor(total_xp / 1000) or custom level thresholds',
        significance: 'Current progression tier'
      },
      {
        field: 'XP Requirements',
        source: 'level_definitions table or calculation',
        significance: 'XP needed for each level'
      },
      {
        field: 'Level Perks',
        source: 'level_definitions.rewards',
        significance: 'What is unlocked at each level'
      }
    ],
    relatedFeatures: ['XP System', 'Rewards', 'Progression']
  },
  {
    id: 'student-leaderboards',
    section: 'gamification',
    subsection: 'Social',
    title: 'Leaderboards (Optional Feature)',
    description: 'Competitive rankings showing top students by XP, streaks, or achievements.',
    userPurpose: 'Social motivation through friendly competition with peers.',
    route: '/dashboard/learner/gamification/leaderboards',
    component: 'Leaderboards component',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'XP Leaderboard',
        action: 'Ranks students by total XP',
        outcome: 'Shows top learners',
        technicalDetails: 'Query gamification_stats ORDER BY total_xp DESC'
      },
      {
        element: 'Streak Leaderboard',
        action: 'Ranks by longest current streak',
        outcome: 'Highlights most consistent learners',
        technicalDetails: 'ORDER BY current_streak DESC'
      },
      {
        element: 'Class vs. Global Leaderboards',
        action: 'Toggle between class-only and entire organization',
        outcome: 'Relevant comparison groups',
        technicalDetails: 'Filter by org_id or group_id'
      },
      {
        element: 'Privacy Settings',
        action: 'Opt in/out of leaderboards',
        outcome: 'Student controls visibility',
        technicalDetails: 'user_settings.show_on_leaderboard boolean'
      }
    ],
    dataDisplayed: [
      {
        field: 'Leaderboard Rankings',
        source: 'gamification_stats with privacy filters',
        calculation: 'Ordered by selected metric (XP, streak, etc.)',
        significance: 'Competitive standings'
      },
      {
        field: 'User\'s Rank',
        source: 'Student\'s position in leaderboard',
        significance: 'Where student stands among peers'
      }
    ],
    relatedFeatures: ['XP System', 'Streaks', 'Social Features']
  }
];
