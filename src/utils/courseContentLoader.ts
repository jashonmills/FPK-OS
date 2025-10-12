/**
 * Course Content Loader
 * 
 * Utility for loading v2 (data-driven) course content from JSON manifests
 */

import { CourseContentManifest } from '@/types/lessonContent';

export const loadCourseContent = async (courseSlug: string): Promise<CourseContentManifest | null> => {
  try {
    // Import the JSON manifest for this course
    const manifest = await import(`@/content/courses/${courseSlug}/manifest.json`);
    return manifest.default || manifest;
  } catch (error) {
    console.error(`Failed to load content for course: ${courseSlug}`, error);
    return null;
  }
};

export const getLessonContent = (manifest: CourseContentManifest, lessonId: number) => {
  return manifest.lessons.find(lesson => lesson.id === lessonId);
};
