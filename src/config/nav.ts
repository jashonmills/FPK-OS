import React from 'react';
import { 
  Home, 
  BookOpen, 
  Library, 
  BarChart3, 
  Bot, 
  Flag, 
  Medal, 
  Notebook,
  Layout,
  Building2,
  Users,
  ClipboardCheck,
  Paintbrush,
  Compass,
  Sparkles
} from 'lucide-react';

export type NavItem = {
  label: string;
  icon: React.ReactNode;
  to: string;
  exact?: boolean;
  show?: boolean;
};

export const navPersonal: NavItem[] = [
  { label: 'Home', icon: React.createElement(Home), to: '/dashboard/learner' },
  { label: 'Organizations', icon: React.createElement(Building2), to: '/dashboard/organizations' },
  { label: 'Courses', icon: React.createElement(BookOpen), to: '/dashboard/learner/courses' },
  { label: 'Library', icon: React.createElement(Library), to: '/dashboard/learner/library' },
  { label: 'Analytics', icon: React.createElement(BarChart3), to: '/dashboard/learner/analytics' },
  { label: 'Live Learning Hub', icon: React.createElement(Compass), to: '/dashboard/learner/live-hub' },
  { label: 'AI Assistant', icon: React.createElement(Sparkles), to: '/dashboard/learner/ai-coach' },
  { label: 'Goals', icon: React.createElement(Flag), to: '/dashboard/learner/goals' },
  { label: 'Achievements & XP', icon: React.createElement(Medal), to: '/dashboard/learner/gamification' },
  { label: 'Notes', icon: React.createElement(Notebook), to: '/dashboard/learner/notes' },
];

export const navOrgStudent: NavItem[] = [
  { label: 'Home', icon: React.createElement(Home), to: '/dashboard/learner?org=:orgId' },
  { label: 'Courses', icon: React.createElement(BookOpen), to: '/dashboard/learner/courses?org=:orgId' },
  { label: 'Library', icon: React.createElement(Library), to: '/dashboard/learner/library?org=:orgId' },
  { label: 'Analytics', icon: React.createElement(BarChart3), to: '/dashboard/learner/analytics?org=:orgId' },
  { label: 'Live Learning Hub', icon: React.createElement(Compass), to: '/dashboard/learner/live-hub?org=:orgId' },
  { label: 'AI Assistant', icon: React.createElement(Sparkles), to: '/dashboard/learner/ai-coach?org=:orgId' },
  { label: 'Goals', icon: React.createElement(Flag), to: '/dashboard/learner/goals?org=:orgId' },
  { label: 'Achievements & XP', icon: React.createElement(Medal), to: '/dashboard/learner/gamification?org=:orgId' },
  { label: 'Notes', icon: React.createElement(Notebook), to: '/dashboard/learner/notes?org=:orgId' },
];

export const navOrgInstructor: NavItem[] = [
  { label: 'Home', icon: React.createElement(Layout), to: '/dashboard/instructor?org=:orgId' },
  { label: 'Organization', icon: React.createElement(Building2), to: '/dashboard/instructor/organization?org=:orgId' },
  { label: 'Students', icon: React.createElement(Users), to: '/dashboard/instructor/students?org=:orgId' },
  { label: 'Courses', icon: React.createElement(BookOpen), to: '/dashboard/instructor/courses?org=:orgId' },
  { label: 'Assignments', icon: React.createElement(ClipboardCheck), to: '/dashboard/instructor/assignments?org=:orgId' },
  { label: 'Goals', icon: React.createElement(Flag), to: '/dashboard/instructor/goals?org=:orgId' },
  { label: 'Notes', icon: React.createElement(Notebook), to: '/dashboard/instructor/notes?org=:orgId' },
  { label: 'Analytics', icon: React.createElement(BarChart3), to: '/dashboard/instructor/analytics?org=:orgId' },
  { label: 'Live Learning Hub', icon: React.createElement(Compass), to: '/dashboard/learner/live-hub?org=:orgId' },
  { label: 'Branding', icon: React.createElement(Paintbrush), to: '/dashboard/instructor/branding?org=:orgId' },
];

// Helper function to inject orgId into routes
export function injectOrgId(navItems: NavItem[], orgId: string | null): NavItem[] {
  if (!orgId) return navItems;
  
  return navItems.map(item => ({
    ...item,
    to: item.to.replace(':orgId', orgId)
  }));
}

// Helper function to determine navigation context
export function getNavigationContext(
  isPersonalMode: boolean,
  userRole: 'owner' | 'instructor' | 'student' | null
) {
  if (isPersonalMode) {
    return 'personal';
  }
  
  if (userRole === 'owner' || userRole === 'instructor') {
    return 'org-instructor';
  }
  
  return 'org-student';
}