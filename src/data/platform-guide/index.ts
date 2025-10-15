/**
 * Platform Guide - Central Export
 */

import { dashboardGuide } from './organization-owner/dashboard';
import { GuideSectionMeta } from '@/types/platform-guide';

export const organizationOwnerGuide: GuideSectionMeta[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Organization overview, statistics, and quick actions',
    icon: 'Home',
    route: '/org/:orgId',
    entries: dashboardGuide
  }
  // Future sections will be added here:
  // students, groups, courses, iep, goals, ai-assistant, games, website, settings
];

export { dashboardGuide };
