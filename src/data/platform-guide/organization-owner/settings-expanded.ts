import { GuideEntry } from '@/types/platform-guide';

export const settingsExpandedGuide: GuideEntry[] = [
  {
    id: 'settings-navigation-overview',
    section: 'settings',
    subsection: 'Navigation',
    title: 'Settings Page Navigation',
    description: 'Understanding the tabbed interface for managing organization settings.',
    userPurpose: 'Navigate between different configuration areas including General, Branding, Members, My Profile, and AI Learning Coach settings.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Settings Tabs', 
        action: 'Click on any tab (General, Branding, Invite Members, Members, My Profile, AI Learning Coach)', 
        outcome: 'Switches to the selected settings view', 
        technicalDetails: 'React state manages active tab, preserves unsaved changes in memory' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Active Tab Indicator', 
        source: 'Component state', 
        significance: 'Shows which settings section you\'re currently viewing' 
      }
    ],
    relatedFeatures: ['Organization Configuration', 'Member Management', 'Branding Customization']
  },
  {
    id: 'settings-general-org-name',
    section: 'settings',
    subsection: 'General Tab',
    title: 'Organization Name Display',
    description: 'View your organization\'s name as it appears throughout the platform.',
    userPurpose: 'Identify which organization you\'re managing. Organization name is set during creation and can be changed by contacting support.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Organization Name Field', 
        action: 'View organization name in General tab', 
        outcome: 'Displays the current organization name (read-only)', 
        technicalDetails: 'Pulled from organizations.name in database' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Organization Name', 
        source: 'organizations.name', 
        significance: 'Primary identifier for your organization across all features' 
      }
    ],
    relatedFeatures: ['Organization Settings', 'Dashboard Header']
  },
  {
    id: 'settings-general-plan-badge',
    section: 'settings',
    subsection: 'General Tab',
    title: 'Subscription Plan Badge',
    description: 'View your current subscription tier and access upgrade options.',
    userPurpose: 'Check your active plan (Free, Pro, Enterprise) and understand available features or upgrade when needed.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Plan Badge', 
        action: 'View colored badge showing current plan tier', 
        outcome: 'Displays "Free", "Pro", or "Enterprise" with plan-specific styling', 
        technicalDetails: 'Color-coded: Free (gray), Pro (blue), Enterprise (purple)' 
      },
      { 
        element: 'Upgrade Button', 
        action: 'Click "Upgrade Plan" if on Free or Pro tier', 
        outcome: 'Opens subscription management dialog or redirects to billing portal', 
        technicalDetails: 'Owners only; navigates to Stripe customer portal' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Subscription Tier', 
        source: 'organizations.subscription_tier', 
        significance: 'Determines feature access, member limits, storage quotas' 
      }
    ],
    relatedFeatures: ['Billing', 'Feature Access', 'Member Limits']
  },
  {
    id: 'settings-branding-logo-upload',
    section: 'settings',
    subsection: 'Branding Tab',
    title: 'Organization Logo Upload',
    description: 'Step-by-step guide to uploading a custom logo for your organization.',
    userPurpose: 'Personalize your organization\'s brand identity by uploading a logo that appears in navigation, student portals, and reports.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Logo Upload Area', 
        action: 'Click the upload icon or dashed border area in the Logo section', 
        outcome: 'Opens your device\'s file picker dialog', 
        technicalDetails: 'Accepts .png, .jpg, .jpeg, .svg up to 2MB' 
      },
      { 
        element: 'File Selection', 
        action: 'Choose an image file from your computer', 
        outcome: 'Shows preview of selected image before uploading', 
        technicalDetails: 'Recommended: 200x200px minimum, square aspect ratio (1:1), transparent backgrounds work best' 
      },
      { 
        element: 'Upload Confirmation', 
        action: 'File automatically uploads once selected', 
        outcome: 'Image appears in preview area, logo_url is updated in database', 
        technicalDetails: 'Stored in Supabase storage bucket "org-branding" at path: {orgId}/logo.{ext}' 
      },
      { 
        element: 'Remove Logo', 
        action: 'Click the X icon on uploaded logo to remove it', 
        outcome: 'Returns to placeholder state, deletes file from storage', 
        technicalDetails: 'Sets logo_url to null in organizations table' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Logo Preview', 
        source: 'organizations.logo_url', 
        significance: 'Real-time preview of current logo, shows in org navigation immediately after upload' 
      },
      { 
        field: 'Upload Status', 
        source: 'Client mutation state', 
        significance: 'Loading spinner during upload, success checkmark or error message on completion' 
      }
    ],
    relatedFeatures: ['Banner Upload', 'Accent Color', 'Live Preview', 'Student Portal Branding']
  },
  {
    id: 'settings-branding-banner-upload',
    section: 'settings',
    subsection: 'Branding Tab',
    title: 'Organization Banner Upload',
    description: 'Upload a custom banner image for organization pages and student portals.',
    userPurpose: 'Add a wide header image that creates visual appeal on your organization\'s dashboard and student-facing pages.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Banner Upload Area', 
        action: 'Click the upload icon or dashed border area in the Banner section', 
        outcome: 'Opens file picker to select banner image', 
        technicalDetails: 'Accepts .png, .jpg, .jpeg up to 5MB' 
      },
      { 
        element: 'File Selection', 
        action: 'Choose a wide-format image (landscape orientation)', 
        outcome: 'Shows preview with aspect ratio maintained', 
        technicalDetails: 'Recommended: 1920x400px, 16:3 aspect ratio, high-quality for best display' 
      },
      { 
        element: 'Upload Confirmation', 
        action: 'File uploads automatically once selected', 
        outcome: 'Banner displays in preview area and updates across platform', 
        technicalDetails: 'Stored in "org-branding" bucket at {orgId}/banner.{ext}, updates organizations.banner_url' 
      },
      { 
        element: 'Remove Banner', 
        action: 'Click X icon to remove banner', 
        outcome: 'Returns to placeholder, deletes from storage', 
        technicalDetails: 'Sets banner_url to null' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Banner Preview', 
        source: 'organizations.banner_url', 
        significance: 'Shows how banner will appear on dashboards and org pages' 
      }
    ],
    relatedFeatures: ['Logo Upload', 'Accent Color', 'Dashboard Appearance']
  },
  {
    id: 'settings-branding-accent-presets',
    section: 'settings',
    subsection: 'Branding Tab',
    title: 'Accent Color Presets',
    description: 'Select from six pre-configured accent colors to match your brand.',
    userPurpose: 'Quickly apply professional color schemes without needing design expertise.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Preset Color Swatches', 
        action: 'Click on any of the 6 colored circles (Blue, Purple, Green, Orange, Pink, Teal)', 
        outcome: 'Immediately updates accent_color in database and live preview', 
        technicalDetails: 'Predefined HSL values optimized for accessibility and visual appeal' 
      },
      { 
        element: 'Active Preset Indicator', 
        action: 'View checkmark on currently selected preset', 
        outcome: 'Shows which preset is active', 
        technicalDetails: 'Matches organizations.accent_color to preset values' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Preset Options', 
        source: 'Hard-coded preset array in component', 
        significance: 'Six curated colors: Blue (#3B82F6), Purple (#8B5CF6), Green (#10B981), Orange (#F59E0B), Pink (#EC4899), Teal (#14B8A6)' 
      },
      { 
        field: 'Current Accent Color', 
        source: 'organizations.accent_color', 
        significance: 'Applied to buttons, links, highlights, progress bars throughout platform' 
      }
    ],
    relatedFeatures: ['Custom Accent Color', 'Live Preview', 'Student Portal Theme']
  },
  {
    id: 'settings-branding-custom-color',
    section: 'settings',
    subsection: 'Branding Tab',
    title: 'Custom Accent Color Picker',
    description: 'Define a precise custom color using HSL color picker for perfect brand matching.',
    userPurpose: 'Match your exact brand colors when presets don\'t align with your style guide.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Custom Color Button', 
        action: 'Click "Custom Color" button below presets', 
        outcome: 'Opens HSL color picker dialog', 
        technicalDetails: 'Advanced users can input Hue (0-360), Saturation (0-100%), Lightness (0-100%)' 
      },
      { 
        element: 'Color Picker Interface', 
        action: 'Drag sliders or input values for H, S, L', 
        outcome: 'Live preview updates as you adjust values', 
        technicalDetails: 'HSL format preferred for consistent theming across light/dark modes' 
      },
      { 
        element: 'Apply Custom Color', 
        action: 'Click "Apply" button in color picker', 
        outcome: 'Saves custom HSL value to organizations.accent_color, updates all themed elements', 
        technicalDetails: 'Stored as HSL string: "hsl(210, 100%, 50%)"' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'HSL Input Fields', 
        source: 'Component state', 
        significance: 'Allows precise color control for brand consistency' 
      },
      { 
        field: 'Color Preview Swatch', 
        source: 'Real-time calculation', 
        significance: 'Shows resulting color before applying' 
      }
    ],
    relatedFeatures: ['Preset Colors', 'Live Preview', 'Brand Guidelines']
  },
  {
    id: 'settings-branding-live-preview',
    section: 'settings',
    subsection: 'Branding Tab',
    title: 'Live Branding Preview Window',
    description: 'Real-time preview of how your branding changes affect the student portal.',
    userPurpose: 'See exactly how logo, banner, and accent colors look before saving, ensuring cohesive design.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Preview Pane', 
        action: 'Observe right side of screen while editing branding', 
        outcome: 'Shows miniature version of student portal with your changes applied', 
        technicalDetails: 'Updates immediately on logo upload, banner upload, or color change' 
      },
      { 
        element: 'Preview Elements', 
        action: 'View navigation bar, buttons, cards with new branding', 
        outcome: 'Simulates actual student experience', 
        technicalDetails: 'Includes logo placement, banner positioning, accent color on interactive elements' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Live Preview UI', 
        source: 'Component state + organizations table', 
        significance: 'Combines pending uploads with saved settings to show accurate representation' 
      }
    ],
    relatedFeatures: ['Logo Upload', 'Banner Upload', 'Accent Color', 'Student Portal']
  },
  {
    id: 'settings-invite-email-input',
    section: 'settings',
    subsection: 'Invite Members Tab',
    title: 'Member Email Input',
    description: 'Add email addresses to invite new members to your organization.',
    userPurpose: 'Onboard instructors, aides, or admins by sending them email invitations.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Email Input Field', 
        action: 'Type email address into the input field', 
        outcome: 'Email is validated for proper format (must contain @ and domain)', 
        technicalDetails: 'Client-side validation prevents invalid emails, max 50 invites at once' 
      },
      { 
        element: 'Add Another Email Button', 
        action: 'Click "+ Add Another Email" link', 
        outcome: 'Adds a new email input field to invite multiple members at once', 
        technicalDetails: 'Can add up to 10 email fields per submission' 
      },
      { 
        element: 'Remove Email Field', 
        action: 'Click X icon next to an email input', 
        outcome: 'Removes that specific email field from the form', 
        technicalDetails: 'Must have at least 1 email field remaining' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Email Fields', 
        source: 'Component form state', 
        significance: 'Collects recipient emails for invitation system' 
      },
      { 
        field: 'Validation Errors', 
        source: 'Client-side validation', 
        significance: 'Shows red error text if email format is invalid' 
      }
    ],
    relatedFeatures: ['Role Selection', 'Expiration Date', 'Pending Invitations']
  },
  {
    id: 'settings-invite-role-selection',
    section: 'settings',
    subsection: 'Invite Members Tab',
    title: 'Role Selection for Invites',
    description: 'Assign roles (Instructor, Instructor Aide, Admin) when inviting members.',
    userPurpose: 'Control access levels by assigning appropriate roles based on responsibilities.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Role Dropdown', 
        action: 'Click dropdown menu labeled "Role"', 
        outcome: 'Shows list of available roles: Instructor, Instructor Aide, Admin', 
        technicalDetails: 'Only Owner can assign Admin role; Admins cannot create other Admins' 
      },
      { 
        element: 'Role Selection', 
        action: 'Select a role from dropdown', 
        outcome: 'Sets the role for that specific invite', 
        technicalDetails: 'Stored in org_invitations.role as enum: instructor, instructor_aide, admin' 
      },
      { 
        element: 'Role Descriptions', 
        action: 'Hover over info icon next to roles', 
        outcome: 'Shows tooltip explaining permissions for each role', 
        technicalDetails: 'Instructor: manages courses/students; Aide: assists instructors; Admin: full org access except deletion' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Available Roles', 
        source: 'member_role enum type', 
        significance: 'Defines permission levels for invited members' 
      }
    ],
    relatedFeatures: ['Email Input', 'Member Management', 'Permission System']
  },
  {
    id: 'settings-invite-expiration',
    section: 'settings',
    subsection: 'Invite Members Tab',
    title: 'Invitation Expiration Date',
    description: 'Set how long invitation links remain valid before expiring.',
    userPurpose: 'Maintain security by ensuring invites expire after a reasonable timeframe (default 7 days).',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Expiration Date Picker', 
        action: 'Click calendar icon or date field', 
        outcome: 'Opens date picker to select expiration date', 
        technicalDetails: 'Must be future date, max 30 days from now' 
      },
      { 
        element: 'Date Selection', 
        action: 'Choose date from calendar', 
        outcome: 'Sets expire_at timestamp for invitation', 
        technicalDetails: 'Stored as timestamptz in org_invitations.expire_at' 
      },
      { 
        element: 'Default Expiration', 
        action: 'Leave blank or use default', 
        outcome: 'Automatically sets expiration to 7 days from now', 
        technicalDetails: 'Calculated as: now() + interval \'7 days\'' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Selected Date', 
        source: 'Form state', 
        significance: 'When invite link will stop working' 
      }
    ],
    relatedFeatures: ['Email Input', 'Send Invites', 'Pending Invitations']
  },
  {
    id: 'settings-invite-send',
    section: 'settings',
    subsection: 'Invite Members Tab',
    title: 'Send Member Invitations',
    description: 'Submit invitation form to send emails to new members.',
    userPurpose: 'Complete the invitation process by sending secure links to join your organization.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Send Invitations Button', 
        action: 'Click "Send Invitations" button after filling form', 
        outcome: 'Creates invitation records and sends emails to all provided addresses', 
        technicalDetails: 'Inserts rows into org_invitations table, triggers email via Resend API' 
      },
      { 
        element: 'Loading State', 
        action: 'Wait while invitations are processed', 
        outcome: 'Button shows spinner, disabled during submission', 
        technicalDetails: 'Batch processes up to 10 invites simultaneously' 
      },
      { 
        element: 'Success Confirmation', 
        action: 'View success toast notification', 
        outcome: 'Shows "X invitations sent successfully" message', 
        technicalDetails: 'Form resets, new invites appear in Pending Invitations list' 
      },
      { 
        element: 'Error Handling', 
        action: 'If errors occur (duplicate email, invalid data)', 
        outcome: 'Shows error toast with specific message', 
        technicalDetails: 'Common errors: email already member, email already invited, role permission denied' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Submission Status', 
        source: 'Mutation state', 
        significance: 'Loading/success/error feedback' 
      }
    ],
    relatedFeatures: ['Email Input', 'Role Selection', 'Pending Invitations']
  },
  {
    id: 'settings-invite-pending-list',
    section: 'settings',
    subsection: 'Invite Members Tab',
    title: 'Pending Invitations List',
    description: 'View and manage invitations that have been sent but not yet accepted.',
    userPurpose: 'Track who you\'ve invited, resend invitations if needed, or revoke access before acceptance.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Pending Invites Table', 
        action: 'Scroll down to view list below invitation form', 
        outcome: 'Shows all invitations with status "pending"', 
        technicalDetails: 'Queries org_invitations where status = \'pending\' AND expire_at > now()' 
      },
      { 
        element: 'Invitation Details', 
        action: 'View each row showing: email, role, sent date, expires date', 
        outcome: 'See complete invitation information', 
        technicalDetails: 'Displays org_invitations columns: email, role, created_at, expire_at' 
      },
      { 
        element: 'Resend Button', 
        action: 'Click "Resend" button next to an invitation', 
        outcome: 'Sends another email with the same invitation link', 
        technicalDetails: 'Does not create new invitation, reuses existing token and expiration' 
      },
      { 
        element: 'Revoke Button', 
        action: 'Click "Revoke" button to cancel invitation', 
        outcome: 'Marks invitation as revoked, link no longer works', 
        technicalDetails: 'Updates org_invitations.status to \'revoked\', invite disappears from list' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Pending Invitations', 
        source: 'org_invitations table', 
        refreshRate: 'Real-time via subscription',
        significance: 'Active invitations awaiting acceptance' 
      },
      { 
        field: 'Days Until Expiration', 
        source: 'Calculated from expire_at', 
        significance: 'Shows urgency, expired invites auto-removed' 
      }
    ],
    relatedFeatures: ['Send Invitations', 'Member Management', 'Email Notifications']
  },
  {
    id: 'settings-members-view-modes',
    section: 'settings',
    subsection: 'Members Tab',
    title: 'Member List View Modes',
    description: 'Switch between different visualization layouts for viewing organization members.',
    userPurpose: 'Choose the most efficient way to browse and manage your team based on preference and screen size.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'View Mode Toggle', 
        action: 'Click view icons in top-right: List, Large Tiles, or Small Tiles', 
        outcome: 'Switches member display layout', 
        technicalDetails: 'Stored in localStorage as user preference' 
      },
      { 
        element: 'List View', 
        action: 'Select list icon (horizontal lines)', 
        outcome: 'Shows compact rows with avatar, name, role, status in table format', 
        technicalDetails: 'Best for viewing many members at once, sortable columns' 
      },
      { 
        element: 'Large Tiles View', 
        action: 'Select large grid icon', 
        outcome: 'Shows members as large cards with prominent avatars', 
        technicalDetails: 'Best for visual identification, shows 2-3 per row on desktop' 
      },
      { 
        element: 'Small Tiles View', 
        action: 'Select small grid icon', 
        outcome: 'Shows compact cards, fits 4-6 per row', 
        technicalDetails: 'Balance between detail and density' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'View Preference', 
        source: 'localStorage', 
        significance: 'Persists across sessions for consistent UX' 
      }
    ],
    relatedFeatures: ['Member Profile Cards', 'Member Search', 'Role Management']
  },
  {
    id: 'settings-members-profile-cards',
    section: 'settings',
    subsection: 'Members Tab',
    title: 'Member Profile Cards',
    description: 'View detailed information for each member in card format.',
    userPurpose: 'Quickly identify team members and access their profiles for management actions.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Member Card', 
        action: 'View card showing avatar, name, role badge, status', 
        outcome: 'Displays key member information at a glance', 
        technicalDetails: 'Data from org_members JOIN with profiles table' 
      },
      { 
        element: 'Avatar Display', 
        action: 'See member\'s profile picture or initials', 
        outcome: 'Visual identification of team member', 
        technicalDetails: 'Falls back to colored circle with initials if no avatar uploaded' 
      },
      { 
        element: 'Role Badge', 
        action: 'View colored badge showing role (Owner, Admin, Instructor, Instructor Aide)', 
        outcome: 'Understand member\'s permission level', 
        technicalDetails: 'Color-coded: Owner (gold), Admin (red), Instructor (blue), Aide (green)' 
      },
      { 
        element: 'Status Indicator', 
        action: 'See status: Active, Pending, or Suspended', 
        outcome: 'Know if member can currently access organization', 
        technicalDetails: 'From org_members.status enum' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Member Information', 
        source: 'org_members + profiles tables', 
        significance: 'Complete member identity and access status' 
      }
    ],
    relatedFeatures: ['View Profile Button', 'Change Role', 'Remove Member']
  },
  {
    id: 'settings-members-view-profile',
    section: 'settings',
    subsection: 'Members Tab',
    title: 'View Member Profile',
    description: 'Open detailed profile modal for any organization member.',
    userPurpose: 'Access complete member information including contact details, activity history, and assigned courses.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'View Profile Button', 
        action: 'Click "View Profile" button on member card or row', 
        outcome: 'Opens modal overlay with full member profile', 
        technicalDetails: 'Queries profiles table + org_members for complete data' 
      },
      { 
        element: 'Profile Modal', 
        action: 'View member details: bio, email, phone, joined date, last active', 
        outcome: 'See comprehensive member information', 
        technicalDetails: 'Read-only for other members, editable for own profile' 
      },
      { 
        element: 'Activity Timeline', 
        action: 'Scroll to see recent activity (logins, course assignments, student interactions)', 
        outcome: 'Track member engagement and usage patterns', 
        technicalDetails: 'From activity_log table filtered by user_id' 
      },
      { 
        element: 'Close Modal', 
        action: 'Click X or outside modal to close', 
        outcome: 'Returns to members list', 
        technicalDetails: 'No changes saved from this view' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Complete Profile', 
        source: 'profiles + org_members + activity_log', 
        significance: 'Holistic view of member account and engagement' 
      }
    ],
    relatedFeatures: ['Member Cards', 'Activity Log', 'My Profile']
  },
  {
    id: 'settings-members-change-role',
    section: 'settings',
    subsection: 'Members Tab',
    title: 'Change Member Role',
    description: 'Modify a member\'s role to adjust their permissions within the organization.',
    userPurpose: 'Promote instructors to admins, demote admins, or adjust responsibilities as team needs change.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner'],
    interactions: [
      { 
        element: 'Role Dropdown', 
        action: 'Click role dropdown on member card (Owner only)', 
        outcome: 'Shows available roles based on your permissions', 
        technicalDetails: 'Owner can assign any role; Admins cannot change roles' 
      },
      { 
        element: 'Select New Role', 
        action: 'Choose new role from dropdown', 
        outcome: 'Shows confirmation dialog explaining permission changes', 
        technicalDetails: 'Cannot change Owner role; only one Owner allowed per org' 
      },
      { 
        element: 'Confirm Change', 
        action: 'Click "Confirm" in dialog', 
        outcome: 'Updates org_members.role, member\'s access changes immediately', 
        technicalDetails: 'RLS policies enforce new permissions on next request' 
      },
      { 
        element: 'Automatic Logout', 
        action: 'If demoting admin to instructor, they may be logged out', 
        outcome: 'Member must re-login to see new interface', 
        technicalDetails: 'Prevents unauthorized access with old session' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Current Role', 
        source: 'org_members.role', 
        significance: 'Determines feature access and management capabilities' 
      }
    ],
    relatedFeatures: ['Member Management', 'Permission System', 'Role Selection']
  },
  {
    id: 'settings-members-remove',
    section: 'settings',
    subsection: 'Members Tab',
    title: 'Remove Organization Member',
    description: 'Remove a member from your organization, revoking all access.',
    userPurpose: 'Offboard team members when they leave or no longer need access.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Remove Button', 
        action: 'Click "Remove" button on member card or row', 
        outcome: 'Shows confirmation dialog with warning', 
        technicalDetails: 'Cannot remove self or sole Owner' 
      },
      { 
        element: 'Confirmation Dialog', 
        action: 'Read warning: "This will revoke access immediately and cannot be undone. Associated data will be preserved."', 
        outcome: 'Understand consequences before confirming', 
        technicalDetails: 'Student data, activity logs, and content remain intact' 
      },
      { 
        element: 'Confirm Removal', 
        action: 'Click "Remove Member" button', 
        outcome: 'Deletes org_members record, member can no longer access organization', 
        technicalDetails: 'Soft delete: sets status to \'removed\' instead of hard delete' 
      },
      { 
        element: 'Success Notification', 
        action: 'Toast appears: "Member removed successfully"', 
        outcome: 'Member disappears from list immediately', 
        technicalDetails: 'Real-time update via Supabase subscription' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Member Status', 
        source: 'org_members.status', 
        significance: 'Changes to \'removed\', triggers RLS policy blocking access' 
      }
    ],
    relatedFeatures: ['Member Management', 'Danger Zone', 'Access Control']
  },
  {
    id: 'settings-myprofile-avatar-upload',
    section: 'settings',
    subsection: 'My Profile Tab',
    title: 'Upload Profile Avatar',
    description: 'Add or change your profile picture visible across the platform.',
    userPurpose: 'Personalize your account with a photo for easy recognition by students and team members.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin', 'instructor', 'instructor_aide'],
    interactions: [
      { 
        element: 'Avatar Circle', 
        action: 'Click on your current avatar or placeholder circle', 
        outcome: 'Opens file picker to select image', 
        technicalDetails: 'Accepts .jpg, .jpeg, .png up to 2MB' 
      },
      { 
        element: 'Image Selection', 
        action: 'Choose photo from device', 
        outcome: 'Shows preview with crop/resize tool', 
        technicalDetails: 'Recommended: square aspect ratio, face clearly visible' 
      },
      { 
        element: 'Crop & Adjust', 
        action: 'Drag crop box to frame your face', 
        outcome: 'Preview updates in real-time', 
        technicalDetails: 'Maintains 1:1 aspect ratio, outputs 200x200px' 
      },
      { 
        element: 'Save Profile', 
        action: 'Click "Save Profile" button at bottom', 
        outcome: 'Uploads avatar to storage, updates profiles.avatar_url', 
        technicalDetails: 'Stored in "avatars" bucket at {userId}/avatar.{ext}' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Avatar Preview', 
        source: 'profiles.avatar_url', 
        significance: 'Shows across navigation, comments, activity feeds' 
      }
    ],
    relatedFeatures: ['My Profile', 'Member Cards', 'User Identity']
  },
  {
    id: 'settings-myprofile-basic-info',
    section: 'settings',
    subsection: 'My Profile Tab',
    title: 'Update Basic Profile Information',
    description: 'Edit your name, bio, and contact information.',
    userPurpose: 'Keep your profile current so students and colleagues can identify and contact you.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin', 'instructor', 'instructor_aide'],
    interactions: [
      { 
        element: 'Name Fields', 
        action: 'Edit "Display Name" text input', 
        outcome: 'Updates how your name appears throughout platform', 
        technicalDetails: 'Stored in profiles.display_name, max 100 characters' 
      },
      { 
        element: 'Bio Field', 
        action: 'Type in "Bio" textarea (optional)', 
        outcome: 'Adds personal description visible on profile views', 
        technicalDetails: 'profiles.bio, max 500 characters, supports line breaks' 
      },
      { 
        element: 'Email Display', 
        action: 'View email (read-only)', 
        outcome: 'Shows auth email, cannot be changed here', 
        technicalDetails: 'From auth.users.email, change via account settings' 
      },
      { 
        element: 'Save Profile Button', 
        action: 'Click "Save Profile" at bottom after making changes', 
        outcome: 'Updates profiles table, shows success toast', 
        technicalDetails: 'Required to persist changes, auto-saves are NOT enabled' 
      },
      { 
        element: 'Unsaved Changes Warning', 
        action: 'Navigate away without saving', 
        outcome: 'Browser prompt: "You have unsaved changes. Leave anyway?"', 
        technicalDetails: 'Prevents accidental data loss' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Profile Data', 
        source: 'profiles table', 
        significance: 'Identity information used across all features' 
      }
    ],
    relatedFeatures: ['Avatar Upload', 'Member Profile Cards', 'Account Settings']
  },
  {
    id: 'settings-ai-coach-free-chat',
    section: 'settings',
    subsection: 'AI Learning Coach',
    title: 'Enable Free Chat Mode',
    description: 'Toggle whether students can have unrestricted conversations with AI coach.',
    userPurpose: 'Control AI coach behavior: enable free chat for flexible learning, or restrict to Socratic method for structured guidance.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner', 'admin'],
    interactions: [
      { 
        element: 'Free Chat Toggle', 
        action: 'Click toggle switch labeled "Enable Free Chat Mode"', 
        outcome: 'Immediately updates ai_coach_settings.free_chat_enabled', 
        technicalDetails: 'Boolean stored in org settings, affects all students in organization' 
      },
      { 
        element: 'Free Chat ON', 
        action: 'When enabled (toggle right/green)', 
        outcome: 'Students can ask any question, AI provides direct answers', 
        technicalDetails: 'AI uses conversational mode without Socratic constraints' 
      },
      { 
        element: 'Free Chat OFF (Socratic)', 
        action: 'When disabled (toggle left/gray)', 
        outcome: 'AI responds only with guiding questions, never direct answers', 
        technicalDetails: 'AI enforces Socratic method, encourages critical thinking' 
      },
      { 
        element: 'Impact Notice', 
        action: 'Read description below toggle', 
        outcome: 'Explains difference and pedagogical implications', 
        technicalDetails: 'Socratic mode recommended for deeper learning outcomes' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Free Chat Status', 
        source: 'ai_coach_settings.free_chat_enabled', 
        significance: 'Controls AI interaction style for all students' 
      }
    ],
    relatedFeatures: ['AI Learning Coach', 'Student AI Assistant', 'Pedagogy Settings']
  },
  {
    id: 'settings-danger-zone',
    section: 'settings',
    subsection: 'Danger Zone',
    title: 'Delete Organization',
    description: 'Permanently delete your organization and all associated data.',
    userPurpose: 'Complete removal of organization when no longer needed. This action is irreversible.',
    route: '/org/:orgId/settings',
    component: 'OrganizationSettingsTabs.tsx',
    accessLevel: ['owner'],
    interactions: [
      { 
        element: 'Danger Zone Section', 
        action: 'Scroll to bottom of settings, view red warning section', 
        outcome: 'Shows "Delete Organization" button with warnings', 
        technicalDetails: 'Only visible to organization Owner' 
      },
      { 
        element: 'Delete Organization Button', 
        action: 'Click red "Delete Organization" button', 
        outcome: 'Opens multi-step confirmation dialog with warnings', 
        technicalDetails: 'Requires explicit typing of organization name to proceed' 
      },
      { 
        element: 'Warning Dialog', 
        action: 'Read warnings: "This will permanently delete: All courses and content, All student records and progress, All member accounts, All branding assets, All analytics data"', 
        outcome: 'Understand complete scope of deletion', 
        technicalDetails: 'Cascading delete affects 20+ related tables' 
      },
      { 
        element: 'Type Confirmation', 
        action: 'Type exact organization name in input field', 
        outcome: 'Confirms you understand which org is being deleted', 
        technicalDetails: 'Case-sensitive match required to enable final delete button' 
      },
      { 
        element: 'Final Confirmation', 
        action: 'Click "I understand, delete this organization" button', 
        outcome: 'Executes deletion, redirects to personal dashboard', 
        technicalDetails: 'Soft delete: sets deleted_at timestamp, data retained for 30 days for recovery' 
      },
      { 
        element: 'Post-Deletion', 
        action: 'View success message: "Organization deleted. Data will be permanently removed in 30 days."', 
        outcome: 'Organization no longer accessible to any members', 
        technicalDetails: 'Contact support within 30 days to restore if deleted by mistake' 
      }
    ],
    dataDisplayed: [
      { 
        field: 'Organization Status', 
        source: 'organizations.deleted_at', 
        significance: 'Non-null value triggers RLS policies blocking all access' 
      }
    ],
    relatedFeatures: ['Organization Management', 'Data Retention', 'Account Deletion']
  }
];
