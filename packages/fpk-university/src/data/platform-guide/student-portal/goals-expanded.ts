/**
 * Student Portal - Goals Section
 * Comprehensive documentation for student goals features
 */

import { GuideEntry } from '@/types/platform-guide';

export const studentGoalsGuide: GuideEntry[] = [
  {
    id: 'student-goals-dashboard-overview',
    section: 'goals',
    title: 'Goals Dashboard - Complete View',
    description: 'Comprehensive goals management interface showing personal and instructor-assigned goals with progress tracking and deadline monitoring.',
    userPurpose: 'Track learning objectives, see what instructors expect, maintain accountability, and create self-directed goals.',
    route: '/dashboard/learner/goals',
    component: 'Goals.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Goals Dashboard',
        action: 'Main container for all goal-related features',
        outcome: 'Displays GoalsDashboard component with full goal management',
        technicalDetails: 'GoalsDashboard component with useAuth and useGoalProgressTracking hooks'
      },
      {
        element: 'First Visit Tutorial',
        action: 'Video modal appears on first visit',
        outcome: 'Teaches students how to use goals system',
        technicalDetails: 'useFirstVisitVideo hook shows onboarding video for goals page'
      },
      {
        element: 'Help Button',
        action: 'Click to replay tutorial video',
        outcome: 'Manually opens instructional video',
        technicalDetails: 'PageHelpTrigger component allows re-watching'
      },
      {
        element: 'Loading State',
        action: 'While checking authentication',
        outcome: 'Shows loading spinner',
        technicalDetails: 'Conditional rendering based on user auth state'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Goals',
        source: 'organization_goals WHERE student_id=:userId AND visible_to_student=true',
        calculation: 'All goals visible to student (instructor-assigned + self-created)',
        significance: 'Complete list of learning objectives'
      }
    ],
    relatedFeatures: ['Goal Creation', 'Progress Tracking', 'Goal Reminders', 'Instructor Feedback']
  },
  {
    id: 'student-goals-list-view',
    section: 'goals',
    subsection: 'Goal Display',
    title: 'Goals List and Card View',
    description: 'Display of all active goals with filtering, progress indicators, and quick actions.',
    userPurpose: 'View all goals at once, filter by category or status, and see progress at a glance.',
    route: '/dashboard/learner/goals',
    component: 'GoalsDashboard component',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Goals Grid',
        action: 'Displays goals in card format',
        outcome: 'Visual layout of all goals with key information',
        technicalDetails: 'Grid of GoalCard components'
      },
      {
        element: 'Goal Card',
        action: 'Shows goal title, category, progress bar, due date',
        outcome: 'At-a-glance view of goal details',
        technicalDetails: 'Card component with goal metadata and visual indicators'
      },
      {
        element: 'Filter by Category',
        action: 'Select category filter (Academic, Behavioral, Social, etc.)',
        outcome: 'Shows only goals in selected category',
        technicalDetails: 'Client-side filtering of goals array'
      },
      {
        element: 'Filter by Status',
        action: 'Filter for Active, Completed, or All goals',
        outcome: 'Shows goals matching selected status',
        technicalDetails: 'WHERE status = :selectedStatus'
      },
      {
        element: 'Sort Options',
        action: 'Sort by due date, progress, or creation date',
        outcome: 'Reorders goals list',
        technicalDetails: 'Array sort based on selected field'
      }
    ],
    dataDisplayed: [
      {
        field: 'Goal Title',
        source: 'organization_goals.title',
        significance: 'Name of the learning objective'
      },
      {
        field: 'Goal Description',
        source: 'organization_goals.description',
        significance: 'Detailed explanation of what student should achieve'
      },
      {
        field: 'Category',
        source: 'organization_goals.category',
        significance: 'Type of goal (Academic, Behavioral, Social, IEP-related, etc.)'
      },
      {
        field: 'Progress Percentage',
        source: 'organization_goals.current_value and target_value',
        calculation: '(current_value / target_value) * 100',
        significance: 'How close to completion'
      },
      {
        field: 'Target Date',
        source: 'organization_goals.target_date',
        significance: 'Deadline for goal achievement'
      },
      {
        field: 'Created By',
        source: 'organization_goals.created_by',
        significance: 'Whether goal is instructor-assigned or self-created'
      },
      {
        field: 'Status',
        source: 'organization_goals.status',
        significance: 'active, completed, archived, on_hold'
      }
    ],
    relatedFeatures: ['Goal Details', 'Progress Updates', 'Goal Filters']
  },
  {
    id: 'student-goal-creation',
    section: 'goals',
    subsection: 'Goal Management',
    title: 'Create Personal Goals (Self-Directed)',
    description: 'Students can create their own learning goals if feature is enabled by organization.',
    userPurpose: 'Set personal learning objectives, practice self-directed learning, and take ownership of education.',
    route: '/dashboard/learner/goals',
    component: 'GoalCreationForm component',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Create Goal Button',
        action: 'Click to open goal creation form',
        outcome: 'Opens modal or form for new goal',
        technicalDetails: 'Conditional on org settings allow_student_goal_creation'
      },
      {
        element: 'Goal Form Fields',
        action: 'Enter goal title, description, category, target date, target value',
        outcome: 'Defines new personal goal',
        technicalDetails: 'Form with validation using react-hook-form and zod'
      },
      {
        element: 'Submit Goal',
        action: 'Click submit button',
        outcome: 'Creates new goal in database',
        technicalDetails: 'INSERT into organization_goals with created_by=student_id, visible_to_student=true'
      },
      {
        element: 'Category Selection',
        action: 'Choose from predefined categories or custom',
        outcome: 'Categorizes goal for filtering and organization',
        technicalDetails: 'Dropdown with standard categories + option for custom'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Goal Tracking', 'Self-Directed Learning', 'Goal Templates']
  },
  {
    id: 'student-goal-progress-update',
    section: 'goals',
    subsection: 'Progress Tracking',
    title: 'Goal Progress Updates',
    description: 'Manual and automatic progress updates for goals with visual feedback.',
    userPurpose: 'Track advancement toward goals, update progress manually, or have it auto-tracked from learning activities.',
    route: '/dashboard/learner/goals/:goalId',
    component: 'GoalProgressUpdate component',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Update Progress Button',
        action: 'Click to manually update progress',
        outcome: 'Opens progress update form',
        technicalDetails: 'Modal with current_value input field'
      },
      {
        element: 'Progress Input',
        action: 'Enter new progress value',
        outcome: 'Updates current_value in database',
        technicalDetails: 'UPDATE organization_goals SET current_value=:newValue, updated_at=NOW()'
      },
      {
        element: 'Auto-Progress Sync',
        action: 'For goals linked to course completion or XP, progress auto-updates',
        outcome: 'Progress syncs with actual performance',
        technicalDetails: 'Backend triggers or scheduled jobs sync goal progress with source data'
      },
      {
        element: 'Progress History',
        action: 'View timeline of progress updates',
        outcome: 'Shows how progress changed over time',
        technicalDetails: 'goal_progress_history table with timestamp snapshots'
      },
      {
        element: 'Celebration Animation',
        action: 'When goal reaches 100%, shows completion celebration',
        outcome: 'Positive reinforcement',
        technicalDetails: 'Confetti animation or success modal on completion'
      }
    ],
    dataDisplayed: [
      {
        field: 'Current Progress',
        source: 'organization_goals.current_value',
        significance: 'Current status toward goal'
      },
      {
        field: 'Target Value',
        source: 'organization_goals.target_value',
        significance: 'What needs to be achieved'
      },
      {
        field: 'Progress History',
        source: 'goal_progress_history',
        calculation: 'Timeline of updates',
        significance: 'Shows trend and rate of progress'
      }
    ],
    relatedFeatures: ['Goal Completion', 'Progress Analytics', 'Automated Goal Tracking']
  },
  {
    id: 'student-goal-reminders',
    section: 'goals',
    subsection: 'Notifications',
    title: 'Goal Reminders and Notifications',
    description: 'Automated reminders for goals approaching due dates or requiring attention.',
    userPurpose: 'Stay on track with goals through timely reminders and avoid missing deadlines.',
    route: '/dashboard/learner/goals',
    component: 'GoalReminders component',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Reminder Notifications',
        action: 'System sends reminders before goal due dates',
        outcome: 'Student receives notification (in-app, email, or both)',
        technicalDetails: 'Scheduled job checks goals with target_date within reminder_threshold days'
      },
      {
        element: 'Reminder Settings',
        action: 'Configure how many days before due date to receive reminders',
        outcome: 'Customizes reminder timing',
        technicalDetails: 'User preference stored in user_settings.goal_reminder_days'
      },
      {
        element: 'Overdue Goal Alerts',
        action: 'If goal passes target_date without completion',
        outcome: 'Shows urgent notification or banner',
        technicalDetails: 'WHERE target_date < NOW() AND status != \'completed\''
      },
      {
        element: 'Dismiss Reminder',
        action: 'Click to dismiss notification',
        outcome: 'Removes from notification list',
        technicalDetails: 'Updates notification.dismissed_at'
      }
    ],
    dataDisplayed: [
      {
        field: 'Upcoming Deadlines',
        source: 'organization_goals WHERE target_date BETWEEN NOW() AND NOW() + :reminder_days',
        significance: 'Goals needing attention soon'
      },
      {
        field: 'Overdue Goals',
        source: 'organization_goals WHERE target_date < NOW() AND status != \'completed\'',
        significance: 'Goals past deadline'
      }
    ],
    relatedFeatures: ['Notifications', 'Goal Tracking', 'Deadline Management']
  },
  {
    id: 'student-goal-details-view',
    section: 'goals',
    subsection: 'Goal Details',
    title: 'Goal Detail Page',
    description: 'Detailed view of a single goal with full description, progress history, instructor notes, and action items.',
    userPurpose: 'Deep dive into specific goal to understand requirements, see instructor feedback, and review progress timeline.',
    route: '/dashboard/learner/goals/:goalId',
    component: 'GoalDetailView component',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Goal Header',
        action: 'Shows goal title, category badge, status',
        outcome: 'Clear identification of goal',
        technicalDetails: 'Header with goal metadata'
      },
      {
        element: 'Full Description',
        action: 'Displays complete goal description and success criteria',
        outcome: 'Student understands exactly what is expected',
        technicalDetails: 'Rich text display of organization_goals.description'
      },
      {
        element: 'Progress Timeline',
        action: 'Visual timeline of progress updates',
        outcome: 'Shows progress trajectory over time',
        technicalDetails: 'Timeline component with goal_progress_history data'
      },
      {
        element: 'Instructor Notes Section',
        action: 'View notes/feedback from instructors',
        outcome: 'Guidance and feedback for improvement',
        technicalDetails: 'goal_notes WHERE visible_to_student=true'
      },
      {
        element: 'Related Resources',
        action: 'Shows courses, lessons, materials linked to goal',
        outcome: 'Access learning resources to achieve goal',
        technicalDetails: 'Links from goal_resources table'
      },
      {
        element: 'Action Items Checklist',
        action: 'Sub-tasks or milestones for goal',
        outcome: 'Break down goal into manageable steps',
        technicalDetails: 'goal_milestones table with checkboxes'
      }
    ],
    dataDisplayed: [
      {
        field: 'Goal Details',
        source: 'organization_goals full record',
        significance: 'All metadata about the goal'
      },
      {
        field: 'Progress History',
        source: 'goal_progress_history',
        significance: 'Timeline of changes'
      },
      {
        field: 'Instructor Feedback',
        source: 'goal_notes',
        significance: 'Guidance from instructors'
      },
      {
        field: 'Related Resources',
        source: 'goal_resources',
        significance: 'Supporting learning materials'
      }
    ],
    relatedFeatures: ['Progress Timeline', 'Instructor Notes', 'Resource Links']
  },
  {
    id: 'student-instructor-assigned-goals',
    section: 'goals',
    subsection: 'Goal Types',
    title: 'Instructor-Assigned Goals',
    description: 'Goals created by instructors and assigned to students, often tied to curriculum or IEP requirements.',
    userPurpose: 'Understand what instructors expect and work toward assigned learning objectives.',
    route: '/dashboard/learner/goals',
    component: 'Filtered goals list',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Assigned Goals Badge',
        action: 'Visual indicator showing goal is instructor-assigned',
        outcome: 'Distinguishes from self-created goals',
        technicalDetails: 'Badge component when created_by != student_id'
      },
      {
        element: 'Cannot Edit Assigned Goals',
        action: 'Edit button disabled or hidden for instructor goals',
        outcome: 'Students cannot modify instructor-set objectives',
        technicalDetails: 'Conditional rendering based on created_by field'
      },
      {
        element: 'Progress Updates Allowed',
        action: 'Students can still update progress on assigned goals',
        outcome: 'Track advancement even if goal is instructor-created',
        technicalDetails: 'Progress update permissions separate from edit permissions'
      }
    ],
    dataDisplayed: [
      {
        field: 'Instructor-Created Goals',
        source: 'organization_goals WHERE created_by != student_id AND visible_to_student=true',
        significance: 'Goals assigned by teachers'
      }
    ],
    relatedFeatures: ['IEP Goals', 'Course Goals', 'Instructor Feedback']
  }
];
