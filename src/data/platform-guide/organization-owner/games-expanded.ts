import { GuideEntry } from '@/types/platform-guide';

export const gamesExpandedGuide: GuideEntry[] = [
  {
    id: 'games-overview',
    section: 'games',
    title: 'Educational Games Library Overview',
    description: 'Curated library of educational games designed to reinforce learning concepts through engaging, gamified experiences.',
    userPurpose: 'Supplement traditional curriculum with interactive games that motivate students and provide alternative learning modalities.',
    route: '/org/:orgId/games',
    component: 'OrganizationGamesPage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Games Grid Display',
        action: 'Displays all available games as cards',
        outcome: 'Shows game library with thumbnails, titles, and descriptions',
        technicalDetails: 'Query from games table or game catalog API'
      }
    ],
    dataDisplayed: [
      {
        field: 'Available Games',
        source: 'games table or external game catalog',
        significance: 'Complete library of educational games for assignment'
      }
    ],
    relatedFeatures: ['Game Assignment', 'Student Engagement', 'Gamification', 'Leaderboards']
  },
  {
    id: 'games-card-information',
    section: 'games',
    subsection: 'Game Cards',
    title: 'Game Card Display Elements',
    description: 'Each game displays key information to help instructors select appropriate games for students.',
    userPurpose: 'Evaluate game content, difficulty, learning objectives, and current usage before assigning to students.',
    route: '/org/:orgId/games',
    component: 'OrganizationGamesPage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Game Thumbnail',
        action: 'Visual preview of game',
        outcome: 'Helps instructors quickly identify games',
        technicalDetails: 'Image from games.thumbnail_url'
      },
      {
        element: 'Game Title',
        action: 'Name of the game',
        outcome: 'Primary identifier for game selection',
        technicalDetails: 'games.title field'
      },
      {
        element: 'Game Description',
        action: 'Brief overview of gameplay and learning objectives',
        outcome: 'Explains educational value and mechanics',
        technicalDetails: 'games.description, typically 50-150 characters'
      },
      {
        element: 'Subject Tags',
        action: 'Display subject area tags (Math, ELA, Science, etc.)',
        outcome: 'Quick filtering by curriculum area',
        technicalDetails: 'games.subjects array or tags many-to-many'
      },
      {
        element: 'Difficulty Level',
        action: 'Shows grade level or difficulty indicator',
        outcome: 'Ensures age-appropriate game selection',
        technicalDetails: 'games.difficulty_level: elementary, middle, high'
      },
      {
        element: 'Play Count',
        action: 'Shows how many times students in org have played',
        outcome: 'Indicates game popularity within organization',
        technicalDetails: 'COUNT(*) from game_sessions WHERE org_id=:orgId'
      },
      {
        element: 'Average Score',
        action: 'Average performance across org students',
        outcome: 'Shows if game is appropriately challenging',
        technicalDetails: 'AVG(score) from game_sessions for this org'
      },
      {
        element: 'Play Button',
        action: 'Click to launch game preview',
        outcome: 'Instructors can test game before assigning',
        technicalDetails: 'Opens game in modal or new tab'
      }
    ],
    dataDisplayed: [
      {
        field: 'Game Metadata',
        source: 'games table',
        significance: 'Complete game information for informed assignment decisions'
      },
      {
        field: 'Organization Usage Stats',
        source: 'game_sessions filtered by org_id',
        calculation: 'Play count and average scores for this organization',
        significance: 'Shows adoption and effectiveness within your organization'
      }
    ],
    relatedFeatures: ['Game Detail View', 'Game Assignment', 'Subject Filtering']
  },
  {
    id: 'games-filtering-search',
    section: 'games',
    subsection: 'Search & Filter',
    title: 'Games Filtering and Search',
    description: 'Tools to narrow down game library by subject, difficulty, and search terms.',
    userPurpose: 'Quickly find games aligned with current curriculum topics or student skill levels.',
    route: '/org/:orgId/games',
    component: 'OrganizationGamesPage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Search Bar',
        action: 'Type game name or keywords',
        outcome: 'Filters game grid in real-time',
        technicalDetails: 'Client-side filtering on title and description'
      },
      {
        element: 'Subject Filter',
        action: 'Select dropdown: Math, ELA, Science, Social Studies, etc.',
        outcome: 'Shows only games for selected subject',
        technicalDetails: 'WHERE games.subjects CONTAINS :subject'
      },
      {
        element: 'Difficulty Filter',
        action: 'Select: Elementary, Middle School, High School',
        outcome: 'Filters by grade-appropriate games',
        technicalDetails: 'WHERE games.difficulty_level=:selected'
      },
      {
        element: 'Most Popular Toggle',
        action: 'Sort by organization play count',
        outcome: 'Shows most-played games first',
        technicalDetails: 'ORDER BY play_count DESC'
      },
      {
        element: 'Highest Rated Toggle',
        action: 'Sort by average student scores',
        outcome: 'Shows games where students perform best',
        technicalDetails: 'ORDER BY avg_score DESC'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Game Catalog', 'Subject Tagging', 'Difficulty Levels']
  },
  {
    id: 'games-assignment-flow',
    section: 'games',
    subsection: 'Game Assignment',
    title: 'Game Assignment Workflow',
    description: 'Process to assign games to individual students, groups, or entire organization for practice.',
    userPurpose: 'Deploy engaging learning games as homework, review activities, or reward-based enrichment.',
    route: '/org/:orgId/games',
    component: 'OrganizationGamesPage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Assign Game Button',
        action: 'Click button on game card',
        outcome: 'Opens game assignment modal',
        technicalDetails: 'Dialog component with assignment configuration'
      },
      {
        element: 'Select Recipients',
        action: 'Choose Individual Students, Groups, or All Students',
        outcome: 'Determines who receives game assignment',
        technicalDetails: 'Multi-select dropdown with filtering'
      },
      {
        element: 'Due Date (Optional)',
        action: 'Set deadline for game completion',
        outcome: 'Creates accountability for game engagement',
        technicalDetails: 'Date picker, stores in game_assignments.due_date'
      },
      {
        element: 'Minimum Plays',
        action: 'Optional: Set required number of plays',
        outcome: 'Ensures sufficient practice repetition',
        technicalDetails: 'Integer input, game_assignments.min_plays'
      },
      {
        element: 'Target Score',
        action: 'Optional: Set score students must achieve',
        outcome: 'Encourages mastery instead of just participation',
        technicalDetails: 'Integer input, game_assignments.target_score'
      },
      {
        element: 'Send Notification',
        action: 'Toggle to notify students of assignment',
        outcome: 'Sends email/in-app notification about new game',
        technicalDetails: 'Triggers notification on assignment creation'
      },
      {
        element: 'Assign Button (Final)',
        action: 'Confirm and create assignments',
        outcome: 'Creates game_assignments entries for selected students',
        technicalDetails: 'Batch INSERT for all recipients'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Student Selection', 'Group Assignment', 'Notifications', 'Gamification']
  },
  {
    id: 'games-leaderboards',
    section: 'games',
    subsection: 'Leaderboards',
    title: 'Game Leaderboards',
    description: 'Organization-wide and per-game leaderboards showing top-performing students.',
    userPurpose: 'Foster healthy competition and motivation through visible achievement rankings.',
    route: '/org/:orgId/games',
    component: 'OrganizationGamesPage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'View Leaderboard Button',
        action: 'Click to open leaderboard modal',
        outcome: 'Displays ranked list of students for specific game',
        technicalDetails: 'Query game_sessions ordered by score DESC, grouped by student'
      },
      {
        element: 'Leaderboard Timeframe',
        action: 'Filter: All-Time, This Month, This Week',
        outcome: 'Shows rankings for selected time period',
        technicalDetails: 'WHERE game_sessions.created_at >= :timeframe'
      },
      {
        element: 'Top Players Display',
        action: 'Shows student names, avatars, scores',
        outcome: 'Recognizes high achievers publicly',
        technicalDetails: 'JOIN profiles for student info, display top 10-20'
      },
      {
        element: 'Student Position Highlight',
        action: 'If viewing as student, highlights their ranking',
        outcome: 'Motivates students to improve position',
        technicalDetails: 'Conditional styling for current user\'s row'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Rankings',
        source: 'game_sessions table',
        calculation: 'Ordered by MAX(score) or SUM(score) per student per game',
        significance: 'Creates competitive environment to drive engagement'
      },
      {
        field: 'High Scores',
        source: 'game_sessions.score',
        calculation: 'MAX(score) for each student',
        significance: 'Shows best individual performance'
      },
      {
        field: 'Total Plays',
        source: 'game_sessions.COUNT(*)',
        calculation: 'Number of times each student played',
        significance: 'Measures engagement level beyond just performance'
      }
    ],
    relatedFeatures: ['Gamification', 'Student Motivation', 'Competition']
  },
  {
    id: 'games-analytics',
    section: 'games',
    subsection: 'Game Analytics',
    title: 'Game Performance Analytics',
    description: 'Detailed analytics showing game effectiveness, student engagement, and learning outcomes.',
    userPurpose: 'Evaluate which games are most effective for learning outcomes and student engagement.',
    route: '/org/:orgId/games',
    component: 'OrganizationGamesPage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Game Analytics Button',
        action: 'Click analytics icon on game card',
        outcome: 'Opens modal with detailed game metrics',
        technicalDetails: 'Dialog component with charts and data tables'
      }
    ],
    dataDisplayed: [
      {
        field: 'Total Plays',
        source: 'game_sessions WHERE game_id=:id AND org_id=:orgId',
        calculation: 'COUNT(*) of all game sessions',
        significance: 'Indicates game popularity and usage'
      },
      {
        field: 'Unique Players',
        source: 'game_sessions WHERE game_id=:id',
        calculation: 'COUNT(DISTINCT student_id)',
        significance: 'Shows reach - how many students have tried the game'
      },
      {
        field: 'Average Score',
        source: 'game_sessions.score',
        calculation: 'AVG(score) across all plays',
        significance: 'Indicates game difficulty and student success rate'
      },
      {
        field: 'Average Time Spent',
        source: 'game_sessions.duration',
        calculation: 'AVG(duration) in minutes',
        significance: 'Shows engagement level - longer sessions indicate interest'
      },
      {
        field: 'Completion Rate',
        source: 'game_sessions WHERE completed=true',
        calculation: '(completed_sessions / total_sessions) * 100',
        significance: 'Measures if students are finishing games or quitting'
      },
      {
        field: 'Score Distribution',
        source: 'game_sessions.score',
        calculation: 'Histogram of scores across all plays',
        significance: 'Shows if game is too easy, too hard, or appropriately challenging'
      },
      {
        field: 'Improvement Over Time',
        source: 'game_sessions ordered by created_at',
        calculation: 'Trend line of scores per student',
        significance: 'Shows if repeated plays lead to skill improvement'
      }
    ],
    relatedFeatures: ['Learning Analytics', 'Game Effectiveness', 'Student Progress']
  },
  {
    id: 'games-preview-mode',
    section: 'games',
    subsection: 'Game Preview',
    title: 'Instructor Game Preview',
    description: 'Ability for instructors to play games themselves before assigning to students.',
    userPurpose: 'Test game mechanics, difficulty, and educational value firsthand before deployment.',
    route: '/org/:orgId/games',
    component: 'OrganizationGamesPage.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Preview/Play Button',
        action: 'Click to launch game in preview mode',
        outcome: 'Opens game in modal or full-screen view',
        technicalDetails: 'Game loads with instructor context, scores not recorded on leaderboard'
      },
      {
        element: 'Full-Screen Game View',
        action: 'Game renders in playable state',
        outcome: 'Instructor can interact with game like students would',
        technicalDetails: 'iframe or embedded game component with game engine'
      },
      {
        element: 'Exit Preview Button',
        action: 'Close game and return to library',
        outcome: 'Returns to games list view',
        technicalDetails: 'Closes modal or navigates back to games page'
      },
      {
        element: 'Preview Mode Indicator',
        action: 'Banner or indicator showing "Preview Mode"',
        outcome: 'Clarifies that play session is not counted',
        technicalDetails: 'Visual UI element distinguishing preview from student play'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Game Library', 'Game Testing', 'Quality Control']
  }
];
