import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildContextPrompt } from './prompt-builder.ts';
import type { ChatRequest } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Advanced Socratic AI Study Coach v2.0 - Comprehensive Implementation
const CLAUDE_MODEL = 'claude-3-5-haiku-20241022';
const MAX_TOKENS = 800; // Increased for sophisticated responses
const BLUEPRINT_VERSION = '2.0-socratic';

// Memory and State Management
interface ConversationMemory {
  workingMemory: {
    currentTopic: string | null;
    questionSequence: string[];
    studentResponses: string[];
    misconceptions: string[];
  };
  episodicMemory: {
    sessionHistory: any[];
    learningPatterns: string[];
    successfulStrategies: string[];
  };
  semanticMemory: {
    conceptMap: Record<string, string[]>;
    knowledgeGaps: string[];
    masteredConcepts: string[];
  };
  proceduralMemory: {
    preferredQuestioningStyles: string[];
    effectiveScaffolding: string[];
    adaptationStrategies: string[];
  };
}

// Student Modeling Interface
interface StudentProfile {
  knowledgeState: {
    currentUnderstanding: number; // 0-1 scale
    confidence: number; // 0-1 scale
    misconceptions: string[];
    gapsIdentified: string[];
  };
  cognitiveLoad: {
    currentLoad: number; // 0-1 scale
    fatigueIndicators: string[];
    optimalChallenge: number; // 0-1 scale
  };
  learningStyle: {
    preferredModality: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    questioningPreference: 'direct' | 'analogical' | 'systematic' | 'exploratory';
    scaffoldingNeeds: 'high' | 'medium' | 'low';
  };
}

// Advanced Questioning Strategies
const SOCRATIC_STRATEGIES = {
  foundational: [
    "What do you mean when you say...?",
    "How would you define...?",
    "What is your understanding of...?",
    "Can you give me an example of...?"
  ],
  clarification: [
    "Can you be more specific about...?",
    "What makes you think that...?",
    "How does this relate to what we discussed earlier?",
    "What would someone who disagrees with you say?"
  ],
  evidence: [
    "What evidence supports your thinking?",
    "How did you come to that conclusion?",
    "What might convince you otherwise?",
    "What are you basing that on?"
  ],
  implication: [
    "What would happen if...?",
    "How does this connect to...?",
    "What are the consequences of...?",
    "If this is true, then what follows?"
  ],
  perspective: [
    "What are the strengths and weaknesses of this view?",
    "How might someone from a different background see this?",
    "What alternatives have you considered?",
    "What assumptions are you making?"
  ],
  metacognitive: [
    "How confident are you in your answer?",
    "What would you need to know to be more certain?",
    "How did you approach this problem?",
    "What would you do differently next time?"
  ]
};

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

// Initialize conversation memory store (in production, this would be persistent)
const conversationStore = new Map<string, ConversationMemory>();

// Advanced conversation state management
function initializeConversationMemory(sessionId: string): ConversationMemory {
  return {
    workingMemory: {
      currentTopic: null,
      questionSequence: [],
      studentResponses: [],
      misconceptions: []
    },
    episodicMemory: {
      sessionHistory: [],
      learningPatterns: [],
      successfulStrategies: []
    },
    semanticMemory: {
      conceptMap: {},
      knowledgeGaps: [],
      masteredConcepts: []
    },
    proceduralMemory: {
      preferredQuestioningStyles: [],
      effectiveScaffolding: [],
      adaptationStrategies: []
    }
  };
}

// Advanced student modeling
function analyzeStudentState(message: string, history: any[], memory: ConversationMemory): StudentProfile {
  const recentResponses = history.slice(-5);
  const responseLength = message.length;
  const questionMarks = (message.match(/\?/g) || []).length;
  const uncertaintyWords = ['maybe', 'i think', 'not sure', 'possibly', 'might be'].some(word => 
    message.toLowerCase().includes(word)
  );

  return {
    knowledgeState: {
      currentUnderstanding: uncertaintyWords ? 0.4 : 0.7,
      confidence: responseLength > 50 && !uncertaintyWords ? 0.8 : 0.5,
      misconceptions: memory.workingMemory.misconceptions,
      gapsIdentified: memory.semanticMemory.knowledgeGaps
    },
    cognitiveLoad: {
      currentLoad: recentResponses.length > 3 ? 0.7 : 0.4,
      fatigueIndicators: responseLength < 10 ? ['short_responses'] : [],
      optimalChallenge: 0.6
    },
    learningStyle: {
      preferredModality: questionMarks > 0 ? 'auditory' : 'visual',
      questioningPreference: uncertaintyWords ? 'systematic' : 'exploratory',
      scaffoldingNeeds: uncertaintyWords ? 'high' : 'medium'
    }
  };
}

