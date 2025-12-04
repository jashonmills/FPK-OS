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

// EL Optimal Learning State Components
import { IntroductionLesson } from '@/components/course/learning-state-lessons/IntroductionLesson';
import { TechniquesLesson } from '@/components/course/learning-state-lessons/TechniquesLesson';
import { BigStrongTreeLesson } from '@/components/course/learning-state-lessons/BigStrongTreeLesson';
import { EnergyBearLesson } from '@/components/course/learning-state-lessons/EnergyBearLesson';
import { FiveFourThreeTwoOneLesson } from '@/components/course/learning-state-lessons/FiveFourThreeTwoOneLesson';
import { LabyrinthLesson } from '@/components/course/learning-state-lessons/LabyrinthLesson';
import { BreathingLesson } from '@/components/course/learning-state-lessons/BreathingLesson';
import { PhoenixBreathLesson } from '@/components/course/learning-state-lessons/PhoenixBreathLesson';
import { SandTimerLesson } from '@/components/course/learning-state-lessons/SandTimerLesson';
import { RaisingBookScreenLesson } from '@/components/course/learning-state-lessons/RaisingBookScreenLesson';
import { LookingUpLesson } from '@/components/course/learning-state-lessons/LookingUpLesson';
import { WorkingTimeLimitsLesson } from '@/components/course/learning-state-lessons/WorkingTimeLimitsLesson';
import { UseImaginationLesson } from '@/components/course/learning-state-lessons/UseImaginationLesson';

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
  
  'optimal-learning-state': [
    { id: 1, title: "Introduction", description: "Getting Into The Most Effective Learning State", component: IntroductionLesson, unit: "Foundation", unitColor: "bg-blue-100 text-blue-700" },
    { id: 2, title: "Learning Techniques", description: "Overview of techniques for optimal learning", component: TechniquesLesson, unit: "Foundation", unitColor: "bg-blue-100 text-blue-700" },
    { id: 3, title: "Big Strong Tree", description: "Planting and grounding technique", component: BigStrongTreeLesson, unit: "Grounding Techniques", unitColor: "bg-green-100 text-green-700" },
    { id: 4, title: "Your Energy Bear", description: "Using your energy bear for grounding", component: EnergyBearLesson, unit: "Grounding Techniques", unitColor: "bg-green-100 text-green-700" },
    { id: 5, title: "5, 4, 3, 2, 1 Technique", description: "Sensory grounding method", component: FiveFourThreeTwoOneLesson, unit: "Grounding Techniques", unitColor: "bg-green-100 text-green-700" },
    { id: 6, title: "Labyrinths", description: "Using labyrinths for focus and brain integration", component: LabyrinthLesson, unit: "Focus Techniques", unitColor: "bg-purple-100 text-purple-700" },
    { id: 7, title: "Box Breathing", description: "Breathing technique for calm and control", component: BreathingLesson, unit: "Breathing Techniques", unitColor: "bg-indigo-100 text-indigo-700" },
    { id: 8, title: "Phoenix Flames Breath", description: "Empowering breath technique", component: PhoenixBreathLesson, unit: "Breathing Techniques", unitColor: "bg-indigo-100 text-indigo-700" },
    { id: 9, title: "Sand Timer", description: "Using timers for regulation and focus", component: SandTimerLesson, unit: "Regulation Tools", unitColor: "bg-orange-100 text-orange-700" },
    { id: 10, title: "Raising Book/Screen", description: "Optimal positioning for learning materials", component: RaisingBookScreenLesson, unit: "Learning Environment", unitColor: "bg-yellow-100 text-yellow-700" },
    { id: 11, title: "Looking Up", description: "Visual positioning techniques", component: LookingUpLesson, unit: "Learning Environment", unitColor: "bg-yellow-100 text-yellow-700" },
    { id: 12, title: "Working Time Limits", description: "Managing focus and concentration periods", component: WorkingTimeLimitsLesson, unit: "Learning Environment", unitColor: "bg-yellow-100 text-yellow-700" },
    { id: 13, title: "Use Their Imagination", description: "Developing visualization and creative thinking", component: UseImaginationLesson, unit: "Creativity Tools", unitColor: "bg-pink-100 text-pink-700" }
  ],
  
  // Aliases for backward compatibility
  'learning-state-beta': [
    { id: 1, title: "Introduction", description: "Getting Into The Most Effective Learning State", component: IntroductionLesson, unit: "Foundation", unitColor: "bg-blue-100 text-blue-700" },
    { id: 2, title: "Learning Techniques", description: "Overview of techniques for optimal learning", component: TechniquesLesson, unit: "Foundation", unitColor: "bg-blue-100 text-blue-700" },
    { id: 3, title: "Big Strong Tree", description: "Planting and grounding technique", component: BigStrongTreeLesson, unit: "Grounding Techniques", unitColor: "bg-green-100 text-green-700" },
    { id: 4, title: "Your Energy Bear", description: "Using your energy bear for grounding", component: EnergyBearLesson, unit: "Grounding Techniques", unitColor: "bg-green-100 text-green-700" },
    { id: 5, title: "5, 4, 3, 2, 1 Technique", description: "Sensory grounding method", component: FiveFourThreeTwoOneLesson, unit: "Grounding Techniques", unitColor: "bg-green-100 text-green-700" },
    { id: 6, title: "Labyrinths", description: "Using labyrinths for focus and brain integration", component: LabyrinthLesson, unit: "Focus Techniques", unitColor: "bg-purple-100 text-purple-700" },
    { id: 7, title: "Box Breathing", description: "Breathing technique for calm and control", component: BreathingLesson, unit: "Breathing Techniques", unitColor: "bg-indigo-100 text-indigo-700" },
    { id: 8, title: "Phoenix Flames Breath", description: "Empowering breath technique", component: PhoenixBreathLesson, unit: "Breathing Techniques", unitColor: "bg-indigo-100 text-indigo-700" },
    { id: 9, title: "Sand Timer", description: "Using timers for regulation and focus", component: SandTimerLesson, unit: "Regulation Tools", unitColor: "bg-orange-100 text-orange-700" },
    { id: 10, title: "Raising Book/Screen", description: "Optimal positioning for learning materials", component: RaisingBookScreenLesson, unit: "Learning Environment", unitColor: "bg-yellow-100 text-yellow-700" },
    { id: 11, title: "Looking Up", description: "Visual positioning techniques", component: LookingUpLesson, unit: "Learning Environment", unitColor: "bg-yellow-100 text-yellow-700" },
    { id: 12, title: "Working Time Limits", description: "Managing focus and concentration periods", component: WorkingTimeLimitsLesson, unit: "Learning Environment", unitColor: "bg-yellow-100 text-yellow-700" },
    { id: 13, title: "Use Their Imagination", description: "Developing visualization and creative thinking", component: UseImaginationLesson, unit: "Creativity Tools", unitColor: "bg-pink-100 text-pink-700" }
  ],
  
  // Add more courses here as they are migrated:
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
