import { GuideEntry } from '@/types/platform-guide';

export const settingsGuide: GuideEntry[] = [
  {
    id: 'settings-overview',
    section: 'settings',
    title: 'Organization Settings Overview',
    description: 'Configure organization-level settings including billing, members, security, and integrations.',
    userPurpose: 'Manage subscription, invite instructors, configure security policies, and integrate external tools.',
    route: '/org/:orgId/settings',
    component: 'OrgSettings.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { element: 'Settings Tabs', action: 'Navigate between setting categories', outcome: 'Access different configuration areas', technicalDetails: 'Tabbed interface' }
    ],
    dataDisplayed: [
      { field: 'Organization Configuration', source: 'organizations table', significance: 'Core org settings and preferences' }
    ],
    relatedFeatures: ['Subscription', 'Members', 'Security', 'Integrations']
  }
];
