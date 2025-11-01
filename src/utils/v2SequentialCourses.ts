/**
 * Registry of V2 Sequential Framework courses
 * These courses MUST use the UniversalCoursePlayer at /courses/player/:slug
 * 
 * CRITICAL: Any course listed here will bypass legacy routing and always
 * route through the UniversalCoursePlayer and SequentialCourseShell.
 */
export const V2_SEQUENTIAL_COURSE_SLUGS = [
  'el-spelling',
  'el-handwriting',
  'empowering-learning-numeracy',
  'empowering-learning-reading',
  'optimal-learning-state',
  'elt-empowering-learning-techniques',
  'introduction-video-production',
  'french-101',
  'intro-drawing-sketching',
] as const;

export type V2SequentialCourseSlug = typeof V2_SEQUENTIAL_COURSE_SLUGS[number];

/**
 * Check if a course slug is a V2 sequential course
 */
export function isV2SequentialCourse(slug: string | null | undefined): slug is V2SequentialCourseSlug {
  if (!slug) return false;
  return V2_SEQUENTIAL_COURSE_SLUGS.includes(slug as V2SequentialCourseSlug);
}

/**
 * Get the Universal Player route for a V2 sequential course
 */
export function getV2CourseRoute(slug: V2SequentialCourseSlug): string {
  return `/courses/player/${slug}`;
}
