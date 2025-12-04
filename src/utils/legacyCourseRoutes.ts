/**
 * Registry of legacy Sequential Learning Framework courses
 * These courses have dedicated route pages and should not use NativeCoursePlayer
 * 
 * CRITICAL: V2 courses have been REMOVED from this list.
 * V2 courses are now in src/utils/v2SequentialCourses.ts
 */
export const LEGACY_COURSE_SLUGS = [
  'elt-empowering-learning-techniques',
  'interactive-algebra',
  'interactive-trigonometry',
  'interactive-linear-equations',
  'logic-critical-thinking',
  'introduction-modern-economics',
  'neurodiversity-strengths-based-approach',
  'interactive-science',
  'geometry',
  'money-management-teens',
  'introduction-video-production'
] as const;

export type LegacyCourseSlug = typeof LEGACY_COURSE_SLUGS[number];

/**
 * UUID to slug mapping for legacy courses where slug is not in courses table
 */
export const UUID_TO_SLUG_MAP: Record<string, LegacyCourseSlug> = {
  // Add UUID mappings for legacy courses as needed
};

/**
 * Check if a course slug is a legacy course
 */
export function isLegacyCourse(slug: string | null | undefined): slug is LegacyCourseSlug {
  if (!slug) return false;
  return LEGACY_COURSE_SLUGS.includes(slug as LegacyCourseSlug);
}

/**
 * Get slug for a course by UUID (if it's a legacy course)
 */
export function getSlugByUUID(uuid: string): LegacyCourseSlug | null {
  return UUID_TO_SLUG_MAP[uuid] || null;
}

/**
 * Get the route path for a legacy course
 */
export function getLegacyCourseRoute(slug: LegacyCourseSlug): string {
  return `/courses/${slug}`;
}
