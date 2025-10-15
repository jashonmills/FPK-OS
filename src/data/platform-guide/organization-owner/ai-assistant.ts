import { GuideEntry } from '@/types/platform-guide';

export const aiAssistantGuide: GuideEntry[] = [
  {
    id: 'ai-assistant-overview',
    section: 'ai-assistant',
    title: 'AI Organization Assistant Overview',
    description: 'Context-aware AI assistant for organization management queries and data analysis.',
    userPurpose: 'Natural language interface to query student data, generate reports, and get actionable insights.',
    route: '/org/:orgId/ai-coach',
    component: 'AIAssistant.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      { element: 'Chat Interface', action: 'Type natural language queries', outcome: 'AI responds with data and visualizations', technicalDetails: 'Uses AI with org data context' }
    ],
    dataDisplayed: [
      { field: 'AI Responses', source: 'Real-time AI generation', significance: 'Provides insights from organizational data' }
    ],
    relatedFeatures: ['Analytics', 'Reports', 'Student Data']
  }
];
