/**
 * Platform Guide - Central Export
 */

import { dashboardGuide } from './organization-owner/dashboard';
import { studentsGuide } from './organization-owner/students';
import { groupsGuide } from './organization-owner/groups';
import { coursesGuide } from './organization-owner/courses';
import { iepGuide } from './organization-owner/iep';
import { goalsNotesGuide } from './organization-owner/goals';
import { aiAssistantGuide } from './organization-owner/ai-assistant';
import { gamesGuide } from './organization-owner/games';
import { websiteGuide } from './organization-owner/website';
import { settingsGuide } from './organization-owner/settings';
import { studentPortalGuide } from './student-portal/overview';
import { GuideSectionMeta } from '@/types/platform-guide';

export const organizationOwnerGuide: GuideSectionMeta[] = [
  { id: 'dashboard', title: 'Dashboard', description: 'Organization overview, statistics, and quick actions', icon: 'Home', route: '/org/:orgId', entries: dashboardGuide },
  { id: 'students', title: 'Students', description: 'Student roster management and profiles', icon: 'Users', route: '/org/:orgId/students', entries: studentsGuide },
  { id: 'groups', title: 'Groups', description: 'Cohort and class group management', icon: 'UserCog', route: '/org/:orgId/groups', entries: groupsGuide },
  { id: 'courses', title: 'Courses', description: 'Course catalog and assignment management', icon: 'BookOpen', route: '/org/:orgId/courses', entries: coursesGuide },
  { id: 'iep', title: 'Interactive IEP', description: 'IEP creation and compliance management', icon: 'FileText', route: '/org/:orgId/iep', entries: iepGuide },
  { id: 'goals', title: 'Goals & Notes', description: 'Student goals and instructor notes', icon: 'Target', route: '/org/:orgId/goals-notes', entries: goalsNotesGuide },
  { id: 'ai-assistant', title: 'AI Assistant', description: 'AI-powered organization management', icon: 'Bot', route: '/org/:orgId/ai-coach', entries: aiAssistantGuide },
  { id: 'games', title: 'Games', description: 'Educational games library', icon: 'Gamepad2', route: '/org/:orgId/games', entries: gamesGuide },
  { id: 'website', title: 'Website', description: 'Portal branding and configuration', icon: 'Globe', route: '/org/:orgId/website', entries: websiteGuide },
  { id: 'settings', title: 'Settings', description: 'Organization settings and preferences', icon: 'Settings', route: '/org/:orgId/settings', entries: settingsGuide }
];

export const studentPortalGuideSections: GuideSectionMeta[] = [
  { id: 'dashboard', title: 'Student Dashboard', description: 'Personal learning overview and stats', icon: 'Home', route: '/dashboard/learner', entries: studentPortalGuide.filter(e => e.id === 'student-dashboard') },
  { id: 'courses', title: 'My Courses', description: 'Assigned courses and progress', icon: 'BookOpen', route: '/dashboard/learner/courses', entries: studentPortalGuide.filter(e => e.section === 'courses') },
  { id: 'goals', title: 'Goals', description: 'Learning objectives and targets', icon: 'Target', route: '/dashboard/learner/goals', entries: studentPortalGuide.filter(e => e.section === 'goals') },
  { id: 'analytics', title: 'Learning Analytics', description: 'Performance and progress insights', icon: 'BarChart', route: '/dashboard/learner/analytics', entries: studentPortalGuide.filter(e => e.section === 'analytics') },
  { id: 'gamification', title: 'XP & Achievements', description: 'Gamification rewards system', icon: 'Award', route: '/dashboard/learner/gamification', entries: studentPortalGuide.filter(e => e.section === 'gamification') },
  { id: 'ai-assistant', title: 'AI Study Coach', description: 'Personal AI tutor', icon: 'Bot', route: '/dashboard/learner/ai-coach', entries: studentPortalGuide.filter(e => e.section === 'ai-assistant') },
  { id: 'study', title: 'Notes & Flashcards', description: 'Study tools', icon: 'StickyNote', route: '/dashboard/learner/notes', entries: studentPortalGuide.filter(e => e.section === 'study') }
];

export const allGuideEntries = [...dashboardGuide, ...studentsGuide, ...groupsGuide, ...coursesGuide, ...iepGuide, ...goalsNotesGuide, ...aiAssistantGuide, ...gamesGuide, ...websiteGuide, ...settingsGuide, ...studentPortalGuide];
