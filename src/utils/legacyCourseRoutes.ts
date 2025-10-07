/**
 * Registry of legacy Sequential Learning Framework courses
 * These courses have dedicated route pages and should not use NativeCoursePlayer
 */
export const LEGACY_COURSE_SLUGS = [
  'empowering-learning-spelling',
  'empowering-learning-handwriting',
  'empowering-learning-numeracy', 
  'empowering-learning-reading',
  'optimal-learning-state',
  'el-handwriting'
] as const;

export type LegacyCourseSlug = typeof LEGACY_COURSE_SLUGS[number];

/**
 * Check if a course slug is a legacy course
 */
export function isLegacyCourse(slug: string | null | undefined): slug is LegacyCourseSlug {
  if (!slug) return false;
  return LEGACY_COURSE_SLUGS.includes(slug as LegacyCourseSlug);
}

/**
 * Get the route path for a legacy course
 */
export function getLegacyCourseRoute(slug: LegacyCourseSlug): string {
  return `/courses/${slug}`;
}
