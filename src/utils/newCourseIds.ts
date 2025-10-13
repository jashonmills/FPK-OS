/**
 * List of new courses currently in development
 * These appear in the "Coming Soon" section of the catalog
 */
export const NEW_COURSE_IDS = [
  'ap-biology',
  'ap-us-history',
  'biology-study-of-life',
  'calculus-2-integrals-series',
  'chemistry-central-science',
  'creative-writing-short-stories-poetry',
  'cybersecurity-fundamentals',
  'digital-art-graphic-design',
  'earth-science',
  'french-101',
  'german-101',
  'intro-calculus',
  'intro-coding-python',
  'intro-data-science',
  'intro-drawing-sketching',
  'intro-literature-analyzing-fiction',
  'introduction-to-philosophy',
  'introduction-to-psychology',
  'irish-government-civics',
  'irish-history-union-famine',
  'music-theory-fundamentals',
  'personal-finance-investing',
  'physics-motion-energy-matter',
  'pre-calculus',
  'public-speaking-debate',
  'spanish-101',
  'us-government-civics',
  'us-history-founding-civil-war',
  'web-dev-basics',
  'world-history-ancient-modern',
  'writing-composition',
] as const;

export type NewCourseId = typeof NEW_COURSE_IDS[number];

export function isNewCourse(courseId: string): courseId is NewCourseId {
  return NEW_COURSE_IDS.includes(courseId as NewCourseId);
}