// Smart question selection based on student profile
function selectSocraticQuestion(studentProfile: StudentProfile, context: string): string {
  const { knowledgeState, cognitiveLoad, learningStyle } = studentProfile;
  
  if (cognitiveLoad.currentLoad > 0.8) {
    return SOCRATIC_STRATEGIES.foundational[Math.floor(Math.random() * SOCRATIC_STRATEGIES.foundational.length)];
  }
  
  if (knowledgeState.currentUnderstanding < 0.5) {
    return SOCRATIC_STRATEGIES.clarification[Math.floor(Math.random() * SOCRATIC_STRATEGIES.clarification.length)];
  }
  
  if (learningStyle.questioningPreference === 'systematic') {
    return SOCRATIC_STRATEGIES.evidence[Math.floor(Math.random() * SOCRATIC_STRATEGIES.evidence.length)];
  }
  
  return SOCRATIC_STRATEGIES.implication[Math.floor(Math.random() * SOCRATIC_STRATEGIES.implication.length)];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ChatRequest = await req.json();
    const { message, userId, sessionId, chatMode = 'personal', voiceActive = false, clientHistory = [] } = requestData;
    
    console.log('🚀 ADVANCED SOCRATIC AI v2.0 - PROCESSING:', { 
      hasMessage: !!message, 
      hasUserId: !!userId,
      sessionId: sessionId?.substring(0, 8) + '...',
      chatMode,
      voiceActive,
      historyLength: clientHistory.length,
      timestamp: new Date().toISOString()
    });
    
    if (!message || !userId) {
      throw new Error('Message and user ID are required');
    }

    // Initialize or retrieve conversation memory
    const memoryKey = `${userId}-${sessionId || 'default'}`;
    let conversationMemory = conversationStore.get(memoryKey);
    if (!conversationMemory) {
      conversationMemory = initializeConversationMemory(sessionId || 'default');
      conversationStore.set(memoryKey, conversationMemory);
    }

    // Update working memory with current interaction
    conversationMemory.workingMemory.questionSequence.push(message);
    conversationMemory.episodicMemory.sessionHistory = clientHistory;

    // Advanced student modeling
    const studentProfile = analyzeStudentState(message, clientHistory, conversationMemory);
    
    console.log('📊 STUDENT PROFILE ANALYSIS:', {
      understanding: studentProfile.knowledgeState.currentUnderstanding,
      confidence: studentProfile.knowledgeState.confidence,
      cognitiveLoad: studentProfile.cognitiveLoad.currentLoad,
      scaffoldingNeeds: studentProfile.learningStyle.scaffoldingNeeds
    });

    // Check for Anthropic API key
    if (!anthropicApiKey) {
      const adaptiveResponse = generateAdaptiveFallback(studentProfile, message);
      
      return new Response(
        JSON.stringify({ 
          response: adaptiveResponse,
          source: 'adaptive_fallback',
          blueprintVersion: BLUEPRINT_VERSION,
          studentProfile: {
            understanding: studentProfile.knowledgeState.currentUnderstanding,
            confidence: studentProfile.knowledgeState.confidence
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build sophisticated contextual prompt using the existing prompt builder
    const enhancedPrompt = buildContextPrompt(
      null, // learningContext - could be enhanced with student profile
      clientHistory,
      'personal',
      voiceActive,
      message,
      chatMode
    );

    // Add advanced Socratic coaching instructions
    const socraticEnhancement = `

## ADVANCED SOCRATIC COACHING PROTOCOL

STUDENT PROFILE ANALYSIS:
- Current Understanding Level: ${Math.round(studentProfile.knowledgeState.currentUnderstanding * 100)}%
- Confidence Level: ${Math.round(studentProfile.knowledgeState.confidence * 100)}%
- Cognitive Load: ${Math.round(studentProfile.cognitiveLoad.currentLoad * 100)}%
- Scaffolding Needs: ${studentProfile.learningStyle.scaffoldingNeeds}

RESPONSE STRATEGY:
1. NEVER provide direct answers unless '/answer' command is used
2. Use ${studentProfile.learningStyle.questioningPreference} questioning approach
3. Adapt complexity based on cognitive load (${studentProfile.cognitiveLoad.currentLoad > 0.7 ? 'REDUCE' : 'MAINTAIN'})
4. Focus on ${studentProfile.knowledgeState.misconceptions.length > 0 ? 'misconception correction' : 'knowledge building'}

QUESTION SELECTION GUIDANCE:
${selectSocraticQuestion(studentProfile, message)}

Remember: Guide through questions, build understanding step by step, encourage critical thinking.`;

    const finalPrompt = enhancedPrompt + socraticEnhancement;
    
    console.log('🧠 ADVANCED SOCRATIC PROCESSING: Enhanced prompt with student modeling');
    console.log('🤖 Calling Anthropic Claude with ADVANCED SOCRATIC LOGIC');

    // Call Anthropic API with advanced prompt
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'x-api-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        messages: [
          {
            role: 'user',
            content: finalPrompt
          }
        ]
      })
    });

    if (!anthropicResponse.ok) {
      const error = await anthropicResponse.text();
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    const anthropicData = await anthropicResponse.json();
    const aiResponse = anthropicData.content?.[0]?.text || selectSocraticQuestion(studentProfile, message);

    // Update conversation memory with AI response
    conversationMemory.workingMemory.studentResponses.push(message);
    conversationMemory.episodicMemory.sessionHistory.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    });

    // Analyze response effectiveness for future adaptation
    const responseAnalysis = {
      questionType: determineQuestionType(aiResponse),
      expectedCognitiveLoad: studentProfile.cognitiveLoad.currentLoad,
      adaptationStrategy: studentProfile.learningStyle.scaffoldingNeeds
    };

    console.log('✅ ADVANCED SOCRATIC response generated with adaptation:', responseAnalysis);

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        source: 'advanced_socratic',
        blueprintVersion: BLUEPRINT_VERSION,
        model: CLAUDE_MODEL,
        studentProfile: {
          understanding: studentProfile.knowledgeState.currentUnderstanding,
          confidence: studentProfile.knowledgeState.confidence,
          cognitiveLoad: studentProfile.cognitiveLoad.currentLoad,
          scaffoldingNeeds: studentProfile.learningStyle.scaffoldingNeeds
        },
        conversationAnalysis: responseAnalysis,
        memoryState: {
          questionSequenceLength: conversationMemory.workingMemory.questionSequence.length,
          sessionHistoryLength: conversationMemory.episodicMemory.sessionHistory.length,
          identifiedMisconceptions: conversationMemory.workingMemory.misconceptions.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in Advanced Socratic AI Study Coach:', error);
    
    // Adaptive error fallback with basic student modeling
    const adaptiveErrorResponse = `I'm your AI study coach, ready to guide your learning through thoughtful questions! 🎓

Rather than giving you direct answers, I'll help you discover knowledge through guided inquiry. This approach builds deeper understanding and critical thinking skills.

What topic or concept would you like to explore together? I'll ask questions that help you think through it step by step.`;
    
    return new Response(
      JSON.stringify({ 
        response: adaptiveErrorResponse,
        source: 'adaptive_error_fallback',
        blueprintVersion: BLUEPRINT_VERSION,
        error: error.message,
        socraticMode: true
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper functions for advanced functionality
function generateAdaptiveFallback(studentProfile: StudentProfile, message: string): string {
  const scaffoldingLevel = studentProfile.learningStyle.scaffoldingNeeds;
  const understanding = studentProfile.knowledgeState.currentUnderstanding;
  
  if (scaffoldingLevel === 'high' || understanding < 0.5) {
    return `Let's start with the basics! I notice you might benefit from breaking this down step by step. ${selectSocraticQuestion(studentProfile, message)}`;
  } else if (scaffoldingLevel === 'medium') {
    return `Good question! Instead of giving you the answer directly, let me guide you to discover it. ${selectSocraticQuestion(studentProfile, message)}`;
  } else {
    return `Excellent thinking! You seem ready for deeper exploration. ${selectSocraticQuestion(studentProfile, message)}`;
  }
}

function determineQuestionType(response: string): string {
  if (response.includes('What do you think') || response.includes('How would you')) return 'foundational';
  if (response.includes('Can you explain') || response.includes('What makes you')) return 'clarification';
  if (response.includes('What evidence') || response.includes('How did you')) return 'evidence';
  if (response.includes('What would happen') || response.includes('What are the consequences')) return 'implication';
  if (response.includes('What alternatives') || response.includes('How might someone else')) return 'perspective';
  if (response.includes('How confident') || response.includes('What would you need')) return 'metacognitive';
  return 'general';
}