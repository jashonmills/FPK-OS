/**
 * Organization Owner Interactive IEP Tab - Complete Feature Guide
 * Route: /org/:orgId/iep
 * Component: IEPManagement.tsx
 */

import { GuideEntry } from '@/types/platform-guide';

export const iepGuide: GuideEntry[] = [
  {
    id: 'iep-overview',
    section: 'iep',
    title: 'Interactive IEP Management Overview',
    description: 'Comprehensive system for creating, managing, and tracking Individualized Education Programs (IEPs) for students with special needs.',
    userPurpose: 'Legally compliant IEP management that centralizes documentation, tracks goals, coordinates services, and facilitates parent communication.',
    route: '/org/:orgId/iep',
    component: 'IEPManagement.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'IEP Dashboard',
        action: 'Displays all active IEPs',
        outcome: 'Shows IEP list with review status and due dates',
        technicalDetails: 'Query from student_ieps WHERE org_id=:orgId'
      }
    ],
    dataDisplayed: [
      {
        field: 'Active IEPs',
        source: 'student_ieps table',
        calculation: 'All IEPs with status=\'active\'',
        significance: 'Complete view of special education students requiring support'
      }
    ],
    relatedFeatures: ['IEP Builder', 'Parent Portal', 'Goal Tracking', 'Compliance Reports']
  },
  {
    id: 'iep-dashboard-table',
    section: 'iep',
    subsection: 'IEP Dashboard',
    title: 'Active IEPs List Table',
    description: 'Table displaying all IEPs with key metadata and status indicators.',
    userPurpose: 'Track IEP compliance deadlines, review schedules, and quickly access individual student IEPs.',
    route: '/org/:orgId/iep',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'IEP Row Click',
        action: 'Click row to open IEP detail view',
        outcome: 'Navigates to /org/:orgId/iep/:iepId',
        technicalDetails: 'Router navigation with iepId parameter'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Name',
        source: 'student_ieps JOIN profiles',
        significance: 'Identifies which student the IEP belongs to'
      },
      {
        field: 'IEP Creation Date',
        source: 'student_ieps.created_at',
        significance: 'When IEP was initially created'
      },
      {
        field: 'Last Review Date',
        source: 'student_ieps.last_review_date',
        significance: 'Most recent formal review (typically annual)'
      },
      {
        field: 'Next Review Due',
        source: 'student_ieps.next_review_date',
        calculation: 'Typically last_review_date + 1 year',
        significance: 'Critical compliance deadline - IEPs must be reviewed annually'
      },
      {
        field: 'Status',
        source: 'student_ieps.status',
        calculation: 'Values: Active, Under Review, Archived',
        significance: 'Indicates current IEP state in lifecycle'
      },
      {
        field: 'Assigned Case Manager',
        source: 'student_ieps.case_manager_id JOIN profiles',
        significance: 'Primary responsible party for IEP implementation'
      }
    ],
    relatedFeatures: ['IEP Detail View', 'Compliance Calendar', 'Case Manager Assignment']
  },
  {
    id: 'iep-wizard',
    section: 'iep',
    subsection: 'Create IEP',
    title: 'IEP Creation Wizard',
    description: 'Guided multi-step process to create a comprehensive, legally compliant IEP.',
    userPurpose: 'Systematically document all required IEP components including assessments, goals, accommodations, and service plans.',
    route: '/org/:orgId/iep/wizard',
    component: 'IEPWizard.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Create New IEP Button',
        action: 'Click from IEP Dashboard',
        outcome: 'Launches IEP Wizard at Step 1',
        technicalDetails: 'Router navigation to wizard route'
      },
      {
        element: 'Step 1: Student Selection',
        action: 'Choose student from roster',
        outcome: 'Associates IEP with selected student',
        technicalDetails: 'Dropdown of students without active IEPs'
      },
      {
        element: 'Step 2: Assessment Data Entry',
        action: 'Input or upload evaluation results',
        outcome: 'Documents present levels of performance',
        technicalDetails: 'Rich text editor with file attachment support'
      },
      {
        element: 'Step 3: Goal Setting (SMART Goals)',
        action: 'Create measurable annual goals',
        outcome: 'Defines target outcomes for the IEP period',
        technicalDetails: 'Form with SMART goal template (Specific, Measurable, Achievable, Relevant, Time-bound)'
      },
      {
        element: 'Step 4: Accommodations & Modifications',
        action: 'Select or describe support strategies',
        outcome: 'Documents required classroom and testing accommodations',
        technicalDetails: 'Checkbox list of common accommodations + custom text field'
      },
      {
        element: 'Step 5: Service Provider Assignment',
        action: 'Assign specialists and define service hours',
        outcome: 'Creates service schedule (e.g., "30 min/week speech therapy")',
        technicalDetails: 'Multi-select with time allocation per provider'
      },
      {
        element: 'Step 6: Parent/Guardian Access Setup',
        action: 'Generate secure parent portal link',
        outcome: 'Creates parent_iep_access record with unique token',
        technicalDetails: 'Generates UUID token for parent access at /iep/parent/:token'
      },
      {
        element: 'Step 7: Review & Finalize',
        action: 'Review all entered data, sign-off',
        outcome: 'Creates student_ieps record with status=\'active\'',
        technicalDetails: 'Final validation check, then batch INSERT all IEP components'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['SMART Goals', 'Service Coordination', 'Parent Portal', 'Assessment Data']
  },
  {
    id: 'iep-detail-view',
    section: 'iep',
    subsection: 'IEP Detail',
    title: 'IEP Detail View',
    description: 'Complete view of an individual student\'s IEP with all components and progress tracking.',
    userPurpose: 'Access full IEP documentation, track goal progress, update accommodations, and maintain compliance records.',
    route: '/org/:orgId/iep/:iepId',
    component: 'IEPDetail.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Edit IEP Button',
        action: 'Opens IEP editor',
        outcome: 'Allows modification of IEP components',
        technicalDetails: 'Versioned editing - creates new version on major changes'
      },
      {
        element: 'Generate Report Button',
        action: 'Export IEP as PDF',
        outcome: 'Creates printable, formatted IEP document',
        technicalDetails: 'Server-side PDF generation from IEP data'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Information',
        source: 'profiles table',
        significance: 'Demographics, grade level, disability classification'
      },
      {
        field: 'Present Levels of Performance',
        source: 'student_ieps.assessment_data',
        significance: 'Baseline academic and functional abilities'
      },
      {
        field: 'Annual Goals',
        source: 'iep_goals table',
        calculation: 'All goals linked to this IEP',
        significance: 'Measurable targets for the year'
      },
      {
        field: 'Short-Term Objectives',
        source: 'iep_objectives table',
        calculation: 'Milestones toward annual goals',
        significance: 'Progress monitoring checkpoints'
      },
      {
        field: 'Accommodations',
        source: 'iep_accommodations table',
        significance: 'Required supports and modifications'
      },
      {
        field: 'Progress Monitoring',
        source: 'iep_progress_notes table',
        calculation: 'Periodic updates on goal achievement',
        significance: 'Documents student growth toward IEP goals'
      },
      {
        field: 'Review History',
        source: 'iep_reviews table',
        significance: 'Audit trail of formal IEP meetings and updates'
      },
      {
        field: 'Signatures & Approvals',
        source: 'iep_signatures table',
        significance: 'Legal sign-offs from parents, teachers, administrators'
      }
    ],
    relatedFeatures: ['Goal Progress Tracking', 'Compliance Documentation', 'Parent Communication']
  },
  {
    id: 'iep-parent-portal',
    section: 'iep',
    subsection: 'Parent Access',
    title: 'Parent Access Portal',
    description: 'Secure, read-only portal for parents/guardians to view their child\'s IEP.',
    userPurpose: 'Increase parent engagement and transparency. Allows families to review IEP details anytime without requesting documents.',
    route: '/iep/parent/:accessToken',
    component: 'ParentIEPAccess.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Generate Parent Link Button',
        action: 'Creates secure access token',
        outcome: 'Generates shareable URL for parent access',
        technicalDetails: 'Creates entry in parent_iep_access with UUID token, expiration date optional'
      },
      {
        element: 'Parent Portal View',
        action: 'Parents access via unique link',
        outcome: 'Read-only view of IEP goals, accommodations, progress',
        technicalDetails: 'Token-based authentication, no parent account required'
      },
      {
        element: 'Revoke Access Button',
        action: 'Deactivate parent access link',
        outcome: 'Invalidates token, prevents further access',
        technicalDetails: 'Sets parent_iep_access.revoked=true'
      }
    ],
    dataDisplayed: [
      {
        field: 'Parent-Visible IEP Data',
        source: 'student_ieps with filtered fields',
        significance: 'Excludes sensitive internal notes, shows goals and accommodations'
      }
    ],
    relatedFeatures: ['Parent Communication', 'Access Control', 'Compliance']
  }
];
