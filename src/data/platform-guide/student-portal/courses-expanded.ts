/**
 * Student Portal - Courses Section
 * Comprehensive documentation for student course features
 */

import { GuideEntry } from '@/types/platform-guide';

export const studentCoursesGuide: GuideEntry[] = [
  {
    id: 'student-my-courses-overview',
    section: 'courses',
    title: 'My Courses - Complete Overview',
    description: 'Central hub displaying all courses assigned to the student with progress tracking, quick access, and completion status.',
    userPurpose: 'Access assigned learning content, continue where left off, track completion status, and navigate to course materials.',
    route: '/dashboard/learner/courses',
    component: 'MyCourses.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Course Grid/List View',
        action: 'Displays all assigned courses in card format',
        outcome: 'Visual overview of all enrolled courses with thumbnails and progress',
        technicalDetails: 'Queries course_enrollments WHERE student_id=:userId, displays CourseCard components in responsive grid'
      },
      {
        element: 'Course Card',
        action: 'Shows course thumbnail, title, description, progress bar',
        outcome: 'At-a-glance view of course details and completion status',
        technicalDetails: 'CourseCard component with course metadata and calculated progress percentage'
      },
      {
        element: 'Continue Learning Button',
        action: 'Click to resume from last completed lesson',
        outcome: 'Deep links directly to exact lesson student left off',
        technicalDetails: 'Queries course_progress.last_lesson_id and navigates to /dashboard/learner/course/:courseId?lesson=:lessonId'
      },
      {
        element: 'Start Course Button (First Time)',
        action: 'For courses not yet started, shows "Start Course"',
        outcome: 'Begins course from first lesson',
        technicalDetails: 'Conditional rendering based on course_progress existence'
      },
      {
        element: 'Course Details Click',
        action: 'Click anywhere on course card',
        outcome: 'Opens course overview/syllabus page',
        technicalDetails: 'Navigates to /dashboard/learner/course/:courseId/overview'
      }
    ],
    dataDisplayed: [
      {
        field: 'Assigned Courses',
        source: 'course_enrollments WHERE student_id=:userId',
        calculation: 'All courses assigned by instructors to this student',
        significance: 'Student\'s complete curriculum'
      },
      {
        field: 'Course Progress',
        source: 'course_progress table',
        calculation: '(completed_lessons / total_lessons) * 100',
        significance: 'Completion percentage per course'
      },
      {
        field: 'Last Accessed',
        source: 'course_progress.last_accessed_at',
        significance: 'Shows when student last engaged with course'
      },
      {
        field: 'Course Status',
        source: 'course_enrollments.status',
        significance: 'active, completed, archived status'
      },
      {
        field: 'Time Spent',
        source: 'session_analytics WHERE course_id=:courseId',
        calculation: 'SUM(session_duration) for this course',
        significance: 'Total engagement time in hours'
      }
    ],
    relatedFeatures: ['Course Player', 'Lesson Progress', 'Course Overview', 'Certificates']
  },
  {
    id: 'student-course-player',
    section: 'courses',
    subsection: 'Course Viewer',
    title: 'Course Player Interface',
    description: 'Interactive course player where students engage with lesson content, complete activities, and progress through modules.',
    userPurpose: 'Access learning materials, watch videos, complete exercises, and progress through course curriculum.',
    route: '/dashboard/learner/course/:courseId',
    component: 'DynamicCourse.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Module Sidebar',
        action: 'Lists all course modules and lessons',
        outcome: 'Navigate between lessons, see completion status',
        technicalDetails: 'Two-pane layout with module navigation on left, content viewer on right'
      },
      {
        element: 'Module/Lesson Click',
        action: 'Click module to open that lesson',
        outcome: 'Loads selected module content in main viewer',
        technicalDetails: 'Updates URL query param ?module=:moduleIndex and renders EnhancedModuleViewer'
      },
      {
        element: 'Previous/Next Module Buttons',
        action: 'Navigate sequentially through course',
        outcome: 'Moves to previous or next lesson in order',
        technicalDetails: 'Increments/decrements currentModuleIndex state'
      },
      {
        element: 'Module Content Viewer',
        action: 'Displays lesson content (video, text, interactive elements)',
        outcome: 'Student engages with learning materials',
        technicalDetails: 'EnhancedModuleViewer component renders module content based on type'
      },
      {
        element: 'Progress Auto-Save',
        action: 'Automatically saves progress as student advances',
        outcome: 'Tracks lesson completion and time spent',
        technicalDetails: 'useProgressTracking hook updates course_progress table on lesson completion'
      },
      {
        element: 'Completion Indicator',
        action: 'Shows checkmark on completed lessons',
        outcome: 'Visual feedback of progress',
        technicalDetails: 'lesson_progress.completed boolean flag'
      }
    ],
    dataDisplayed: [
      {
        field: 'Course Modules',
        source: 'course_modules WHERE course_id=:courseId',
        calculation: 'All modules/lessons in sequential order',
        significance: 'Course structure and curriculum'
      },
      {
        field: 'Current Module',
        source: 'URL query parameter or course_progress.last_lesson_id',
        significance: 'Currently displayed lesson'
      },
      {
        field: 'Module Content',
        source: 'course_modules.content field',
        significance: 'Learning materials (video URLs, text, HTML, interactive components)'
      },
      {
        field: 'Completion Status',
        source: 'lesson_progress WHERE student_id=:userId',
        significance: 'Which lessons have been completed'
      }
    ],
    relatedFeatures: ['Course Progress Tracking', 'Module Navigation', 'Learning State Player']
  },
  {
    id: 'student-learning-state-embed',
    section: 'courses',
    subsection: 'Interactive Player',
    title: 'Learning State Interactive Player',
    description: 'Embedded iframe player for interactive learning content with progress tracking and completion messaging.',
    userPurpose: 'Engage with interactive learning modules and have progress automatically tracked.',
    route: '/dashboard/learner/learning-state/:moduleId',
    component: 'LearningStateEmbed.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Iframe Player',
        action: 'Loads external learning content',
        outcome: 'Interactive module runs in embedded player',
        technicalDetails: 'Secure iframe with sandbox restrictions and postMessage communication'
      },
      {
        element: 'Progress Communication',
        action: 'Iframe sends progress events via postMessage',
        outcome: 'Parent window receives and stores progress updates',
        technicalDetails: 'handleMessage listener processes READY, PROGRESS_UPDATE, MODULE_COMPLETE, COURSE_COMPLETE events'
      },
      {
        element: 'Back Button',
        action: 'Return to course list',
        outcome: 'Navigates back to My Courses page',
        technicalDetails: 'Router navigate to /dashboard/learner/courses'
      },
      {
        element: 'Auto-Save Progress',
        action: 'Periodically saves progress data',
        outcome: 'Student can resume from last position',
        technicalDetails: 'useProgressTracking hook updates database on progress events'
      }
    ],
    dataDisplayed: [
      {
        field: 'Module URL',
        source: 'course_modules.embed_url',
        significance: 'Source URL for interactive content'
      },
      {
        field: 'Progress Data',
        source: 'postMessage events from iframe',
        significance: 'Completion status, time spent, score, etc.'
      }
    ],
    relatedFeatures: ['Course Player', 'Progress Tracking', 'Interactive Modules']
  },
  {
    id: 'student-course-certificates',
    section: 'courses',
    subsection: 'Completion',
    title: 'Course Completion Certificates',
    description: 'Digital certificates awarded upon successful course completion.',
    userPurpose: 'Receive recognition for completing courses and showcase achievements.',
    route: '/dashboard/learner/course/:courseId/certificate',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Certificate Display',
        action: 'Automatically shown when course is 100% complete',
        outcome: 'Displays official-looking completion certificate',
        technicalDetails: 'Triggered when course_progress.progress_percentage = 100'
      },
      {
        element: 'Download Certificate',
        action: 'Click download button',
        outcome: 'Saves certificate as PDF',
        technicalDetails: 'Generates PDF using certificate template and student data'
      },
      {
        element: 'Share Certificate',
        action: 'Click share button',
        outcome: 'Allows sharing on social media or via link',
        technicalDetails: 'Generates shareable public URL for certificate'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Name',
        source: 'student_profiles.full_name',
        significance: 'Certificate recipient'
      },
      {
        field: 'Course Title',
        source: 'courses.title',
        significance: 'Course completed'
      },
      {
        field: 'Completion Date',
        source: 'course_progress.completed_at',
        significance: 'Date of achievement'
      },
      {
        field: 'Instructor/Organization',
        source: 'organizations.name or instructor name',
        significance: 'Issuing authority'
      }
    ],
    relatedFeatures: ['Course Completion', 'Achievements', 'Portfolio']
  },
  {
    id: 'student-course-assignments',
    section: 'courses',
    subsection: 'Assignments',
    title: 'Course Assignments Dashboard',
    description: 'View and manage all assignments related to enrolled courses, categorized by status.',
    userPurpose: 'Track assignments, see due dates, submit work, and monitor completion status.',
    route: '/dashboard/learner/assignments',
    component: 'AssignmentsDashboard.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Assignments Tabs',
        action: 'Switch between Active, Completed, and Overdue tabs',
        outcome: 'Filters assignments by status',
        technicalDetails: 'Tabs component with filtered lists for each category'
      },
      {
        element: 'Active Assignments List',
        action: 'Shows assignments with upcoming or no due date',
        outcome: 'Displays current work to be completed',
        technicalDetails: 'Filters WHERE status != \'completed\' AND (due_date >= today OR due_date IS NULL)'
      },
      {
        element: 'Overdue Assignments',
        action: 'Shows assignments past due date that are not completed',
        outcome: 'Highlights urgent work requiring attention',
        technicalDetails: 'Filters WHERE status != \'completed\' AND due_date < today, styled with warning colors'
      },
      {
        element: 'Completed Assignments',
        action: 'Shows finished assignments',
        outcome: 'Review of completed work and grades',
        technicalDetails: 'Filters WHERE status = \'completed\''
      },
      {
        element: 'Assignment Card Click',
        action: 'Click assignment to open details',
        outcome: 'Shows full assignment description, requirements, submission form',
        technicalDetails: 'Navigates to assignment detail page or opens modal'
      },
      {
        element: 'Summary Badges',
        action: 'Shows count of active, completed, overdue',
        outcome: 'Quick overview of assignment status',
        technicalDetails: 'Badge components with count from filtered arrays'
      }
    ],
    dataDisplayed: [
      {
        field: 'Assignments',
        source: 'course_assignments WHERE student_id=:userId',
        calculation: 'All assignments for student\'s enrolled courses',
        significance: 'Complete assignment list'
      },
      {
        field: 'Due Dates',
        source: 'course_assignments.due_date',
        significance: 'Assignment deadlines'
      },
      {
        field: 'Assignment Status',
        source: 'course_assignments.status',
        calculation: 'active, completed, overdue',
        significance: 'Current state of assignment'
      },
      {
        field: 'Course Association',
        source: 'course_assignments.course_id -> courses.title',
        significance: 'Which course the assignment belongs to'
      }
    ],
    relatedFeatures: ['Assignment Submission', 'My Courses', 'Grades']
  },
  {
    id: 'student-course-progress-tracking',
    section: 'courses',
    subsection: 'Progress',
    title: 'Course Progress Tracking System',
    description: 'Automatic tracking of lesson completion, time spent, quiz scores, and overall course advancement.',
    userPurpose: 'Monitor learning progress, understand completion status, and identify areas needing attention.',
    route: 'Multiple routes (embedded in course player)',
    component: 'useProgressTracking hook',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Auto-Progress Tracking',
        action: 'System automatically records lesson starts and completions',
        outcome: 'Progress is saved without manual student action',
        technicalDetails: 'useProgressTracking hook updates course_progress and lesson_progress tables on events'
      },
      {
        element: 'Time Tracking',
        action: 'Measures time spent in each lesson',
        outcome: 'Accurate engagement metrics',
        technicalDetails: 'Session timestamps recorded in session_analytics'
      },
      {
        element: 'Completion Percentage',
        action: 'Calculates % of course completed',
        outcome: 'Visual progress bars show advancement',
        technicalDetails: '(completed_lessons / total_lessons) * 100'
      }
    ],
    dataDisplayed: [
      {
        field: 'Course Progress',
        source: 'course_progress table',
        calculation: 'progress_percentage, completed_lessons, last_lesson_id',
        significance: 'Overall course advancement'
      },
      {
        field: 'Lesson Progress',
        source: 'lesson_progress table',
        calculation: 'Individual lesson completion status and timestamps',
        significance: 'Detailed progress per lesson'
      },
      {
        field: 'Time Spent',
        source: 'session_analytics',
        calculation: 'SUM(session_duration) per course and lesson',
        significance: 'Engagement metrics'
      }
    ],
    relatedFeatures: ['Learning Analytics', 'Course Player', 'Progress Reports']
  }
];
