/**
 * Organization Owner Groups Tab - Complete Feature Guide
 * Route: /org/:orgId/groups
 * Component: GroupsManagement.tsx
 */

import { GuideEntry } from '@/types/platform-guide';

export const groupsGuide: GuideEntry[] = [
  {
    id: 'groups-overview',
    section: 'groups',
    title: 'Groups Management Overview',
    description: 'Organize students into cohorts, classes, or skill-level groups for easier course assignment and targeted instruction.',
    userPurpose: 'Create logical student groupings that mirror real-world class structures. Enables bulk course assignments, group-level goals, and cohort analytics.',
    route: '/org/:orgId/groups',
    component: 'GroupsManagement.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Groups Grid/List',
        action: 'Displays all groups as cards or table rows',
        outcome: 'Shows group overview with member count and assigned courses',
        technicalDetails: 'Query from organization_groups with COUNT of members and assignments'
      }
    ],
    dataDisplayed: [
      {
        field: 'Group List',
        source: 'organization_groups table',
        calculation: 'All groups within organization',
        significance: 'Complete view of organizational structure and cohorts'
      }
    ],
    relatedFeatures: ['Create Group', 'Bulk Course Assignment', 'Group Analytics', 'Student Management']
  },
  {
    id: 'groups-card-details',
    section: 'groups',
    subsection: 'Group Cards',
    title: 'Group Card Information',
    description: 'Each group displays key metadata in a card format for quick scanning.',
    userPurpose: 'Quickly assess group size, course coverage, and leadership at a glance.',
    route: '/org/:orgId/groups',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Group Card',
        action: 'Click to open group detail page',
        outcome: 'Navigates to /org/:orgId/groups/:groupId',
        technicalDetails: 'Router navigation with groupId parameter'
      }
    ],
    dataDisplayed: [
      {
        field: 'Group Name',
        source: 'organization_groups.name',
        significance: 'Identifier for the cohort (e.g., "Algebra I - Period 3", "Advanced ESL")'
      },
      {
        field: 'Number of Students',
        source: 'organization_group_members table',
        calculation: 'COUNT(*) WHERE group_id=:id',
        significance: 'Shows group size - useful for capacity planning'
      },
      {
        field: 'Assigned Courses',
        source: 'organization_group_assignments table',
        calculation: 'COUNT(DISTINCT course_id)',
        significance: 'Shows curriculum coverage for this group'
      },
      {
        field: 'Group Admin/Lead',
        source: 'organization_groups.lead_instructor_id',
        significance: 'Optional: Primary instructor responsible for this group'
      },
      {
        field: 'Creation Date',
        source: 'organization_groups.created_at',
        significance: 'Helps track when group was formed'
      }
    ],
    relatedFeatures: ['Group Detail Page', 'Group Editing']
  },
  {
    id: 'groups-create',
    section: 'groups',
    subsection: 'Create Group',
    title: 'Create Group Flow',
    description: 'Form to create new student groups with member selection and optional bulk course assignment.',
    userPurpose: 'Establish new cohorts for incoming classes, skill-level groupings, or special programs.',
    route: '/org/:orgId/groups',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Create Group Button',
        action: 'Opens group creation form',
        outcome: 'Modal or page with group configuration options',
        technicalDetails: 'Dialog component with multi-step form'
      },
      {
        element: 'Group Name Field',
        action: 'Enter descriptive name for group',
        outcome: 'Stores in organization_groups.name',
        technicalDetails: 'Required field, max 100 characters'
      },
      {
        element: 'Description Field',
        action: 'Optional description of group purpose',
        outcome: 'Stores in organization_groups.description',
        technicalDetails: 'Optional text area, max 500 characters'
      },
      {
        element: 'Select Students',
        action: 'Multi-select dropdown of all students',
        outcome: 'Creates entries in organization_group_members',
        technicalDetails: 'Checkbox list with search functionality'
      },
      {
        element: 'Assign Courses',
        action: 'Optional bulk course assignment during group creation',
        outcome: 'Creates course assignments for all group members',
        technicalDetails: 'Multi-select course picker, batch INSERT on save'
      },
      {
        element: 'Set Group Goals',
        action: 'Optional group-level goals',
        outcome: 'Creates goals that cascade to all members',
        technicalDetails: 'organization_goals with group_id reference'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Student Selection', 'Course Assignment', 'Goal Management']
  },
  {
    id: 'groups-detail-page',
    section: 'groups',
    subsection: 'Group Detail',
    title: 'Group Detail Page',
    description: 'Comprehensive view of a single group showing members, courses, goals, and aggregate analytics.',
    userPurpose: 'Manage group membership, track collective progress, and analyze group performance trends.',
    route: '/org/:orgId/groups/:groupId',
    component: 'GroupDetail.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Group Header',
        action: 'Shows group name with edit/delete buttons',
        outcome: 'Provides quick access to group management',
        technicalDetails: 'Display organization_groups data with action buttons'
      },
      {
        element: 'Edit Group Button',
        action: 'Opens group edit form',
        outcome: 'Allows renaming, description update, lead instructor change',
        technicalDetails: 'PATCH request to organization_groups'
      },
      {
        element: 'Delete Group Button',
        action: 'Opens confirmation dialog, deletes group',
        outcome: 'Removes group record but preserves member data',
        technicalDetails: 'Soft delete - sets deleted_at timestamp, preserves history'
      },
      {
        element: 'Student Members Table',
        action: 'Lists all group members with same columns as Students tab',
        outcome: 'Shows name, email, progress, last active',
        technicalDetails: 'Query organization_group_members JOIN organization_members'
      },
      {
        element: 'Add Members Button',
        action: 'Opens student picker to add more members',
        outcome: 'Creates new organization_group_members entries',
        technicalDetails: 'Multi-select dialog with existing students'
      },
      {
        element: 'Remove Member Action',
        action: 'Remove individual student from group',
        outcome: 'Deletes organization_group_members entry',
        technicalDetails: 'Does not affect student\'s org membership or assignments'
      },
      {
        element: 'Assigned Courses Section',
        action: 'Lists courses assigned to this group',
        outcome: 'Shows per-course progress metrics aggregated across group',
        technicalDetails: 'Query organization_group_assignments with progress rollup'
      },
      {
        element: 'Assign Course to Group',
        action: 'Bulk assign course to all group members',
        outcome: 'Creates course_enrollments for all members',
        technicalDetails: 'Batch INSERT with group_id reference for tracking'
      },
      {
        element: 'Group Goals Section',
        action: 'View and manage goals set at group level',
        outcome: 'Shows goals that apply to all group members',
        technicalDetails: 'organization_goals WHERE group_id=:id'
      },
      {
        element: 'Group Analytics',
        action: 'View aggregate performance data',
        outcome: 'Shows group average completion rate, time spent, engagement',
        technicalDetails: 'Aggregated metrics from all group members\' progress data'
      }
    ],
    dataDisplayed: [
      {
        field: 'Group Membership',
        source: 'organization_group_members table',
        calculation: 'All students in this group',
        significance: 'Defines the cohort for analytics and assignments'
      },
      {
        field: 'Group Average Progress',
        source: 'course_progress via group members',
        calculation: 'AVG(progress) across all members and their courses',
        significance: 'Key metric for group performance tracking'
      },
      {
        field: 'Group Completion Rate',
        source: 'course_progress via group members',
        calculation: '(completed_courses / total_assigned_courses) * 100 for group',
        significance: 'Measures collective success rate'
      }
    ],
    relatedFeatures: ['Student Profiles', 'Course Assignment', 'Group Analytics', 'Goal Management']
  }
];
