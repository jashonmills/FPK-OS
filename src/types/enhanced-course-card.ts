// Enhanced Course Card Types
export type CourseOrigin = 'platform' | 'organization';
export type CourseSourceType = 'manual' | 'ai' | 'json' | 'csv' | 'scorm' | 'scorm-direct';
export type CourseFramework = 'framework1' | 'framework2' | 'scorm-direct';
export type CourseStatus = 'draft' | 'ready_for_review' | 'published' | 'processing' | 'error';
export type ProcessingStage = 'uploaded' | 'extracting' | 'parsed' | 'mapped' | 'generated' | 'ready';
export type CourseDifficulty = 'introductory' | 'intermediate' | 'advanced';

export interface AssignmentSummary {
  groupCount: number;
  studentCount: number;
}

export interface CourseCardModel {
  id: string;
  orgId?: string | null;
  title: string;
  description?: string;
  thumbnailUrl?: string | null;
  durationMinutes?: number | null;
  difficulty?: CourseDifficulty;
  origin: CourseOrigin;
  sourceType: CourseSourceType;
  framework: CourseFramework;
  status: CourseStatus;
  // processing
  processingStage?: ProcessingStage;
  // analytics snippet
  enrolledCount?: number;
  avgCompletionPct?: number;
  // assignment snippet
  lastAssignment?: AssignmentSummary;
  // badges
  isFeatured?: boolean;
  isNew?: boolean;
  // instructor
  instructorName?: string;
  // route for navigation
  route: string;
  // tags
  tags?: string[];
}

export interface CourseCardActions {
  onPreview: (courseId: string) => void;
  onStart: (courseId: string) => void;
  onEdit?: (courseId: string) => void;
  onDuplicateToOrg?: (courseId: string) => void;     // platform only
  onPublish?: (courseId: string) => Promise<AssignmentSummary | void>;
  onUnpublish?: (courseId: string) => Promise<AssignmentSummary | void>;
  onDelete?: (courseId: string) => Promise<AssignmentSummary | void>;
  onSharePreview?: (courseId: string) => void;
  onViewAnalytics?: (courseId: string) => void;
  onAddToCollection?: (courseId: string) => void;
  onAssignToStudents?: (courseId: string, courseTitle?: string) => void;
}

export interface ConfirmModalData {
  kind: 'publish' | 'unpublish' | 'delete' | null;
  busy: boolean;
  courseTitle?: string;
  impactSummary?: AssignmentSummary;
}