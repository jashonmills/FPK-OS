/**
 * ⚠️ DEPRECATED - This utility is being phased out
 * 
 * DO NOT USE FOR NEW CODE
 * 
 * Single Source of Truth: Use course.background_image from database instead.
 * This file exists only for legacy fallback support and will be removed in future versions.
 * 
 * Migration: All components should read course.background_image directly from the database.
 */

// Course image imports
import linearEquationsBg from '@/assets/linear-equations-unique-bg.jpg';
import trigBg from '@/assets/trigonometry-background.jpg';
import algebraBg from '@/assets/linear-equations-background.jpg';
import logicBg from '@/assets/logic-background.jpg';
import economicsBg from '@/assets/economics-background.jpg';
import neurodiversityBackground from '@/assets/neurodiversity-background.jpg';
import moneyManagementBg from '@/assets/money-management-background.jpg';
import empoweringHandwritingBg from '@/assets/empowering-handwriting-bg.jpg';
import elHandwritingBg from '@/assets/el-handwriting-bg.jpg';
import interactiveGeometryBg from '@/assets/interactive-geometry-fundamentals-bg.jpg';
import empoweringNumeracyBg from '@/assets/empowering-numeracy-bg.jpg';
import empoweringReadingBg from '@/assets/empowering-reading-bg.jpg';
import empoweringSpellingBg from '@/assets/empowering-spelling-new-bg.jpg';
import learningStateBg from '@/assets/learning-state-course-bg.jpg';
import eltBackground from '@/assets/elt-background-generated.jpg';
import scienceCourseBg from '@/assets/science-background-generated.jpg';
import creativeWritingBg from '@/assets/creative-writing-bg.jpg';
import drawingSketchingBg from '@/assets/drawing-sketching-bg.jpg';
import philosophyBg from '@/assets/philosophy-bg.jpg';

/**
 * Single source of truth for course images
 * Maps course IDs to their corresponding background images
 */
export const courseImageMap: Record<string, string> = {
  'interactive-linear-equations': linearEquationsBg,
  'interactive-trigonometry': trigBg,
  'interactive-algebra': algebraBg,
  'logic-critical-thinking': logicBg,
  'introduction-modern-economics': economicsBg,
  'empowering-learning-reading': empoweringReadingBg,
  'empowering-learning-numeracy': empoweringNumeracyBg,
  'empowering-learning-handwriting': empoweringHandwritingBg,
  'el-handwriting': elHandwritingBg,
  'empowering-learning-spelling': empoweringSpellingBg,
  'optimal-learning-state': learningStateBg,
  'neurodiversity-strengths-based-approach': neurodiversityBackground,
  'interactive-science': scienceCourseBg,
  'money-management-teens': moneyManagementBg,
  'geometry': interactiveGeometryBg,
  'learning-state-course': learningStateBg,
  'elt-empowering-learning-techniques': eltBackground,
  'creative-writing-short-stories-poetry': creativeWritingBg,
  'intro-drawing-sketching': drawingSketchingBg,
  'introduction-to-philosophy': philosophyBg,
};

/**
 * @deprecated Use course.background_image from database instead
 * 
 * Get the appropriate course image based on course ID and title
 * @param id - Course ID
 * @param title - Course title (used for fallback matching)
 * @returns The appropriate background image URL
 */
export const getCourseImage = (id: string, title: string): string => {
  // Check direct ID mapping first
  if (courseImageMap[id]) {
    return courseImageMap[id];
  }
  
  // Fallback based on title keywords (using actual course background images)
  const titleLower = title.toLowerCase();
  if (titleLower.includes('linear') || titleLower.includes('equation')) return linearEquationsBg;
  if (titleLower.includes('trigonometry') || titleLower.includes('trig')) return trigBg;
  if (titleLower.includes('algebra')) return algebraBg;
  if (titleLower.includes('logic') || titleLower.includes('critical')) return logicBg;
  if (titleLower.includes('economics') || titleLower.includes('economic')) return economicsBg;
  if (titleLower.includes('spelling')) return empoweringSpellingBg;
  if (titleLower.includes('reading')) return empoweringReadingBg;
  if (titleLower.includes('numeracy')) return empoweringNumeracyBg;
  if (titleLower.includes('handwriting') || titleLower.includes('writing')) return empoweringHandwritingBg;
  if (titleLower.includes('neurodiversity') || titleLower.includes('neurodivergent')) return neurodiversityBackground;
  if (titleLower.includes('science') || titleLower.includes('biology') || titleLower.includes('chemistry')) return scienceCourseBg;
  if (titleLower.includes('money') || titleLower.includes('financial') || titleLower.includes('teen')) return moneyManagementBg;
  if (titleLower.includes('geometry')) return interactiveGeometryBg;
  if (titleLower.includes('learning state')) return learningStateBg;
  if (titleLower.includes('elt') || titleLower.includes('empowering learning techniques')) return eltBackground;
  if (titleLower.includes('creative writing') || titleLower.includes('poetry') || titleLower.includes('short stories')) return creativeWritingBg;
  if (titleLower.includes('drawing') || titleLower.includes('sketching') || titleLower.includes('art')) return drawingSketchingBg;
  if (titleLower.includes('philosophy') || titleLower.includes('ethics')) return philosophyBg;
  
  // Default fallback
  return scienceCourseBg;
};