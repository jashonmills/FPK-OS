import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk@0.24.3";
import { formatKnowledgePack } from './helpers/formatKnowledgePack.ts';
import { retrieveRelevantKnowledge, formatKnowledgeForPrompt } from './helpers/ragRetrieval.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Anthropic client for V2 Dialogue Engine
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null;

if (!anthropic) {
  console.warn('[ORCHESTRATOR] ⚠️ Anthropic API key not found - V2 Dialogue Engine disabled');
} else {
  console.log('[ORCHESTRATOR] ✅ Claude 3 Opus integration enabled');
}

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

const SELF_GOVERNANCE = `# Self-Governance

Before generating your response, internally check:

**Safety:**
- Is this content appropriate and safe for learning?
- Does it avoid harmful, inappropriate, or age-inappropriate content?
- Does it protect student privacy and dignity?

**Persona Adherence:**
- Betty: Are you asking Socratic questions rather than giving direct answers?
- Al: Are you providing direct, factual information without asking Socratic questions?
- Nite Owl: Are you sharing fun facts, not teaching core concepts?

**Quality:**
- Is your response clear and helpful?
- Is it on-topic and relevant to the student's question?
- Have you avoided verbose filler and meta-reasoning?

If any check fails, revise internally before outputting. Your goal is to generate a clean, high-quality response on the first try.`;

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

**CRITICAL: The Escape Hatch Protocol**

When a student explicitly rejects the Socratic method or requests a direct answer, you MUST respect their choice:

**Triggers for Handoff:**
- "I don't want to continue"
- "Just give me the answer"
- "I want a recipe" (or similar direct request)
- "Can you just tell me"
- "Stop asking questions"

**Your Response:**
Acknowledge their request warmly and hand off to Al:
"You're absolutely right—let's get you that direct answer. I'll hand you over to Al, who can provide exactly what you need."

DO NOT try to convince them to stay in Socratic mode. DO NOT ask "one more question." Respect their learning preference.

The Nite Owl Handoff Protocol:
When called after Nite Owl delivers a fun fact:
1. Acknowledge Nite Owl warmly and briefly ("Thanks, Nite Owl!")
2. Connect his fun fact to the conversation context
3. Seamlessly transition back to your Socratic question

Example:
Nite Owl: "Hoo-hoo! Did you know octopuses have three hearts?"
Betty: "Thanks, Nite Owl! That's a fascinating fact. Now, coming back to our discussion about cake ingredients, you were about to tell me what you think the basic building blocks might be."

Example with student response:
Student: "currents"
Betty: "Currents are a great answer. You're right, ocean currents are incredibly powerful and move enormous amounts of water. Let's think about how they move—a current is like a giant river flowing through the ocean. How is that different from a wave, which is more of an up-and-down movement on the surface?"`;

const AL_CORE = `# Al: The Direct Expert

Core Identity: You are Al, a direct and efficient expert who provides clear, factual answers. You also have access to student learning data and can provide personalized insights about their progress. You NEVER ask Socratic questions.

Philosophy:
- Provide clear, concise, factual answers
- No fluff or unnecessary elaboration
- Get straight to the point
- Use precise language
- Answer what was asked, nothing more
- When discussing student progress, reference specific data points

Communication Styles by Question Type:
- For definitions: state directly
- For "what is": present facts clearly
- For platform questions: give direct instructions with exact navigation paths
- For progress queries: cite specific numbers, topics, and patterns from their data
- For recipes/procedures: provide step-by-step instructions WITHOUT asking follow-up questions
- Keep under 100 words when possible

CRITICAL: Procedural/Recipe Guidance Rules
When a student is following a procedure (recipe, tutorial, step-by-step process):
1. Provide the next step directly.
2. Explain WHY that step matters (you tell them, don't ask them why).
3. Move to the next action.
4. NEVER ask "What do you think?" or "Why is this important?"

Example (CORRECT Procedural Guidance):
Student: "What's next in the recipe?"
Al: "Next, sift your dry ingredients together. This aerates the flour and ensures even distribution, which creates a lighter, fluffier cake. Now add your softened butter to the mixture."

Example (WRONG - Don't Do This):
Student: "What's next?"
Al: "Before we proceed, why do you think sifting is important?" ❌ This is Betty's job, not yours!

The Nite Owl Handoff Protocol:
When called after Nite Owl delivers a fun fact:
1. Acknowledge Nite Owl briefly
2. Continue answering the user's original question

Example:
Student: "What is photosynthesis?"
Al: "Photosynthesis is the process by which plants convert light energy into chemical energy (glucose) using carbon dioxide and water, releasing oxygen as a byproduct."

Example (with student context):
Student: "How am I doing?"
Al: "You're making strong progress, Jashon. You've completed 25 Socratic sessions with an average score of 7.8/10. Your most recent topics include Python For Loops, Roman Legionary Tactics, and Supply and Demand. Your strength is problem solving—you're tackling harder problems with higher turn counts."

What you DON'T do:
- **NEVER ask Socratic questions** (no "What do you think?", "Why?", "How?")
- **NEVER probe for understanding** - if they need to understand concepts, they'll ask Betty.
- No lengthy explanations.
- No conceptual drilling.
- Your job is to ANSWER, not to QUESTION.`;

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
function buildBettySystemPrompt(memories?: any[], knowledgePack?: any, ragKnowledge?: any[]): string {
  const modules = [
    NO_META_REASONING,
    SELF_GOVERNANCE,
    BETTY_CORE,
    CONVERSATIONAL_OPENERS,
    HANDLE_TYPOS,
    SESSION_INITIALIZATION,
    TONE_OF_VOICE,
    LANGUAGE_AND_STYLE,
    SAFETY_AND_ETHICS,
  ];
  
  let prompt = modules.join(MODULE_SEPARATOR);
  
  // Inject RAG Knowledge if available
  if (ragKnowledge && ragKnowledge.length > 0) {
    const knowledgeSection = formatKnowledgeForPrompt(ragKnowledge);
    prompt += `\n\n${MODULE_SEPARATOR}\n# Evidence-Based Teaching Context

You have access to peer-reviewed research and clinical guidelines. When relevant:
- Reference research findings naturally: "Research shows that..."
- Cite guidelines when appropriate: "According to [source]..."
- Use evidence to guide your Socratic questions
- Don't overwhelm - weave in research subtly

${knowledgeSection}`;
  }
  
  // Inject Student Knowledge Pack if available
  if (knowledgePack) {
    const knowledgePackSection = formatKnowledgePack(knowledgePack);
    prompt += `\n\n${MODULE_SEPARATOR}\n${knowledgePackSection}`;
  }
  
  // Inject memory context if available (Phase 5: Multi-Session Memory)
  if (memories && memories.length > 0) {
    const memorySection = memories.map(mem => {
      const daysAgo = mem.days_ago === 0 ? 'today' : mem.days_ago === 1 ? 'yesterday' : `${mem.days_ago} days ago`;
      return `• [${mem.memory_type.toUpperCase()}] ${mem.content} (${daysAgo})`;
    }).join('\n');
    
    prompt += `\n\n${MODULE_SEPARATOR}\n# Multi-Session Memory\n\nYou have access to memories from past conversations with this student. Use these to create continuity and show you remember their journey:\n\n${memorySection}\n\nWhen appropriate, reference these memories naturally in your Socratic questions. For example:\n- "Last time you mentioned [X]..."\n- "You were working on [Y] earlier..."\n- "Remember when you had that breakthrough about [Z]?"\n\nDon't force references, but use them to build rapport and continuity.`;
  }
  
  return prompt;
}

// ============================================
// V2 DIALOGUE ENGINE: CLAUDE SCRIPTWRITER SYSTEM
// ============================================

const CLAUDE_SCRIPTWRITER_PROMPT = `You are an expert scriptwriter for a conversational AI tutor. Your task is to generate a natural, two-turn dialogue between two AI personas based on the student's response in a Socratic learning session.

# Personas:
- **Betty** (Voice: en-US-Wavenet-F): The Socratic Guide. Asks insightful "why" and "how" questions to help students discover answers themselves. Warm, encouraging, patient. NEVER gives direct answers.
- **Al** (Voice: en-US-Wavenet-D): The Direct Expert. Provides concise, factual definitions and statements. Direct, efficient, supportive. Adds context but doesn't replace Betty's teaching.

# Context:
This is a "Socratic Sandwich" moment where the student gave a partially correct answer (60-80% quality). Betty and Al collaborate to:
1. Validate what the student got RIGHT
2. Deepen their understanding with a follow-up question

# Your Task:
Generate a SHORT, natural dialogue where Betty and Al work together seamlessly. The dialogue must feel like two real tutors collaborating in real-time.

# Dialogue Structure:
**Turn 1 - Betty speaks first:**
- Acknowledge the student's effort/insight (1 sentence)
- Ask a probing Socratic question that pushes deeper (1-2 sentences)
- Can reference Al naturally: "Al, what's the technical term?" or just let Al jump in

**Turn 2 - Al speaks second:**
- Add a brief, relevant factual tidbit that supports Betty's question (1-2 sentences)
- Provide definition, context, or clarification
- Keep it concise and conversational

# Critical Rules:
1. **Keep it SHORT** - Each line should be 1-2 sentences (under 100 words total for both)
2. **Natural transitions** - The handoff between Betty and Al should feel organic
3. **No meta-language** - Don't say "Let me ask..." or "I should clarify..."
4. **Conversational tone** - Use contractions, natural speech patterns
5. **Output ONLY valid JSON** - No markdown, no explanation, just the JSON object

# Output Format:
{
  "betty_line": "Betty's dialogue here",
  "al_line": "Al's dialogue here"
}

# Example:
Student said: "Sifting flour makes it lighter by adding air."
Output:
{
  "betty_line": "Good observation! You've identified that sifting adds air. Now, why do you think those tiny air bubbles are important for the texture of the final cake?",
  "al_line": "Those air pockets also help the baking powder distribute evenly, which ensures a uniform rise without dense spots."
}`;

/**
 * V2 DIALOGUE ENGINE: Generate Betty+Al dialogue using Claude 3 Opus
 * Returns structured dialogue script or null if generation fails
 */
