import { GuideEntry } from '@/types/platform-guide';

export const websiteGuide: GuideEntry[] = [
  {
    id: 'website-overview',
    section: 'website',
    title: 'Organization Website Management',
    description: 'Manage branded student portal website including URL, branding, and feature toggles.',
    userPurpose: 'Customize student-facing portal with organization branding and control feature access.',
    route: '/org/:orgId/website',
    component: 'WebsiteSettings.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { element: 'Public URL Display', action: 'Shows organization portal URL', outcome: 'Students access via this URL', technicalDetails: 'Format: /:orgSlug' }
    ],
    dataDisplayed: [
      { field: 'Portal Configuration', source: 'organization_branding table', significance: 'Controls student portal appearance' }
    ],
    relatedFeatures: ['Branding', 'Custom Domain', 'Feature Toggles']
  }
];
