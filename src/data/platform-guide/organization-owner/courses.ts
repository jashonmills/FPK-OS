/**
 * Organization Owner Courses Tab - Complete Feature Guide
 * Route: /org/:orgId/courses
 * Component: OrgCoursesManagement.tsx
 */

import { GuideEntry } from '@/types/platform-guide';

export const coursesGuide: GuideEntry[] = [
  {
    id: 'courses-overview',
    section: 'courses',
    title: 'Courses Management Overview',
    description: 'Browse the course catalog, assign courses to students and groups, and track organizational course completion metrics.',
    userPurpose: 'Central hub for curriculum management. Deploy learning content to students, monitor course utilization, and analyze course effectiveness.',
    route: '/org/:orgId/courses',
    component: 'OrgCoursesManagement.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Course Catalog Grid',
        action: 'Displays available courses as cards',
        outcome: 'Shows course catalog with enrollment stats',
        technicalDetails: 'Query from courses table with enrollment counts per org'
      }
    ],
    dataDisplayed: [
      {
        field: 'Available Courses',
        source: 'courses table',
        calculation: 'All published courses available to organization',
        significance: 'Complete curriculum library for assignment'
      }
    ],
    relatedFeatures: ['Course Assignment', 'Course Analytics', 'Student Progress']
  },
  {
    id: 'courses-card-elements',
    section: 'courses',
    subsection: 'Course Cards',
    title: 'Course Card Information',
    description: 'Each course displays key information to help instructors make assignment decisions.',
    userPurpose: 'Quickly evaluate course content, difficulty, and current usage before assigning to students.',
    route: '/org/:orgId/courses',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Course Card',
        action: 'Click to view detailed course information',
        outcome: 'Opens course detail modal or page',
        technicalDetails: 'Shows full syllabus, learning objectives, lesson list'
      }
    ],
    dataDisplayed: [
      {
        field: 'Course Title',
        source: 'courses.title',
        significance: 'Primary course identifier'
      },
      {
        field: 'Course Thumbnail',
        source: 'courses.thumbnail_url',
        significance: 'Visual identifier for quick recognition'
      },
      {
        field: 'Duration Estimate',
        source: 'courses.estimated_duration_minutes',
        calculation: 'Sum of lesson durations',
        significance: 'Helps plan student workload and pacing'
      },
      {
        field: 'Difficulty Level',
        source: 'courses.difficulty',
        calculation: 'Values: Beginner, Intermediate, Advanced',
        significance: 'Ensures appropriate course-to-student matching'
      },
      {
        field: 'Enrolled Students (from org)',
        source: 'course_enrollments WHERE org_id=:orgId',
        calculation: 'COUNT(DISTINCT student_id)',
        significance: 'Shows current utilization within your organization'
      },
      {
        field: 'Average Progress (org)',
        source: 'course_progress via org enrollments',
        calculation: 'AVG(progress) for students in this org',
        significance: 'Indicates if students are completing or struggling'
      }
    ],
    relatedFeatures: ['Course Detail View', 'Course Preview']
  },
  {
    id: 'courses-assignment-flow',
    section: 'courses',
    subsection: 'Course Assignment',
    title: 'Course Assignment Workflow',
    description: 'Multi-step process to assign courses to individual students, groups, or the entire organization.',
    userPurpose: 'Deploy curriculum to learners with optional due dates, custom instructions, and notification settings.',
    route: '/org/:orgId/courses',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Assign Course Button (on course card)',
        action: 'Click to begin assignment flow',
        outcome: 'Opens assignment modal',
        technicalDetails: 'Dialog component with assignment configuration'
      },
      {
        element: 'Select Recipients',
        action: 'Choose Individual Students, Groups, or All Students',
        outcome: 'Determines target audience for assignment',
        technicalDetails: 'Dropdown with filtering options'
      },
      {
        element: 'Student/Group Picker',
        action: 'Multi-select specific students or groups',
        outcome: 'Creates assignment list',
        technicalDetails: 'Searchable multi-select component'
      },
      {
        element: 'Due Date (Optional)',
        action: 'Set deadline for course completion',
        outcome: 'Stores in organization_course_assignments.due_date',
        technicalDetails: 'Date picker component, nullable field'
      },
      {
        element: 'Custom Instructions',
        action: 'Text field for instructor notes',
        outcome: 'Provides context or specific guidance for this assignment',
        technicalDetails: 'Stores in organization_course_assignments.instructions'
      },
      {
        element: 'Send Notifications Toggle',
        action: 'Enable/disable assignment notification emails',
        outcome: 'Triggers email to students if enabled',
        technicalDetails: 'Calls Supabase function to send notification emails'
      },
      {
        element: 'Assign Button (final)',
        action: 'Confirm and create assignments',
        outcome: 'Creates course_enrollments and organization_course_assignments entries',
        technicalDetails: 'Batch INSERT for all selected recipients'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Students Tab', 'Groups Tab', 'Notifications', 'Course Progress']
  },
  {
    id: 'courses-collections',
    section: 'courses',
    subsection: 'Course Collections',
    title: 'Course Collections & Filters',
    description: 'Organized views of the course catalog using tabs and filters.',
    userPurpose: 'Navigate large course libraries efficiently. Focus on specific subsets like assigned courses or recommended content.',
    route: '/org/:orgId/courses',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'All Courses Tab',
        action: 'View complete course catalog',
        outcome: 'Shows every available course',
        technicalDetails: 'Query all courses WHERE published=true'
      },
      {
        element: 'Assigned Courses Tab',
        action: 'Filter to only courses this org has assigned',
        outcome: 'Shows courses with active enrollments',
        technicalDetails: 'Query courses with enrollments from this org_id'
      },
      {
        element: 'Custom Collections Tab',
        action: 'View instructor-curated course lists',
        outcome: 'Shows themed course bundles (e.g., "Math Fundamentals", "ELA Curriculum")',
        technicalDetails: 'Query from organization_course_collections table'
      },
      {
        element: 'Recommended Tab',
        action: 'View AI-suggested courses',
        outcome: 'Shows courses recommended based on student needs and performance',
        technicalDetails: 'AI-generated recommendations from student analytics'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Course Catalog', 'AI Recommendations', 'Custom Collections']
  },
  {
    id: 'courses-analytics',
    section: 'courses',
    subsection: 'Course Analytics',
    title: 'Course Analytics Modal',
    description: 'Detailed performance metrics for a specific course within your organization.',
    userPurpose: 'Understand how students are progressing through a course. Identify difficult lessons, completion bottlenecks, and performance distribution.',
    route: '/org/:orgId/courses',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Course Analytics Button',
        action: 'Click analytics icon on course card',
        outcome: 'Opens modal with detailed course metrics',
        technicalDetails: 'Dialog component with charts and tables'
      }
    ],
    dataDisplayed: [
      {
        field: 'Enrollment Count',
        source: 'course_enrollments WHERE org_id=:orgId AND course_id=:courseId',
        calculation: 'COUNT(*) of students enrolled',
        significance: 'Total reach of this course in your organization'
      },
      {
        field: 'Completion Rate',
        source: 'course_progress WHERE progress=100',
        calculation: '(completed / enrolled) * 100',
        significance: 'Key metric for course effectiveness'
      },
      {
        field: 'Average Time to Complete',
        source: 'course_progress.completed_at - course_enrollments.enrolled_at',
        calculation: 'AVG(completion_time) for finished courses',
        significance: 'Helps validate duration estimates'
      },
      {
        field: 'Lesson-by-Lesson Breakdown',
        source: 'lesson_progress table',
        calculation: 'Completion rate per lesson',
        significance: 'Identifies lessons where students get stuck'
      },
      {
        field: 'Student Performance Distribution',
        source: 'course_progress.progress',
        calculation: 'Histogram of progress percentages',
        significance: 'Shows if most students are succeeding or struggling'
      }
    ],
    relatedFeatures: ['Learning Analytics', 'Student Progress', 'Course Design']
  }
];
