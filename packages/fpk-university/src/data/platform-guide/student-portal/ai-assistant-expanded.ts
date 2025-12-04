/**
 * Student Portal - AI Assistant Section
 * Comprehensive documentation for student AI Study Coach features
 */

import { GuideEntry } from '@/types/platform-guide';

export const studentAIAssistantGuide: GuideEntry[] = [
  {
    id: 'student-ai-coach-overview',
    section: 'ai-assistant',
    title: 'AI Study Coach - Complete Overview',
    description: 'Personal AI tutor providing 24/7 homework help, concept explanations, study guidance, and Socratic questioning.',
    userPurpose: 'Get immediate learning support without waiting for instructor, receive personalized explanations, and deepen understanding through guided questioning.',
    route: '/dashboard/learner/ai-coach',
    component: 'AIStudyCoach.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Chat Interface',
        action: 'Type questions or topics in natural language',
        outcome: 'AI responds with explanations, hints, and guidance',
        technicalDetails: 'Lovable AI integration with student context and course materials'
      },
      {
        element: 'Message History',
        action: 'Scroll through previous conversations',
        outcome: 'Review past Q&A sessions and explanations',
        technicalDetails: 'ai_chat_sessions table stores conversation history'
      },
      {
        element: 'New Conversation Button',
        action: 'Start fresh chat thread',
        outcome: 'Begins new session without previous context',
        technicalDetails: 'Creates new ai_chat_sessions record'
      },
      {
        element: 'Suggested Prompts',
        action: 'Quick-start buttons with example questions',
        outcome: 'Helps students know how to interact with AI',
        technicalDetails: 'Pre-defined prompt suggestions based on recent lessons'
      },
      {
        element: 'Code Formatting',
        action: 'For programming questions, displays code with syntax highlighting',
        outcome: 'Clear presentation of code examples',
        technicalDetails: 'Markdown rendering with code block support'
      }
    ],
    dataDisplayed: [
      {
        field: 'Chat Messages',
        source: 'ai_chat_sessions WHERE student_id=:userId',
        significance: 'Conversation history with AI tutor'
      },
      {
        field: 'Student Context',
        source: 'Current courses, recent lessons, profile data',
        significance: 'Enables personalized AI responses based on learning context'
      },
      {
        field: 'Course Materials',
        source: 'Course content student is enrolled in',
        significance: 'AI can reference and explain course-specific content'
      }
    ],
    relatedFeatures: ['Course Materials', 'Notes', 'Homework Help', 'Concept Explanations']
  },
  {
    id: 'student-socratic-dialogue',
    section: 'ai-assistant',
    subsection: 'Teaching Method',
    title: 'Socratic Method AI Questioning',
    description: 'AI uses Socratic questioning technique to guide students to discover answers themselves rather than directly providing solutions.',
    userPurpose: 'Develop deeper understanding and critical thinking skills through guided questioning.',
    route: '/dashboard/learner/ai-coach',
    component: 'AIStudyCoach with Socratic prompting',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Guiding Questions',
        action: 'AI asks questions to lead student to solution',
        outcome: 'Student develops answer through reasoning',
        technicalDetails: 'AI prompt engineering with Betty persona and Socratic method instructions'
      },
      {
        element: 'Hint System',
        action: 'Student can request hints if stuck',
        outcome: 'Provides progressively more direct guidance',
        technicalDetails: 'Multi-level hint system in AI prompts'
      },
      {
        element: 'Explanation After Discovery',
        action: 'Once student reaches answer, AI provides full explanation',
        outcome: 'Reinforces understanding with complete context',
        technicalDetails: 'AI confirms correct understanding and expands on concept'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['AI Study Coach', 'Critical Thinking', 'Problem Solving']
  },
  {
    id: 'student-homework-help',
    section: 'ai-assistant',
    subsection: 'Study Support',
    title: 'AI Homework Help',
    description: 'Get assistance with homework questions, assignments, and problem-solving without receiving direct answers.',
    userPurpose: 'Receive guidance on homework while maintaining academic integrity through guided learning.',
    route: '/dashboard/learner/ai-coach',
    component: 'AIStudyCoach homework mode',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Submit Homework Question',
        action: 'Paste or type homework problem',
        outcome: 'AI provides guidance without giving direct answer',
        technicalDetails: 'AI configured to guide rather than solve directly'
      },
      {
        element: 'Step-by-Step Guidance',
        action: 'AI breaks problem into manageable steps',
        outcome: 'Student solves incrementally with support',
        technicalDetails: 'Structured problem-solving approach in AI responses'
      },
      {
        element: 'Concept Review',
        action: 'AI identifies gaps in understanding',
        outcome: 'Reviews prerequisite concepts before solving',
        technicalDetails: 'AI analyzes student errors and provides targeted review'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Assignments', 'Course Materials', 'Practice Problems']
  },
  {
    id: 'student-concept-explanations',
    section: 'ai-assistant',
    subsection: 'Learning Support',
    title: 'Concept Explanations and Clarifications',
    description: 'Request explanations of difficult concepts, theories, or terms in multiple ways until understood.',
    userPurpose: 'Get personalized explanations adapted to student\'s current understanding level.',
    route: '/dashboard/learner/ai-coach',
    component: 'AIStudyCoach explanation mode',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Concept Request',
        action: 'Ask "Explain [concept]"',
        outcome: 'AI provides clear explanation with examples',
        technicalDetails: 'AI uses simple language and analogies'
      },
      {
        element: 'Explain Differently',
        action: 'Request alternative explanation if not understood',
        outcome: 'AI uses different approach (analogy, visual description, simpler terms)',
        technicalDetails: 'Multiple explanation strategies in AI prompting'
      },
      {
        element: 'Examples Request',
        action: 'Ask for real-world examples',
        outcome: 'AI provides concrete examples of abstract concepts',
        technicalDetails: 'Context-aware example generation'
      },
      {
        element: 'ELI5 Mode',
        action: 'Request "Explain Like I\'m 5"',
        outcome: 'Ultra-simplified explanation',
        technicalDetails: 'AI uses very simple language and relatable analogies'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Course Content', 'Study Materials', 'Vocabulary']
  },
  {
    id: 'student-study-strategies',
    section: 'ai-assistant',
    subsection: 'Study Guidance',
    title: 'AI Study Strategy Recommendations',
    description: 'Personalized study technique suggestions based on student\'s learning patterns and performance.',
    userPurpose: 'Improve study effectiveness through data-driven recommendations.',
    route: '/dashboard/learner/ai-coach',
    component: 'AIStudyCoach with analytics integration',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Study Plan Request',
        action: 'Ask AI to create study plan for upcoming test',
        outcome: 'AI generates customized study schedule',
        technicalDetails: 'AI analyzes course content and time until test'
      },
      {
        element: 'Weak Area Identification',
        action: 'AI reviews performance data and suggests focus areas',
        outcome: 'Targeted study recommendations',
        technicalDetails: 'AI analyzes assessment_results to identify weak topics'
      },
      {
        element: 'Study Technique Suggestions',
        action: 'AI recommends methods (flashcards, practice problems, summaries)',
        outcome: 'Strategies tailored to content type and learning style',
        technicalDetails: 'AI considers subject matter and student preferences'
      }
    ],
    dataDisplayed: [
      {
        field: 'Performance Data',
        source: 'assessment_results, course_progress',
        significance: 'Informs AI recommendations'
      },
      {
        field: 'Study Patterns',
        source: 'session_analytics',
        significance: 'Reveals when and how student studies best'
      }
    ],
    relatedFeatures: ['Learning Analytics', 'Study Sessions', 'Time Management']
  },
  {
    id: 'student-ai-practice-problems',
    section: 'ai-assistant',
    subsection: 'Practice',
    title: 'AI-Generated Practice Problems',
    description: 'Request custom practice problems to test understanding of concepts.',
    userPurpose: 'Get unlimited practice questions tailored to specific topics and difficulty levels.',
    route: '/dashboard/learner/ai-coach',
    component: 'AIStudyCoach practice mode',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Generate Practice Problem',
        action: 'Ask AI to create problem on specific topic',
        outcome: 'AI generates relevant practice question',
        technicalDetails: 'AI creates problems based on topic and difficulty level'
      },
      {
        element: 'Check Answer',
        action: 'Submit answer for AI verification',
        outcome: 'AI evaluates correctness and explains solution',
        technicalDetails: 'AI assesses student response and provides feedback'
      },
      {
        element: 'Adjust Difficulty',
        action: 'Request easier or harder problems',
        outcome: 'AI adapts problem difficulty',
        technicalDetails: 'Difficulty parameter in practice generation'
      },
      {
        element: 'Explain Solution',
        action: 'Request detailed solution walkthrough',
        outcome: 'Step-by-step problem solution',
        technicalDetails: 'AI provides complete explanation after attempt'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Practice Mode', 'Quizzes', 'Self-Assessment']
  },
  {
    id: 'student-ai-essay-review',
    section: 'ai-assistant',
    subsection: 'Writing Support',
    title: 'AI Essay and Writing Review',
    description: 'Submit writing for AI feedback on structure, grammar, clarity, and argumentation.',
    userPurpose: 'Improve writing skills through constructive AI feedback.',
    route: '/dashboard/learner/ai-coach',
    component: 'AIStudyCoach writing mode',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Submit Writing Sample',
        action: 'Paste essay or writing for review',
        outcome: 'AI analyzes and provides feedback',
        technicalDetails: 'AI evaluates structure, grammar, clarity, argument strength'
      },
      {
        element: 'Improvement Suggestions',
        action: 'AI highlights areas for improvement',
        outcome: 'Specific recommendations with examples',
        technicalDetails: 'AI provides actionable feedback on weak areas'
      },
      {
        element: 'Grammar and Style Check',
        action: 'AI identifies grammatical errors and style issues',
        outcome: 'Writing mechanics feedback',
        technicalDetails: 'Grammar analysis and suggestions'
      },
      {
        element: 'Thesis Strengthening',
        action: 'AI helps refine main argument',
        outcome: 'Clearer, stronger thesis statement',
        technicalDetails: 'AI guides through thesis development'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Writing Assignments', 'Essay Submission', 'Feedback']
  }
];
