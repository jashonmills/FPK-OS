import { Step } from 'react-joyride';

export const dashboardTourSteps: Step[] = [
  {
    target: 'main',
    content: 'Welcome! This is your Dashboard, your daily command center.',
    placement: 'center',
    title: 'Your Command Center',
  },
  {
    target: '[data-tour="add-log"]',
    content: "You can navigate to all key areas of the platform from here. Let's explore the Activities Log first.",
    placement: 'bottom',
    title: 'Explore the Platform',
  },
];

export const activitiesTourSteps: Step[] = [
  {
    target: '[data-tour="add-log"]',
    content: 'This is where you\'ll spend most of your time. Click here to add a new entry for behavior, sleep, medication, or other events.',
    placement: 'bottom',
    title: 'Add New Logs',
  },
  {
    target: 'main',
    content: 'Your logs will appear here in chronological order, giving you a clear history of events.',
    placement: 'center',
    title: 'View Your Logs',
  },
];

export const goalsTourSteps: Step[] = [
  {
    target: 'main',
    content: 'Click "Create New Goal" to set a new goal for your child. These can be academic, behavioral, or developmental.',
    placement: 'center',
    title: 'Create Goals',
  },
  {
    target: 'main',
    content: 'Your active and completed goals will be tracked here. You can click on any goal to view its progress and linked data.',
    placement: 'center',
    title: 'Track Progress',
  },
];

export const analyticsTourSteps: Step[] = [
  {
    target: '[data-tour="chart-tabs"]',
    content: 'Welcome to your Insight Engine. Use these tabs to switch between different charts, from universal patterns to charts specific to your child\'s diagnosis.',
    placement: 'bottom',
    title: 'Chart Selection',
  },
  {
    target: 'main',
    content: 'Our charts help you visualize trends, compare data, and understand the relationships between different factors, like sleep and behavior.',
    placement: 'center',
    title: 'Visualize Insights',
  },
];

export const settingsTourSteps: Step[] = [
  {
    target: '[data-tour="profile-tab"]',
    content: 'You can update your personal information here.',
    placement: 'bottom',
    title: 'Your Profile',
  },
  {
    target: '[data-tour="members-tab"]',
    content: 'This is a critical step. Click here to add your spouse, therapists, and teachers to your support team. Collaboration is key!',
    placement: 'bottom',
    title: 'Invite Your Team',
  },
  {
    target: '[data-tour="subscription-tab"]',
    content: 'Manage your subscription plan, review billing history, and access your customer portal here.',
    placement: 'bottom',
    title: 'Manage Subscription',
  },
];

export const documentsTourSteps: Step[] = [
  {
    target: 'main',
    content: 'Upload important files like IEPs and evaluations here. Our AI can analyze them to help you extract insights and set meaningful goals.',
    placement: 'center',
    title: 'Document Hub',
  },
];
