import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConductorRequest {
  message: string;
  conversationId: string;
  conversationHistory: Array<{
    persona: string;
    content: string;
  }>;
}

// ============================================
// MODULAR PROMPT SYSTEM
// ============================================

// Core modules (shared by all personas)
const SAFETY_AND_ETHICS = `# Safety and Ethics

Never generate harmful content. Protect student privacy. Encourage learning over academic dishonesty. All content must be age-appropriate. Be mindful of biases. Recognize emotional distress and respond with empathy.`;

const TONE_OF_VOICE = `# Tone of Voice

Be warm, friendly, and approachable. Celebrate progress. Use clear language. Show patience. Maintain natural, conversational style. Honor student intelligence.`;

const LANGUAGE_AND_STYLE = `# Language and Style

Be clear and direct. Use active voice. Vary sentence length. Adapt vocabulary to student level. Use concrete examples. In voice mode: keep responses concise and use natural speech patterns.`;

const NO_META_REASONING = `# Critical: No Meta-Reasoning Exposure

NEVER expose your internal thinking, analysis, or decision-making process. Students should only see clean, natural dialogue.

FORBIDDEN:
- "I'm thinking..." or "I need to..."
- JSON structures or internal monologue
- Describing your analysis or reasoning

REQUIRED:
- Think internally, keep reasoning invisible
- Output ONLY conversational text students should see
- Respond naturally like a real tutor`;

const CONVERSATIONAL_OPENERS = `# Skill: Natural & Varied Conversational Openers

Your primary goal is to sound like an engaging, human tutor, not a repetitive AI. The biggest failure mode is starting your responses with the same generic affirmations.

### THE CARDINAL RULE: DO NOT START YOUR RESPONSE WITH "THAT'S..."

**FORBIDDEN PHRASES (to start a sentence):**
- "That's a great question."
- "That's an interesting point."
- "That's a good way to put it."
- "That makes sense."
- "That!"

Instead of using these crutches, you MUST integrate your acknowledgment into a more complex and natural opening. Use the following frameworks:

**1. The "Connecting & Reframing" Opener:**
   "Dissecting frogs is such a classic part of learning biology. It sounds like you're interested in..."

**2. The "Empathetic Agreement" Opener:**
   "I can definitely relate; algebra can feel like a real puzzle sometimes. Let's look at..."

**3. The "Curiosity & Intrigue" Opener:**
   "It's fascinating that you chose Ancient Rome. Is there a particular part of it that sparks your interest...?"

**4. The "Direct Acknowledgment" Opener:**
   "You've touched on something important here. Let's explore..."

**5. The "Building On" Opener:**
   "I love where your mind is going with this. What made you think of..."

If you find yourself about to start a sentence with "That's...", STOP and rephrase it immediately.`;

const HANDLE_TYPOS = `# Handle Typos

Silently correct typos and respond to the intended meaning. Never point out spelling errors unless they create genuine ambiguity or the student explicitly asks for spelling help.`;

const SESSION_INITIALIZATION = `# Session Initialization

Manual Start: Acknowledge topic and ask a broad foundational question about prior knowledge.
Promoted Start: Provide 1-2 sentence overview, offer 2-3 concrete direction options.
Continuation: Recap where you left off, acknowledge progress, ask if ready to continue.`;

const PLATFORM_KNOWLEDGE = `# Platform Knowledge Base

You have complete knowledge of the FPK University platform and can answer detailed questions about its features, navigation, and functionality.

## Core Features
- **Phoenix Lab**: Admin-only sandbox for testing the AI coach system
- **Learning Moments Podcast**: Automatically generated audio that captures learning breakthroughs, presented by Nite Owl
- **Dynamic Video Finder**: Contextual video recommendations during learning
- **Personas**: Betty (Socratic Guide), Al (Direct Expert), Nite Owl (Fun Facts)
- **XP & Achievements**: Users earn XP and unlock achievements for milestones
- **Session History**: All conversations are saved and can be revisited

When students ask platform questions, provide specific, actionable guidance with exact navigation paths.`;

// Persona core modules
const BETTY_CORE = `# Betty: The Socratic Guide

Core Identity: You are Betty, a Socratic teaching guide who helps students discover concepts through guided questioning.

NEVER give direct answers to conceptual questions. Always respond with thoughtful, probing questions.

The AVCQ Loop (use for EVERY student response):
1. ACKNOWLEDGE - Repeat/rephrase their answer
2. VALIDATE - Find truth in their response
3. CONNECT & DIFFERENTIATE - Link to the question, highlight differences
4. QUESTION - Ask a refined question that builds on their answer

Critical Rules:
- Never ignore student input (your biggest failure mode)
- Maintain logical thread, no abrupt topic jumps
- Use hint hierarchy when stuck: sensory → analogous → direct clue
- Goal is understanding, not password-guessing

Example:
Student: "currents"
Betty: "Currents are a great answer. You're right, ocean currents are incredibly powerful and move enormous amounts of water. Let's think about how they move—a current is like a giant river flowing through the ocean. How is that different from a wave, which is more of an up-and-down movement on the surface?"`;

