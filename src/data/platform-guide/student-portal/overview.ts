/**
 * Student Portal - Complete Feature Guide
 * Route: /dashboard/learner
 */

import { GuideEntry } from '@/types/platform-guide';
import { studentDashboardGuide } from './dashboard-expanded';
import { studentCoursesGuide } from './courses-expanded';
import { studentGoalsGuide } from './goals-expanded';
import { studentAnalyticsGuide } from './analytics-expanded';
import { studentGamificationGuide } from './gamification-expanded';
import { studentAIAssistantGuide } from './ai-assistant-expanded';
import { studentStudyGuide } from './study-expanded';

export const studentPortalGuide: GuideEntry[] = [
  ...studentDashboardGuide,
  ...studentCoursesGuide,
  ...studentGoalsGuide,
  ...studentAnalyticsGuide,
  ...studentGamificationGuide,
  ...studentAIAssistantGuide,
  ...studentStudyGuide
];
