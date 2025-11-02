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
  'french-101',
  'intro-drawing-sketching',
  'web-dev-basics',
  'music-theory-fundamentals',
  'personal-finance-investing',
  'german-for-beginners-101',
  'cybersecurity-fundamentals',
  'public-speaking-debate',
  'us-history-founding-to-civil-war',
  'creative-writing-short-stories-poetry',
  'chemistry-the-central-science',
  'earth-science-our-planet-in-space',
  'irish-history-union-to-famine',
  'ap-us-history',
  'irish-government-and-civics',
  'us-government-and-civics',
  'physics-motion-energy-matter',
  'writing-and-composition-the-complete-essay',
  'biology-the-study-of-life',
  'introduction-to-literature-analyzing-fiction',
  'ap-biology',
  'introduction-to-calculus',
  'pre-calculus',
  'world-history-ancient-to-modern',
  'introduction-to-philosophy',
  'math-6-3-algebra-stats-probability',
  'science-6-1-earth-science-geology-weather',
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