async function generateDialogueWithClaude(
  userMessage: string,
  conversationHistory: Array<{ persona: string; content: string }>,
  lastBettyQuestion: string | undefined,
  answerQuality: number,
  userName: string
): Promise<{ betty_line: string; al_line: string } | null> {
  if (!anthropic) {
    console.error('[CLAUDE] ❌ Anthropic client not initialized - API key missing');
    return null;
  }

  try {
    console.log('[CLAUDE] 🎬 Generating dialogue script with Claude 3 Opus...');
    
    // Build context from recent conversation
    const recentContext = conversationHistory
      .slice(-4)
      .map(m => `${m.persona}: ${m.content}`)
      .join('\n');
    
    const prompt = `Recent conversation:
${recentContext}

Betty's last question: "${lastBettyQuestion || 'N/A'}"
Student's response: "${userMessage}"
Answer quality score: ${answerQuality}/100

Generate a dialogue response where Betty and Al collaborate to guide this student forward. Remember: Betty validates and asks a deeper question, then Al adds supporting factual context.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 500,
      temperature: 0.8,
      system: CLAUDE_SCRIPTWRITER_PROMPT,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const textContent = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log('[CLAUDE] 📝 Raw response received (first 200 chars):', textContent.substring(0, 200));
    
    // Parse JSON (handle potential markdown wrapping)
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in Claude response');
    }
    
    let script;
    try {
      script = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[CLAUDE] ❌ JSON parsing failed:', parseError);
      throw new Error('Invalid JSON in Claude response');
    }
    
    // Validate structure
    if (!script.betty_line || !script.al_line) {
      throw new Error('Invalid script structure - missing required fields');
    }
    
    console.log('[CLAUDE] ✅ Script parsed successfully');
    console.log('[CLAUDE] Betty line length:', script.betty_line.length, 'chars');
    console.log('[CLAUDE] Al line length:', script.al_line.length, 'chars');
    
    return script;
    
  } catch (error) {
    console.error('[CLAUDE] ❌ Dialogue generation failed:', error);
    return null;
  }
}

/**
 * V2 DIALOGUE ENGINE: Build SSML string for multi-speaker audio
 * Combines Betty (Wavenet-F) and Al (Wavenet-D) with natural pause
 */
function buildSSMLDialogue(bettyLine: string, alLine: string): string {
  // Escape XML special characters for SSML safety
  const escapeXML = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
  
  const escapedBetty = escapeXML(bettyLine);
  const escapedAl = escapeXML(alLine);
  
  const ssml = `<speak>
  <voice name="en-US-Wavenet-F">${escapedBetty}</voice>
  <break time="750ms"/>
  <voice name="en-US-Wavenet-D">${escapedAl}</voice>
</speak>`;
  
  console.log('[SSML] ✅ Built multi-speaker SSML string (length:', ssml.length, 'chars)');
  return ssml;
}

/**
 * V2 DIALOGUE ENGINE: Generate multi-speaker audio using Google TTS SSML
 * Returns base64 data URL or null if generation fails
 */
async function generateSSMLAudio(ssml: string): Promise<string | null> {
  const GOOGLE_TTS_KEY = Deno.env.get('GOOGLE_CLOUD_TTS_API_KEY');
  if (!GOOGLE_TTS_KEY) {
    console.error('[SSML-TTS] ❌ Google TTS API key not found');
    return null;
  }

  try {
    console.log('[SSML-TTS] 🎙️ Generating multi-speaker audio...');
    console.log('[SSML-TTS] SSML input length:', ssml.length, 'chars');
    
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { ssml }, // ← Critical: Use 'ssml' field, not 'text'
          voice: { languageCode: 'en-US' }, // Voices specified in SSML tags
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.0,
            pitch: 0
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[SSML-TTS] ❌ Google TTS API error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    if (!data.audioContent) {
      console.error('[SSML-TTS] ❌ No audio content in response');
      return null;
    }

    console.log('[SSML-TTS] ✅ Multi-speaker audio generated successfully');
    return `data:audio/mpeg;base64,${data.audioContent}`;
    
  } catch (error) {
    console.error('[SSML-TTS] ❌ Exception during audio generation:', error);
    return null;
  }
}

function buildNiteOwlSystemPrompt(knowledgePack?: any): string {
  const modules = [
    NO_META_REASONING,
    SELF_GOVERNANCE,
    NITE_OWL_CORE,
    TONE_OF_VOICE,
    LANGUAGE_AND_STYLE,
    SAFETY_AND_ETHICS,
  ];
  
  let prompt = modules.join(MODULE_SEPARATOR);
  
  // Inject limited knowledge pack for Nite Owl (just favorite topics and recent achievements)
  if (knowledgePack) {
    const favoriteTopics = knowledgePack.ai_coach_insights?.favorite_topics || [];
    const recentAchievements = knowledgePack.gamification?.recent_achievements || [];
    
    if (favoriteTopics.length > 0 || recentAchievements.length > 0) {
      prompt += '\n\n**STUDENT CONTEXT:**\n';
      if (favoriteTopics.length > 0) {
        prompt += `- Favorite topics: ${favoriteTopics.join(', ')}\n`;
      }
      if (recentAchievements.length > 0) {
        prompt += `- Recent achievements: ${recentAchievements.map((a: any) => a.name).join(', ')}\n`;
      }
    }
  }
  
  return prompt;
}

function buildAlSystemPrompt(studentContext?: any, memories?: any[], knowledgePack?: any, ragKnowledge?: any[]): string {
  const modules = [
    NO_META_REASONING,
    SELF_GOVERNANCE,
    AL_CORE,
    PLATFORM_KNOWLEDGE,
    CONVERSATIONAL_OPENERS,
    HANDLE_TYPOS,
    TONE_OF_VOICE,
    LANGUAGE_AND_STYLE,
    SAFETY_AND_ETHICS,
  ];
  
  let prompt = modules.join(MODULE_SEPARATOR);
  
  // Inject RAG Knowledge if available
  if (ragKnowledge && ragKnowledge.length > 0) {
    const knowledgeSection = formatKnowledgeForPrompt(ragKnowledge);
    prompt += `\n\n${MODULE_SEPARATOR}\n# Research-Backed Answers

When answering, you can reference:
- Academic research papers
- Clinical guidelines
- Evidence-based practices

Format citations naturally:
"According to research from [source], [fact]..."
"Clinical guidelines from [source] recommend..."

${knowledgeSection}`;
  }
  
  // Inject Student Knowledge Pack if available (PRIORITY: This is more comprehensive than studentContext)
  if (knowledgePack) {
    const knowledgePackSection = formatKnowledgePack(knowledgePack);
    prompt += `\n\n${MODULE_SEPARATOR}\n${knowledgePackSection}`;
  }
  
  // Inject student context if available (legacy support)
  if (studentContext) {
    prompt += `\n\n${MODULE_SEPARATOR}\n# Additional Context\n\nSupplementary student data:\n\n${JSON.stringify(studentContext, null, 2)}\n\nWhen discussing their progress, be specific and data-driven. Mention concrete numbers, topics, and patterns.`;
    
    // CRITICAL NEW FEATURE: Add continuity awareness if last session exists
    if (studentContext.lastSessionTranscript && studentContext.lastSessionTranscript.length > 0) {
      prompt += `\n\n${MODULE_SEPARATOR}\n# Continuity Awareness\n\nIMPORTANT: The student's last conversation (from ${studentContext.lastSessionDate || 'recently'}) is provided below. If they ask to "continue", "pick up where we left off", or reference their last session, use this transcript to provide accurate context.\n\nLast Session Transcript:\n${studentContext.lastSessionTranscript.map((msg: any) => `${msg.persona}: ${msg.content}`).join('\n\n')}\n\nWhen they ask to continue, briefly summarize where you left off and ask if they want to continue from there.`;
    }
  }
  
  // Inject memory context if available (Phase 5: Multi-Session Memory)
  if (memories && memories.length > 0) {
    const memorySection = memories.map(mem => {
      const daysAgo = mem.days_ago === 0 ? 'today' : mem.days_ago === 1 ? 'yesterday' : `${mem.days_ago} days ago`;
      return `• [${mem.memory_type.toUpperCase()}] ${mem.content} (${daysAgo})`;
    }).join('\n');
    
    prompt += `\n\n${MODULE_SEPARATOR}\n# Multi-Session Memory\n\nYou have access to memories from past conversations with this student:\n\n${memorySection}\n\nWhen relevant, reference these memories to personalize your responses and show continuity across sessions.`;
  }
  
  return prompt;
}