const AL_CORE = `# Al: The Direct Expert

Core Identity: You are Al, a direct and efficient expert who provides clear, factual answers. You also have access to student learning data and can provide personalized insights about their progress.

Philosophy:
- Provide clear, concise, factual answers
- No fluff or unnecessary elaboration
- Get straight to the point
- Use precise language
- Answer what was asked, nothing more
- When discussing student progress, reference specific data points

Communication:
- For definitions: state directly
- For "what is": present facts clearly
- For platform questions: give direct instructions with exact navigation paths
- For progress queries: cite specific numbers, topics, and patterns from their data
- Keep under 100 words when possible

Example:
Student: "What is photosynthesis?"
Al: "Photosynthesis is the process by which plants convert light energy into chemical energy (glucose) using carbon dioxide and water, releasing oxygen as a byproduct."

Example (with student context):
Student: "How am I doing?"
Al: "You're making strong progress, Jashon. You've completed 25 Socratic sessions with an average score of 7.8/10. Your most recent topics include Python For Loops, Roman Legionary Tactics, and Supply and Demand. Your strength is problem solving—you're tackling harder problems with higher turn counts."

What you DON'T do:
- No Socratic questions
- No lengthy explanations
- No conceptual guidance (that's Betty's domain)`;

const AL_SOCRATIC_SUPPORT = `# Al: Socratic Support Mode

Enhanced Role: When a student encounters a factual blocker during Socratic dialogue, briefly interject to provide the missing information, then immediately hand back to Betty.

Activation: Student says "I don't know what X means" or explicitly asks for a definition.

Pattern:
1. Acknowledge the gap
2. Provide the fact concisely
3. Bridge back: "Now that you know [fact], let's continue..."

Example:
Student: "I don't even know what CSS stands for."
Al: "CSS stands for Cascading Style Sheets. It's the language used to define visual styles for web pages—colors, fonts, and layouts."
[Returns to Betty immediately]

Key: Brief, targeted, no conceptual teaching, immediate handoff.`;

const NITE_OWL_CORE = `# Nite Owl: The Knowledge Enricher

Core Identity: You are Nite Owl, the wise and playful owl mascot who appears occasionally during Socratic sessions to share fascinating fun facts related to the current topic.

Personality:
- Warm, enthusiastic, and delightfully quirky
- Use your signature "Hoo-hoo!" greeting
- Brief and engaging (2-3 sentences maximum)
- Focus on surprising, delightful facts that enrich understanding

Communication Pattern:
1. Greeting: "Hoo-hoo! Nite Owl here with a fun fact!"
2. Fun Fact: Share one surprising, relevant tidbit
3. Exit: Encourage continued learning

Example:
"Hoo-hoo! Nite Owl here with a fun fact! Did you know that octopuses have three hearts and blue blood? Two hearts pump blood to the gills, while the third pumps it to the rest of the body. Keep exploring those amazing ocean creatures!"

Rules:
- Keep it brief (under 100 words)
- Make it memorable and surprising
- Always relate to the current topic
- End with encouragement`;

// Module separator
const MODULE_SEPARATOR = '\n\n---\n\n';

// Prompt assembly functions
function buildBettySystemPrompt(): string {
  const modules = [
    NO_META_REASONING,
    BETTY_CORE,
    CONVERSATIONAL_OPENERS,
    HANDLE_TYPOS,
    SESSION_INITIALIZATION,
    TONE_OF_VOICE,
    LANGUAGE_AND_STYLE,
    SAFETY_AND_ETHICS,
  ];
  return modules.join(MODULE_SEPARATOR);
}

function buildNiteOwlSystemPrompt(): string {
  const modules = [
    NO_META_REASONING,
    NITE_OWL_CORE,
    TONE_OF_VOICE,
    LANGUAGE_AND_STYLE,
    SAFETY_AND_ETHICS,
  ];
  return modules.join(MODULE_SEPARATOR);
}

