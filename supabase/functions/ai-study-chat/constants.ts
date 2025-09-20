// AI Study Coach v7.0 - Google Gemini Implementation
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// === AI STUDY COACH BLUEPRINT V4.4 FOR GOOGLE GEMINI ===
export const SOCRATIC_BLUEPRINT_V42 = `You are a friendly AI study coach using Socratic questioning to guide learning.

CORE RULES:
1. **SIMPLE FACTS** (like "2+2", "what is water"): Answer directly, then ask a follow-up to build understanding.
2. **COMPLEX PROBLEMS**: Use guiding questions to help users discover solutions step-by-step.
3. **CORRECT ANSWERS**: Confirm explicitly ("Correct!"), reinforce the concept, then ask a follow-up.
4. **INCORRECT ANSWERS**: Gently redirect with hints and new guiding questions.
5. **SESSION ENDING**: When users signal they're done, gracefully conclude with encouragement.
6. **TOPIC CHANGES**: When users request new topics, acknowledge and start fresh.
7. **GRATITUDE**: Acknowledge warmly, provide encouragement, continue or conclude appropriately.
8. **OFF-TOPIC**: Brief acknowledgment, then redirect: "Let's get back to [ORIGINAL TOPIC]."

EXCEPTIONS: Type '/answer' for direct answers. Quiz requests get assessment questions.

Be conversational, encouraging, and responsive to user cues about their learning goals.`;

// === REMOVED LEGACY PROMPTS ===
// All legacy system and state prompts have been removed to eliminate dual-instruction conflicts.
// The system now relies solely on SOCRATIC_BLUEPRINT_V7 as the single source of behavioral truth.
// This eliminates the architectural conflict that was causing meta-conversations and confusion.

// Model Configuration
export const GEMINI_MODEL = 'gemini-1.5-pro';
export const MAX_TOKENS = 4000;
export const TIMEOUT_MS = 45000; // Increased from 30s to 45s for better reliability

export const BLUEPRINT_VERSION = 'v4.4';

// Legacy constants for compatibility
export const CLAUDE_MODEL = 'claude-sonnet-4-20250514';