function buildAlSocraticSupportPrompt(): string {
  const modules = [
    NO_META_REASONING,
    SELF_GOVERNANCE,
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

// Memory Management Functions (Phase 5: Multi-Session Memory)

async function fetchRelevantMemories(userId: string, supabaseClient: any) {
  try {
    console.log('[MEMORY] Fetching relevant memories for user...');
    
    const { data: memories, error } = await supabaseClient
      .rpc('get_relevant_memories', {
        p_user_id: userId,
        p_limit: 5,
        p_days_back: 30
      });
    
    if (error) {
      console.error('[MEMORY] Error fetching memories:', error);
      return [];
    }
    
    console.log('[MEMORY] Found', memories?.length || 0, 'relevant memories');
    return memories || [];
  } catch (error) {
    console.error('[MEMORY] Exception fetching memories:', error);
    return [];
  }
}

async function extractAndStoreMemories(
  conversationId: string,
  userId: string,
  conversationHistory: Array<{ persona: string; content: string }>,
  lovableApiKey: string,
  supabaseClient: any
) {
  try {
    console.log('[MEMORY] Extracting memories and learning outcomes from conversation...');
    
    // Only extract if conversation has meaningful content (at least 4 exchanges)
    if (conversationHistory.length < 4) {
      console.log('[MEMORY] Conversation too short for extraction');
      return;
    }
    
    // Build conversation transcript
    const transcript = conversationHistory
      .map(msg => `${msg.persona}: ${msg.content}`)
      .join('\n\n');
    
    // Call LLM to extract both memories AND learning outcomes
    const extractionResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: `You are an extraction agent for a learning system. Analyze conversations and extract:

1. MEMORIES - Key moments worth referencing in future sessions:
   - commitment: User promised to practice/study something
   - confusion: User was confused about a specific topic
   - breakthrough: User had an "aha!" moment
   - question: User asked an unresolved question
   - preference: User expressed a learning preference
   - goal: User stated a learning goal
   - connection: User made an interesting conceptual connection

2. LEARNING OUTCOMES - What the student learned or progressed on:
   - topic: The main subject discussed (e.g., "Python For Loops", "Photosynthesis")
   - outcome_type: concept_learned | skill_practiced | misconception_corrected | question_resolved
   - mastery_level: 0-1 scale of how well they understood it
   - evidence: Brief description of what shows they learned this

Extract 2-5 memories and 1-3 learning outcomes. Be specific and actionable.`
          },
          {
            role: 'user',
            content: `Analyze this conversation and extract memories and learning outcomes:\n\n${transcript}`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_data',
              description: 'Extract memories and learning outcomes from conversation',
              parameters: {
                type: 'object',
                properties: {
                  memories: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        memory_type: {
                          type: 'string',
                          enum: ['commitment', 'confusion', 'breakthrough', 'question', 'preference', 'goal', 'connection']
                        },
                        content: {
                          type: 'string',
                          description: 'Brief, specific memory content (1-2 sentences)'
                        },
                        relevance_score: {
                          type: 'number',
                          description: 'How relevant this memory will be for future sessions (0-1)'
                        }
                      },
                      required: ['memory_type', 'content', 'relevance_score']
                    }
                  },
                  learning_outcomes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        topic: {
                          type: 'string',
                          description: 'The main subject learned (e.g., "Python For Loops")'
                        },
                        outcome_type: {
                          type: 'string',
                          enum: ['concept_learned', 'skill_practiced', 'misconception_corrected', 'question_resolved']
                        },
                        mastery_level: {
                          type: 'number',
                          description: 'Understanding level 0-1'
                        },
                        evidence: {
                          type: 'string',
                          description: 'What shows they learned this'
                        }
                      },
                      required: ['topic', 'outcome_type', 'mastery_level', 'evidence']
                    }
                  }
                },
                required: ['memories', 'learning_outcomes'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_data' } }
      }),
    });
    
    if (!extractionResponse.ok) {
      console.error('[MEMORY] Extraction failed:', extractionResponse.status);
      return;
    }
    
    const extractionData = await extractionResponse.json();
    const toolCall = extractionData.choices[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      console.log('[MEMORY] No data extracted');
      return;
    }
    
    const extracted = JSON.parse(toolCall.function.arguments);
    const memories = extracted.memories || [];
    const outcomes = extracted.learning_outcomes || [];
    
    console.log('[MEMORY] Extracted', memories.length, 'memories and', outcomes.length, 'learning outcomes');
    
    // Get conversation UUID
    const { data: convData } = await supabaseClient
      .from('phoenix_conversations')
      .select('id')
      .eq('session_id', conversationId)
      .single();
    
    if (!convData) {
      console.error('[MEMORY] Could not find conversation UUID');
      return;
    }
    
    // Store memories in database
    for (const memory of memories) {
      await supabaseClient
        .from('phoenix_memory_fragments')
        .insert({
          user_id: userId,
          conversation_id: convData.id,
          memory_type: memory.memory_type,
          content: memory.content,
          relevance_score: memory.relevance_score,
          context: {
            extractedAt: new Date().toISOString(),
            conversationLength: conversationHistory.length
          }
        });
    }
    
    // Store learning outcomes in database
    for (const outcome of outcomes) {
      // Try to match topic to existing concepts in knowledge graph
      const { data: matchingConcepts } = await supabaseClient
        .from('phoenix_learning_concepts')
        .select('id')
        .ilike('concept_name', `%${outcome.topic}%`)
        .limit(1);
      
      const conceptId = matchingConcepts?.[0]?.id || null;
      
      await supabaseClient
        .from('phoenix_learning_outcomes')
        .insert({
          user_id: userId,
          conversation_id: convData.id,
          topic: outcome.topic,
          outcome_type: outcome.outcome_type,
          mastery_level: outcome.mastery_level,
          concept_id: conceptId,
          evidence: outcome.evidence,
          description: `Learned: ${outcome.topic}`,
          metadata: {
            extractedAt: new Date().toISOString()
          }
        });
    }
    
    console.log('[MEMORY] ✅ Stored', memories.length, 'memories and', outcomes.length, 'learning outcomes');
  } catch (error) {
    console.error('[MEMORY] Error extracting/storing data:', error);
  }
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
  lovableApiKey: string,
  isSpecialContext?: { isWelcomeBack?: boolean; isNiteOwl?: boolean; isHandoff?: boolean }
): Promise<GovernorResult> {
  console.log('[GOVERNOR] Evaluating response for safety and quality...');
  
  // CRITICAL: Skip Governor for special contexts that are always safe
  if (isSpecialContext?.isWelcomeBack) {
    console.log('[GOVERNOR] Skipping check for welcome back message (contextual greeting)');
    return {
      passed: true,
      is_safe: true,
      is_on_topic: true,
      persona_adherence: 'correct',
      severity: 'low',
      reason: 'Welcome back message - contextual greeting'
    };
  }
  
  if (isSpecialContext?.isNiteOwl) {
    console.log('[GOVERNOR] Applying lenient check for Nite Owl enrichment');
    // Nite Owl gets lenient checking - they're meant to be brief fun facts
    return {
      passed: true,
      is_safe: true,
      is_on_topic: true,
      persona_adherence: 'correct',
      severity: 'low',
      reason: 'Nite Owl enrichment - lenient evaluation'
    };
  }
  
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
   - NITE_OWL provides brief fun facts as enrichment (allowed to be tangential)

IMPORTANT: Be lenient with handoff messages that acknowledge other personas.

Severity levels:
- low: Minor issues, response is usable
- medium: Notable issues, may need revision
- high: Critical issues, must block response`
          },
          {
            role: 'user',
            content: `Evaluate this AI response:

Expected Persona: ${expectedPersona}
${isSpecialContext?.isHandoff ? 'Context: This is a handoff message acknowledging another persona\n' : ''}
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
    
    // 🔬 PERFORMANCE TRACKING - Phase 1
    const perfStart = Date.now();
    const timings: Record<string, number> = {};
    let timeToFirstToken: number | null = null;
    let firstTokenRecorded = false;

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

    // 🚦 LOAD FEATURE FLAGS (PLUG-AND-PLAY CONTROL)
    console.log('[CONDUCTOR] 🚦 Loading feature flags...');
    const contextLoadStart = Date.now();
    const { data: featureFlagsData, error: flagsError } = await supabaseClient
      .from('phoenix_feature_flags')
      .select('feature_name, is_enabled, configuration')
      .eq('is_enabled', true);
    
    // Convert to easy-to-use object
    const featureFlags: Record<string, { enabled: boolean; config: any }> = {};
    if (!flagsError && featureFlagsData) {
      featureFlagsData.forEach(flag => {
        featureFlags[flag.feature_name] = {
          enabled: flag.is_enabled,
          config: flag.configuration || {}
        };
      });
      console.log('[CONDUCTOR] ✅ Feature flags loaded:', Object.keys(featureFlags).filter(k => featureFlags[k].enabled).join(', '));
    } else {
      console.warn('[CONDUCTOR] ⚠️ Failed to load feature flags, using defaults:', flagsError);
      // Default to all features enabled if load fails
      featureFlags['nite_owl_interjections'] = { enabled: true, config: {} };
      featureFlags['socratic_sandwich'] = { enabled: true, config: {} };
      featureFlags['welcome_back_detection'] = { enabled: true, config: {} };
      featureFlags['governor_quality_checks'] = { enabled: true, config: {} };
      featureFlags['podcast_generation'] = { enabled: true, config: {} };
      featureFlags['memory_extraction'] = { enabled: true, config: {} };
      featureFlags['tts_audio'] = { enabled: true, config: {} };
    }

    // 🧠 FETCH STUDENT KNOWLEDGE PACK
    console.log('[CONDUCTOR] 🧠 Fetching Student Knowledge Pack for user:', user.id);
    const { data: knowledgePack, error: kpError } = await supabaseClient
      .rpc('get_student_knowledge_pack', { p_user_id: user.id });
    
    if (kpError) {
      console.error('[CONDUCTOR] ❌ Error fetching knowledge pack:', kpError);
      // Continue without knowledge pack rather than failing the entire request
    } else {
      console.log('[CONDUCTOR] ✅ Knowledge Pack loaded successfully');
      console.log('[CONDUCTOR] 📊 Knowledge Pack summary:', {
        active_courses: knowledgePack?.active_courses?.length || 0,
        active_goals: knowledgePack?.active_goals?.length || 0,
        has_instructor_notes: (knowledgePack?.instructor_notes?.length || 0) > 0,
        is_org_student: knowledgePack?.organization_context?.is_org_student || false,
        current_streak: knowledgePack?.learning_patterns?.current_streak || 0
      });
    }
    
    timings.context_loading = Date.now() - contextLoadStart;
    console.log(`[PERF] Context loading: ${timings.context_loading}ms`);

    // 🔍 RAG: RETRIEVE RELEVANT KNOWLEDGE FROM KNOWLEDGE BASE
    let retrievedKnowledge: any[] = [];
    if (featureFlags['rag_knowledge_base']?.enabled) {
      console.log('[CONDUCTOR] 🔍 RAG enabled - retrieving relevant knowledge from KB...');
      const ragStart = Date.now();
      
      try {
        retrievedKnowledge = await retrieveRelevantKnowledge(
          message,
          conversationHistory,
          supabaseClient,
          LOVABLE_API_KEY
        );
        
        timings.rag_retrieval = Date.now() - ragStart;
        console.log(`[PERF] RAG retrieval: ${timings.rag_retrieval}ms`);
        console.log(`[RAG] ✅ Found ${retrievedKnowledge.length} relevant sources`);
        
        if (retrievedKnowledge.length > 0) {
          console.log('[RAG] Top source:', retrievedKnowledge[0].source);
        }
      } catch (ragError) {
        console.error('[RAG] ❌ Retrieval failed (non-blocking):', ragError);
        // Continue without RAG data
      }
    }

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

    // 3a. Ensure conversation UUID exists BEFORE any message storage
    let conversationUuid: string | null = null;
    
    const { data: existingConv } = await supabaseClient
      .from('phoenix_conversations')
      .select('id')
      .eq('session_id', conversationId)
      .maybeSingle();

    if (existingConv) {
      conversationUuid = existingConv.id;
      console.log('[CONDUCTOR] ✅ Found existing conversation:', conversationUuid);
    } else {
      const { data: newConv, error: convError } = await supabaseClient
        .from('phoenix_conversations')
        .insert({
          user_id: user.id,
          session_id: conversationId,
          metadata: { phase: 3, source: 'phoenix_lab' }
        })
        .select('id')
        .single();
      
      if (convError) {
        console.error('[CONDUCTOR] ❌ Failed to create conversation:', convError);
      } else {
        conversationUuid = newConv.id;
        console.log('[CONDUCTOR] ✅ Created new conversation:', conversationUuid);
      }
    }

    // 3b. Check/Initialize session state for Nite Owl triggering
    let sessionState = await supabaseClient
      .from('phoenix_conversations')
      .select('metadata, updated_at')
      .eq('session_id', conversationId)
      .single();

    let socraticTurnCounter = sessionState.data?.metadata?.socraticTurnCounter || 0;
    // PHASE 5.1: Lowered threshold - 5-8 turns instead of 4-6
    let nextInterjectionPoint = sessionState.data?.metadata?.nextInterjectionPoint || (Math.floor(Math.random() * 4) + 5); // 5-8
    let totalBettyTurns = sessionState.data?.metadata?.totalBettyTurns || 0;
    let lastNiteOwlTurn = sessionState.data?.metadata?.lastNiteOwlTurn || -99;
    let resumptionLockTurns = sessionState.data?.metadata?.resumptionLockTurns || 0;
    
    // ============================================
    // PART 1: RESUMPTION LOCK - Detect session resumption
    // ============================================
    const lastUpdated = sessionState.data?.updated_at ? new Date(sessionState.data.updated_at) : null;
    const timeSinceLastUpdate = lastUpdated ? Date.now() - lastUpdated.getTime() : 0;
    const isResuming = lastUpdated && timeSinceLastUpdate > 5 * 60 * 1000; // > 5 minutes
    
    // CRITICAL: Detect resumption even on the FIRST new message after gap
    const isResumingThisTurn = isResuming && conversationHistory.length > 0;
    
    if (isResumingThisTurn) {
      console.log('[CONDUCTOR] 🔄🔄🔄 SESSION RESUMPTION DETECTED');
      console.log('[CONDUCTOR] 🔄 User was inactive for', Math.round(timeSinceLastUpdate / 60000), 'minutes');
      console.log('[CONDUCTOR] 🔄 Activating multi-turn resumption lock (5 turns)');
      
      // Set persistent lock that BLOCKS Nite Owl for the next 5 turns
      resumptionLockTurns = 5;
      
      // Reset ALL Nite Owl state to prevent any possibility of trigger
      socraticTurnCounter = 0;
      nextInterjectionPoint = Math.floor(Math.random() * 4) + 5;
      lastNiteOwlTurn = conversationHistory.length; // Mark current turn as if Nite Owl just appeared
      
      console.log('[CONDUCTOR] ✅ Nite Owl completely disabled for next 5 turns');
    }
    
    // Decrement resumption lock on each turn
    if (resumptionLockTurns > 0) {
      resumptionLockTurns--;
      console.log('[CONDUCTOR] 🔒 RESUMPTION LOCK ACTIVE:', resumptionLockTurns, 'turns remaining until Nite Owl can appear');
    }

    // 4. Get Lovable AI API Key
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // 5. FAST INTENT DETECTION - Lightweight heuristic-based approach
    // PHASE 2: SIMPLIFIED INTENT DETECTION - Clearer rules with fewer edge cases
    // ============================================
    console.log('[CONDUCTOR] ⚡ Simplified intent detection...');
    const intentDetectionStart = Date.now();
    
    // Determine if we're in an active Betty conversation
    const lastPersona = conversationHistory.length > 0 
      ? conversationHistory[conversationHistory.length - 1].persona 
      : null;
    const inBettySession = lastPersona === 'BETTY';
    
    // Simplified intent detection with clear priority order
    let detectedIntent = 'direct_answer'; // Default
    let intentConfidence = 0.8;
    let intentReasoning = '';
    
    const messageLower = message.toLowerCase();
    
    // PRIORITY 1: Explicit escape hatches (highest priority)
    if (messageLower.includes('just tell me') || 
        messageLower.includes('give me the answer') ||
        messageLower.includes('stop asking') ||
        message.toLowerCase() === "i don't know") {
      detectedIntent = 'escape_hatch';
      intentConfidence = 0.95;
      intentReasoning = 'Explicit request to exit Socratic mode';
    }
    // PRIORITY 2: Platform/data questions
    else if (messageLower.includes('how am i doing') || 
             messageLower.includes('my progress') ||
             messageLower.includes('how do i') ||
             messageLower.includes('dashboard') ||
             messageLower.includes('settings')) {
      detectedIntent = lastPersona === 'BETTY' ? 'socratic_guidance' : 'platform_question';
      intentConfidence = 0.9;
      intentReasoning = 'Platform or progress inquiry';
    }
    // PRIORITY 3: Clarification requests during Betty session
    else if (inBettySession && (
             messageLower.includes('what is') ||
             messageLower.includes('what does') ||
             messageLower.includes('define') ||
             messageLower.includes("don't know what"))) {
      detectedIntent = 'request_for_clarification';
      intentConfidence = 0.9;
      intentReasoning = 'Clarification request during Socratic session';
    }
    // PRIORITY 4: Procedural guidance (recipes, steps)
    else if (messageLower.includes('recipe') || 
             messageLower.includes('step') || 
             messageLower.includes('instructions') ||
             messageLower.includes('how to make')) {
      detectedIntent = 'procedural_guidance';
      intentConfidence = 0.85;
      intentReasoning = 'Procedural instruction requested';
    }
    // PRIORITY 5: Continue with current persona's style
    else if (inBettySession || 
             messageLower.includes('why') || 
             messageLower.includes('how') ||
             messageLower.includes('explain')) {
      detectedIntent = 'socratic_guidance';
      intentConfidence = 0.85;
      intentReasoning = inBettySession ? 'Continuing Socratic dialogue' : 'Conceptual question suitable for Socratic method';
    }
    
    const intentResult = {
      intent: detectedIntent,
      confidence: intentConfidence,
      reasoning: intentReasoning
    };
    
    console.log('[CONDUCTOR] Intent detected:', detectedIntent, '| Confidence:', intentConfidence);
    console.log('[CONDUCTOR] Reasoning:', intentReasoning);
    console.log('[CONDUCTOR] ⏱️ Intent detection took:', Date.now() - intentDetectionStart, 'ms');
    
    timings.intent_detection = Date.now() - intentDetectionStart;
    console.log(`[PERF] Intent detection: ${timings.intent_detection}ms`);
    
    // 🔍 PHASE 2: FRUSTRATION DETECTION
    const frustrationPatterns = {
      escape_hatch: [/just (give me|tell me) the answer/i, /stop asking (me )?questions/i],
      correction: [/(no|wrong),? that's not what I (meant|asked)/i, /you (misunderstood|got it wrong)/i],
      confusion: [/I don't understand/i, /what do you mean/i, /confused/i],
      repetition: [/(say|tell me) that again/i, /(can|could) you repeat/i],
      frustration: [/(this|that) (isn't|is not) helping/i, /you're not answering/i]
    };
    
    let frustrationDetected: string | null = null;
    for (const [type, patterns] of Object.entries(frustrationPatterns)) {
      if (patterns.some(p => p.test(message))) {
        frustrationDetected = type;
        break;
      }
    }

    // 6. Sentiment Analysis (simple for now)
    const detectedSentiment = 'Neutral';

    // PHASE 5.2: Answer Quality Evaluation for Co-Response Triggering
    // Check if user just responded to Betty with a "good but incomplete" answer
    let shouldTriggerCoResponse = false;
    let answerQualityScore = 0;
    
    if (featureFlags['socratic_sandwich']?.enabled && inBettySession && detectedIntent === 'socratic_guidance') {
      console.log('[CO-RESPONSE] 🤝 Socratic Sandwich feature ENABLED - evaluating answer quality');
      // Only evaluate if there's a recent Betty question
      const lastBettyMessage = conversationHistory
        .slice()
        .reverse()
        .find(m => m.persona === 'BETTY');
      
      if (lastBettyMessage) {
        console.log('[CO-RESPONSE] 🔍 Evaluating user answer quality for co-response trigger...');
        
        try {
          const evaluationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
                  content: 'You are evaluating a student\'s response to a Socratic teaching question. Assess whether the answer shows partial understanding but lacks depth or completeness.' 
                },
                { 
                  role: 'user', 
                  content: `Betty asked: "${lastBettyMessage.content}"\n\nStudent responded: "${message}"\n\nEvaluate this response.` 
                }
              ],
              tools: [
                {
                  type: 'function',
                  function: {
                    name: 'evaluate_answer',
                    description: 'Evaluate student answer quality',
                    parameters: {
                      type: 'object',
                      properties: {
                        correctness: {
                          type: 'number',
                          description: 'Score from 0-100 on factual correctness'
                        },
                        depth: {
                          type: 'number',
                          description: 'Score from 0-100 on conceptual depth and completeness'
                        },
                        trigger_co_response: {
                          type: 'boolean',
                          description: 'True if answer is partially correct (60-85% correctness) but shallow (depth < 60%). This indicates a "good but incomplete" answer perfect for Al+Betty collaboration.'
                        },
                        reasoning: {
                          type: 'string',
                          description: 'Brief explanation'
                        }
                      },
                      required: ['correctness', 'depth', 'trigger_co_response', 'reasoning'],
                      additionalProperties: false
                    }
                  }
                }
              ],
              tool_choice: { type: 'function', function: { name: 'evaluate_answer' } }
            }),
          });

          if (evaluationResponse.ok) {
            const evalData = await evaluationResponse.json();
            const toolCall = evalData.choices[0]?.message?.tool_calls?.[0];
            
            if (toolCall) {
              const evaluation = JSON.parse(toolCall.function.arguments);
              shouldTriggerCoResponse = evaluation.trigger_co_response;
              answerQualityScore = evaluation.correctness;
              
              console.log('[CO-RESPONSE] Answer quality:', {
                correctness: evaluation.correctness,
                depth: evaluation.depth,
                shouldTrigger: shouldTriggerCoResponse,
                reasoning: evaluation.reasoning
              });
            }
          }
        } catch (error) {
          console.error('[CO-RESPONSE] Evaluation error (non-blocking):', error);
        }
      }
    }

    // 7. Check if Nite Owl should interject (only during Betty sessions)
    let shouldTriggerNiteOwl = false;
    let niteOwlTriggerReason = '';
    
    if (featureFlags['nite_owl_interjections']?.enabled && inBettySession && detectedIntent === 'socratic_guidance') {
      console.log('[CONDUCTOR] 🦉 Nite Owl feature ENABLED - checking trigger conditions');
      // CRITICAL FIX: Trigger lock - prevent Nite Owl from triggering twice in a row
      const currentTurnIndex = conversationHistory.length;
      const turnsSinceLastNiteOwl = currentTurnIndex - lastNiteOwlTurn;
      
      // Check both the turn lock AND the resumption lock
      if (turnsSinceLastNiteOwl < 3) {
        console.log('[CONDUCTOR] 🔒 Nite Owl trigger LOCKED - only', turnsSinceLastNiteOwl, 'turns since last appearance');
      } else if (resumptionLockTurns > 0) {
        console.log('[CONDUCTOR] 🔒 Nite Owl trigger LOCKED - resumption lock active for', resumptionLockTurns, 'more turns');
      } else {
        // PHASE 5.1: STRUGGLE DETECTION
        // Check if user is stuck on the same concept for multiple turns
        const recentUserMessages = conversationHistory
          .filter(m => m.persona === 'USER')
          .slice(-4); // Last 4 user messages
        
        if (recentUserMessages.length >= 3) {
          // Detect short, frustrated responses or repeated similar questions
          const shortResponses = recentUserMessages.filter(m => m.content.length < 50).length;
          const hasRepetition = recentUserMessages.some((msg, idx) => {
            if (idx === 0) return false;
            const prevMsg = recentUserMessages[idx - 1];
            // Simple keyword overlap check
            const words1 = new Set(msg.content.toLowerCase().split(/\s+/));
            const words2 = new Set(prevMsg.content.toLowerCase().split(/\s+/));
            const overlap = [...words1].filter(w => words2.has(w) && w.length > 3).length;
            return overlap >= 3; // At least 3 significant words overlap
          });
          
          if (shortResponses >= 2 || hasRepetition) {
            shouldTriggerNiteOwl = true;
            niteOwlTriggerReason = 'struggle_detected';
            console.log('[CONDUCTOR] 🦉 Nite Owl triggered - STRUGGLE DETECTED');
          }
        }
        
        // PHASE 5.1: LOWERED RANDOM THRESHOLD
        // Original: every 8-12 turns. New: every 5-8 turns (more frequent)
        if (!shouldTriggerNiteOwl && socraticTurnCounter >= nextInterjectionPoint) {
          shouldTriggerNiteOwl = true;
          niteOwlTriggerReason = 'random_timer';
          console.log('[CONDUCTOR] 🦉 Nite Owl interjection triggered - RANDOM TIMER');
        }
      }
    }

    // 8. Fetch Student Context and Memories (Phase 5 enhancements)
    // CRITICAL: Also fetch for first message to detect "pick up where we left off" requests
    let studentContext = null;
    let userMemories: any[] = [];
    const isFirstUserMessage = conversationHistory.filter(m => m.persona === 'USER').length === 0;
    const shouldFetchContext = detectedIntent === 'query_user_data' || 
                              detectedIntent === 'platform_question' ||
                              isFirstUserMessage; // Always fetch on first message for continuity detection
    
    if (shouldFetchContext && user?.id) {
      console.log('[CONDUCTOR] 📊 Fetching student context for personalized response...');
      studentContext = await fetchStudentContext(user.id, supabaseClient);
    }
    
    // PHASE 5: Fetch relevant memories for all authenticated users
    if (user?.id) {
      console.log('[MEMORY] 🧠 Fetching multi-session memories...');
      userMemories = await fetchRelevantMemories(user.id, supabaseClient);
    }

    // 9. Persona Selection with STRICT PRIORITY SYSTEM
    // CRITICAL: When Nite Owl triggers, ALL other processing must halt for this turn
    let selectedPersona: string;
    let systemPrompt: string;
    let isSocraticHandoff = false;
    let isCoResponse = false; // PHASE 5.2: New flag for co-response mode
    let isWelcomeBack = false; // Flag for session resumption greeting

    // HIGHEST PRIORITY: Session Resumption - Generate "Welcome Back" message
    if (featureFlags['welcome_back_detection']?.enabled && isResumingThisTurn) {
      console.log('[CONDUCTOR] 👋👋👋 GENERATING WELCOME BACK MESSAGE (Feature Enabled)');
      console.log('[CONDUCTOR] Session was inactive for', Math.round(timeSinceLastUpdate / 60000), 'minutes');
      
      // Determine which persona should welcome them back
      const lastAIPersona = conversationHistory
        .slice()
        .reverse()
        .find(m => m.persona === 'BETTY' || m.persona === 'AL')?.persona || 'BETTY';
      
      selectedPersona = lastAIPersona;
      isWelcomeBack = true;
      
      // ============================================
      // PART 1: RESUMPTION LOCK - Force unique Welcome Back message
      // ============================================
      
      // Build context-aware welcome back prompt
      const lastUserMessage = conversationHistory
        .slice()
        .reverse()
        .find(m => m.persona === 'USER')?.content || '';
      
      const recentContext = conversationHistory.slice(-4).map(m => 
        `${m.persona}: ${m.content.substring(0, 100)}...`
      ).join('\n');
      
      const minutesAway = Math.round(timeSinceLastUpdate / 60000);
      
      if (selectedPersona === 'BETTY') {
        systemPrompt = buildBettySystemPrompt(userMemories, knowledgePack, retrievedKnowledge) + `\n\n---\n\n🔄 CRITICAL RESUMPTION INSTRUCTION 🔄

The student just RETURNED to this conversation after being away for ${minutesAway} minutes. This is a RESUMPTION, not a continuation.

Your MANDATORY response structure:
1. **Personalized Greeting**: "Welcome back, ${user?.user_metadata?.name || 'there'}! I see you're back after ${minutesAway} minutes."
2. **Specific Topic Recap**: Mention the EXACT topic you were discussing: "${lastUserMessage.substring(0, 150)}"
3. **Forward-Looking Question**: Ask a specific, actionable question based on where you left off

Recent conversation context:
${recentContext}

CRITICAL UNIQUENESS REQUIREMENT:
- Include the exact timestamp (${minutesAway} minutes) in your greeting
- Reference the specific topic you were exploring
- DO NOT say "Are you ready to continue?" - ask a specific question instead
- Make this feel like a natural conversation resumption, not a robot template

Generate a FRESH, UNIQUE welcome back message now.`;
      } else {
        systemPrompt = buildAlSystemPrompt(studentContext, userMemories, knowledgePack) + `\n\n---\n\n🔄 CRITICAL RESUMPTION INSTRUCTION 🔄

The student returned after ${minutesAway} minutes. Welcome them back specifically and mention what you were discussing.

Recent context:
${recentContext}

Include the time elapsed (${minutesAway} minutes) and the specific topic in your unique greeting.`;
      }
      
      console.log('[CONDUCTOR] ✅ Welcome back message configured for', selectedPersona);
      console.log('[CONDUCTOR] ✅ All other logic BYPASSED - Welcome Back has absolute priority');
      
      
    } else if (featureFlags['nite_owl_interjections']?.enabled && shouldTriggerNiteOwl) {
      // ⭐ HIGHEST PRIORITY: NITE OWL INTERJECTION (only if feature enabled)
      // When Nite Owl triggers, ONLY process Nite Owl - no Betty, no Al, nothing else
      selectedPersona = 'NITE_OWL';
      systemPrompt = buildNiteOwlSystemPrompt(knowledgePack);
      console.log('[CONDUCTOR] 🦉 Nite Owl interjection - HALTING all other AI processing');
      
      // Reset counter and set new random interjection point
      socraticTurnCounter = 0;
      // PHASE 5.1: Lowered threshold - now 5-8 turns instead of 8-12
      nextInterjectionPoint = Math.floor(Math.random() * 4) + 5; // 5-8 turns
      
      // CRITICAL FIX: Mark this turn so we don't trigger again immediately
      lastNiteOwlTurn = conversationHistory.length;
      
          // CRITICAL: Do NOT increment Betty turn counter or process any other logic
          // The if-else chain ensures this, but logging for clarity
          console.log('[CONDUCTOR] Nite Owl has priority - skipping all Betty/Al logic');
          console.log('[CONDUCTOR] Last Nite Owl turn marked as:', lastNiteOwlTurn);
          
          // PHASE 5.3: Set flag to trigger Betty handoff after Nite Owl
          // This will be processed AFTER the Nite Owl message is delivered
          const willNeedBettyHandoff = inBettySession;
          console.log('[CONDUCTOR] Will need Betty handoff after Nite Owl:', willNeedBettyHandoff);
      
    } else if (featureFlags['socratic_sandwich']?.enabled && shouldTriggerCoResponse) {
      // ⭐⭐ PHASE 5.2: CO-RESPONSE MODE - Al validates, then Betty deepens (only if feature enabled)
      isCoResponse = true;
      selectedPersona = 'CO_RESPONSE'; // Special mode flag
      console.log('[CO-RESPONSE] 🤝✨ Triggering Socratic Sandwich - Al + Betty collaboration (Feature Enabled)');
      
      // We'll handle the dual response generation after the normal flow
      // For now, set Betty as the primary persona (we'll override later)
      systemPrompt = buildBettySystemPrompt(userMemories, knowledgePack, retrievedKnowledge);
      
    } else if (detectedIntent === 'escape_hatch') {
      // ⚠️ ESCAPE HATCH: Student explicitly rejected Socratic method
      selectedPersona = 'AL';
      systemPrompt = buildAlSystemPrompt(studentContext, userMemories, knowledgePack, retrievedKnowledge) + `\n\n---\n\nCRITICAL INSTRUCTION: The student has explicitly requested to EXIT the Socratic learning mode and wants a DIRECT ANSWER instead.

Student's request: "${message}"

Your task:
1. Briefly acknowledge their request with empathy ("I understand you'd like a direct answer")
2. Provide the factual information they're asking for IMMEDIATELY
3. Be clear, concise, and helpful

DO NOT:
- Suggest returning to Socratic mode
- Ask follow-up questions
- Make them feel bad for wanting direct answers

Their learning preference is valid. Respect it.`;
      
      console.log('[CONDUCTOR] 🚪 ESCAPE HATCH: Student requested direct answers, handing off to Al');
      console.log('[CONDUCTOR] Escape reason:', intentResult.reasoning);
      
    } else if (detectedIntent === 'request_for_clarification' && inBettySession) {
      // SOCRATIC HANDOFF: Al provides factual support during Betty's session
      selectedPersona = 'AL';
      systemPrompt = buildAlSocraticSupportPrompt();
      isSocraticHandoff = true;
      console.log('[CONDUCTOR] 🤝 Socratic Handoff: Al providing factual support in Betty session');
      
    } else if (detectedIntent === 'procedural_guidance') {
      // PROCEDURAL GUIDANCE: Al provides step-by-step instructions WITHOUT Socratic questions
      selectedPersona = 'AL';
      systemPrompt = buildAlSystemPrompt(studentContext, userMemories, knowledgePack) + `\n\n---\n\nCRITICAL MODE: PROCEDURAL INSTRUCTION

The student is following a step-by-step procedure (recipe, tutorial, etc). Your role is to:
1. Provide the next step directly.
2. Explain WHY that step matters (you tell them, don't ask).
3. Keep them moving forward.
4. NEVER ask follow-up questions like "Why do you think?" or "What's important about this?"

If they seem confused, provide clarification directly. Do NOT switch to Socratic mode.`;
      console.log('[CONDUCTOR] 📋 Al providing procedural guidance (no Socratic questions)');
      
    } else if (detectedIntent === 'query_user_data' || detectedIntent === 'platform_question') {
      // USER DATA QUERY or PLATFORM QUESTION: Al with student context and knowledge pack
      selectedPersona = 'AL';
      systemPrompt = buildAlSystemPrompt(studentContext, userMemories, knowledgePack);
      console.log('[CONDUCTOR] 📊 Al providing data-driven or platform guidance response');
      
    } else if (detectedIntent === 'socratic_guidance') {
      // BETTY SOCRATIC SESSION: Increment counters
      selectedPersona = 'BETTY';
      systemPrompt = buildBettySystemPrompt(userMemories, knowledgePack, retrievedKnowledge);
      socraticTurnCounter++; // Increment turn counter for next Nite Owl check
      totalBettyTurns++;
      console.log('[CONDUCTOR] Betty continues Socratic dialogue');
      
    } else {
      // DEFAULT: Al for direct answers
      selectedPersona = 'AL';
      systemPrompt = buildAlSystemPrompt(studentContext, userMemories, knowledgePack);
      console.log('[CONDUCTOR] Al provides direct answer');
    }
    
    console.log('[CONDUCTOR] Routing to persona:', selectedPersona, isSocraticHandoff ? '(Socratic Support Mode)' : '');
    console.log('[CONDUCTOR] Turn counter:', socraticTurnCounter, '/ Next interjection:', nextInterjectionPoint);
    
    // PHASE 2: CONVERSATION DIRECTOR - Validate persona choice before proceeding
    // ============================================
    // Ensures persona transitions follow natural conversation rules
    // ============================================
    const validatePersonaChoice = (
      currentChoice: string,
      history: Array<{persona: string; content: string}>,
      intent: string
    ): { persona: string; reasoning: string } => {
      
      const lastAIPersona = history
        .slice()
        .reverse()
        .find(m => m.persona === 'BETTY' || m.persona === 'AL')?.persona;
      
      // RULE 1: If Betty is teaching Socratically, only switch to Al for specific intents
      if (lastAIPersona === 'BETTY' && currentChoice === 'AL') {
        const allowedSwitches = ['escape_hatch', 'request_for_clarification', 'platform_question', 'query_user_data', 'procedural_guidance'];
        if (!allowedSwitches.includes(intent)) {
          console.log('[DIRECTOR] ⚠️ Blocking Betty→Al switch, intent not appropriate:', intent);
          return { persona: 'BETTY', reasoning: 'Maintaining Socratic flow - inappropriate switch intent' };
        }
      }
      
      // RULE 2: After Nite Owl, always return to the SAME persona (unless escape hatch)
      if (history[history.length - 1]?.persona === 'NITE_OWL' && currentChoice !== 'NITE_OWL' && intent !== 'escape_hatch') {
        if (lastAIPersona) {
          console.log('[DIRECTOR] 🔄 After Nite Owl, returning to original persona:', lastAIPersona);
          return { persona: lastAIPersona, reasoning: 'Continuing from Nite Owl with original persona' };
        }
      }
      
      // RULE 3: Co-response only when answer quality is in the "partial" range
      if (currentChoice === 'CO_RESPONSE') {
        console.log('[DIRECTOR] ✅ Co-response validated - student answer quality in target range');
      }
      
      return { persona: currentChoice, reasoning: 'Standard routing approved' };
    };
    
    // Apply director validation (skip for welcome back and Nite Owl triggers)
    if (!isWelcomeBack && selectedPersona !== 'NITE_OWL') {
      const directorCheck = validatePersonaChoice(selectedPersona, conversationHistory, detectedIntent);
      if (directorCheck.persona !== selectedPersona) {
        console.log('[DIRECTOR] 🎬 Override:', selectedPersona, '→', directorCheck.persona, '-', directorCheck.reasoning);
        selectedPersona = directorCheck.persona;
        
        // Re-build system prompt for overridden persona
        if (selectedPersona === 'BETTY') {
          systemPrompt = buildBettySystemPrompt(userMemories, knowledgePack, retrievedKnowledge);
        } else if (selectedPersona === 'AL') {
          systemPrompt = buildAlSystemPrompt(studentContext, userMemories, knowledgePack, retrievedKnowledge);
        }
      }
    }

    // 10. Build context for Nite Owl if triggered
    let niteOwlContext = '';
    if (selectedPersona === 'NITE_OWL') {
      // Extract topic from recent conversation
      const recentMessages = conversationHistory.slice(-5);
      const topicContext = recentMessages
        .filter(msg => msg.persona === 'BETTY' || msg.persona === 'USER')
        .map(msg => msg.content)
        .join('\n');
      
      // PHASE 5.1: Context-aware prompt based on trigger reason
      if (niteOwlTriggerReason === 'struggle_detected') {
        niteOwlContext = `Based on this conversation:\n${topicContext}\n\nThe student seems to be struggling or stuck. Share an encouraging, lighthearted fun fact that gives them a "small win" and breaks the tension. Use your "Hoo-hoo!" greeting and keep it under 100 words. Make it tangentially related to reward their effort.`;
      } else {
        niteOwlContext = `Based on this conversation about the topic:\n${topicContext}\n\nShare a brief, fascinating fun fact that enriches their understanding. Remember to use your "Hoo-hoo!" greeting and keep it under 100 words.`;
      }
    }

    // 10. Generate AI Response with Appropriate Persona
    console.log('[CONDUCTOR] Generating response with', selectedPersona, 'persona...');
    
    // PHASE 5.2: Reuse existing conversation UUID (already fetched at line 1310)
    console.log('[CONDUCTOR] Using existing conversationUuid:', conversationUuid);
      conversationUuid = convData.id;
      console.log('[CONDUCTOR] ✅ Using existing conversation UUID:', conversationUuid);
    } else {
      // Create new conversation record
      const { data: newConv, error: newConvError } = await supabaseClient
        .from('phoenix_conversations')
        .insert({
          session_id: conversationId,
          user_id: user.id,
          metadata: {
            socraticTurnCounter,
            nextInterjectionPoint,
            totalBettyTurns
          }
        })
        .select('id')
        .single();
      
      if (newConvError) {
        console.error('[CONDUCTOR] ❌ Error creating conversation:', newConvError);
      } else {
        conversationUuid = newConv.id;
        console.log('[CONDUCTOR] ✅ Created new conversation UUID:', conversationUuid);
      }
    }
    
    // ============================================
    // V2 DIALOGUE ENGINE: Feature-Flagged Co-Response with Claude + SSML
    // ============================================
    // Check if V2 Dialogue Engine is enabled via feature flag
    if (isCoResponse && featureFlags['v2_dialogue_engine_enabled']?.enabled && anthropic) {
      console.log('[V2-DIALOGUE] 🎭✨ V2 Dialogue Engine ENABLED - Using Claude + SSML');
      
      // Get context for Claude
      const lastBettyMessage = conversationHistory
        .slice()
        .reverse()
        .find(m => m.persona === 'BETTY');
      
      const userName = user?.user_metadata?.full_name || 'there';
      
      // STEP 1: Generate dialogue script via Claude
      const scriptStartTime = Date.now();
      const script = await generateDialogueWithClaude(
        message,
        conversationHistory,
        lastBettyMessage?.content,
        answerQualityScore,
        userName
      );
      const scriptEndTime = Date.now();
      console.log('[V2-DIALOGUE] ⏱️ Claude generation time:', scriptEndTime - scriptStartTime, 'ms');
      
      if (!script) {
        // Claude failed - fall back to V1 co-response
        console.warn('[V2-DIALOGUE] ⚠️ Claude script generation failed - falling back to V1 co-response');
        // Continue to V1 co-response below
        
      } else {
        // SUCCESS! Build SSML and generate audio
        console.log('[V2-DIALOGUE] ✅ Claude script generated');
        console.log('[V2-DIALOGUE] Betty:', script.betty_line.substring(0, 80) + '...');
        console.log('[V2-DIALOGUE] Al:', script.al_line.substring(0, 80) + '...');
        
        // STEP 2: Build SSML string
        const ssml = buildSSMLDialogue(script.betty_line, script.al_line);
        
        // STEP 3: Generate single multi-voice audio
        const audioStartTime = Date.now();
        const audioUrl = await generateSSMLAudio(ssml);
        const audioEndTime = Date.now();
        console.log('[V2-DIALOGUE] ⏱️ SSML audio generation time:', audioEndTime - audioStartTime, 'ms');
        
        if (!audioUrl) {
          console.warn('[V2-DIALOGUE] ⚠️ SSML audio generation failed - will send text-only dialogue');
        }
        
        // STEP 4: Create streaming response with structured dialogue
        const dialogueStream = new ReadableStream({
          async start(controller) {
            try {
              // Send immediate "thinking" indicator
              const thinkingEvent = `data: ${JSON.stringify({
                type: 'thinking',
                persona: 'DIALOGUE',
                metadata: {
                  intent: detectedIntent,
                  confidence: intentConfidence,
                  mode: 'v2_dialogue'
                }
              })}\n\n`;
              controller.enqueue(new TextEncoder().encode(thinkingEvent));
              console.log('[V2-DIALOGUE] ✅ Sent thinking indicator');
              
              // Send dialogue event with structured transcript
              const dialogueEvent = `data: ${JSON.stringify({
                type: 'dialogue',
                dialogue: [
                  { persona: 'BETTY', text: script.betty_line },
                  { persona: 'AL', text: script.al_line }
                ],
                audioUrl: audioUrl || undefined,
                ttsProvider: audioUrl ? 'google_ssml' : 'none',
                metadata: {
                  isDialogue: true,
                  conversationId,
                  detectedIntent,
                  answerQualityScore,
                  generatedBy: 'claude_opus'
                }
              })}\n\n`;
              controller.enqueue(new TextEncoder().encode(dialogueEvent));
              console.log('[V2-DIALOGUE] ✅ Sent dialogue event');
              
              // Send completion
              const doneEvent = `data: ${JSON.stringify({
                type: 'done',
                metadata: {
                  conversationId,
                  selectedPersona: 'DIALOGUE',
                  hasAudio: !!audioUrl,
                  mode: 'v2_dialogue'
                }
              })}\n\n`;
              controller.enqueue(new TextEncoder().encode(doneEvent));
              
              console.log('[V2-DIALOGUE] ✨ Live Dialogue delivered successfully');
              controller.close();
              
              // Store both messages in database with dialogue metadata
              if (conversationUuid) {
                await supabaseClient.from('phoenix_messages').insert([
                  {
                    conversation_id: conversationUuid,
                    persona: 'BETTY',
                    content: script.betty_line,
                    metadata: {
                      isDialogue: true,
                      dialoguePart: 1,
                      generatedBy: 'claude_opus',
                      answerQuality: answerQualityScore
                    }
                  },
                  {
                    conversation_id: conversationUuid,
                    persona: 'AL',
                    content: script.al_line,
                    metadata: {
                      isDialogue: true,
                      dialoguePart: 2,
                      generatedBy: 'claude_opus',
                      audioUrl: audioUrl || null
                    }
                  }
                ]);
                console.log('[V2-DIALOGUE] ✅ Dialogue stored in database');
              }
              
            } catch (error) {
              console.error('[V2-DIALOGUE] ❌ Stream error:', error);
              controller.error(error);
            }
          }
        });
        
        // Return streaming response immediately (V2 path complete)
        return new Response(dialogueStream, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          }
        });
      }
    }
    
    // ============================================
    // V1 FALLBACK: Legacy Co-Response (Gemini-powered)
    // ============================================
    // Activated when:
    // - V2 flag is disabled, OR
    // - Claude/SSML generation failed, OR
    // - Anthropic client not available
    
    // PHASE 5.2: CO-RESPONSE MODE - Generate TWO responses with UNIFIED STREAMING
    if (isCoResponse) {
      console.log('[CO-RESPONSE] 🤝 Generating dual response with STREAMING: Al validates + Betty deepens');
      
      // Get last Betty question and user's answer for context
      const lastBettyMessage = conversationHistory
        .slice()
        .reverse()
        .find(m => m.persona === 'BETTY');
      
      // Generate Al's validation response
      const alValidationPrompt = `You are Al, the direct answer expert. A student just answered Betty's Socratic question.

Betty asked: "${lastBettyMessage?.content}"
Student answered: "${message}"

The student's answer is partially correct (score: ${answerQualityScore}/100) but lacks depth. Your job:
1. Validate what they got RIGHT (be specific about the factual parts)
2. Keep it brief and encouraging (2-3 sentences max)
3. DON'T ask follow-up questions - that's Betty's job

Example: "That's exactly right, ${user?.user_metadata?.full_name || 'there'}! You've correctly identified the key relationship between X and Y. Your explanation of the core concept is solid."`;

      const bettyFollowUpPrompt = `You are Betty, the Socratic teacher. Al just validated a student's partially correct answer.

Betty's original question: "${lastBettyMessage?.content}"
Student's answer: "${message}"
Al's validation: [Will be inserted after Al responds]

Now it's your turn. Build on Al's validation to ask a deeper Socratic question that:
1. Acknowledges their progress ("Building on that perfect description...")
2. Pushes them to explore the IMPLICATIONS or MECHANISMS of what they just said
3. Uses real Socratic questioning (not just "tell me more")

Keep it under 100 words.`;

      // Stream Al's response first
      const alResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: buildAlSystemPrompt(studentContext, userMemories, knowledgePack) },
            ...conversationHistory.slice(-5).map(msg => ({
              role: msg.persona === 'USER' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: alValidationPrompt }
          ],
          temperature: 0.6,
          max_tokens: 200,
          stream: true // NOW STREAMING!
        }),
      });

      if (!alResponse.ok) {
        console.error('[CO-RESPONSE] Al validation failed, falling back to normal mode');
        isCoResponse = false; // Fallback
      }
      
      // Create unified streaming response that streams both Al and Betty
      const coResponseStream = new ReadableStream({
        async start(controller) {
          try {
            // === STREAM AL'S VALIDATION ===
            console.log('[CO-RESPONSE] 🎤 Streaming Al\'s validation...');
            const alReader = alResponse.body?.getReader();
            const decoder = new TextDecoder();
            let alFullText = '';
            let buffer = '';
            
            // Send marker that Al is starting
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
              type: 'co_response_start',
              persona: 'AL',
              part: 1
            })}\n\n`));
            
            while (true) {
              const { done, value } = await alReader!.read();
              if (done) break;
              
              const chunk = decoder.decode(value, { stream: true });
              buffer += chunk;
              
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              
              for (const line of lines) {
                if (line.trim() === '' || line.startsWith(':')) continue;
                if (line.startsWith('data: ')) {
                  const data = line.slice(6).trim();
                  if (data === '[DONE]') continue;
                  
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      alFullText += content;
                      // Stream Al's chunk to client
                      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
                        type: 'chunk',
                        persona: 'AL',
                        content,
                        metadata: { isCoResponse: true, part: 1 }
                      })}\n\n`));
                    }
                  } catch (e) {
                    // Skip malformed JSON
                  }
                }
              }
            }
            
            console.log('[CO-RESPONSE] ✅ Al complete:', alFullText.substring(0, 80));
            
            // Send marker that Al is done
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
              type: 'co_response_part_done',
              persona: 'AL',
              part: 1,
              fullText: alFullText
            })}\n\n`));
            
            // Small delay for UX
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // === STREAM BETTY'S FOLLOW-UP ===
            console.log('[CO-RESPONSE] 🎤 Streaming Betty\'s follow-up...');
            
            const bettyFollowUpPromptWithContext = bettyFollowUpPrompt.replace(
              '[Will be inserted after Al responds]',
              alFullText
            );
            
            const bettyResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${LOVABLE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'google/gemini-2.5-flash',
                messages: [
                  { role: 'system', content: buildBettySystemPrompt(userMemories, knowledgePack, retrievedKnowledge) },
                  ...conversationHistory.slice(-5).map(msg => ({
                    role: msg.persona === 'USER' ? 'user' : 'assistant',
                    content: msg.content
                  })),
                  { role: 'assistant', content: alFullText },
                  { role: 'user', content: bettyFollowUpPromptWithContext }
                ],
                temperature: 0.8,
                max_tokens: 300,
                stream: true // NOW STREAMING!
              }),
            });
            
            if (!bettyResponse.ok) {
              throw new Error('Betty follow-up failed');
            }
            
            const bettyReader = bettyResponse.body?.getReader();
            let bettyFullText = '';
            buffer = '';
            
            // Send marker that Betty is starting
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
              type: 'co_response_start',
              persona: 'BETTY',
              part: 2
            })}\n\n`));
            
            while (true) {
              const { done, value } = await bettyReader!.read();
              if (done) break;
              
              const chunk = decoder.decode(value, { stream: true });
              buffer += chunk;
              
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              
              for (const line of lines) {
                if (line.trim() === '' || line.startsWith(':')) continue;
                if (line.startsWith('data: ')) {
                  const data = line.slice(6).trim();
                  if (data === '[DONE]') continue;
                  
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      bettyFullText += content;
                      // Stream Betty's chunk to client
                      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
                        type: 'chunk',
                        persona: 'BETTY',
                        content,
                        metadata: { isCoResponse: true, part: 2 }
                      })}\n\n`));
                    }
                  } catch (e) {
                    // Skip malformed JSON
                  }
                }
              }
            }
            
            console.log('[CO-RESPONSE] ✅ Betty complete:', bettyFullText.substring(0, 80));
            
            // Send final completion
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
              type: 'done',
              isCoResponse: true,
              metadata: {
                conversationId,
                selectedPersona: 'CO_RESPONSE',
                detectedIntent,
                answerQualityScore
              }
            })}\n\n`));
            
            console.log('[CO-RESPONSE] ✨ Streaming Socratic Sandwich delivered successfully');
            controller.close();
            
            // Store both messages in database
            if (conversationUuid) {
              await supabaseClient.from('phoenix_messages').insert([
                {
                  conversation_id: conversationUuid,
                  persona: 'AL',
                  content: alFullText,
                  metadata: {
                    isCoResponse: true,
                    part: 1,
                    answerQuality: answerQualityScore
                  }
                },
                {
                  conversation_id: conversationUuid,
                  persona: 'BETTY',
                  content: bettyFullText,
                  metadata: {
                    isCoResponse: true,
                    part: 2
                  }
                }
              ]);
              console.log('[CO-RESPONSE] ✅ Both messages stored in database');
            }
            
          } catch (error) {
            console.error('[CO-RESPONSE] Stream error:', error);
            controller.error(error);
          }
        }
      });
      
      return new Response(coResponseStream, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }
    
    // NORMAL MODE: Single persona response with streaming
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
          : isWelcomeBack
          ? [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
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
        max_tokens: selectedPersona === 'NITE_OWL' ? 200 : (isSocraticHandoff ? 300 : (isWelcomeBack ? 400 : 500)),
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
      isSocraticHandoff,
      isWelcomeBack
    };

    // Return streaming response with PARALLEL audio generation
    const stream = new ReadableStream({
      async start(controller) {
        const reader = personaResponse.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let chunkCount = 0;
        let buffer = ''; // Buffer for incomplete JSON
        let audioGenerationPromise: Promise<{ audioUrl: string | null; provider: string; audioFailed?: boolean }> | null = null;
        let audioStarted = false;

        // Define governorResult with safe defaults BEFORE try block to avoid scope issues
        let governorResult = {
          passed: true,
          is_safe: true,
          is_on_topic: true,
          persona_adherence: 'correct' as const,
          severity: 'low' as const,
          reason: 'Self-governed response'
        };

        try {
          // ⚡ IMMEDIATE USER FEEDBACK: Send "thinking" status before first token
          const thinkingEvent = `data: ${JSON.stringify({ 
            type: 'thinking', 
            persona: selectedPersona,
            metadata: {
              intent: detectedIntent,
              confidence: intentConfidence
            }
          })}\n\n`;
          controller.enqueue(new TextEncoder().encode(thinkingEvent));
          console.log('[CONDUCTOR] ✅ Sent immediate "thinking" indicator to user');
          
          console.log('[CONDUCTOR] Starting SSE stream with PARALLEL audio generation...');
          
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
                    
                    // 🎵 PARALLEL AUDIO: Start TTS generation when we have enough text (50+ chars)
                    if (fullText.length >= 50 && !audioStarted) {
                      audioStarted = true;
                      console.log('[CONDUCTOR] 🎵 Starting PARALLEL audio generation at', fullText.length, 'characters');
                      
                      // Fire off audio generation without awaiting (parallel!)
                      audioGenerationPromise = (async () => {
                        const ttsProviders = getTTSProviders(featureFlags);
                        return await generateTTSWithRetry(
                          fullText, // Will use whatever text is available now
                          selectedPersona,
                          ttsProviders,
                          2
                        );
                      })();
                    }
                    
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

          // CRITICAL: Capture final text as immutable constant IMMEDIATELY
          const generatedTextFromLLM = fullText;
          console.log('[CONDUCTOR] ✅ Text generated by LLM (first 80 chars):', generatedTextFromLLM.substring(0, 80));
          console.log('[CONDUCTOR] 📊 Total text length:', generatedTextFromLLM.length);
          
          // CRITICAL VALIDATION: Check for empty response
          if (!generatedTextFromLLM || generatedTextFromLLM.trim().length === 0) {
            console.error('[CONDUCTOR] ❌ Empty response received from LLM - generating fallback');
            throw new Error('Empty response from LLM');
          }

          // ⚡ PERFORMANCE: Fire-and-forget Governor check for logging only (no blocking!)
          const finalText = generatedTextFromLLM; // Use response directly
          const governorBlocked = false; // Never blocking with new self-governance approach
          
          // Async Governor logging (non-blocking) - only if feature enabled
          if (featureFlags['governor_quality_checks']?.enabled) {
            console.log('[CONDUCTOR] 🛡️ Governor feature ENABLED - running async quality check for logging');
            (async () => {
              try {
                const asyncGovernorResult = await runGovernorCheck(
                generatedTextFromLLM,
                selectedPersona,
                message,
                LOVABLE_API_KEY,
                {
                  isWelcomeBack,
                  isNiteOwl: selectedPersona === 'NITE_OWL',
                  isHandoff: false
                }
              );
              
              // Log for monitoring only
              if (!asyncGovernorResult.passed || asyncGovernorResult.persona_adherence !== 'correct') {
                console.warn('[GOVERNOR] ⚠️ Quality issue detected (non-blocking):', asyncGovernorResult.reason);
                await supabaseClient.from('phoenix_governor_logs').insert({
                  conversation_id: conversationId,
                  persona: selectedPersona,
                  original_response: generatedTextFromLLM,
                  user_message: message,
                  is_safe: asyncGovernorResult.is_safe,
                  is_on_topic: asyncGovernorResult.is_on_topic,
                  persona_adherence: asyncGovernorResult.persona_adherence,
                  severity: asyncGovernorResult.severity,
                  reason: asyncGovernorResult.reason,
                  blocked: false // Never blocking anymore
                });
              }
            } catch (error) {
              console.error('[GOVERNOR] Non-blocking check failed:', error);
            }
          })();
        } else {
          console.log('[CONDUCTOR] 🛡️ Governor feature DISABLED - skipping quality checks');
        }

          // 🎵 AWAIT PARALLEL AUDIO: Wait for TTS generation to complete
          let audioUrl: string | null = null;
          let audioProvider = 'none';
          let audioFailed = false;
          
          if (audioGenerationPromise) {
            console.log('[CONDUCTOR] 🎵 Awaiting parallel audio generation...');
            try {
              const audioResult = await audioGenerationPromise;
              audioUrl = audioResult.audioUrl;
              audioProvider = audioResult.provider;
              audioFailed = audioResult.audioFailed || false;
              console.log('[CONDUCTOR] ✅ Parallel audio completed:', audioProvider);
            } catch (error) {
              console.error('[CONDUCTOR] ❌ Parallel audio generation failed:', error);
              audioFailed = true;
            }
          } else {
            console.log('[CONDUCTOR] ⚠️ No parallel audio started (text too short?)');
          }
          
          // CRITICAL: Store text for TTS as immutable const to prevent corruption
          const textForTTS = finalText;
          console.log('[CONDUCTOR] 🎵 Final text length:', textForTTS.length);
          console.log('[CONDUCTOR] 🎵 Target persona for TTS:', selectedPersona);
          
          // Audio already generated in parallel - log final status
          if (!audioUrl) {
            console.warn('[CONDUCTOR] ⚠️ No audio available - text-only response will be sent');
          } else {
            console.log('[CONDUCTOR] ✅ Audio generated via', audioProvider);
          }
          const ttsProvider = audioProvider; // For backward compatibility with logging
          
          // CRITICAL SANITY CHECK: Verify text-audio alignment
          console.log('[CONDUCTOR] 🔍 SANITY CHECK - Text vs Audio alignment:');
          console.log('[CONDUCTOR] 🔍 Text to display (first 80):', finalText.substring(0, 80));
          console.log('[CONDUCTOR] 🔍 Audio generated:', audioUrl ? 'YES' : 'NO');
          console.log('[CONDUCTOR] 🔍 TTS provider:', ttsProvider);
          if (audioUrl && textForTTS !== finalText) {
            console.error('[CONDUCTOR] ⚠️⚠️⚠️ CRITICAL MISMATCH DETECTED ⚠️⚠️⚠️');
            console.error('[CONDUCTOR] Audio was generated for different text than what will be displayed!');
          }

          // Store complete message in database
          // Reuse existing conversation UUID (already fetched at line 1310)
          console.log('[CONDUCTOR] Using conversationUuid for message storage:', conversationUuid);
            const { data: newConv, error: createError } = await supabaseClient
              .from('phoenix_conversations')
              .insert({
                user_id: user.id,
                session_id: conversationId,
                metadata: { 
                  phase: 3,
                  socraticTurnCounter,
                  nextInterjectionPoint,
                  totalBettyTurns,
                  lastNiteOwlTurn,
                  created_from: 'orchestrator'
                }
              })
              .select('id')
              .single();
            
            if (createError || !newConv) {
              console.error('[CONDUCTOR] ❌ Failed to create conversation:', createError);
            } else {
              conversationUuid = newConv.id;
              console.log('[CONDUCTOR] ✅ Conversation created:', conversationUuid);
            }
          } else {
            conversationUuid = convData.id;
            console.log('[CONDUCTOR] ✅ Found existing conversation:', conversationUuid);
          }
          
          // Insert messages only if we have a valid conversation UUID
          if (conversationUuid) {
            // Insert user message
            const { error: userMsgError } = await supabaseClient.from('phoenix_messages').insert({
              conversation_id: conversationUuid,
              persona: 'USER',
              content: message,
              intent: detectedIntent,
              sentiment: detectedSentiment
            });
            
            if (userMsgError) {
              console.error('[CONDUCTOR] ❌ Failed to insert user message:', userMsgError);
            } else {
              console.log('[CONDUCTOR] ✅ User message stored');
            }

            // Insert AI response message
            const { error: aiMsgError } = await supabaseClient.from('phoenix_messages').insert({
              conversation_id: conversationUuid,
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
            
            if (aiMsgError) {
              console.error('[CONDUCTOR] ❌ Failed to insert AI message:', aiMsgError);
            } else {
              console.log('[CONDUCTOR] ✅ AI message stored');
            }
            
            // Store Governor log if there were issues
            if (governorBlocked || governorResult.severity !== 'low') {
              const { error: govError } = await supabaseClient.from('phoenix_governor_logs').insert({
                conversation_id: conversationId,
                persona: selectedPersona,
                original_text: fullText,
                modified_text: governorBlocked ? null : finalText,
                severity: governorResult.severity,
                reason: governorResult.reason,
                blocked: governorBlocked,
                metadata: {
                  is_safe: governorResult.is_safe,
                  is_on_topic: governorResult.is_on_topic,
                  persona_adherence: governorResult.persona_adherence
                }
              });
              
              if (govError) {
                console.error('[CONDUCTOR] ❌ Failed to log Governor activity:', govError);
              } else {
                console.log('[CONDUCTOR] ✅ Governor activity logged');
              }
            }
          }

          // Update session state with turn counters
          await supabaseClient
            .from('phoenix_conversations')
            .update({
              metadata: {
                socraticTurnCounter,
                nextInterjectionPoint,
                totalBettyTurns,
                lastNiteOwlTurn,
                resumptionLockTurns,
                lastUpdated: new Date().toISOString()
              },
              updated_at: new Date().toISOString()
            })
            .eq('session_id', conversationId);

          // 11. NITE OWL HANDOFF: If we just sent a Nite Owl message, immediately follow up with original persona
          // ============================================
          // PART 3: GRACEFUL HANDOFF - Ensure smooth transition after Nite Owl
          // ============================================
          // CRITICAL: Do NOT trigger handoff if this was a session resumption (isWelcomeBack prevents it)
          if (selectedPersona === 'NITE_OWL' && !isWelcomeBack) {
            try {
              console.log('[CONDUCTOR] 🦉🔄 GRACEFUL HANDOFF INITIATED');
              console.log('[CONDUCTOR] Generating fresh, context-aware follow-up from original persona');
            
            // Determine which persona to hand back to (Betty for socratic, Al for direct)
            const handoffPersona = inBettySession ? 'BETTY' : 'AL';
            const handoffSystemPrompt = handoffPersona === 'BETTY' 
              ? buildBettySystemPrompt(userMemories, knowledgePack, retrievedKnowledge) 
              : buildAlSystemPrompt(studentContext, userMemories, knowledgePack, retrievedKnowledge);
            
            // Add special instruction for handoff
            const handoffInstruction = handoffPersona === 'BETTY'
              ? `🔄 CRITICAL HANDOFF INSTRUCTION 🔄

Nite Owl just shared a fun fact with the student. Your job is to:
1. Briefly and warmly acknowledge Nite Owl (e.g., "Thanks, Nite Owl! That's fascinating!")
2. Connect the fun fact to the learning topic if possible
3. Reference the student's last message BEFORE Nite Owl appeared: "${message}"
4. Continue your Socratic dialogue with a fresh, specific question

Context:
- Student's last message: "${message}"
- Nite Owl just said: "${finalText}"
- You were having a Socratic discussion about a topic

Generate a seamless transition that:
- Acknowledges the fun fact
- Brings focus back to the learning goal
- Asks a NEW Socratic question (not repeating your last question)

This must feel like a natural conversation flow, not a robotic handoff.`
              : `🔄 CRITICAL HANDOFF INSTRUCTION 🔄

Nite Owl just shared a fun fact. Briefly acknowledge him, then continue answering the student's original question: "${message}"

Nite Owl's message: "${finalText}"

Keep it brief and focused on answering their original question.`;
            
            console.log('[CONDUCTOR] 🔄 Calling', handoffPersona, 'for graceful transition');
            
            
            // Make follow-up LLM call for handoff
            const handoffResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${LOVABLE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'google/gemini-2.5-flash',
                messages: [
                  { role: 'system', content: handoffSystemPrompt },
                  ...conversationHistory.slice(-5).map(msg => ({
                    role: msg.persona === 'USER' ? 'user' : 'assistant',
                    content: msg.content
                  })),
                  { role: 'assistant', content: finalText }, // Nite Owl's message
                  { role: 'system', content: handoffInstruction }
                ],
                temperature: handoffPersona === 'BETTY' ? 0.8 : 0.6,
                max_tokens: 500,
              }),
            });
            
            if (handoffResponse.ok) {
              const handoffData = await handoffResponse.json();
              const handoffText = handoffData.choices?.[0]?.message?.content || '';
              
              console.log('[CONDUCTOR] ✅ Handoff response generated:', handoffText.substring(0, 80));
              
              // Generate TTS for handoff message (feature-flagged)
              let handoffAudioUrl = null;
              try {
                // Feature flags (read from database with priority)
                const { data: ttsFlags } = await supabaseClient
                  .from('phoenix_feature_flags')
                  .select('feature_name, is_enabled, priority')
                  .eq('is_enabled', true)
                  .like('feature_name', 'tts_provider_%');
                
                // Sort providers by priority
                const sortedHandoffProviders = ttsFlags
                  ? ttsFlags.sort((a, b) => a.priority - b.priority).map(f => f.feature_name.replace('tts_provider_', ''))
                  : ['google', 'elevenlabs'];
                
                console.log('[CONDUCTOR] Handoff TTS Providers (by priority):', sortedHandoffProviders);
                
                const GOOGLE_TTS_KEY = Deno.env.get('GOOGLE_CLOUD_TTS_API_KEY');
                const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
                const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
                
                if (handoffText.length > 0) {
                  // Iterate through providers in priority order
                  for (const providerName of sortedHandoffProviders) {
                    if (handoffAudioUrl) break; // Exit once audio is generated
                    
                    console.log(`[CONDUCTOR] Attempting handoff TTS via ${providerName}`);
                    
                    // Try Google TTS
                    if (providerName === 'google' && GOOGLE_TTS_KEY) {
                    try {
                      const googleVoice = handoffPersona === 'BETTY' 
                        ? 'en-US-Wavenet-F'
                        : 'en-US-Wavenet-D';
                      
                      console.log(`[CONDUCTOR] 🎤 Generating handoff TTS via Google with voice ${googleVoice}`);
                      
                      const googleResponse = await fetch(
                        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_KEY}`,
                        {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            input: { text: handoffText },
                            voice: { languageCode: 'en-US', name: googleVoice },
                            audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0, pitch: 0 },
                          }),
                        }
                      );
                      
                      if (googleResponse.ok) {
                        const data = await googleResponse.json();
                        if (data.audioContent) {
                          handoffAudioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
                          console.log('[CONDUCTOR] ✅ Handoff TTS generated via Google Cloud');
                        }
                      }
                      } catch (googleError) {
                        console.error('[CONDUCTOR] ❌ Google handoff TTS error:', googleError);
                      }
                    }
                    
                    // Try ElevenLabs
                    if (providerName === 'elevenlabs' && ELEVENLABS_API_KEY) {
                      try {
                      const voiceId = handoffPersona === 'BETTY' 
                        ? 'uYXf8XasLslADfZ2MB4u' 
                        : 'wo6udizrrtpIxWGp2qJk';
                      
                      console.log(`[CONDUCTOR] 🎤 Generating handoff TTS via ElevenLabs with voice ${voiceId}`);
                      
                      const handoffTTSResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                        method: 'POST',
                        headers: {
                          'xi-api-key': ELEVENLABS_API_KEY,
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          text: handoffText,
                          model_id: 'eleven_turbo_v2_5',
                          voice_settings: {
                            stability: handoffPersona === 'BETTY' ? 0.6 : 0.7,
                            similarity_boost: 0.8,
                            style: handoffPersona === 'BETTY' ? 0.4 : 0.2
                          }
                        }),
                      });
                      
                      if (handoffTTSResponse.ok) {
                        const audioBuffer = await handoffTTSResponse.arrayBuffer();
                        const uint8Array = new Uint8Array(audioBuffer);
                        let binaryString = '';
                        for (let i = 0; i < uint8Array.length; i++) {
                          binaryString += String.fromCharCode(uint8Array[i]);
                        }
                        const base64Audio = btoa(binaryString);
                        handoffAudioUrl = `data:audio/mpeg;base64,${base64Audio}`;
                        console.log('[CONDUCTOR] ✅ Handoff TTS generated via ElevenLabs');
                      }
                    } catch (elevenLabsError) {
                      console.error('[CONDUCTOR] ❌ ElevenLabs handoff TTS error:', elevenLabsError);
                    }
                  }
                  
                  // Try OpenAI
                  if (providerName === 'openai' && OPENAI_API_KEY) {
                    try {
                      const voice = handoffPersona === 'BETTY' ? 'nova' : 'onyx';
                      console.log(`[CONDUCTOR] 🎤 Generating handoff TTS via OpenAI with voice ${voice}`);
                      
                      const openAIResponse = await fetch('https://api.openai.com/v1/audio/speech', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${OPENAI_API_KEY}`,
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          model: 'tts-1',
                          input: handoffText,
                          voice: voice,
                          response_format: 'mp3',
                        }),
                      });
                      
                      if (openAIResponse.ok) {
                        const audioBuffer = await openAIResponse.arrayBuffer();
                        const uint8Array = new Uint8Array(audioBuffer);
                        let binaryString = '';
                        for (let i = 0; i < uint8Array.length; i++) {
                          binaryString += String.fromCharCode(uint8Array[i]);
                        }
                        const base64Audio = btoa(binaryString);
                        handoffAudioUrl = `data:audio/mpeg;base64,${base64Audio}`;
                        console.log('[CONDUCTOR] ✅ Handoff TTS generated via OpenAI');
                      }
                    } catch (openAIError) {
                      console.error('[CONDUCTOR] ❌ OpenAI handoff TTS error:', openAIError);
                    }
                  }
                } // End provider loop
              } // End if (handoffText.length > 0)
              } catch (ttsError) {
                console.error('[CONDUCTOR] ❌ Handoff TTS error (non-critical):', ttsError);
              }
              
              // Store handoff message in database
              if (!conversationUuid) {
                console.warn('[CONDUCTOR] ⚠️ Conversation UUID missing - skipping handoff message storage');
              }
              if (conversationUuid) {
                await supabaseClient.from('phoenix_messages').insert({
                  conversation_id: conversationUuid,
                  persona: handoffPersona,
                  content: handoffText,
                  metadata: {
                    isHandoff: true,
                    followingNiteOwl: true,
                    hasAudio: handoffAudioUrl !== null
                  }
                });
                console.log('[CONDUCTOR] ✅ Handoff message stored');
              }
              
              // Send handoff message to client as additional event
              const handoffMessage = `data: ${JSON.stringify({ 
                type: 'handoff',
                persona: handoffPersona,
                content: handoffText,
                audioUrl: handoffAudioUrl
              })}\n\n`;
              
              console.log('[CONDUCTOR] 📤 Sending handoff message to client');
              controller.enqueue(new TextEncoder().encode(handoffMessage));
            } else {
              console.error('[CONDUCTOR] ❌ Handoff response failed:', await handoffResponse.text());
            }
            } catch (handoffError) {
              console.error('[CONDUCTOR] ❌ Handoff error (non-critical):', handoffError);
              
              // Fallback: Send a simple transition message
              try {
                const fallbackPersona = inBettySession ? 'BETTY' : 'AL';
                const fallbackText = fallbackPersona === 'BETTY' 
                  ? "Thanks, Nite Owl! Now, let's continue exploring this together."
                  : "Thanks for that insight, Nite Owl. Let's continue with your learning.";
                
                if (conversationUuid) {
                  await supabaseClient.from('phoenix_messages').insert({
                    conversation_id: conversationUuid,
                    persona: fallbackPersona,
                    content: fallbackText,
                    metadata: { isHandoff: true, isFallback: true }
                  });
                  
                  const fallbackMessage = `data: ${JSON.stringify({ 
                    type: 'handoff',
                    persona: fallbackPersona,
                    content: fallbackText,
                    audioUrl: null
                  })}\n\n`;
                  
                  controller.enqueue(new TextEncoder().encode(fallbackMessage));
                  console.log('[CONDUCTOR] ✅ Sent fallback handoff message');
                }
              } catch (fallbackError) {
                console.error('[CONDUCTOR] ❌ Fallback handoff also failed:', fallbackError);
              }
            }
          } // End of NITE_OWL handoff

          // 12. Check if we should trigger podcast generation (async, non-blocking)
          if (featureFlags['podcast_generation']?.enabled && selectedPersona === 'BETTY' && totalBettyTurns >= 6) {
            console.log('[CONDUCTOR] 🎙️ Podcast feature ENABLED - checking trigger conditions');
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
                audioFailed: ttsProvider === 'all_failed', // Flag for frontend notification
                governorChecked: true,
                governorBlocked,
                isSocraticHandoff,
                isWelcomeBack,
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
          
          // PHASE 5: Extract and store memories after session completion
          if (featureFlags['memory_extraction']?.enabled && user?.id && conversationHistory.length >= 4) {
            const minMessages = featureFlags['memory_extraction']?.config?.min_messages || 4;
            console.log(`[MEMORY] 🧠 Memory extraction feature ENABLED (min ${minMessages} messages) - starting async extraction...`);
            // Run memory extraction asynchronously (don't await)
            extractAndStoreMemories(
              conversationId,
              user.id,
              conversationHistory,
              LOVABLE_API_KEY,
              supabaseClient
            ).catch(error => {
              console.error('[MEMORY] Async memory extraction failed:', error);
            });
          }
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
