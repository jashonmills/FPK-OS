import type { CourseCard } from '@/types/course-card';
import type { CourseCardModel, CourseOrigin, CourseFramework, CourseStatus } from '@/types/enhanced-course-card';

/**
 * Converts legacy CourseCard type to unified CourseCardModel
 */
export function toCourseCardModel(raw: CourseCard): CourseCardModel {
  return {
    id: raw.id,
    orgId: raw.org_id,
    title: raw.title ?? 'Untitled Course',
    description: raw.description ?? '',
    thumbnailUrl: raw.thumbnail_url,
    durationMinutes: raw.duration_minutes,
    difficulty: raw.difficulty_level as 'introductory' | 'intermediate' | 'advanced',
    origin: determineOrigin(raw),
    sourceType: determineSourceType(raw),
    framework: determineFramework(raw),
    status: determineStatus(raw),
    instructorName: raw.instructor_name,
    route: raw.route,
    tags: raw.tags || [],
    enrolledCount: raw.progress?.completion_percentage ? 1 : 0, // Basic approximation
    avgCompletionPct: raw.progress?.completion_percentage || 0,
    isFeatured: raw.badges?.some(b => b.label === 'Featured') || false,
    isNew: raw.badges?.some(b => b.label === 'New') || false,
  };
}

function determineOrigin(course: CourseCard): CourseOrigin {
  return course.source === 'platform' ? 'platform' : 'organization';
}

function determineSourceType(course: CourseCard): 'manual' | 'ai' | 'json' | 'csv' | 'scorm' | 'scorm-direct' {
  if (course.source === 'scorm') return 'scorm';
  if (course.source_table === 'org_courses') return 'manual';
  return 'manual';
}

function determineFramework(course: CourseCard): CourseFramework {
  if (course.source === 'scorm') return 'scorm-direct';
  // TODO: Add logic to detect framework type based on course structure
  return 'framework1';
}

function determineStatus(course: CourseCard): CourseStatus {
  if (course.status === 'published') return 'published';
  if (course.status === 'draft') return 'draft';
  if (course.status === 'preview') return 'ready_for_review';
  return 'draft';
}