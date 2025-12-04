import { GuideEntry } from '@/types/platform-guide';

export const aiAssistantExpandedGuide: GuideEntry[] = [
  {
    id: 'ai-assistant-overview',
    section: 'ai-assistant',
    title: 'AI Organization Assistant Overview',
    description: 'Context-aware AI assistant designed to help organization leaders query data, generate insights, and make data-driven decisions.',
    userPurpose: 'Use natural language to ask questions about student performance, course effectiveness, and organizational trends without complex queries or reports.',
    route: '/org/:orgId/ai-coach',
    component: 'OrgAIStudyCoach.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'AI Chat Interface',
        action: 'Type natural language questions about organization data',
        outcome: 'AI provides answers with relevant data, insights, and actionable recommendations',
        technicalDetails: 'GPT-4 or similar model with organization data context via RAG'
      }
    ],
    dataDisplayed: [
      {
        field: 'AI-Generated Responses',
        source: 'Real-time AI generation with organization database context',
        significance: 'Provides data-driven insights in conversational format'
      }
    ],
    relatedFeatures: ['Analytics', 'Data Reports', 'Student Insights', 'Course Effectiveness']
  },
  {
    id: 'ai-assistant-query-types',
    section: 'ai-assistant',
    subsection: 'Query Capabilities',
    title: 'Types of Questions AI Can Answer',
    description: 'Categories of organizational queries the AI assistant can handle effectively.',
    userPurpose: 'Understand the breadth of data and insights available through natural language interaction.',
    route: '/org/:orgId/ai-coach',
    component: 'OrgAIStudyCoach.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Student Performance Queries',
        action: 'Ask about individual or aggregate student progress',
        outcome: 'AI provides detailed performance analysis',
        technicalDetails: 'Example: "Which students are falling behind in Math?" or "Show me Sarah\'s progress this month"'
      },
      {
        element: 'Course Effectiveness Queries',
        action: 'Ask about course completion rates, difficulty, engagement',
        outcome: 'AI analyzes course data and suggests improvements',
        technicalDetails: 'Example: "Which courses have the lowest completion rates?" or "Is Algebra II too difficult?"'
      },
      {
        element: 'Goal Tracking Queries',
        action: 'Ask about goal achievement and accountability',
        outcome: 'AI summarizes goal status and identifies at-risk students',
        technicalDetails: 'Example: "How many active goals are off-track?" or "Show students with overdue goals"'
      },
      {
        element: 'Engagement Metrics Queries',
        action: 'Ask about login frequency, time spent, activity patterns',
        outcome: 'AI identifies disengaged students and suggests interventions',
        technicalDetails: 'Example: "Who hasn\'t logged in this week?" or "What\'s our average daily active user count?"'
      },
      {
        element: 'Comparative Analysis Queries',
        action: 'Ask about trends over time or between groups',
        outcome: 'AI provides trend analysis with visualizations',
        technicalDetails: 'Example: "Compare this month vs last month engagement" or "How does Group A compare to Group B?"'
      },
      {
        element: 'Predictive Queries',
        action: 'Ask about likelihood of outcomes',
        outcome: 'AI uses historical data to predict future performance',
        technicalDetails: 'Example: "Which students are at risk of not graduating?" or "Predict next quarter\'s course completion rates"'
      },
      {
        element: 'Recommendation Queries',
        action: 'Ask for AI-generated action items',
        outcome: 'AI suggests interventions, course assignments, or resource allocation',
        technicalDetails: 'Example: "What courses should I assign to struggling Math students?" or "Recommend next steps for improving engagement"'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Natural Language Processing', 'Data Analytics', 'Predictive Models']
  },
  {
    id: 'ai-assistant-chat-interface',
    section: 'ai-assistant',
    subsection: 'Chat Interface',
    title: 'Chat Interface Elements',
    description: 'Components of the AI assistant chat interface and how to interact with them.',
    userPurpose: 'Navigate the chat interface efficiently to ask questions, review history, and export insights.',
    route: '/org/:orgId/ai-coach',
    component: 'OrgAIStudyCoach.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Message Input Box',
        action: 'Type questions in natural language',
        outcome: 'Send query to AI for processing',
        technicalDetails: 'Text area with auto-resize, Enter to send, Shift+Enter for new line'
      },
      {
        element: 'Send Button',
        action: 'Click to submit query',
        outcome: 'Sends message to AI assistant',
        technicalDetails: 'Button with loading state while AI generates response'
      },
      {
        element: 'Conversation History',
        action: 'Scrollable list of past messages',
        outcome: 'Review previous queries and responses',
        technicalDetails: 'Stored in chat_messages table, persists across sessions'
      },
      {
        element: 'AI Response Formatting',
        action: 'AI responses include text, tables, and charts',
        outcome: 'Rich formatted data for easy comprehension',
        technicalDetails: 'Markdown rendering with embedded charts using Recharts'
      },
      {
        element: 'Follow-Up Questions',
        action: 'Ask clarifying questions based on AI response',
        outcome: 'AI maintains conversation context',
        technicalDetails: 'Conversation memory maintains last 5-10 exchanges'
      },
      {
        element: 'Copy Response Button',
        action: 'Click to copy AI response to clipboard',
        outcome: 'Paste insights into reports or emails',
        technicalDetails: 'Copies formatted text, optionally includes table data'
      },
      {
        element: 'Export Chat Button',
        action: 'Export entire conversation as PDF or CSV',
        outcome: 'Save insights for documentation or sharing',
        technicalDetails: 'Generates PDF with formatted responses and charts'
      },
      {
        element: 'New Conversation Button',
        action: 'Start fresh chat without previous context',
        outcome: 'Clears conversation memory for new topic',
        technicalDetails: 'Creates new session in chat_sessions table'
      }
    ],
    dataDisplayed: [
      {
        field: 'Chat Messages',
        source: 'chat_messages table',
        calculation: 'All messages in current session',
        significance: 'Maintains conversation history for context-aware responses'
      }
    ],
    relatedFeatures: ['Chat History', 'Data Export', 'Conversation Context']
  },
  {
    id: 'ai-assistant-data-visualizations',
    section: 'ai-assistant',
    subsection: 'Visualizations',
    title: 'AI-Generated Data Visualizations',
    description: 'How AI creates charts, graphs, and tables to visualize data insights.',
    userPurpose: 'Receive visual representations of data for easier pattern recognition and reporting.',
    route: '/org/:orgId/ai-coach',
    component: 'OrgAIStudyCoach.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Automatic Chart Generation',
        action: 'AI decides when visualizations would enhance understanding',
        outcome: 'Embeds charts directly in chat responses',
        technicalDetails: 'AI generates Recharts configuration based on query type'
      },
      {
        element: 'Chart Types',
        action: 'AI selects appropriate chart type for data',
        outcome: 'Bar charts for comparisons, line charts for trends, pie charts for distributions',
        technicalDetails: 'Supports bar, line, area, pie, scatter, and radar charts'
      },
      {
        element: 'Interactive Charts',
        action: 'Hover over data points for details',
        outcome: 'Shows exact values and percentages',
        technicalDetails: 'Recharts tooltip component with custom formatting'
      },
      {
        element: 'Table Generation',
        action: 'AI creates tables for detailed data listings',
        outcome: 'Sortable columns with student names, scores, dates',
        technicalDetails: 'Markdown table with optional CSV export'
      },
      {
        element: 'Download Chart Button',
        action: 'Export chart as PNG image',
        outcome: 'Save visualization for presentations or reports',
        technicalDetails: 'Uses html-to-image library to capture chart'
      }
    ],
    dataDisplayed: [
      {
        field: 'Dynamic Visualizations',
        source: 'Generated from AI query results',
        significance: 'Transforms raw data into actionable visual insights'
      }
    ],
    relatedFeatures: ['Data Visualization', 'Charts', 'Reports', 'Export']
  },
  {
    id: 'ai-assistant-suggested-prompts',
    section: 'ai-assistant',
    subsection: 'Prompt Suggestions',
    title: 'Suggested Question Prompts',
    description: 'Pre-written example questions to help users get started with the AI assistant.',
    userPurpose: 'Discover the types of queries possible and learn effective prompt patterns.',
    route: '/org/:orgId/ai-coach',
    component: 'OrgAIStudyCoach.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Suggested Prompt Chips',
        action: 'Display clickable example questions',
        outcome: 'User can click to instantly ask suggested question',
        technicalDetails: 'Button chips shown when chat is empty or after response'
      },
      {
        element: 'Category-Based Suggestions',
        action: 'Prompts grouped by type (Performance, Engagement, Goals, Courses)',
        outcome: 'Helps users navigate different query categories',
        technicalDetails: 'Conditional display based on organization context'
      },
      {
        element: 'Contextual Suggestions',
        action: 'AI suggests follow-up questions based on current response',
        outcome: 'Guides users to deeper analysis',
        technicalDetails: 'Example: After showing low-performing students, suggests "What interventions have worked for similar students?"'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['User Onboarding', 'Prompt Engineering', 'AI Guidance']
  },
  {
    id: 'ai-assistant-data-privacy',
    section: 'ai-assistant',
    subsection: 'Privacy & Security',
    title: 'AI Data Privacy and Security',
    description: 'How AI assistant maintains data privacy and security when processing organizational information.',
    userPurpose: 'Understand what data AI can access and how student information is protected.',
    route: '/org/:orgId/ai-coach',
    component: 'OrgAIStudyCoach.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'Data Scope Limitation',
        action: 'AI only accesses data for your organization',
        outcome: 'Cannot see data from other organizations',
        technicalDetails: 'RLS policies enforce org_id filtering on all queries'
      },
      {
        element: 'Role-Based Data Access',
        action: 'AI respects user role permissions',
        outcome: 'Instructors only see their assigned students\' data',
        technicalDetails: 'Permission checks before revealing student details'
      },
      {
        element: 'PII Handling',
        action: 'Personally identifiable information is minimized in AI context',
        outcome: 'AI references students by ID or anonymized identifiers in logs',
        technicalDetails: 'PII stripped from AI training data and logs'
      },
      {
        element: 'Data Retention',
        action: 'Chat history retained for convenience',
        outcome: 'Users can delete conversations anytime',
        technicalDetails: 'chat_messages table with user-controlled deletion'
      },
      {
        element: 'No External Sharing',
        action: 'AI responses stay within FPK University platform',
        outcome: 'Data never sent to third-party AI trainers',
        technicalDetails: 'Dedicated AI instances with no cross-contamination'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['FERPA Compliance', 'COPPA Compliance', 'Data Security', 'Privacy']
  },
  {
    id: 'ai-assistant-limitations',
    section: 'ai-assistant',
    subsection: 'Limitations',
    title: 'AI Assistant Limitations',
    description: 'Understanding what the AI assistant cannot do and when human judgment is required.',
    userPurpose: 'Set realistic expectations and know when to escalate to human decision-making.',
    route: '/org/:orgId/ai-coach',
    component: 'OrgAIStudyCoach.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [
      {
        element: 'No Direct Database Modifications',
        action: 'AI cannot change student records or settings',
        outcome: 'AI provides insights and recommendations only, does not execute actions',
        technicalDetails: 'Read-only access to database, no write permissions'
      },
      {
        element: 'No Guaranteed Accuracy',
        action: 'AI may occasionally misinterpret queries or provide incorrect analysis',
        outcome: 'Users should verify critical insights before acting',
        technicalDetails: 'AI confidence scores provided when available'
      },
      {
        element: 'Limited Real-Time Data',
        action: 'AI works with recently cached data, not always live',
        outcome: 'May have slight delay (5-10 minutes) for latest updates',
        technicalDetails: 'Data cache refreshes periodically for performance'
      },
      {
        element: 'Cannot Replace Professional Judgment',
        action: 'AI suggestions are not educational or legal advice',
        outcome: 'Final decisions rest with human educators and administrators',
        technicalDetails: 'AI includes disclaimers on sensitive recommendations'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Human Oversight', 'Data Accuracy', 'Professional Responsibility']
  },
  {
    id: 'ai-assistant-example-queries',
    section: 'ai-assistant',
    subsection: 'Example Queries',
    title: 'Example AI Assistant Queries',
    description: 'Practical examples of effective AI assistant questions and their responses.',
    userPurpose: 'Learn by example how to phrase questions for optimal AI responses.',
    route: '/org/:orgId/ai-coach',
    component: 'OrgAIStudyCoach.tsx',
    accessLevel: ['owner', 'admin', 'instructor'],
    interactions: [],
    dataDisplayed: [],
    relatedFeatures: ['Prompt Examples', 'Best Practices', 'Query Optimization']
  }
];