function buildAlSystemPrompt(studentContext?: any): string {
  const modules = [
    NO_META_REASONING,
    AL_CORE,
    PLATFORM_KNOWLEDGE,
    CONVERSATIONAL_OPENERS,
    HANDLE_TYPOS,
    TONE_OF_VOICE,
    LANGUAGE_AND_STYLE,
    SAFETY_AND_ETHICS,
  ];
  
  let prompt = modules.join(MODULE_SEPARATOR);
  
  // Inject student context if available
  if (studentContext) {
    prompt += `\n\n${MODULE_SEPARATOR}\n# Current Student Context\n\nYou are speaking to the following student. Use this data to personalize your answers about their progress and learning journey.\n\n${JSON.stringify(studentContext, null, 2)}\n\nWhen discussing their progress, be specific and data-driven. Mention concrete numbers, topics, and patterns.`;
    
    // CRITICAL NEW FEATURE: Add continuity awareness if last session exists
    if (studentContext.lastSessionTranscript && studentContext.lastSessionTranscript.length > 0) {
      prompt += `\n\n${MODULE_SEPARATOR}\n# Continuity Awareness\n\nIMPORTANT: The student's last conversation (from ${studentContext.lastSessionDate || 'recently'}) is provided below. If they ask to "continue", "pick up where we left off", or reference their last session, use this transcript to provide accurate context.\n\nLast Session Transcript:\n${studentContext.lastSessionTranscript.map((msg: any) => `${msg.persona}: ${msg.content}`).join('\n\n')}\n\nWhen they ask to continue, briefly summarize where you left off and ask if they want to continue from there.`;
    }
  }
  
  return prompt;
}

function buildAlSocraticSupportPrompt(): string {
  const modules = [
    NO_META_REASONING,
    AL_CORE,
    AL_SOCRATIC_SUPPORT,
    CONVERSATIONAL_OPENERS,
    HANDLE_TYPOS,
    TONE_OF_VOICE,
    LANGUAGE_AND_STYLE,
    SAFETY_AND_ETHICS,
  ];
  return modules.join(MODULE_SEPARATOR);
}

// Legacy wrapper functions for backward compatibility
function buildBettyPrompt(message: string, history: Array<{ persona: string; content: string }>) {
  return {
    systemPrompt: buildBettySystemPrompt()
  };
}

function buildAlPrompt(message: string, history: Array<{ persona: string; content: string }>) {
  return {
    systemPrompt: buildAlSystemPrompt()
  };
}

// Student Context Fetcher: Retrieves user learning data for personalization
async function fetchStudentContext(userId: string, supabaseClient: any) {
  try {
    console.log('[CONDUCTOR] Fetching student data from database...');
    
    // Fetch user profile data
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('full_name, display_name, total_xp, current_streak, last_activity_date')
      .eq('id', userId)
      .single();
    
    // Fetch recent Socratic sessions
    const { data: sessions } = await supabaseClient
      .from('socratic_sessions')
      .select('topic, created_at, score_history')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    // Fetch achievements
    const { data: achievements } = await supabaseClient
      .from('achievements')
      .select('achievement_name, achievement_type, unlocked_at')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })
      .limit(5);
    
    // CRITICAL NEW FEATURE: Fetch last session transcript for continuity
    const { data: lastSession } = await supabaseClient
      .from('coach_sessions')
      .select('session_data, created_at')
      .eq('user_id', userId)
      .eq('source', 'coach_portal')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    let lastSessionTranscript = null;
    if (lastSession?.session_data?.messages) {
      // Extract last 8 messages from previous session
      const messages = lastSession.session_data.messages.slice(-8);
      lastSessionTranscript = messages.map((msg: any) => ({
        persona: msg.role === 'user' ? 'USER' : msg.role.toUpperCase(),
        content: msg.content,
        timestamp: msg.timestamp
      }));
    }
    
    // Extract unique topics from sessions
    const recentTopics = sessions
      ? [...new Set(sessions.map(s => s.topic).filter(Boolean))].slice(0, 5)
      : [];
    
    // Calculate average mastery score
    const avgMastery = sessions && sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, s) => {
            if (s.score_history && s.score_history.length > 0) {
              const avg = s.score_history.reduce((a, b) => a + b, 0) / s.score_history.length;
              return sum + avg;
            }
            return sum;
          }, 0) / sessions.filter(s => s.score_history?.length > 0).length
        )
      : 0;
    
    const context = {
      userName: profile?.display_name || profile?.full_name || 'Student',
      totalSessions: sessions?.length || 0,
      recentTopics,
      totalXP: profile?.total_xp || 0,
      currentStreak: profile?.current_streak || 0,
      lastActivityDate: profile?.last_activity_date || null,
      avgMasteryScore: avgMastery,
      recentAchievements: achievements?.map(a => a.achievement_name) || [],
      lastSessionTranscript, // NEW: Include recent conversation for continuity
      lastSessionDate: lastSession?.created_at || null
    };
    
    console.log('[CONDUCTOR] Student context fetched successfully:', {
      ...context,
      hasLastSession: !!lastSessionTranscript
    });
    return context;
    
  } catch (error) {
    console.error('[CONDUCTOR] Error fetching student context:', error);
    return null;
  }
}

// Governor Module: Quality Control and Safety Layer
interface GovernorResult {
  passed: boolean;
  is_safe: boolean;
  is_on_topic: boolean;
  persona_adherence: 'correct' | 'violation_direct_answer' | 'violation_socratic_question' | 'violation_other';
  severity?: 'low' | 'medium' | 'high';
  reason?: string;
  safe_fallback?: string;
}

