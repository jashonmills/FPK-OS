/**
 * Organization Owner Dashboard - Complete Feature Guide
 * Route: /org/:orgId
 * Component: OrgPortalHome.tsx
 */

import { GuideEntry } from '@/types/platform-guide';

export const dashboardGuide: GuideEntry[] = [
  {
    id: 'dashboard-overview',
    section: 'dashboard',
    title: 'Dashboard Overview',
    description: 'The main hub for organization owners and instructors to monitor student progress, course assignments, and organizational metrics at a glance.',
    userPurpose: 'Provides immediate visibility into organizational health, student engagement, and key performance indicators. Serves as the command center for daily management tasks.',
    route: '/org/:orgId',
    component: 'OrgPortalHome.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Organization Welcome Header',
        action: 'Displays organization branding',
        outcome: 'Confirms context - which organization you are managing',
        technicalDetails: 'Fetched via useOrgContext() hook from organization_members JOIN organizations'
      }
    ],
    dataDisplayed: [
      {
        field: 'Organization Name',
        source: 'organizations table',
        significance: 'Provides immediate context and confirmation of which organization is being managed'
      },
      {
        field: 'User Role Badge',
        source: 'organization_members.role',
        significance: 'Shows current user\'s permission level (Owner, Admin, Instructor, Instructor Aide)'
      }
    ],
    relatedFeatures: ['Organization Settings', 'Branding Management', 'User Roles']
  },
  {
    id: 'dashboard-total-students',
    section: 'dashboard',
    subsection: 'Statistics Grid',
    title: 'Total Students Card',
    description: 'Displays the total number of active students enrolled in the organization with capacity monitoring.',
    userPurpose: 'Monitor enrollment levels against subscription tier limits. Quickly identify if approaching capacity constraints or if there is room for growth.',
    route: '/org/:orgId',
    component: 'OrgPortalHome.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Total Students Count',
        action: 'Displays numeric count of active students',
        outcome: 'Shows current enrollment level',
        technicalDetails: 'COUNT(*) from organization_members WHERE role=\'student\' AND status=\'active\''
      },
      {
        element: '+ Add Student Button (Zero State)',
        action: 'Appears when student count is 0',
        outcome: 'Navigates to /org/:orgId/students to begin adding students',
        technicalDetails: 'Conditional render based on student count'
      },
      {
        element: 'Card Click',
        action: 'Click anywhere on card',
        outcome: 'Navigates to Students tab for detailed roster view',
        technicalDetails: 'Router navigation to /org/:orgId/students'
      }
    ],
    dataDisplayed: [
      {
        field: 'Active Student Count',
        source: 'organization_members table',
        calculation: 'COUNT(*) WHERE role=\'student\' AND status=\'active\'',
        refreshRate: 'Real-time (updates on page load)',
        significance: 'Critical metric for subscription management and capacity planning'
      },
      {
        field: 'Seats Used vs Seat Cap',
        source: 'organizations.seats_used, organizations.seat_cap',
        calculation: 'Comparison between current enrollment and subscription limit',
        significance: 'Prevents over-enrollment and triggers upgrade prompts when nearing capacity'
      }
    ],
    relatedFeatures: ['Students Tab', 'Subscription Management', 'Add Student Flow', 'Invitation System']
  },
  {
    id: 'dashboard-course-assignments',
    section: 'dashboard',
    subsection: 'Statistics Grid',
    title: 'Course Assignments Card',
    description: 'Shows total number of course assignments across all students in the organization.',
    userPurpose: 'Track how actively courses are being utilized. Identify if instructors need to assign more learning content or if assignment load is appropriate.',
    route: '/org/:orgId',
    component: 'OrgPortalHome.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Assignment Count',
        action: 'Displays total course assignments',
        outcome: 'Shows aggregate assignment activity',
        technicalDetails: 'COUNT(*) from organization_course_assignments'
      },
      {
        element: '+ Assign Course Button (Zero State)',
        action: 'Appears when no courses assigned',
        outcome: 'Navigates to /org/:orgId/courses for course catalog',
        technicalDetails: 'Conditional CTA based on assignment count'
      },
      {
        element: 'Card Click',
        action: 'Click card to drill down',
        outcome: 'Opens Courses tab with assignment view',
        technicalDetails: 'Navigation to /org/:orgId/courses?view=assignments'
      }
    ],
    dataDisplayed: [
      {
        field: 'Total Course Assignments',
        source: 'organization_course_assignments table',
        calculation: 'COUNT(*) of all assignments in organization',
        refreshRate: 'Updates on page load and after new assignments',
        significance: 'Indicates level of course utilization and curriculum deployment'
      },
      {
        field: 'Unique Courses Assigned',
        source: 'organization_course_assignments (DISTINCT course_id)',
        calculation: 'COUNT(DISTINCT course_id)',
        significance: 'Shows curriculum diversity - are students exposed to variety or narrow focus'
      }
    ],
    relatedFeatures: ['Courses Tab', 'Course Assignment Flow', 'Course Catalog', 'Student Progress']
  },
  {
    id: 'dashboard-active-goals',
    section: 'dashboard',
    subsection: 'Statistics Grid',
    title: 'Active Goals Card',
    description: 'Displays count of currently active goals set for students in the organization.',
    userPurpose: 'Monitor goal-setting activity and accountability. Ensure students have clear learning objectives and instructors are actively guiding student development.',
    route: '/org/:orgId',
    component: 'OrgPortalHome.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Active Goals Count',
        action: 'Shows number of goals with status=\'active\'',
        outcome: 'Indicates goal-setting engagement level',
        technicalDetails: 'COUNT(*) from organization_goals WHERE status=\'active\''
      },
      {
        element: '+ Create Goal Button (Zero State)',
        action: 'Appears when no active goals exist',
        outcome: 'Navigates to Goals & Notes tab',
        technicalDetails: 'Navigation to /org/:orgId/goals-notes'
      },
      {
        element: 'Card Click',
        action: 'Click to view all goals',
        outcome: 'Opens Goals & Notes tab with goals view',
        technicalDetails: 'Router push to goals management interface'
      }
    ],
    dataDisplayed: [
      {
        field: 'Active Goals Count',
        source: 'organization_goals table',
        calculation: 'COUNT(*) WHERE status=\'active\'',
        refreshRate: 'Real-time on page load',
        significance: 'Reflects accountability culture and individualized learning approach'
      },
      {
        field: 'Goals by Priority',
        source: 'organization_goals.priority',
        calculation: 'Breakdown by High/Medium/Low priority',
        significance: 'Helps prioritize instructor attention on critical student needs'
      }
    ],
    relatedFeatures: ['Goals & Notes Tab', 'Goal Creation Flow', 'SMART Goals', 'Student Progress Tracking']
  },
  {
    id: 'dashboard-completion-rate',
    section: 'dashboard',
    subsection: 'Statistics Grid',
    title: 'Completion Rate Card',
    description: 'Aggregate completion percentage across all assigned courses in the organization.',
    userPurpose: 'High-level measure of student engagement and success. Identify if overall completion rates are healthy or if intervention is needed organization-wide.',
    route: '/org/:orgId',
    component: 'OrgPortalHome.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Completion Percentage',
        action: 'Displays calculated completion rate',
        outcome: 'Shows organizational learning effectiveness',
        technicalDetails: '(completed_courses / total_assigned_courses) * 100'
      },
      {
        element: 'Trend Indicator',
        action: 'Shows up/down arrow with percentage change',
        outcome: 'Indicates if completion rate is improving or declining',
        technicalDetails: 'Comparison to previous period (week/month)'
      },
      {
        element: 'Card Click',
        action: 'Click for detailed breakdown',
        outcome: 'Opens analytics modal with completion data by course, student, timeframe',
        technicalDetails: 'Modal component with recharts visualizations'
      }
    ],
    dataDisplayed: [
      {
        field: 'Overall Completion Rate',
        source: 'course_progress, organization_course_assignments',
        calculation: '(SUM(progress = 100) / COUNT(*)) * 100 across all assignments',
        refreshRate: 'Calculated on page load',
        significance: 'Primary KPI for organizational learning effectiveness and student success'
      },
      {
        field: 'Completed vs In Progress',
        source: 'course_progress table',
        calculation: 'COUNT(progress = 100) vs COUNT(progress < 100)',
        significance: 'Helps identify if students are finishing or getting stuck'
      }
    ],
    relatedFeatures: ['Learning Analytics', 'Course Progress Tracking', 'Student Performance Reports']
  },
  {
    id: 'dashboard-progress-overview',
    section: 'dashboard',
    subsection: 'Progress Section',
    title: 'Progress Overview Collapsible',
    description: 'Expandable section providing deeper insight into organizational learning progress with visual progress bars and breakdowns.',
    userPurpose: 'Drill deeper into completion metrics. Understand not just overall rate, but distribution of progress levels and identify struggling vs thriving students.',
    route: '/org/:orgId',
    component: 'OrgPortalHome.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Collapsible Trigger',
        action: 'Click header to expand/collapse',
        outcome: 'Toggles visibility of detailed progress metrics',
        technicalDetails: 'Radix UI Collapsible component with animated height transition'
      },
      {
        element: 'Overall Progress Bar',
        action: 'Visual representation of average progress',
        outcome: 'Shows at-a-glance progress level with color coding',
        technicalDetails: 'Progress component with gradient based on percentage (red < 30%, yellow 30-70%, green > 70%)'
      },
      {
        element: 'Enrolled vs Completed Breakdown',
        action: 'Shows ratio of enrollments to completions',
        outcome: 'Identifies completion funnel effectiveness',
        technicalDetails: 'Calculated from course_enrollments and course_progress tables'
      }
    ],
    dataDisplayed: [
      {
        field: 'Average Progress Percentage',
        source: 'course_progress table',
        calculation: 'AVG(progress) across all active enrollments',
        significance: 'Shows if students are generally making progress or stalling'
      },
      {
        field: 'Total Enrollments',
        source: 'course_enrollments',
        calculation: 'COUNT(*) of all active enrollments',
        significance: 'Context for completion numbers'
      },
      {
        field: 'Completed Courses',
        source: 'course_progress WHERE progress = 100',
        calculation: 'COUNT(*) of finished courses',
        significance: 'Actual completion count for organizational reporting'
      }
    ],
    relatedFeatures: ['Detailed Analytics', 'Student Progress Reports', 'Course Analytics']
  },
  {
    id: 'dashboard-recent-activity',
    section: 'dashboard',
    subsection: 'Activity Feed',
    title: 'Recent Activity Feed',
    description: 'Chronological feed of recent student and instructor actions within the organization.',
    userPurpose: 'Stay informed about organization activity in real-time. Quickly spot when students complete milestones, new goals are created, or engagement changes.',
    route: '/org/:orgId',
    component: 'OrgPortalHome.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Activity List Items',
        action: 'Displays recent events chronologically',
        outcome: 'Shows timestamp, user, and action taken',
        technicalDetails: 'Aggregated from multiple tables: course_progress, organization_goals, student_progress'
      },
      {
        element: 'Activity Item Click',
        action: 'Click on activity to view details',
        outcome: 'Navigates to related entity (student profile, course, goal)',
        technicalDetails: 'Dynamic routing based on activity type'
      },
      {
        element: 'Load More Button',
        action: 'Fetches older activities',
        outcome: 'Expands feed with previous 10-20 events',
        technicalDetails: 'Pagination with offset-based queries'
      }
    ],
    dataDisplayed: [
      {
        field: 'Activity Events',
        source: 'Multiple tables: course_progress.updated_at, organization_goals.created_at, etc.',
        calculation: 'Union query with timestamp ordering, LIMIT 5-10',
        refreshRate: 'Polled every 30-60 seconds or WebSocket real-time',
        significance: 'Provides pulse check on organizational engagement and activity levels'
      },
      {
        field: 'Event Types',
        source: 'Activity log or inferred from table updates',
        calculation: 'Categorized as: Course Completed, Lesson Started, Goal Created, Goal Completed, Student Enrolled',
        significance: 'Different event types indicate different engagement patterns'
      }
    ],
    relatedFeatures: ['Activity Logs', 'Student Profiles', 'Goal Management', 'Course Progress']
  },
  {
    id: 'dashboard-quick-actions',
    section: 'dashboard',
    subsection: 'Quick Actions',
    title: 'Quick Actions Panel',
    description: 'Set of prominent buttons for common instructor workflows and management tasks.',
    userPurpose: 'Provide one-click access to most frequent tasks. Reduces navigation friction for daily operations like viewing student rosters, assigning courses, or creating goals.',
    route: '/org/:orgId',
    component: 'OrgPortalHome.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'View All Students Button',
        action: 'Click to navigate',
        outcome: 'Opens Students tab with full roster',
        technicalDetails: 'Router push to /org/:orgId/students'
      },
      {
        element: 'Manage Courses Button',
        action: 'Click to navigate',
        outcome: 'Opens Courses tab with catalog view',
        technicalDetails: 'Router push to /org/:orgId/courses'
      },
      {
        element: 'View Analytics Button',
        action: 'Click to open modal',
        outcome: 'Displays detailed analytics dashboard in modal overlay',
        technicalDetails: 'Opens Dialog component with comprehensive analytics charts'
      },
      {
        element: 'Create Goal Button',
        action: 'Click to navigate',
        outcome: 'Opens Goals & Notes tab with goal creation form pre-focused',
        technicalDetails: 'Router push to /org/:orgId/goals-notes with ?action=create-goal query param'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Students Tab', 'Courses Tab', 'Goals & Notes Tab', 'Analytics Dashboard']
  }
];
