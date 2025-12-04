/**
 * Platform Guide Type Definitions
 * Comprehensive documentation system for FPK University Platform
 */

export type AccessLevel = 'owner' | 'admin' | 'instructor' | 'instructor_aide' | 'student';
export type GuideSection = 'dashboard' | 'students' | 'groups' | 'courses' | 'iep' | 'goals' | 'ai-assistant' | 'games' | 'website' | 'settings' | 'analytics' | 'gamification' | 'study';

export interface InteractionDetail {
  element: string;
  action: string;
  outcome: string;
  technicalDetails?: string;
}

export interface DataFieldDetail {
  field: string;
  source: string;
  calculation?: string;
  refreshRate?: string;
  significance: string;
}

export interface GuideEntry {
  id: string;
  section: GuideSection;
  subsection?: string;
  title: string;
  description: string;
  userPurpose: string;
  interactions: InteractionDetail[];
  dataDisplayed: DataFieldDetail[];
  relatedFeatures: string[];
  screenshots?: string[];
  videoWalkthrough?: string;
  accessLevel: AccessLevel[];
  route?: string;
  component?: string;
}

export interface GuideSectionMeta {
  id: GuideSection;
  title: string;
  description: string;
  icon: string;
  route: string;
  entries: GuideEntry[];
}
