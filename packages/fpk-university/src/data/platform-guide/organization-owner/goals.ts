/**
 * Organization Owner Goals & Notes Tab - Complete Feature Guide
 * Route: /org/:orgId/goals-notes
 * Component: GoalsNotesManagement.tsx
 */

import { GuideEntry } from '@/types/platform-guide';

export const goalsNotesGuide: GuideEntry[] = [
  {
    id: 'goals-notes-overview',
    section: 'goals',
    title: 'Goals & Notes Management Overview',
    description: 'Centralized hub for setting student learning goals and maintaining private instructor notes.',
    userPurpose: 'Track student accountability through goal-setting while documenting observations and interventions in private notes. Supports individualized learning plans.',
    route: '/org/:orgId/goals-notes',
    component: 'GoalsNotesManagement.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Two-Column Layout',
        action: 'Desktop: side-by-side Goals (left) and Notes (right). Mobile: Tabbed interface',
        outcome: 'Provides parallel access to both goal and note management',
        technicalDetails: 'Responsive layout with shared filtering context'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Student Profiles', 'Progress Tracking', 'Accountability']
  },
  {
    id: 'goals-list-view',
    section: 'goals',
    subsection: 'Goals Column',
    title: 'Goals List View',
    description: 'Filterable list of all student goals with status indicators and progress tracking.',
    userPurpose: 'Monitor student goal achievement across the organization. Identify students needing support or motivation.',
    route: '/org/:orgId/goals-notes',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Goals List',
        action: 'Scrollable list of goal cards',
        outcome: 'Displays all goals matching current filters',
        technicalDetails: 'Query from organization_goals with filters applied'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Goals',
        source: 'organization_goals table',
        calculation: 'All goals for students in this organization',
        significance: 'Complete view of accountability and learning targets'
      }
    ],
    relatedFeatures: ['Goal Creation', 'Goal Progress', 'SMART Goals']
  },
  {
    id: 'goals-filters',
    section: 'goals',
    subsection: 'Goals Filters',
    title: 'Goals Filtering Options',
    description: 'Advanced filters to narrow goal list by student, status, priority, and category.',
    userPurpose: 'Focus on specific goal subsets - e.g., all high-priority goals, goals for struggling students, or behavioral vs academic goals.',
    route: '/org/:orgId/goals-notes',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Student Filter',
        action: 'Dropdown: All Students or select individual',
        outcome: 'Shows only goals for selected student(s)',
        technicalDetails: 'WHERE student_id=:selected'
      },
      {
        element: 'Status Filter',
        action: 'Select: Active / Completed / Paused / Cancelled',
        outcome: 'Filters by goal lifecycle status',
        technicalDetails: 'WHERE status=:selected'
      },
      {
        element: 'Priority Filter',
        action: 'Select: High / Medium / Low',
        outcome: 'Filters by urgency/importance',
        technicalDetails: 'WHERE priority=:selected'
      },
      {
        element: 'Category Filter',
        action: 'Select: Academic / Behavioral / Social-Emotional',
        outcome: 'Filters by goal type',
        technicalDetails: 'WHERE category=:selected'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Advanced Search', 'Goal Categories']
  },
  {
    id: 'goals-card-elements',
    section: 'goals',
    subsection: 'Goal Cards',
    title: 'Goal Card Elements',
    description: 'Each goal displays as a card with key information and quick actions.',
    userPurpose: 'At-a-glance view of goal details without opening full detail page.',
    route: '/org/:orgId/goals-notes',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Goal Card Click',
        action: 'Click to expand full goal details',
        outcome: 'Opens goal detail modal or expands card',
        technicalDetails: 'Shows full description, milestones, progress history'
      },
      {
        element: 'Edit Button',
        action: 'Opens goal edit form',
        outcome: 'Allows modification of goal details',
        technicalDetails: 'PATCH request to organization_goals'
      },
      {
        element: 'Delete Button',
        action: 'Opens confirmation, deletes goal',
        outcome: 'Soft delete (sets deleted_at)',
        technicalDetails: 'Preserves data for historical tracking'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Name (with avatar)',
        source: 'profiles table',
        significance: 'Identifies whose goal this is'
      },
      {
        field: 'Goal Title',
        source: 'organization_goals.title',
        significance: 'Brief description of the goal'
      },
      {
        field: 'Description',
        source: 'organization_goals.description',
        significance: 'Detailed explanation of what success looks like'
      },
      {
        field: 'Target Date',
        source: 'organization_goals.target_date',
        significance: 'Deadline for goal achievement'
      },
      {
        field: 'Progress Bar',
        source: 'organization_goals.progress',
        calculation: 'Percentage (0-100)',
        significance: 'Visual indicator of goal completion'
      },
      {
        field: 'Status Badge',
        source: 'organization_goals.status',
        significance: 'Active, Completed, Paused, or Cancelled'
      },
      {
        field: 'Priority Indicator',
        source: 'organization_goals.priority',
        significance: 'Color-coded: High (red), Medium (yellow), Low (green)'
      }
    ],
    relatedFeatures: ['Goal Detail View', 'Goal Progress Tracking']
  },
  {
    id: 'goals-create',
    section: 'goals',
    subsection: 'Create Goal',
    title: 'Goal Creation Form',
    description: 'Form to create new SMART goals for students.',
    userPurpose: 'Set clear, measurable learning targets that guide student effort and instructor support.',
    route: '/org/:orgId/goals-notes',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Create Goal Button',
        action: 'Opens goal creation form',
        outcome: 'Modal or slide-out panel with form fields',
        technicalDetails: 'Dialog component with validation'
      },
      {
        element: 'Select Student(s)',
        action: 'Multi-select to assign goal to one or more students',
        outcome: 'Creates separate goal entries for each student',
        technicalDetails: 'Batch INSERT into organization_goals'
      },
      {
        element: 'Goal Title',
        action: 'Brief, clear goal statement',
        outcome: 'Stores in organization_goals.title',
        technicalDetails: 'Required field, max 200 characters'
      },
      {
        element: 'Description',
        action: 'Detailed explanation of goal and success criteria',
        outcome: 'Stores in organization_goals.description',
        technicalDetails: 'Text area, max 1000 characters'
      },
      {
        element: 'Category Dropdown',
        action: 'Select Academic, Behavioral, or Social-Emotional',
        outcome: 'Categorizes goal type',
        technicalDetails: 'Enum field for filtering'
      },
      {
        element: 'Target Date Picker',
        action: 'Set deadline for goal completion',
        outcome: 'Stores in organization_goals.target_date',
        technicalDetails: 'Date field, must be future date'
      },
      {
        element: 'Priority Level',
        action: 'Select High, Medium, or Low',
        outcome: 'Sets priority for instructor attention',
        technicalDetails: 'Affects sorting and highlighting'
      },
      {
        element: 'Folder/Tag',
        action: 'Optional organization using tags',
        outcome: 'Enables custom grouping beyond categories',
        technicalDetails: 'Many-to-many relationship with goal_tags table'
      },
      {
        element: 'Visibility Toggle',
        action: 'Private (instructor-only) or Visible to Student',
        outcome: 'Controls if student can see this goal',
        technicalDetails: 'organization_goals.visible_to_student boolean'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['SMART Goals Framework', 'Goal Templates', 'Student Goal Visibility']
  },
  {
    id: 'notes-list-view',
    section: 'goals',
    subsection: 'Notes Column',
    title: 'Notes List View',
    description: 'Private instructor notes about students, organized and filterable.',
    userPurpose: 'Document observations, interventions, parent communications, and behavioral incidents. Maintain institutional knowledge about students.',
    route: '/org/:orgId/goals-notes',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Notes List',
        action: 'Scrollable list of note cards',
        outcome: 'Displays all notes matching filters',
        technicalDetails: 'Query from organization_notes with visibility check'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Notes',
        source: 'organization_notes table',
        calculation: 'All notes created by instructors in this org',
        significance: 'Critical documentation for student support'
      }
    ],
    relatedFeatures: ['Note Creation', 'Note Categories', 'Privacy Controls']
  },
  {
    id: 'notes-visibility',
    section: 'goals',
    subsection: 'Notes Visibility',
    title: 'Notes Visibility Scopes',
    description: 'Three-tier visibility system for note privacy control.',
    userPurpose: 'Ensure sensitive information is only visible to appropriate staff while allowing collaboration where appropriate.',
    route: '/org/:orgId/goals-notes',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Visibility Scope Filter',
        action: 'Filter notes by visibility level',
        outcome: 'Shows only notes matching selected scope',
        technicalDetails: 'WHERE visibility=:selected'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student-Only (Private)',
        source: 'organization_notes WHERE visibility=\'student_only\'',
        significance: 'Only the creator can see these notes - most sensitive information'
      },
      {
        field: 'Instructor-Visible',
        source: 'organization_notes WHERE visibility=\'instructor\'',
        significance: 'All instructors in org can view - team collaboration'
      },
      {
        field: 'Org-Public',
        source: 'organization_notes WHERE visibility=\'org_public\'',
        significance: 'All org members (including admins) can view'
      }
    ],
    relatedFeatures: ['Privacy Controls', 'Role-Based Access', 'Compliance']
  },
  {
    id: 'notes-card-elements',
    section: 'goals',
    subsection: 'Note Cards',
    title: 'Note Card Display Elements',
    description: 'Each note displays with metadata and content preview.',
    userPurpose: 'Quickly scan notes to find specific observations or documentation.',
    route: '/org/:orgId/goals-notes',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Note Card Click',
        action: 'Expand to view full note content',
        outcome: 'Shows complete note text',
        technicalDetails: 'Expands card or opens modal'
      },
      {
        element: 'Edit Button',
        action: 'Opens note editor',
        outcome: 'Allows modification if user is creator',
        technicalDetails: 'Permission check: only creator can edit'
      },
      {
        element: 'Delete Button',
        action: 'Soft delete note',
        outcome: 'Sets deleted_at, preserves record',
        technicalDetails: 'Audit trail maintained'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Name',
        source: 'profiles table',
        significance: 'Identifies note subject'
      },
      {
        field: 'Note Title',
        source: 'organization_notes.title',
        significance: 'Brief summary of note content'
      },
      {
        field: 'Content Snippet',
        source: 'organization_notes.content',
        calculation: 'First 100 characters',
        significance: 'Preview without opening full note'
      },
      {
        field: 'Created Date',
        source: 'organization_notes.created_at',
        significance: 'Timestamp for chronological organization'
      },
      {
        field: 'Last Modified',
        source: 'organization_notes.updated_at',
        significance: 'Shows if note has been edited'
      },
      {
        field: 'Tags',
        source: 'note_tags many-to-many',
        significance: 'Custom categorization for organization'
      },
      {
        field: 'Visibility Indicator',
        source: 'organization_notes.visibility',
        significance: 'Icon showing privacy level'
      }
    ],
    relatedFeatures: ['Note Detail View', 'Rich Text Editor']
  },
  {
    id: 'notes-create',
    section: 'goals',
    subsection: 'Create Note',
    title: 'Note Creation Form',
    description: 'Rich text editor for creating detailed instructor notes about students.',
    userPurpose: 'Document important observations, interventions, or student interactions for future reference.',
    route: '/org/:orgId/goals-notes',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Create Note Button',
        action: 'Opens note creation form',
        outcome: 'Rich text editor appears',
        technicalDetails: 'Dialog with TipTap or similar WYSIWYG editor'
      },
      {
        element: 'Select Student',
        action: 'Choose which student note is about',
        outcome: 'Associates note with student profile',
        technicalDetails: 'Required field, organization_notes.student_id'
      },
      {
        element: 'Title',
        action: 'Brief note title',
        outcome: 'Stores in organization_notes.title',
        technicalDetails: 'Max 200 characters'
      },
      {
        element: 'Content (Rich Text)',
        action: 'Full note content with formatting',
        outcome: 'Supports bold, italic, lists, links',
        technicalDetails: 'HTML stored in organization_notes.content'
      },
      {
        element: 'Category',
        action: 'Tag note type (e.g., Behavioral, Academic, Communication)',
        outcome: 'Enables filtering and organization',
        technicalDetails: 'Enum or many-to-many with categories'
      },
      {
        element: 'Tags (Multi-Select)',
        action: 'Apply custom tags or create new ones',
        outcome: 'Flexible categorization',
        technicalDetails: 'Many-to-many with note_tags table'
      },
      {
        element: 'Visibility Scope',
        action: 'Select Student-Only, Instructor-Visible, or Org-Public',
        outcome: 'Sets note privacy level',
        technicalDetails: 'organization_notes.visibility enum'
      },
      {
        element: 'Folder Path',
        action: 'Optional hierarchical organization',
        outcome: 'Stores notes in virtual folder structure',
        technicalDetails: 'organization_notes.folder_path string'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Rich Text Editor', 'Tagging System', 'Privacy Controls']
  }
];
