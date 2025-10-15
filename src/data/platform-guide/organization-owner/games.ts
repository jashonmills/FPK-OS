import { GuideEntry } from '@/types/platform-guide';

export const gamesGuide: GuideEntry[] = [
  {
    id: 'games-overview',
    section: 'games',
    title: 'Educational Games Overview',
    description: 'Library of educational games for student engagement and supplemental learning.',
    userPurpose: 'Assign gamified learning activities to reinforce concepts and maintain engagement.',
    route: '/org/:orgId/games',
    component: 'GamesLibrary.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      { element: 'Games Grid', action: 'Browse available games', outcome: 'Shows game library with categories', technicalDetails: 'Query from games table' }
    ],
    dataDisplayed: [
      { field: 'Game Library', source: 'games table', significance: 'Available educational games for students' }
    ],
    relatedFeatures: ['Game Assignment', 'Leaderboards', 'Progress Tracking']
  }
];
