/**
 * Utility to sync course manifests from filesystem to database
 * Run this once to populate content_manifest for all courses
 */

import { supabase } from '@/integrations/supabase/client';

// Import all course manifests
import introVideoProduction from '@/content/courses/introduction-video-production/manifest.json';
import moneyManagementTeens from '@/content/courses/money-management-teens/manifest.json';
import philosophyEthics from '@/content/courses/philosophy-ethics/manifest.json';
import careerReadiness from '@/content/courses/career-readiness/manifest.json';
import sociology101 from '@/content/courses/sociology-101/manifest.json';
import healthWellness from '@/content/courses/health-wellness/manifest.json';
import theaterPerformance from '@/content/courses/theater-performance/manifest.json';
import personalFinance from '@/content/courses/personal-finance/manifest.json';
import earthScience from '@/content/courses/earth-science-geology/manifest.json';
import calculus2 from '@/content/courses/calculus-2-integrals-series/manifest.json';
import publicSpeaking from '@/content/courses/public-speaking/manifest.json';
import environmentalScience from '@/content/courses/environmental-science/manifest.json';
import biologyStudyOfLife from '@/content/courses/biology-study-of-life/manifest.json';
import microeconomics from '@/content/courses/microeconomics/manifest.json';
import mandarinChinese from '@/content/courses/mandarin-chinese-101/manifest.json';
import digitalArtDesign from '@/content/courses/digital-art-design/manifest.json';
import introPsychology from '@/content/courses/intro-psychology/manifest.json';
import webDevelopment from '@/content/courses/web-development-fundamentals/manifest.json';
import introductionPsychology from '@/content/courses/introduction-to-psychology/manifest.json';
import statisticsDataAnalysis from '@/content/courses/statistics-data-analysis/manifest.json';
import introCodingPython from '@/content/courses/intro-coding-python/manifest.json';
import usHistory from '@/content/courses/us-history-colonial-modern/manifest.json';
import digitalArtGraphicDesign from '@/content/courses/digital-art-graphic-design/manifest.json';
import calculusAB from '@/content/courses/calculus-ab/manifest.json';
import anatomyPhysiology from '@/content/courses/anatomy-physiology/manifest.json';
import dataStructures from '@/content/courses/data-structures-algorithms/manifest.json';
import trigonometry from '@/content/courses/interactive-trigonometry/manifest.json';
import linearEquations from '@/content/courses/interactive-linear-equations/manifest.json';
import logicCriticalThinking from '@/content/courses/logic-critical-thinking/manifest.json';
import numeracyExtended from '@/content/courses/empowering-learning-numeracy-extended/manifest.json';

export const syncCourseManifests = async () => {
  console.log('[SYNC] Starting course manifest sync...');

  const manifestMap: Record<string, any> = {
    'introduction-video-production': introVideoProduction,
    'money-management-teens': moneyManagementTeens,
    'philosophy-ethics': philosophyEthics,
    'career-readiness': careerReadiness,
    'sociology-101': sociology101,
    'health-wellness': healthWellness,
    'theater-performance': theaterPerformance,
    'personal-finance': personalFinance,
    'earth-science-geology': earthScience,
    'calculus-2-integrals-series': calculus2,
    'public-speaking': publicSpeaking,
    'environmental-science': environmentalScience,
    'biology-study-of-life': biologyStudyOfLife,
    'microeconomics': microeconomics,
    'mandarin-chinese-101': mandarinChinese,
    'digital-art-design': digitalArtDesign,
    'intro-psychology': introPsychology,
    'web-development-fundamentals': webDevelopment,
    'introduction-to-psychology': introductionPsychology,
    'statistics-data-analysis': statisticsDataAnalysis,
    'intro-coding-python': introCodingPython,
    'us-history-colonial-modern': usHistory,
    'digital-art-graphic-design': digitalArtGraphicDesign,
    'calculus-ab': calculusAB,
    'anatomy-physiology': anatomyPhysiology,
    'data-structures-algorithms': dataStructures,
    'interactive-trigonometry': trigonometry,
    'interactive-linear-equations': linearEquations,
    'logic-critical-thinking': logicCriticalThinking,
    'empowering-learning-numeracy-extended': numeracyExtended,
  };

  const courses = Object.entries(manifestMap).map(([slug, manifest]) => ({
    slug,
    manifest,
  }));

  try {
    const { data, error } = await supabase.functions.invoke('sync-course-manifests', {
      body: { courses },
    });

    if (error) {
      console.error('[SYNC] Error:', error);
      return { success: false, error };
    }

    console.log('[SYNC] Complete:', data);
    return { success: true, data };
  } catch (error) {
    console.error('[SYNC] Exception:', error);
    return { success: false, error };
  }
};
