/**
 * Organization Owner Students Tab - Complete Feature Guide
 * Route: /org/:orgId/students
 * Component: StudentsManagementNew.tsx
 */

import { GuideEntry } from '@/types/platform-guide';

export const studentsGuide: GuideEntry[] = [
  {
    id: 'students-overview',
    section: 'students',
    title: 'Students Management Overview',
    description: 'Central hub for managing your organization\'s student roster, viewing individual progress, and performing bulk operations.',
    userPurpose: 'Manage the complete student lifecycle - from invitation and onboarding through monitoring progress and managing access. Provides detailed visibility into each student\'s learning journey.',
    route: '/org/:orgId/students',
    component: 'StudentsManagementNew.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Students List Table',
        action: 'Displays all students in organization',
        outcome: 'Shows comprehensive roster with key metrics per student',
        technicalDetails: 'Query from organization_members WHERE role=\'student\' with JOINs to profiles, course_enrollments, and progress tables'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Roster',
        source: 'organization_members JOIN profiles',
        calculation: 'All members with role=\'student\' and status in (\'active\', \'paused\')',
        significance: 'Complete organizational enrollment view'
      }
    ],
    relatedFeatures: ['Add Student', 'Student Profiles', 'Bulk Operations', 'Course Assignments']
  },
  {
    id: 'students-table-columns',
    section: 'students',
    subsection: 'Student List',
    title: 'Student Table Columns',
    description: 'Detailed breakdown of all data columns displayed in the student roster table.',
    userPurpose: 'Understand what each column represents and how to interpret student data at a glance.',
    route: '/org/:orgId/students',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [],
    dataDisplayed: [
      {
        field: 'Name',
        source: 'profiles.full_name or profiles.display_name',
        significance: 'Student identification - primary way to locate and reference students'
      },
      {
        field: 'Email',
        source: 'auth.users.email via user_id JOIN',
        significance: 'Contact information and unique identifier for communication'
      },
      {
        field: 'Role',
        source: 'organization_members.role',
        calculation: 'Always \'student\' on this page (filtered)',
        significance: 'Confirms user type within organization'
      },
      {
        field: 'Status',
        source: 'organization_members.status',
        calculation: 'Values: \'active\', \'paused\', \'blocked\', \'removed\'',
        significance: 'Indicates if student can currently access courses. Active = full access, Paused = temporary suspension, Blocked = permanent ban, Removed = no longer in org'
      },
      {
        field: 'Enrolled Courses',
        source: 'course_enrollments table',
        calculation: 'COUNT(*) of enrollments for this student',
        significance: 'Shows course assignment activity - helps identify under-enrolled students'
      },
      {
        field: 'Average Progress',
        source: 'course_progress table',
        calculation: 'AVG(progress) across all enrolled courses',
        significance: 'Overall engagement metric - low progress may indicate struggling or disengaged student'
      },
      {
        field: 'Last Active',
        source: 'user_sessions.last_seen_at or similar timestamp',
        calculation: 'Most recent activity timestamp',
        significance: 'Identifies inactive students who may need outreach or re-engagement'
      }
    ],
    relatedFeatures: ['Student Sorting', 'Column Filtering', 'Export Data']
  },
  {
    id: 'students-actions-dropdown',
    section: 'students',
    subsection: 'Student Actions',
    title: 'Per-Student Actions Dropdown',
    description: 'Action menu available for each student row providing quick access to common management tasks.',
    userPurpose: 'Perform actions on individual students without navigating away from the roster view.',
    route: '/org/:orgId/students',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'View Profile',
        action: 'Click to navigate to student detail page',
        outcome: 'Opens /org/:orgId/students/:studentId with full student profile',
        technicalDetails: 'Router navigation with studentId parameter'
      },
      {
        element: 'Assign Course',
        action: 'Opens course assignment modal',
        outcome: 'Shows course catalog picker, creates entry in organization_course_assignments',
        technicalDetails: 'Modal component with course selection and optional due date'
      },
      {
        element: 'Set Goal',
        action: 'Opens goal creation form',
        outcome: 'Creates new goal entry in organization_goals table',
        technicalDetails: 'Pre-populates student_id field in goal form'
      },
      {
        element: 'Add Note',
        action: 'Opens private note form',
        outcome: 'Creates instructor-only note about student',
        technicalDetails: 'Stores in organization_notes with visibility=\'instructor_only\''
      },
      {
        element: 'Pause Access',
        action: 'Temporarily suspends student access',
        outcome: 'Sets status=\'paused\', student cannot login or access courses',
        technicalDetails: 'UPDATE organization_members SET status=\'paused\' WHERE user_id=:studentId'
      },
      {
        element: 'Remove from Org',
        action: 'Opens confirmation dialog, then removes student',
        outcome: 'Sets status=\'removed\', preserves data but revokes all access',
        technicalDetails: 'Soft delete - data retained for records/reporting'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Student Profile', 'Course Assignment', 'Goal Management', 'Access Control']
  },
  {
    id: 'students-add-button',
    section: 'students',
    subsection: 'Add Student',
    title: 'Add Student Button & Flow',
    description: 'Primary method for adding new students to the organization via email invitation or PIN generation.',
    userPurpose: 'Onboard new students by sending email invitations (for older students with email) or generating secure PIN codes (for younger students).',
    route: '/org/:orgId/students',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Add Student Button',
        action: 'Click button in top-right of page',
        outcome: 'Opens "Add Student" modal with two tab options',
        technicalDetails: 'Dialog component with TabsList for invitation method'
      },
      {
        element: 'Invite by Email Tab',
        action: 'Enter student email address and send invitation',
        outcome: 'Creates entry in organization_invitations, sends email via Supabase Auth with invite link',
        technicalDetails: 'Uses Supabase inviteUserByEmail with metadata including org_id and role=\'student\''
      },
      {
        element: 'Generate Student PIN Tab',
        action: 'Create secure PIN-based login for K-12 students',
        outcome: 'Generates unique PIN code, stores in student_portal_pins table, displays PIN for instructor to share',
        technicalDetails: 'Crypto.randomBytes generates 6-8 digit PIN, hashed before storage'
      },
      {
        element: 'Invitation Link Display',
        action: 'Shows generated invitation URL',
        outcome: 'Instructor can copy link to share via other channels',
        technicalDetails: 'Format: https://app.com/signup/invitation?token=:inviteToken'
      }
    ],
    dataDisplayed: [
      {
        field: 'Invitation Token',
        source: 'organization_invitations.token',
        calculation: 'UUID generated on invitation creation',
        significance: 'Secure, one-time-use token for student registration'
      },
      {
        field: 'Student PIN',
        source: 'student_portal_pins table',
        calculation: 'Random numeric code, typically 6-8 digits',
        significance: 'Child-friendly login method, no email required'
      }
    ],
    relatedFeatures: ['Invitation Management', 'Student Activation', 'Onboarding Flow']
  },
  {
    id: 'students-bulk-operations',
    section: 'students',
    subsection: 'Bulk Actions',
    title: 'Bulk Operations & Multi-Select',
    description: 'Checkbox selection system allowing instructors to perform actions on multiple students simultaneously.',
    userPurpose: 'Efficiently manage multiple students at once - assign same course to entire class, create groups, export data for reporting.',
    route: '/org/:orgId/students',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Checkbox Selection',
        action: 'Click checkboxes to multi-select students',
        outcome: 'Bulk actions toolbar appears when ≥1 students selected',
        technicalDetails: 'React state array of selected student IDs'
      },
      {
        element: 'Assign Course (Bulk)',
        action: 'Click bulk assign course button',
        outcome: 'Opens course picker, creates assignments for all selected students',
        technicalDetails: 'Batch INSERT into organization_course_assignments'
      },
      {
        element: 'Create Group',
        action: 'Create new group from selected students',
        outcome: 'Opens group creation form with selected students pre-populated',
        technicalDetails: 'Creates organization_group with member entries'
      },
      {
        element: 'Export Data (CSV)',
        action: 'Download student data as CSV',
        outcome: 'Generates CSV file with selected students\' data',
        technicalDetails: 'Client-side CSV generation from table data'
      },
      {
        element: 'Bulk Message',
        action: 'Send announcement to selected students',
        outcome: 'Opens message composer, sends to all selected',
        technicalDetails: 'Creates notification entries or sends emails via Supabase'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Course Assignment', 'Group Management', 'Data Export', 'Messaging']
  },
  {
    id: 'students-search-filter',
    section: 'students',
    subsection: 'Search & Filter',
    title: 'Search and Filter Panel',
    description: 'Advanced filtering and search capabilities to quickly locate specific students or student cohorts.',
    userPurpose: 'Narrow down student list to find specific individuals or identify groups needing attention (e.g., all students below 25% progress).',
    route: '/org/:orgId/students',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Search Bar',
        action: 'Type to search by name or email',
        outcome: 'Filters table in real-time as you type',
        technicalDetails: 'Client-side filtering on name and email fields'
      },
      {
        element: 'Status Filter',
        action: 'Select Active / Paused / All',
        outcome: 'Shows only students matching selected status',
        technicalDetails: 'WHERE clause filter on organization_members.status'
      },
      {
        element: 'Course Filter',
        action: 'Select specific course from dropdown',
        outcome: 'Shows only students enrolled in that course',
        technicalDetails: 'JOIN filter on course_enrollments.course_id'
      },
      {
        element: 'Progress Filter',
        action: 'Select progress range (<25%, 25-50%, 50-75%, 75%+, Completed)',
        outcome: 'Filters students by average progress range',
        technicalDetails: 'HAVING clause on AVG(progress) calculation'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Student Sorting', 'Data Export', 'Analytics']
  },
  {
    id: 'students-profile-page',
    section: 'students',
    subsection: 'Student Profile',
    title: 'Individual Student Profile Page',
    description: 'Detailed view of a single student showing all courses, goals, notes, analytics, and IEP information.',
    userPurpose: 'Deep dive into an individual student\'s complete learning journey - progress, engagement patterns, goals, and instructor observations.',
    route: '/org/:orgId/students/:studentId',
    component: 'StudentProfile.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Profile Header',
        action: 'Displays student avatar, name, contact info',
        outcome: 'Provides quick identification and context',
        technicalDetails: 'Data from profiles and auth.users tables'
      },
      {
        element: 'Status Toggle',
        action: 'Quick toggle between Active/Paused',
        outcome: 'Updates student access status immediately',
        technicalDetails: 'PATCH request to update organization_members.status'
      },
      {
        element: 'Overview Tab',
        action: 'View key metrics, XP, level, recent activity',
        outcome: 'Shows gamification progress and high-level engagement',
        technicalDetails: 'Aggregates from student_progress, xp_transactions, achievements'
      },
      {
        element: 'Courses Tab',
        action: 'View all assigned courses with progress bars',
        outcome: 'Shows detailed course-by-course progress',
        technicalDetails: 'Query course_enrollments with progress percentages'
      },
      {
        element: 'Goals Tab',
        action: 'View all student goals (instructor-set and self-set)',
        outcome: 'Shows goal status, progress, and history',
        technicalDetails: 'organization_goals WHERE student_id=:id'
      },
      {
        element: 'Notes Tab',
        action: 'View private instructor notes',
        outcome: 'Shows all notes instructors have written about this student',
        technicalDetails: 'organization_notes WHERE student_id=:id AND visibility=instructor'
      },
      {
        element: 'Analytics Tab',
        action: 'View detailed learning analytics',
        outcome: 'Shows time spent, lesson completion patterns, engagement trends',
        technicalDetails: 'Aggregated data from session_analytics, course_progress'
      },
      {
        element: 'IEP Tab',
        action: 'Link to student\'s IEP if one exists',
        outcome: 'Opens IEP detail view',
        technicalDetails: 'Conditional display if student_ieps record exists'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Metadata',
        source: 'profiles table',
        significance: 'Personal information, registration date, last login'
      },
      {
        field: 'XP and Level',
        source: 'student_progress or gamification_stats',
        calculation: 'Total XP earned across all activities',
        significance: 'Gamification progress indicator'
      },
      {
        field: 'Course Progress Details',
        source: 'course_progress table',
        calculation: 'Per-course progress percentages, lessons completed',
        significance: 'Granular view of learning progress'
      }
    ],
    relatedFeatures: ['Course Progress', 'Goal Management', 'IEP Module', 'Analytics Dashboard']
  }
];
