/**
 * Course Content Loader
 * 
 * Utility for loading v2 (data-driven) course content from JSON manifests
 */

import { CourseContentManifest } from '@/types/lessonContent';

/**
 * Slug mapping for legacy database course slugs to actual content directory names
 */
const SLUG_MAP: Record<string, string> = {
  'el-numeracy': 'empowering-learning-numeracy',
  'el-reading': 'empowering-learning-reading',
  // el-handwriting and el-spelling are already correct
};

export const loadCourseContent = async (courseSlug: string): Promise<CourseContentManifest | null> => {
  try {
    // Try original slug first
    try {
      const manifest = await import(`@/content/courses/${courseSlug}/manifest.json`);
      console.log(`✅ Loaded course content for: ${courseSlug}`);
      return manifest.default || manifest;
    } catch (firstError) {
      // Try mapped slug if original fails
      const mappedSlug = SLUG_MAP[courseSlug];
      if (mappedSlug) {
        console.log(`🔄 Trying mapped slug: ${courseSlug} → ${mappedSlug}`);
        const manifest = await import(`@/content/courses/${mappedSlug}/manifest.json`);
        console.log(`✅ Loaded course content using mapped slug: ${mappedSlug}`);
        return manifest.default || manifest;
      }
      throw firstError;
    }
  } catch (error) {
    console.error(`❌ Failed to load content for course: ${courseSlug}`, error);
    return null;
  }
};

export const getLessonContent = (manifest: CourseContentManifest, lessonId: number) => {
  return manifest.lessons.find(lesson => lesson.id === lessonId);
};