async function runGovernorCheck(
  responseText: string,
  expectedPersona: string,
  userMessage: string,
  lovableApiKey: string
): Promise<GovernorResult> {
  console.log('[GOVERNOR] Evaluating response for safety and quality...');
  
  try {
    const governorResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are the Governor, a quality control agent in the Phoenix AI Learning System. Your job is to evaluate AI-generated responses before they reach students.

Evaluate responses based on:
1. SAFETY: Is the content free of harmful, inappropriate, or unsafe material?
2. TOPIC RELEVANCE: Is the response educational and appropriate for a learning context?
3. PERSONA ADHERENCE: Does the response match the expected persona behavior?
   - BETTY should ask Socratic questions, NEVER give direct answers to conceptual questions
   - AL should give direct, concise answers, NEVER ask Socratic questions

Severity levels:
- low: Minor issues, response is usable
- medium: Notable issues, may need revision
- high: Critical issues, must block response`
          },
          {
            role: 'user',
            content: `Evaluate this AI response:

Expected Persona: ${expectedPersona}
Student Message: "${userMessage}"
AI Response: "${responseText}"

Classify the response quality and safety.`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'classify_output_quality',
              description: 'Classify the AI response quality and safety',
              parameters: {
                type: 'object',
                properties: {
                  is_safe: {
                    type: 'boolean',
                    description: 'Is the content safe and appropriate?'
                  },
                  is_on_topic: {
                    type: 'boolean',
                    description: 'Is the response educational and relevant?'
                  },
                  persona_adherence: {
                    type: 'string',
                    enum: ['correct', 'violation_direct_answer', 'violation_socratic_question', 'violation_other'],
                    description: 'Does the response match the expected persona behavior?'
                  },
                  severity: {
                    type: 'string',
                    enum: ['low', 'medium', 'high'],
                    description: 'Severity of any issues found'
                  },
                  reason: {
                    type: 'string',
                    description: 'Brief explanation of the evaluation'
                  }
                },
                required: ['is_safe', 'is_on_topic', 'persona_adherence', 'severity', 'reason'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'classify_output_quality' } }
      }),
    });

    if (!governorResponse.ok) {
      console.error('[GOVERNOR] Evaluation failed:', governorResponse.status);
      // On error, allow response through with warning
      return {
        passed: true,
        is_safe: true,
        is_on_topic: true,
        persona_adherence: 'correct',
        reason: 'Governor check failed, allowing response'
      };
    }

    const governorData = await governorResponse.json();
    const toolCall = governorData.choices[0]?.message?.tool_calls?.[0];
    const evaluation = toolCall ? JSON.parse(toolCall.function.arguments) : {
      is_safe: true,
      is_on_topic: true,
      persona_adherence: 'correct',
      severity: 'low',
      reason: 'No evaluation'
    };

    console.log('[GOVERNOR] Evaluation result:', evaluation);

    // Determine if response should pass
    const criticalFailure = !evaluation.is_safe || (evaluation.severity === 'high');
    const passed = evaluation.is_safe && evaluation.is_on_topic;

    const result: GovernorResult = {
      passed,
      is_safe: evaluation.is_safe,
      is_on_topic: evaluation.is_on_topic,
      persona_adherence: evaluation.persona_adherence,
      severity: evaluation.severity,
      reason: evaluation.reason
    };

    // Generate safe fallback if needed
    if (!passed) {
      result.safe_fallback = "I apologize, but I need to reconsider my response. Let's try approaching this differently. Could you rephrase your question?";
    }

    return result;

  } catch (error) {
    console.error('[GOVERNOR] Error during evaluation:', error);
    // On error, allow response through with warning
    return {
      passed: true,
      is_safe: true,
      is_on_topic: true,
      persona_adherence: 'correct',
      reason: 'Governor check error, allowing response'
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[CONDUCTOR] Function invoked');

    // 1. Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('[CONDUCTOR] User authenticated:', user.id);

    // 2. Verify admin status
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isAdmin = roles?.some(r => r.role === 'admin');
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    // 3. Parse request body
    const { message, conversationId, conversationHistory }: ConductorRequest = await req.json();
    
    console.log('[CONDUCTOR] Processing message:', {
      conversationId,
      messageLength: message.length,
      historyLength: conversationHistory.length
    });

    // 3a. Check/Initialize session state for Nite Owl triggering
    let sessionState = await supabaseClient
      .from('phoenix_conversations')
      .select('metadata')
      .eq('session_id', conversationId)
      .single();

    let socraticTurnCounter = sessionState.data?.metadata?.socraticTurnCounter || 0;
    let nextInterjectionPoint = sessionState.data?.metadata?.nextInterjectionPoint || (Math.floor(Math.random() * 3) + 4); // 4-6
    let totalBettyTurns = sessionState.data?.metadata?.totalBettyTurns || 0;

    // 4. Get Lovable AI API Key
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // 5. Intent Detection using LLM with Tool Calling
    console.log('[CONDUCTOR] Analyzing intent with LLM...');
    
    // Determine if we're in an active Betty conversation
    const lastPersona = conversationHistory.length > 0 
      ? conversationHistory[conversationHistory.length - 1].persona 
      : null;
    const inBettySession = lastPersona === 'BETTY';
    
    const intentResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are the Conductor in an AI tutoring system. Your job is to analyze the user's message and determine their intent.

Intent Types:
- "socratic_guidance": Conceptual questions, problem-solving, "why" or "how" questions, seeking understanding
- "direct_answer": Platform questions, general facts, "what is" questions requiring factual answers
- "request_for_clarification": Student explicitly states they don't know a term/definition (e.g., "I don't know what X means", "What does X stand for?", "I'm not sure what that is")

IMPORTANT: Only use "request_for_clarification" when the student explicitly asks for a definition or states they don't understand a specific term. Regular questions should still be "socratic_guidance" or "direct_answer".`
          },
          {
            role: 'user',
            content: `Analyze this student message and classify the intent:\n\n"${message}"\n\n${inBettySession ? 'Context: This is during an active Socratic learning session with Betty.\n\n' : ''}Classify the intent type.`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'classify_intent',
              description: 'Classify the student message intent',
              parameters: {
                type: 'object',
                properties: {
                  intent: {
                    type: 'string',
                    enum: ['socratic_guidance', 'direct_answer', 'request_for_clarification', 'query_user_data', 'platform_question'],
                    description: 'The detected intent type. Use query_user_data when asking about their own progress/stats. Use platform_question when asking how features work.'
                  },
                  confidence: {
                    type: 'number',
                    description: 'Confidence score between 0 and 1'
                  },
                  reasoning: {
                    type: 'string',
                    description: 'Brief explanation of the classification'
                  }
                },
                required: ['intent', 'confidence', 'reasoning'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'classify_intent' } }
      }),
    });

    if (!intentResponse.ok) {
      const errorText = await intentResponse.text();
      console.error('[CONDUCTOR] Intent detection error:', intentResponse.status, errorText);
      throw new Error(`Intent detection failed: ${intentResponse.status}`);
    }

    const intentData = await intentResponse.json();
    const toolCall = intentData.choices[0]?.message?.tool_calls?.[0];
    const intentResult = toolCall ? JSON.parse(toolCall.function.arguments) : { intent: 'direct_answer', confidence: 0.5, reasoning: 'Fallback' };
    
    const detectedIntent = intentResult.intent;
    console.log('[CONDUCTOR] Intent detected:', detectedIntent, 'Confidence:', intentResult.confidence);
    console.log('[CONDUCTOR] Reasoning:', intentResult.reasoning);

    // 6. Sentiment Analysis (simple for now)
    const detectedSentiment = 'Neutral';

    // 7. Check if Nite Owl should interject (only during Betty sessions)
    let shouldTriggerNiteOwl = false;
    if (inBettySession && detectedIntent === 'socratic_guidance') {
      if (socraticTurnCounter >= nextInterjectionPoint) {
        shouldTriggerNiteOwl = true;
        console.log('[CONDUCTOR] 🦉 Nite Owl interjection triggered!');
      }
    }

    // 8. Fetch Student Context if needed (for data-driven personalization)
    // CRITICAL: Also fetch for first message to detect "pick up where we left off" requests
    let studentContext = null;
    const isFirstUserMessage = conversationHistory.filter(m => m.persona === 'USER').length === 0;
    const shouldFetchContext = detectedIntent === 'query_user_data' || 
                              detectedIntent === 'platform_question' ||
                              isFirstUserMessage; // Always fetch on first message for continuity detection
    
    if (shouldFetchContext && user?.id) {
      console.log('[CONDUCTOR] 📊 Fetching student context for personalized response...');
      studentContext = await fetchStudentContext(user.id, supabaseClient);
    }

    // 9. Persona Selection with STRICT PRIORITY SYSTEM
    // CRITICAL: When Nite Owl triggers, ALL other processing must halt for this turn
    let selectedPersona: string;
    let systemPrompt: string;
    let isSocraticHandoff = false;

    if (shouldTriggerNiteOwl) {
      // ⭐ HIGHEST PRIORITY: NITE OWL INTERJECTION
      // When Nite Owl triggers, ONLY process Nite Owl - no Betty, no Al, nothing else
      selectedPersona = 'NITE_OWL';
      systemPrompt = buildNiteOwlSystemPrompt();
      console.log('[CONDUCTOR] 🦉 Nite Owl interjection - HALTING all other AI processing');
      
      // Reset counter and set new random interjection point
      socraticTurnCounter = 0;
      nextInterjectionPoint = Math.floor(Math.random() * 4) + 3; // 3-6 turns
      
      // CRITICAL: Do NOT increment Betty turn counter or process any other logic
      // The if-else chain ensures this, but logging for clarity
      console.log('[CONDUCTOR] Nite Owl has priority - skipping all Betty/Al logic');
      
    } else if (detectedIntent === 'request_for_clarification' && inBettySession) {
      // SOCRATIC HANDOFF: Al provides factual support during Betty's session
      selectedPersona = 'AL';
      systemPrompt = buildAlSocraticSupportPrompt();
      isSocraticHandoff = true;
      console.log('[CONDUCTOR] 🤝 Socratic Handoff: Al providing factual support in Betty session');
      
    } else if (detectedIntent === 'query_user_data' || detectedIntent === 'platform_question') {
      // USER DATA QUERY or PLATFORM QUESTION: Al with student context
      selectedPersona = 'AL';
      systemPrompt = buildAlSystemPrompt(studentContext);
      console.log('[CONDUCTOR] 📊 Al providing data-driven or platform guidance response');
      
    } else if (detectedIntent === 'socratic_guidance') {
      // BETTY SOCRATIC SESSION: Increment counters
      selectedPersona = 'BETTY';
      systemPrompt = buildBettySystemPrompt();
      socraticTurnCounter++; // Increment turn counter for next Nite Owl check
      totalBettyTurns++;
      console.log('[CONDUCTOR] Betty continues Socratic dialogue');
      
    } else {
      // DEFAULT: Al for direct answers
      selectedPersona = 'AL';
      systemPrompt = buildAlSystemPrompt();
      console.log('[CONDUCTOR] Al provides direct answer');
    }
    
    console.log('[CONDUCTOR] Routing to persona:', selectedPersona, isSocraticHandoff ? '(Socratic Support Mode)' : '');
    console.log('[CONDUCTOR] Turn counter:', socraticTurnCounter, '/ Next interjection:', nextInterjectionPoint);

    // 10. Build context for Nite Owl if triggered
    let niteOwlContext = '';
    if (selectedPersona === 'NITE_OWL') {
      // Extract topic from recent conversation
      const recentMessages = conversationHistory.slice(-5);
      const topicContext = recentMessages
        .filter(msg => msg.persona === 'BETTY' || msg.persona === 'USER')
        .map(msg => msg.content)
        .join('\n');
      
      niteOwlContext = `Based on this conversation about the topic:\n${topicContext}\n\nShare a brief, fascinating fun fact that enriches their understanding. Remember to use your "Hoo-hoo!" greeting and keep it under 100 words.`;
    }

    // 10. Generate AI Response with Appropriate Persona
    console.log('[CONDUCTOR] Generating response with', selectedPersona, 'persona...');
    const personaResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: selectedPersona === 'NITE_OWL' 
          ? [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: niteOwlContext }
            ]
          : [
              { role: 'system', content: systemPrompt },
              ...conversationHistory.slice(-5).map(msg => ({
                role: msg.persona === 'USER' ? 'user' : 'assistant',
                content: msg.content
              })),
              { role: 'user', content: message }
            ],
        temperature: selectedPersona === 'BETTY' ? 0.8 : (selectedPersona === 'NITE_OWL' ? 0.9 : 0.6),
        max_tokens: selectedPersona === 'NITE_OWL' ? 200 : (isSocraticHandoff ? 300 : 500),
        stream: true
      }),
    });

    if (!personaResponse.ok) {
      const errorText = await personaResponse.text();
      console.error('[CONDUCTOR] Persona response error:', personaResponse.status, errorText);
      throw new Error(`Persona response failed: ${personaResponse.status}`);
    }

    console.log('[CONDUCTOR] Streaming AI response...');
    
    // Store metadata for streaming response
    const responseMetadata = {
      conversationId,
      selectedPersona,
      detectedIntent,
      detectedSentiment,
      intentConfidence: intentResult.confidence,
      intentReasoning: intentResult.reasoning,
      isSocraticHandoff
    };

    // Return streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = personaResponse.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let chunkCount = 0;
        let buffer = ''; // Buffer for incomplete JSON

        try {
          console.log('[CONDUCTOR] Starting SSE stream...');
          
          while (true) {
            const { done, value } = await reader!.read();
            if (done) {
              console.log(`[CONDUCTOR] Stream complete. Total chunks sent: ${chunkCount}`);
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.trim() === '' || line.startsWith(':')) continue;
              
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    fullText += content;
                    chunkCount++;
                    
                    // Send chunk to client with SSE format
                    const sseMessage = `data: ${JSON.stringify({ 
                      type: 'chunk', 
                      content,
                      persona: selectedPersona 
                    })}\n\n`;
                    
                    controller.enqueue(new TextEncoder().encode(sseMessage));
                    
                    // Log progress every 10 chunks
                    if (chunkCount % 10 === 0) {
                      console.log(`[CONDUCTOR] Streamed ${chunkCount} chunks, ${fullText.length} chars`);
                    }
                  }
                } catch (e) {
                  // Skip malformed JSON silently - likely incomplete chunk
                  if (!data.includes('[DONE]')) {
                    console.debug('[CONDUCTOR] Skipping incomplete JSON chunk');
                  }
                }
              }
            }
          }

          // Run Governor Check on completed response
          console.log('[CONDUCTOR] Running Governor quality check...');
          const governorResult = await runGovernorCheck(
            fullText,
            selectedPersona,
            message,
            LOVABLE_API_KEY
          );

          // Handle Governor violations
          let finalText = fullText;
          let governorBlocked = false;
          
          if (!governorResult.passed) {
            console.warn('[GOVERNOR] Response blocked:', governorResult.reason);
            finalText = governorResult.safe_fallback || "I apologize, but I need to reconsider my response. Let's try approaching this differently.";
            governorBlocked = true;
            
            // Log violation to database for review
            await supabaseClient.from('phoenix_governor_logs').insert({
              conversation_id: conversationId,
              persona: selectedPersona,
              original_response: fullText,
              user_message: message,
              is_safe: governorResult.is_safe,
              is_on_topic: governorResult.is_on_topic,
              persona_adherence: governorResult.persona_adherence,
              severity: governorResult.severity,
              reason: governorResult.reason,
              blocked: true
            });
          } else if (governorResult.persona_adherence !== 'correct') {
            // Log persona violations even if not blocking
            console.warn('[GOVERNOR] Persona adherence issue:', governorResult.persona_adherence);
            await supabaseClient.from('phoenix_governor_logs').insert({
              conversation_id: conversationId,
              persona: selectedPersona,
              original_response: fullText,
              user_message: message,
              is_safe: governorResult.is_safe,
              is_on_topic: governorResult.is_on_topic,
              persona_adherence: governorResult.persona_adherence,
              severity: governorResult.severity,
              reason: governorResult.reason,
              blocked: false
            });
          }

          console.log('[GOVERNOR] Check complete. Blocked:', governorBlocked);

          // Generate TTS Audio - Try ElevenLabs first, fallback to OpenAI
          let audioUrl = null;
          let ttsProvider = 'none';
          try {
            const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
            const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
            
            if (finalText.length > 0) {
              console.log('[CONDUCTOR] Generating TTS audio for completed response...');
              
              // Try ElevenLabs first
              if (ELEVENLABS_API_KEY) {
                try {
                  // Voice mapping: Betty = custom voice, Al = Callum, Nite Owl = Lily (playful)
                  const voiceId = selectedPersona === 'BETTY' 
                    ? 'uYXf8XasLslADfZ2MB4u' 
                    : selectedPersona === 'NITE_OWL'
                    ? 'pFZP5JQG7iQjIQuC4Bku'
                    : 'N2lVS1w4EtoT3dr4eOWO';
                  
                  const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: {
                      'xi-api-key': ELEVENLABS_API_KEY,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      text: finalText,
                      model_id: 'eleven_turbo_v2_5',
                      voice_settings: {
                        stability: selectedPersona === 'BETTY' ? 0.6 : 0.7,
                        similarity_boost: 0.8,
                        style: selectedPersona === 'BETTY' ? 0.4 : 0.2
                      }
                    }),
                  });

                  if (elevenLabsResponse.ok) {
                    const audioBuffer = await elevenLabsResponse.arrayBuffer();
                    
                    // Convert to base64 safely without stack overflow
                    const uint8Array = new Uint8Array(audioBuffer);
                    let binaryString = '';
                    
                    // Process byte by byte to avoid any apply() stack issues
                    for (let i = 0; i < uint8Array.length; i++) {
                      binaryString += String.fromCharCode(uint8Array[i]);
                    }
                    
                    const base64Audio = btoa(binaryString);
                    audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
                    ttsProvider = 'elevenlabs';
                    console.log('[CONDUCTOR] TTS audio generated successfully via ElevenLabs');
                  } else {
                    const errorText = await elevenLabsResponse.text();
                    console.warn('[CONDUCTOR] ElevenLabs TTS failed, falling back to OpenAI:', errorText);
                  }
                } catch (elevenLabsError) {
                  console.warn('[CONDUCTOR] ElevenLabs error, falling back to OpenAI:', elevenLabsError);
                }
              }
              
              // Fallback to OpenAI if ElevenLabs failed or wasn't configured
              if (!audioUrl && OPENAI_API_KEY) {
                const voice = selectedPersona === 'BETTY' 
                  ? 'nova' 
                  : selectedPersona === 'NITE_OWL'
                  ? 'shimmer'
                  : 'onyx';
                
                const openAIResponse = await fetch('https://api.openai.com/v1/audio/speech', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    model: 'tts-1',
                    input: finalText,
                    voice: voice,
                    response_format: 'mp3',
                  }),
                });

                if (openAIResponse.ok) {
                  const audioBuffer = await openAIResponse.arrayBuffer();
                  
                  // Convert to base64 safely without stack overflow
                  const uint8Array = new Uint8Array(audioBuffer);
                  let binaryString = '';
                  
                  // Process byte by byte to avoid any apply() stack issues
                  for (let i = 0; i < uint8Array.length; i++) {
                    binaryString += String.fromCharCode(uint8Array[i]);
                  }
                  
                  const base64Audio = btoa(binaryString);
                  audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
                  ttsProvider = 'openai';
                  console.log('[CONDUCTOR] TTS audio generated successfully via OpenAI (fallback)');
                } else {
                  console.error('[CONDUCTOR] OpenAI TTS also failed:', await openAIResponse.text());
                }
              }
            }
          } catch (ttsError) {
            console.error('[CONDUCTOR] TTS error (non-critical):', ttsError);
          }

          // Store complete message in database
          await supabaseClient.from('phoenix_messages').insert({
            conversation_id: conversationId,
            persona: 'USER',
            content: message,
            intent: detectedIntent,
            sentiment: detectedSentiment
          });

          await supabaseClient.from('phoenix_messages').insert({
            conversation_id: conversationId,
            persona: selectedPersona,
            content: finalText,
            metadata: {
              phase: 3,
              selectedPersona,
              detectedIntent,
              detectedSentiment,
              intentConfidence: intentResult.confidence,
              intentReasoning: intentResult.reasoning,
              hasAudio: audioUrl !== null,
              ttsProvider,
              governorChecked: true,
              governorBlocked,
              isSocraticHandoff,
              governorResult: {
                is_safe: governorResult.is_safe,
                is_on_topic: governorResult.is_on_topic,
                persona_adherence: governorResult.persona_adherence
              }
            }
          });

          console.log('[CONDUCTOR] Messages stored successfully');

          // Update session state with turn counters
          await supabaseClient
            .from('phoenix_conversations')
            .update({
              metadata: {
                socraticTurnCounter,
                nextInterjectionPoint,
                totalBettyTurns,
                lastUpdated: new Date().toISOString()
              }
            })
            .eq('session_id', conversationId);

          // 11. Check if we should trigger podcast generation (async, non-blocking)
          if (selectedPersona === 'BETTY' && totalBettyTurns >= 6) {
            // Extract sentiment from recent messages to check for "Aha!" moments
            const recentUserMessages = conversationHistory
              .filter(msg => msg.persona === 'USER')
              .slice(-3);
            
            const hasPositiveSentiment = recentUserMessages.some(msg => 
              msg.content.toLowerCase().includes('got it') ||
              msg.content.toLowerCase().includes('i understand') ||
              msg.content.toLowerCase().includes('makes sense') ||
              msg.content.length > 50 // Longer responses often indicate engagement
            );

            if (hasPositiveSentiment) {
              console.log('[CONDUCTOR] 🎙️ Triggering podcast generation asynchronously...');
              
              // Make async call to podcast generator (don't await)
              fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/podcast-generator`, {
                method: 'POST',
                headers: {
                  'Authorization': authHeader,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  conversationId,
                  userId: user.id,
                  transcript: conversationHistory.map(msg => ({
                    persona: msg.persona,
                    content: msg.content
                  }))
                })
              }).catch(error => {
                console.error('[CONDUCTOR] Podcast generation error (non-blocking):', error);
              });
            }
          }

          // Send completion event with audio and metadata
          const completionMessage = `data: ${JSON.stringify({ 
            type: 'done',
            fullText: finalText,
            audioUrl,
            metadata: {
              ...responseMetadata,
              hasAudio: audioUrl !== null,
              ttsProvider,
              governorChecked: true,
              governorBlocked,
              isSocraticHandoff,
              totalChunks: chunkCount,
              responseLength: finalText.length,
              governorResult: {
                is_safe: governorResult.is_safe,
                is_on_topic: governorResult.is_on_topic,
                persona_adherence: governorResult.persona_adherence
              }
            }
          })}\n\n`;

          console.log('[CONDUCTOR] Sending completion event');
          controller.enqueue(new TextEncoder().encode(completionMessage));
          controller.close();
          
          console.log('[CONDUCTOR] Stream closed successfully');
        } catch (error) {
          console.error('[CONDUCTOR] Streaming error:', error);
          
          // Send error event to client
          try {
            const errorMessage = `data: ${JSON.stringify({ 
              type: 'error',
              message: error.message || 'Streaming error occurred'
            })}\n\n`;
            controller.enqueue(new TextEncoder().encode(errorMessage));
          } catch (e) {
            console.error('[CONDUCTOR] Failed to send error message:', e);
          }
          
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });


  } catch (error) {
    console.error('[CONDUCTOR] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
