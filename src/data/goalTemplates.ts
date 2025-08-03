// Goal Templates for quick goal creation
export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDays: number;
  xpEstimate: number;
  milestones: Array<{
    id: string;
    title: string;
    completed: boolean;
    order_index: number;
  }>;
  tags: string[];
}

export const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    id: 'reading-fluency',
    title: 'Improve Reading Fluency',
    description: 'Enhance reading speed and comprehension through daily practice sessions',
    category: 'reading',
    priority: 'high',
    estimatedDays: 30,
    xpEstimate: 250,
    milestones: [
      { id: '1', title: 'Complete baseline reading assessment', completed: false, order_index: 0 },
      { id: '2', title: 'Read 10 pages daily for 1 week', completed: false, order_index: 1 },
      { id: '3', title: 'Achieve 150 WPM reading speed', completed: false, order_index: 2 },
      { id: '4', title: 'Complete 5 comprehension quizzes', completed: false, order_index: 3 },
      { id: '5', title: 'Final reading assessment showing improvement', completed: false, order_index: 4 }
    ],
    tags: ['reading', 'fluency', 'comprehension']
  },
  {
    id: 'spelling-mastery',
    title: 'Complete Spelling Modules 1-5',
    description: 'Master fundamental spelling patterns and high-frequency words',
    category: 'spelling',
    priority: 'medium',
    estimatedDays: 21,
    xpEstimate: 180,
    milestones: [
      { id: '1', title: 'Complete Spelling Module 1', completed: false, order_index: 0 },
      { id: '2', title: 'Complete Spelling Module 2', completed: false, order_index: 1 },
      { id: '3', title: 'Complete Spelling Module 3', completed: false, order_index: 2 },
      { id: '4', title: 'Complete Spelling Module 4', completed: false, order_index: 3 },
      { id: '5', title: 'Complete Spelling Module 5', completed: false, order_index: 4 },
      { id: '6', title: 'Pass comprehensive spelling test', completed: false, order_index: 5 }
    ],
    tags: ['spelling', 'modules', 'assessment']
  },
  {
    id: 'study-duration',
    title: 'Increase Study Session Duration',
    description: 'Build focus and concentration by gradually extending study sessions',
    category: 'study habits',
    priority: 'medium',
    estimatedDays: 14,
    xpEstimate: 120,
    milestones: [
      { id: '1', title: 'Complete 15-minute sessions for 3 days', completed: false, order_index: 0 },
      { id: '2', title: 'Complete 25-minute sessions for 3 days', completed: false, order_index: 1 },
      { id: '3', title: 'Complete 35-minute sessions for 3 days', completed: false, order_index: 2 },
      { id: '4', title: 'Complete 45-minute sessions for 3 days', completed: false, order_index: 3 },
      { id: '5', title: 'Achieve consistent 60-minute sessions', completed: false, order_index: 4 }
    ],
    tags: ['focus', 'concentration', 'study habits']
  },
  {
    id: 'vocabulary-builder',
    title: 'Master Vocabulary List',
    description: 'Learn and retain 100 new vocabulary words with definitions and usage',
    category: 'vocabulary',
    priority: 'high',
    estimatedDays: 28,
    xpEstimate: 200,
    milestones: [
      { id: '1', title: 'Learn first 20 vocabulary words', completed: false, order_index: 0 },
      { id: '2', title: 'Learn next 20 vocabulary words', completed: false, order_index: 1 },
      { id: '3', title: 'Learn next 20 vocabulary words', completed: false, order_index: 2 },
      { id: '4', title: 'Learn next 20 vocabulary words', completed: false, order_index: 3 },
      { id: '5', title: 'Learn final 20 vocabulary words', completed: false, order_index: 4 },
      { id: '6', title: 'Pass vocabulary mastery test (80%+)', completed: false, order_index: 5 }
    ],
    tags: ['vocabulary', 'words', 'language']
  },
  {
    id: 'note-taking-system',
    title: 'Develop Effective Note-Taking System',
    description: 'Create and practice a structured approach to taking and organizing study notes',
    category: 'study skills',
    priority: 'low',
    estimatedDays: 10,
    xpEstimate: 80,
    milestones: [
      { id: '1', title: 'Learn Cornell note-taking method', completed: false, order_index: 0 },
      { id: '2', title: 'Practice note-taking for 3 sessions', completed: false, order_index: 1 },
      { id: '3', title: 'Create digital note organization system', completed: false, order_index: 2 },
      { id: '4', title: 'Review and refine notes weekly', completed: false, order_index: 3 }
    ],
    tags: ['notes', 'organization', 'study skills']
  },
  {
    id: 'math-fundamentals',
    title: 'Strengthen Math Fundamentals',
    description: 'Review and master basic math operations and problem-solving strategies',
    category: 'mathematics',
    priority: 'high',
    estimatedDays: 35,
    xpEstimate: 300,
    milestones: [
      { id: '1', title: 'Master addition and subtraction', completed: false, order_index: 0 },
      { id: '2', title: 'Master multiplication tables', completed: false, order_index: 1 },
      { id: '3', title: 'Master division concepts', completed: false, order_index: 2 },
      { id: '4', title: 'Solve 20 word problems correctly', completed: false, order_index: 3 },
      { id: '5', title: 'Pass comprehensive math assessment', completed: false, order_index: 4 }
    ],
    tags: ['math', 'fundamentals', 'problem-solving']
  }
];

export const getTemplateById = (id: string): GoalTemplate | undefined => {
  return GOAL_TEMPLATES.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): GoalTemplate[] => {
  return GOAL_TEMPLATES.filter(template => template.category === category);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(GOAL_TEMPLATES.map(template => template.category)));
};