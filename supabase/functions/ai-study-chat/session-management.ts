// ============================================
// SESSION STATE MANAGEMENT for AI Study Coach
// Handles conversation states and session tracking
// ============================================

import { BLUEPRINT_PROMPTS } from './constants.ts';

export interface SessionState {
  userId: string;
  sessionId: string;
  currentState: SessionStateType;
  context: SessionContext;
  metadata: SessionMetadata;
}

export type SessionStateType = 
  | 'new_session'
  | 'awaiting_answer'
  | 'quiz_active'
  | 'study_session_active'
  | 'refresher_active'
  | 'direct_answer_mode';

export interface SessionContext {
  originalQuestion?: string;
  currentTopic?: string;
  teachingHistory: string[];
  incorrectAnswersCount: number;
  quizTopic?: string;
  studyTopic?: string;
  lastAIQuestion?: string;
  struggleThreshold?: number;
}

export interface SessionMetadata {
  startTime: number;
  lastActivity: number;
  interactionCount: number;
  successfulAnswers: number;
  isVoiceActive: boolean;
}

// Session state detection functions
export function detectSessionState(message: string, chatHistory: any[]): SessionStateType {
  const lowerMessage = message.toLowerCase();
  
  // Direct answer command
  if (lowerMessage.startsWith('/answer')) {
    return 'direct_answer_mode';
  }
  
  // Quiz detection - using direct keyword matching since keywords_to_recognize removed
  const quizKeywords = ["quiz", "test", "questions", "challenge"];
  if (quizKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
    return 'quiz_active';
  }
  
  // Study session detection
  const studyKeywords = ["study", "learn", "understand", "explain"];
  if (studyKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
    return 'study_session_active';
  }
  
  // Struggle detection
  const struggleKeywords = ["help", "stuck", "confused", "don't understand"];
  if (struggleKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
    return 'refresher_active';
  }
  
  // Check if we're in the middle of a conversation (awaiting answer)
  if (chatHistory.length > 0) {
    const lastMessage = chatHistory[chatHistory.length - 1];
    if (lastMessage?.role === 'assistant' && lastMessage?.content?.includes('?')) {
      // Previous AI message was a question, so user is likely providing an answer
      return 'awaiting_answer';
    }
  }
  
  // Default to new session for new academic questions
  return 'new_session';
}

export function buildPromptForState(
  state: SessionStateType, 
  message: string, 
  context: SessionContext,
  chatHistory: any[] = []
): string {
  switch (state) {
    case 'new_session':
      return buildInitiateSessionPrompt(message, context, chatHistory);
      
    case 'study_session_active':
      return buildStudySessionPrompt(message, context, chatHistory);
      
    case 'quiz_active':
      if (context.quizTopic) {
        // If we already have a quiz topic, we're evaluating an answer
        return buildEvaluateQuizAnswerPrompt(message, context, chatHistory);
      } else {
        // Starting a new quiz
        return buildNewQuizPrompt(message, context, chatHistory);
      }
      
    case 'awaiting_answer':
      return buildEvaluateAnswerPrompt(message, context, chatHistory);
      
    case 'refresher_active':
      // Use evaluate_answer prompt as fallback since evaluate_refresher was removed in v4.0
      return buildEvaluateAnswerPrompt(message, context, chatHistory);
      
    case 'direct_answer_mode':
      return buildDirectAnswerPrompt(message, context, chatHistory);
      
    default:
      return buildInitiateSessionPrompt(message);
  }
}

function buildInitiateSessionPrompt(message: string, context: SessionContext, chatHistory: any[]): string {
  const prompt = BLUEPRINT_PROMPTS.initiate_session;
  
  return `${prompt.persona}

${prompt.instruction}

${prompt.tone}

USER MESSAGE: "${message}"`;
}

function buildStudySessionPrompt(message: string, context: SessionContext, chatHistory: any[]): string {
  const prompt = BLUEPRINT_PROMPTS.initiate_study_session;
  const studyTopic = extractStudyTopic(message);
  
  return `${prompt.persona}

${prompt.instruction}

${studyTopic ? `Detected study topic: ${studyTopic}` : 'Please ask for a specific topic to focus on.'}

${prompt.tone}

USER MESSAGE: "${message}"`;
}

function buildNewQuizPrompt(message: string, context: SessionContext, chatHistory: any[]): string {
  const prompt = BLUEPRINT_PROMPTS.initiate_quiz;
  const quizTopic = extractQuizTopic(message);
  
  return `${prompt.persona}

${prompt.instruction.replace('[quiz_topic]', quizTopic)}

${prompt.tone}

Quiz topic requested: "${quizTopic}"
USER MESSAGE: "${message}"`;
}

