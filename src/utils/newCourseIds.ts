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
  'writing-composition',
  'intro-calculus',
  'pre-calculus',
  'earth-science',
  'irish-history-union-famine',
  'spanish-101',
  'intro-coding-python',
  'intro-drawing-sketching',
  'cybersecurity-fundamentals',
  'web-dev-basics',
  'german-101',
  'french-101',
  'public-speaking-debate',
  'intro-data-science',
  'music-theory-fundamentals',
  // Additional new courses
  'intro-psychology',
  'world-history',
  'creative-writing',
  'statistics',
  'environmental-science',
  'italian-101',
  'japanese-101',
  'mandarin-101',
  'latin-101',
  'intro-philosophy',
  'sociology-101'
] as const;

export type NewCourseId = typeof NEW_COURSE_IDS[number];

export function isNewCourse(courseId: string): courseId is NewCourseId {
  return NEW_COURSE_IDS.includes(courseId as NewCourseId);
}
