/**
 * Course Component Registry
 * 
 * This is the single source of truth for mapping course slugs/IDs to their lesson components.
 * When a course is loaded, this registry determines which components to render.
 * 
 * Pattern: Component Registry
 * - Explicit mapping of course keys to their lesson arrays
 * - Type-safe with CourseLesson interface
 * - Easy to maintain and extend
 */

import { CourseLesson } from '@/types/course';

// EL Handwriting Course Components
import { ELHandwritingIntroductionLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingIntroductionLesson';
import { ELHandwritingOptimalStateLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingOptimalStateLesson';
import { ELHandwritingTechniqueLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingTechniqueLesson';
import { ELHandwritingConclusionLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingConclusionLesson';
import { ELHandwritingScienceDeepDiveLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingScienceDeepDiveLesson';
import { ELHandwritingOptimalStateDeepDiveLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingOptimalStateDeepDiveLesson';
import { ELHandwritingEmulationDeepDiveLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingEmulationDeepDiveLesson';
import { ELHandwritingBeyondDeepDiveLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingBeyondDeepDiveLesson';
import { ELHandwritingFinalTestLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingFinalTestLesson';

/**
 * Registry of all course lesson configurations
 * Key: course slug or ID (matches content_component from database)
 * Value: Array of CourseLesson objects
 */
export const COURSE_COMPONENT_REGISTRY: Record<string, CourseLesson[]> = {
  'el-handwriting': [
    { 
      id: 1, 
      title: "Introduction", 
      description: "Welcome to the Empowering Learning for Handwriting programme", 
      component: ELHandwritingIntroductionLesson, 
      unit: "Main Course", 
      unitColor: "bg-blue-100 text-blue-700" 
    },
    { 
      id: 2, 
      title: "The Optimal Learning State", 
      description: "Get grounded using techniques from the Learning State programme", 
      component: ELHandwritingOptimalStateLesson, 
      unit: "Main Course", 
      unitColor: "bg-blue-100 text-blue-700" 
    },
    { 
      id: 3, 
      title: "The Technique", 
      description: "Learn the handwriting emulation technique with interactive practice", 
      component: ELHandwritingTechniqueLesson, 
      unit: "Main Course", 
      unitColor: "bg-blue-100 text-blue-700" 
    },
    { 
      id: 4, 
      title: "Conclusion", 
      description: "Wrap up and continue your handwriting journey", 
      component: ELHandwritingConclusionLesson, 
      unit: "Main Course", 
      unitColor: "bg-blue-100 text-blue-700" 
    },
    { 
      id: 5, 
      title: "The Science of Learning", 
      description: "Understanding the neuroscience behind handwriting development", 
      component: ELHandwritingScienceDeepDiveLesson, 
      unit: "Deep Dive", 
      unitColor: "bg-purple-100 text-purple-700" 
    },
    { 
      id: 6, 
      title: "Optimal Learning State Techniques", 
      description: "Advanced state management for effective practice", 
      component: ELHandwritingOptimalStateDeepDiveLesson, 
      unit: "Deep Dive", 
      unitColor: "bg-purple-100 text-purple-700" 
    },
    { 
      id: 7, 
      title: "The Art and Science of Emulation", 
      description: "Mirror neurons and observational learning principles", 
      component: ELHandwritingEmulationDeepDiveLesson, 
      unit: "Deep Dive", 
      unitColor: "bg-purple-100 text-purple-700" 
    },
    { 
      id: 8, 
      title: "Beyond Handwriting", 
      description: "Universal learning principles for lifelong development", 
      component: ELHandwritingBeyondDeepDiveLesson, 
      unit: "Deep Dive", 
      unitColor: "bg-purple-100 text-purple-700" 
    },
    { 
      id: 9, 
      title: "Final Test", 
      description: "Comprehensive assessment of core principles", 
      component: ELHandwritingFinalTestLesson, 
      unit: "Assessment", 
      unitColor: "bg-gray-100 text-gray-700" 
    }
  ],
  
  // Add more courses here as they are migrated:
  // 'optimal-learning-state': [...],
  // 'interactive-algebra': [...],
  // etc.
};

/**
 * Get lesson configuration for a specific course
 * @param courseKey - The course slug/ID (from database content_component field)
 * @returns Array of CourseLesson objects, or null if not found
 */
export function getCourseLessons(courseKey: string): CourseLesson[] | null {
  return COURSE_COMPONENT_REGISTRY[courseKey] || null;
}

/**
 * Check if a course has lesson components registered
 * @param courseKey - The course slug/ID
 * @returns True if course has lessons registered
 */
export function hasCourseComponents(courseKey: string): boolean {
  return courseKey in COURSE_COMPONENT_REGISTRY;
}

/**
 * Get all registered course keys
 * @returns Array of course slugs that have component mappings
 */
export function getRegisteredCourseKeys(): string[] {
  return Object.keys(COURSE_COMPONENT_REGISTRY);
}