function buildEvaluateQuizAnswerPrompt(message: string, context: SessionContext, chatHistory: any[]): string {
  const prompt = BLUEPRINT_PROMPTS.evaluate_answer; // Use evaluate_answer for quiz answers in v4.0
  
  return `${prompt.persona}

${prompt.instruction.replace('[user_input]', message)}

${prompt.tone}

Quiz Topic: ${context.quizTopic || 'Unknown'}
Current Topic: ${context.currentTopic || 'Unknown'}

Recent conversation:
${chatHistory.slice(-2).map(msg => `${msg.role}: ${msg.content}`).join('\n')}`;
}

function buildEvaluateAnswerPrompt(message: string, context: SessionContext, chatHistory: any[]): string {
  const prompt = BLUEPRINT_PROMPTS.evaluate_answer;
  
  return `${prompt.persona}

${prompt.instruction.replace('[user_input]', message)}

${prompt.tone}

Original Question: ${context.originalQuestion || 'N/A'}
Current Topic: ${context.currentTopic || 'N/A'}
Teaching History: ${context.teachingHistory?.join(', ') || 'None'}

Recent conversation:
${chatHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n')}`;
}

function buildProactiveHelpPrompt(message: string): string {
  const prompt = BLUEPRINT_PROMPTS.proactive_help;
  
  return `${prompt.persona}

${prompt.instruction}

Tone: ${prompt.tone}

USER MESSAGE: "${message}"`;
}

function buildEvaluateRefresherPrompt(message: string, context: SessionContext): string {
  const prompt = BLUEPRINT_PROMPTS.evaluate_refresher;
  
  return `${prompt.persona}

${prompt.instruction.replace('[user_input]', message)}

Original Question: ${context.originalQuestion || 'N/A'}
Foundational Topic: ${context.currentTopic || 'N/A'}

Tone: ${prompt.tone}`;
}

function buildDirectAnswerPrompt(message: string, context: SessionContext, chatHistory: any[]): string {
  const prompt = BLUEPRINT_PROMPTS.direct_answer_exception;
  const cleanMessage = message.replace(/^\/answer\s*/i, '');
  
  return `${prompt.persona}

${prompt.instruction}

${prompt.tone}

USER QUESTION: "${cleanMessage}"

Context: ${context.originalQuestion || 'No previous question context'}`;
}

// Utility functions
function extractQuizTopic(message: string): string {
  const quizKeywords = ["quiz", "test", "questions", "challenge"];
  for (const keyword of quizKeywords) {
    const regex = new RegExp(`${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(.+)`, 'i');
    const match = message.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return 'general knowledge';
}

function extractStudyTopic(message: string): string {
  const studyKeywords = ["study", "learn", "understand", "explain"];
  for (const keyword of studyKeywords) {
    const regex = new RegExp(`${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(.+)`, 'i');
    const match = message.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

export function createSessionContext(
  originalQuestion?: string,
  currentTopic?: string
): SessionContext {
  return {
    originalQuestion,
    currentTopic,
    teachingHistory: [],
    incorrectAnswersCount: 0,
    struggleThreshold: 3
  };
}

export function updateSessionContext(
  context: SessionContext,
  update: Partial<SessionContext>
): SessionContext {
  return {
    ...context,
    ...update,
    lastActivity: Date.now()
  };
}

// Session management functions
const sessionStore = new Map<string, SessionState>();

export function getSession(userId: string, sessionId: string): SessionState | null {
  const key = `${userId}:${sessionId}`;
  return sessionStore.get(key) || null;
}

export function createSession(
  userId: string,
  sessionId: string,
  initialState: SessionStateType = 'new_session'
): SessionState {
  const key = `${userId}:${sessionId}`;
  const session: SessionState = {
    userId,
    sessionId,
    currentState: initialState,
    context: createSessionContext(),
    metadata: {
      startTime: Date.now(),
      lastActivity: Date.now(),
      interactionCount: 0,
      successfulAnswers: 0,
      isVoiceActive: false
    }
  };
  
  sessionStore.set(key, session);
  return session;
}

export function updateSession(session: SessionState, updates: Partial<SessionState>): SessionState {
  const updatedSession = {
    ...session,
    ...updates,
    metadata: {
      ...session.metadata,
      lastActivity: Date.now(),
      interactionCount: session.metadata.interactionCount + 1
    }
  };
  
  const key = `${session.userId}:${session.sessionId}`;
  sessionStore.set(key, updatedSession);
  return updatedSession;
}