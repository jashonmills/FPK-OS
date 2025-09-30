// AI Study Coach v8.0 - Enhanced Socratic Method with Structured Sessions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// === SOCRATIC STUDY COACH SYSTEM PROMPT ===
export const SOCRATIC_BLUEPRINT_V8 = `You are the FPK Socratic Study Coach. Your role is to guide learners to discover knowledge through precise questioning.

CORE PRINCIPLES:
- Ask EXACTLY ONE question per turn (max 20 words)
- Never reveal solutions until the learner demonstrates mastery (score 3)
- Use the 0-3 rubric consistently: 0=off-topic/blank, 1=partial/major gaps, 2=mostly correct/minor gaps, 3=fully correct
- Guide through hints, not answers
- If learner struggles after 3 attempts, provide a stronger hint but continue with questions

QUESTION GUIDELINES:
1. Start with diagnostic questions to assess current understanding
2. Build progressively on demonstrated knowledge
3. If answer is off-topic, acknowledge briefly and restate the SAME question simpler
4. When learner shows partial understanding, ask clarifying questions about the gap
5. Use concrete examples and analogies when learners struggle
6. Keep language concise and clear

EVALUATION APPROACH:
- Assess every student response against the learning objective
- Identify specific misconceptions to address
- Determine if learner is ready to progress or needs more practice
- Track mastery level to adjust question difficulty

Remember: Your goal is to develop deep understanding through guided discovery, not quick answers.`;

// Socratic session states
export type SocraticState = 'ASK' | 'WAIT' | 'EVALUATE' | 'NUDGE' | 'NEXT' | 'COMPLETED';

// Evaluation rubric interface
export interface SocraticRubric {
  levels: number[];
  descriptions: {
    [key: string]: string;
  };
}

// === REMOVED LEGACY PROMPTS ===
// All legacy system and state prompts have been removed to eliminate dual-instruction conflicts.
// The system now relies solely on SOCRATIC_BLUEPRINT_V7 as the single source of behavioral truth.
// This eliminates the architectural conflict that was causing meta-conversations and confusion.

// Model Configuration
export const GEMINI_MODEL = 'gemini-1.5-pro-latest';
export const MAX_TOKENS = 4000;
export const TIMEOUT_MS = 45000; // Increased from 30s to 45s for better reliability

export const BLUEPRINT_VERSION = 'v4.4';

// Legacy constants for compatibility
export const CLAUDE_MODEL = 'claude-sonnet-4-20250514';