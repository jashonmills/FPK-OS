import { GuideEntry } from '@/types/platform-guide';

export const websiteExpandedGuide: GuideEntry[] = [
  {
    id: 'website-overview',
    section: 'website',
    title: 'Organization Website Management Overview',
    description: 'Central hub for managing your organization\'s branded student portal website, including URL display, iframe preview, and public access settings.',
    userPurpose: 'View how students access your organization\'s portal, verify branding displays correctly, and test the public-facing student experience.',
    route: '/org/:orgId/website',
    component: 'OrgWebsitePage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Website Page Layout',
        action: 'Displays organization website information and preview',
        outcome: 'Shows public URL, embedded preview, and external link button',
        technicalDetails: 'Fetches organization data and renders iframe preview'
      }
    ],
    dataDisplayed: [
      {
        field: 'Organization Website View',
        source: 'organizations table',
        significance: 'Complete view of student-facing portal settings'
      }
    ],
    relatedFeatures: ['Branding Settings', 'Student Access', 'Public Portal']
  },
  {
    id: 'website-public-url',
    section: 'website',
    subsection: 'Public URL Display',
    title: 'Organization Public URL',
    description: 'Display of the unique URL where students and educators access your organization\'s portal.',
    userPurpose: 'Share this URL with students, parents, and staff for accessing the organization-specific student portal.',
    route: '/org/:orgId/website',
    component: 'OrgWebsitePage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Public URL Display',
        action: 'Shows formatted URL based on organization slug',
        outcome: 'Displays the URL where students access the portal',
        technicalDetails: 'Format: https://app.fpkuniversity.com/o/:orgSlug'
      },
      {
        element: 'Copy URL Button',
        action: 'Click to copy URL to clipboard',
        outcome: 'Copies complete URL for easy sharing',
        technicalDetails: 'Uses navigator.clipboard API, shows success toast'
      },
      {
        element: 'URL Explanation Text',
        action: 'Descriptive text explaining URL purpose',
        outcome: 'Helps instructors understand what URL is for',
        technicalDetails: 'Static informational text below URL'
      }
    ],
    dataDisplayed: [
      {
        field: 'Organization Slug',
        source: 'organizations.slug',
        significance: 'URL-friendly identifier used in public portal URL'
      },
      {
        field: 'Complete Portal URL',
        source: 'Constructed from organizations.slug',
        calculation: 'Base domain + "/o/" + organization slug',
        significance: 'Direct link students use to access organization portal'
      }
    ],
    relatedFeatures: ['Organization Slug', 'Student Portal', 'Public Access']
  },
  {
    id: 'website-iframe-preview',
    section: 'website',
    subsection: 'Live Preview',
    title: 'Embedded Website Preview',
    description: 'Live iframe preview showing exactly how the organization portal appears to students.',
    userPurpose: 'Verify branding, layout, and content display without leaving the admin interface. Test student experience in real-time.',
    route: '/org/:orgId/website',
    component: 'OrgWebsitePage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Iframe Embed',
        action: 'Displays live organization portal in embedded frame',
        outcome: 'Shows actual student landing page with applied branding',
        technicalDetails: 'iframe element pointing to /o/:orgSlug with responsive sizing'
      },
      {
        element: 'Scroll Behavior',
        action: 'Scroll within iframe to navigate portal',
        outcome: 'Allows exploration of student portal without navigation',
        technicalDetails: 'Iframe allows scrolling, may have sandbox restrictions for security'
      },
      {
        element: 'Loading State',
        action: 'Shows while iframe content loads',
        outcome: 'Displays skeleton or loading spinner during iframe initialization',
        technicalDetails: 'Conditional render based on iframe onLoad event'
      },
      {
        element: 'Error Handling',
        action: 'If iframe fails to load',
        outcome: 'Shows error message with fallback',
        technicalDetails: 'Catches iframe errors, provides "Open in New Tab" alternative'
      }
    ],
    dataDisplayed: [
      {
        field: 'Embedded Portal View',
        source: 'Live organization portal page',
        significance: 'Real-time preview of student experience including branding and content'
      },
      {
        field: 'Applied Branding',
        source: 'organizations.logo_url, banner_url, accent_color',
        significance: 'Verifies branding settings are correctly applied to portal'
      }
    ],
    relatedFeatures: ['Branding Settings', 'Logo Upload', 'Accent Color', 'Banner Image']
  },
  {
    id: 'website-open-new-tab',
    section: 'website',
    subsection: 'External Access',
    title: 'Open in New Tab Button',
    description: 'Button to open the organization portal in a full browser window for comprehensive testing.',
    userPurpose: 'Test the complete student experience in a full browser environment, including mobile responsiveness and all interactive features.',
    route: '/org/:orgId/website',
    component: 'OrgWebsitePage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Open in New Tab Button',
        action: 'Click button to open portal externally',
        outcome: 'Opens organization portal URL in new browser tab',
        technicalDetails: 'Uses window.open() with target="_blank" and rel="noopener noreferrer"'
      },
      {
        element: 'Icon Display',
        action: 'Button shows external link icon',
        outcome: 'Visual indicator that action opens new window',
        technicalDetails: 'ExternalLink icon from lucide-react'
      },
      {
        element: 'Button Position',
        action: 'Located prominently near iframe preview',
        outcome: 'Easy to find when wanting to test full portal',
        technicalDetails: 'Positioned in header area above iframe'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Student Portal', 'Portal Testing', 'Branding Verification']
  },
  {
    id: 'website-responsive-layout',
    section: 'website',
    subsection: 'Page Layout',
    title: 'Responsive Website Page Layout',
    description: 'Adaptive layout that works across desktop, tablet, and mobile devices.',
    userPurpose: 'Ensure website preview and controls are accessible on all device sizes.',
    route: '/org/:orgId/website',
    component: 'OrgWebsitePage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Desktop Layout',
        action: 'Full-width iframe with controls on top',
        outcome: 'Optimal preview size for desktop viewing',
        technicalDetails: 'Container with max-width and responsive padding'
      },
      {
        element: 'Tablet Layout',
        action: 'Adjusted sizing for medium screens',
        outcome: 'Maintains usability on iPad and similar devices',
        technicalDetails: 'Tailwind responsive classes for medium breakpoint'
      },
      {
        element: 'Mobile Layout',
        action: 'Stacked layout with iframe below controls',
        outcome: 'Ensures all features accessible on mobile',
        technicalDetails: 'Mobile-first responsive design with breakpoints'
      },
      {
        element: 'Iframe Height Adjustment',
        action: 'Dynamically adjusts to viewport',
        outcome: 'Prevents awkward scrolling scenarios',
        technicalDetails: 'Calculated height based on available viewport space'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Responsive Design', 'Mobile Access', 'Device Testing']
  },
  {
    id: 'website-branding-sync',
    section: 'website',
    subsection: 'Branding Integration',
    title: 'Branding Settings Synchronization',
    description: 'How branding changes in Settings tab automatically reflect in the website portal.',
    userPurpose: 'Understand the connection between branding settings and portal appearance. Verify changes take effect immediately.',
    route: '/org/:orgId/website',
    component: 'OrgWebsitePage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Branding Update Propagation',
        action: 'Changes made in Settings > Branding tab',
        outcome: 'Automatically appear in iframe preview and public portal',
        technicalDetails: 'Real-time sync via organization data updates'
      },
      {
        element: 'Logo Display',
        action: 'Logo uploaded in Branding settings',
        outcome: 'Appears in portal navigation and landing page',
        technicalDetails: 'organizations.logo_url referenced in portal components'
      },
      {
        element: 'Banner Display',
        action: 'Banner uploaded in Branding settings',
        outcome: 'Shows in portal header or hero section',
        technicalDetails: 'organizations.banner_url used as background image'
      },
      {
        element: 'Accent Color Application',
        action: 'Accent color set in Branding settings',
        outcome: 'Applied to buttons, links, progress bars in portal',
        technicalDetails: 'organizations.accent_color injected as CSS variable'
      },
      {
        element: 'Refresh to See Changes',
        action: 'May need to reload iframe to see updates',
        outcome: 'Ensures latest branding is displayed',
        technicalDetails: 'Manual iframe refresh or page reload syncs changes'
      }
    ],
    dataDisplayed: [
      {
        field: 'Active Branding Settings',
        source: 'organizations.logo_url, banner_url, accent_color',
        significance: 'Current branding applied to student portal in real-time'
      }
    ],
    relatedFeatures: ['Branding Settings', 'Logo Upload', 'Banner Upload', 'Accent Color']
  },
  {
    id: 'website-student-access-flow',
    section: 'website',
    subsection: 'Student Access',
    title: 'Student Access Flow',
    description: 'How students use the public URL to access the organization portal and log in.',
    userPurpose: 'Understand the student journey from receiving the URL to accessing courses and content.',
    route: '/org/:orgId/website',
    component: 'OrgWebsitePage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Student Visits URL',
        action: 'Student navigates to /o/:orgSlug',
        outcome: 'Lands on organization-specific portal landing page',
        technicalDetails: 'Public route, no authentication required to view landing'
      },
      {
        element: 'Portal Landing Page',
        action: 'Displays organization branding and login options',
        outcome: 'Shows organization name, logo, banner, and login methods',
        technicalDetails: 'Renders OrgPortalLanding component with organization data'
      },
      {
        element: 'Student Login Methods',
        action: 'Student can login via Email or PIN',
        outcome: 'Email: Standard auth. PIN: Child-friendly numeric code',
        technicalDetails: 'Dual authentication paths based on student age/setup'
      },
      {
        element: 'Post-Login Experience',
        action: 'After authentication, student accesses portal',
        outcome: 'Redirected to student dashboard with courses, goals, AI coach',
        technicalDetails: 'Routes to /org/:orgId/dashboard with student context'
      }
    ],
    dataDisplayed: [
      {
        field: 'Organization Context',
        source: 'organizations table via slug lookup',
        significance: 'Determines which organization\'s portal to display'
      }
    ],
    relatedFeatures: ['Student Portal', 'Authentication', 'PIN Login', 'Email Login']
  }
];
