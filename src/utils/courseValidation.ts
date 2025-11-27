/**
 * Course Validation Utility
 * 
 * Validates courses before publishing to ensure they have all required content
 */

import { loadCourseContent } from './courseContentLoader';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validateCourseForPublishing(
  courseSlug: string,
  courseTitle: string,
  courseDescription?: string
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check basic metadata
  if (!courseTitle || courseTitle.trim().length === 0) {
    errors.push('Course title is required');
  }

  if (!courseDescription || courseDescription.trim().length === 0) {
    warnings.push('Course description is empty - consider adding one for better discoverability');
  }

  if (!courseSlug || courseSlug.trim().length === 0) {
    errors.push('Course slug is required');
  }

  // Check for manifest file and content
  try {
    const manifest = await loadCourseContent(courseSlug);
    
    if (!manifest) {
      errors.push('Course manifest file is missing. Please create a manifest at src/content/courses/' + courseSlug + '/manifest.json');
    } else {
      // Validate manifest has lessons
      if (!manifest.lessons || manifest.lessons.length === 0) {
        errors.push('Course has no lessons. Add at least one lesson to the manifest.');
      }

      // Check if lessons have required fields
      const lessonsWithoutTitles = manifest.lessons.filter(lesson => !lesson.title);
      if (lessonsWithoutTitles.length > 0) {
        errors.push(`${lessonsWithoutTitles.length} lesson(s) are missing titles`);
      }

      const lessonsWithoutContent = manifest.lessons.filter(lesson => !lesson.sections || lesson.sections.length === 0);
      if (lessonsWithoutContent.length > 0) {
        warnings.push(`${lessonsWithoutContent.length} lesson(s) have no content sections`);
      }
    }
  } catch (error) {
    errors.push('Failed to load course manifest: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
