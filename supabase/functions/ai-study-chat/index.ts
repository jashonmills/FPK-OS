
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, SYSTEM_PROMPT_PERSONAL, SYSTEM_PROMPT_GENERAL, CLAUDE_MODEL, OPENAI_MODEL, BLUEPRINT_PROMPTS } from './constants.ts';
import { ChatRequest, QueryMode } from './types.ts';
import { getLearningContext, getChatHistory } from './context.ts';
import { detectQueryMode, detectRecentFlashcardsRequest, detectStudySessionRequest } from './mode-detection.ts';
import { callClaude, callOpenAI, handleToolCalls, postProcessResponse } from './claude-client.ts';
import { RAGIntegration } from './rag-integration.ts';
import { 
  detectSessionState, 
  buildPromptForState, 
  getSession, 
  createSession, 
  updateSession,
  createSessionContext,
  SessionState,
  SessionStateType
} from './session-management.ts';

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

// Initialize RAG integration
const ragIntegration = new RAGIntegration();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, sessionId, chatMode = 'personal', voiceActive = false, metadata }: ChatRequest = await req.json();
    
    console.log('🎯 Enhanced AI Coach with RAG request:', { 
      hasMessage: !!message, 
      hasUserId: !!userId, 
      chatMode,
      voiceActive,
      hasSessionId: !!sessionId,
      message: message.substring(0, 100) + '...'
    });

    // Add debugging checkpoints
    console.log('🔍 Debug checkpoint 1: Request received');
    
    if (!message || !userId) {
      throw new Error('Message and user ID are required');
    }

    // Mode-specific fallback handling
    if (chatMode === 'general' && !openaiApiKey) {
      const fallbackResponse = voiceActive 
        ? "I need an OpenAI API key to access General Knowledge mode. Please switch to My Data mode or configure the OpenAI API key."
        : "🌐 General Knowledge mode requires OpenAI API configuration. Switch to My Data mode for personalized guidance, or ask an admin to configure OpenAI API access.";
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          voiceEnabled: voiceActive,
          error: 'openai_key_missing'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (chatMode === 'personal' && !anthropicApiKey) {
      const fallbackResponse = voiceActive 
        ? "I need an Anthropic API key to access your personal data. Please switch to General Knowledge mode or configure the Anthropic API key."
        : "🔒 My Data mode requires Anthropic API configuration. Switch to General Knowledge mode for general questions, or ask an admin to configure Anthropic API access.";
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          voiceEnabled: voiceActive,
          error: 'anthropic_key_missing'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine model and API based on chat mode
    const useOpenAI = chatMode === 'general';
    const model = useOpenAI ? OPENAI_MODEL : CLAUDE_MODEL;
    
    console.log(`🤖 Using ${useOpenAI ? 'OpenAI' : 'Claude'} model: ${model} for ${chatMode} mode with RAG enhancement`);

    // Context isolation and mode-specific data fetching
    console.log('🔍 Debug checkpoint 2: Starting context fetching');
    let queryMode: QueryMode;
    let learningContext: any = null;
    let chatHistory: any[] = [];

    if (chatMode === 'personal') {
      // Personal mode: detect query mode and get personal data
      queryMode = detectQueryMode(message);
      console.log('🧠 Query mode detected:', queryMode);
      
      const isRecentFlashcardsRequest = detectRecentFlashcardsRequest(message);
      if (isRecentFlashcardsRequest) {
        console.log('📚 Recent flashcards request detected - ensuring tool usage');
      }
      
      [learningContext, chatHistory] = await Promise.all([
        getLearningContext(userId),
        sessionId ? getChatHistory(sessionId, 6) : Promise.resolve([])
      ]);
    } else {
      // General mode: detect platform vs general knowledge queries
      queryMode = detectQueryMode(message);
      chatHistory = sessionId ? await getChatHistory(sessionId, 6) : [];
      console.log(`🌐 General mode - detected query type: ${queryMode}`);
    }

    // **BLUEPRINT-BASED SESSION MANAGEMENT** - Structured conversation states
    console.log('🔍 Debug checkpoint 3: Implementing AI Study Coach Blueprint v3.1');
    
    // Get or create session state
    let session: SessionState;
    if (sessionId) {
      session = getSession(userId, sessionId) || createSession(userId, sessionId);
    } else {
      session = createSession(userId, `temp_${Date.now()}`);
    }
    
    // Update session metadata
    session = updateSession(session, {
      metadata: {
        ...session.metadata,
        isVoiceActive: voiceActive
      }
    });
    
    // Detect current session state based on message and history
    const detectedState = detectSessionState(message, chatHistory);
    console.log(`🎯 Session state detected: ${detectedState}`);
    
    // Handle direct answer command
    if (detectedState === 'direct_answer_mode') {
      console.log('🔍 Direct answer command detected');
      const enhancedPrompt = buildPromptForState(detectedState, message, session.context, chatHistory);
      session = updateSession(session, { 
        currentState: detectedState,
        context: { ...session.context, originalQuestion: message.replace(/^\/answer\s*/i, '') }
      });
    } else {
      // Update session state and context based on detection
      session = updateSession(session, { currentState: detectedState });
      
      // Build context based on session state
      if (detectedState === 'quiz_active' && !session.context.quizTopic) {
        // Starting new quiz
        const quizTopic = extractQuizTopic(message);
        session = updateSession(session, {
          context: { 
            ...session.context, 
            quizTopic,
            originalQuestion: message,
            teachingHistory: []
          }
        });
        console.log(`🔍 New quiz initiated on topic: ${quizTopic}`);
      } else if (detectedState === 'study_session_active') {
        // Starting study session
        const studyTopic = extractStudyTopic(message);
        session = updateSession(session, {
          context: { 
            ...session.context, 
            studyTopic,
            originalQuestion: message,
            teachingHistory: []
          }
        });
        console.log(`🔍 Study session initiated on topic: ${studyTopic}`);
      } else if (detectedState === 'awaiting_answer' && chatHistory.length > 0) {
        // User is answering a previous question
        const lastAIMessage = chatHistory[chatHistory.length - 1];
        if (lastAIMessage?.role === 'assistant') {
          session = updateSession(session, {
            context: { 
              ...session.context, 
              lastAIQuestion: lastAIMessage.content
            }
          });
        }
      } else if (detectedState === 'new_session') {
        // Starting new academic session
        session = updateSession(session, {
          context: createSessionContext(message, extractTopic(message))
        });
        console.log('🔍 New academic session initiated');
      }
    }
    
    // Build structured prompt based on session state
    const enhancedPrompt = buildPromptForState(detectedState, message, session.context, chatHistory);
    
    // Add voice mode and date context
    let finalPrompt = enhancedPrompt;
    if (voiceActive) {
      finalPrompt += '\n\nVOICE MODE: Keep responses conversational and under 200 words.';
    }
    finalPrompt += `\n\nCURRENT DATE: ${new Date().toISOString().split('T')[0]}`;
    
    console.log('🔍 Debug checkpoint 4: Blueprint-based prompt built');
    
    let ragMetadata = { ragEnabled: false, blueprintVersion: '3.1', sessionState: detectedState };

    // Prepare messages for AI with proper typing
    const messages = [{
      role: 'user' as const,
      content: finalPrompt
    }];

    // Initial call to appropriate AI service with timeout protection
    console.log('🔍 Debug checkpoint 5: About to call AI service');
    let data;
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI service timeout')), 25000) // 25 second timeout
    );

    try {
      if (useOpenAI) {
        data = await Promise.race([
          callOpenAI(messages, model, chatMode),
          timeoutPromise
        ]);
      } else {
        data = await Promise.race([
          callClaude(messages, model, chatMode),
          timeoutPromise
        ]);
      }
      console.log('🔍 Debug checkpoint 6: AI service responded successfully');
    } catch (error) {
      console.error('❌ AI service error or timeout:', error);
      // Blueprint-based fallback responses
      if (detectedState === 'quiz_active') {
        const quizTopic = session.context.quizTopic || 'the topic';
        data = {
          content: `I'd love to quiz you on ${quizTopic}! Let's start with a foundational question: What do you already know about ${quizTopic}? Share whatever comes to mind - there are no wrong answers here!`,
          stop_reason: 'fallback'
        };
        console.log('✅ Used blueprint fallback quiz response');
      } else if (detectedState === 'study_session_active') {
        const studyTopic = session.context.studyTopic || 'your chosen subject';
        data = {
          content: `I'm excited to help you study ${studyTopic}! To get started, what specific area would you like to focus on? This will help me tailor our session to your needs.`,
          stop_reason: 'fallback'
        };
        console.log('✅ Used blueprint fallback study session response');
      } else {
        throw error;
      }
    }
    
    // Update session after successful AI response
    if (data.content) {
      session = updateSession(session, {
        context: {
          ...session.context,
          lastAIQuestion: data.content.includes('?') ? data.content : undefined
        }
      });
    }
    
    console.log('📨 AI response received:', { 
      hasContent: !!data.content, 
      contentLength: data.content?.length,
      stopReason: data.stop_reason,
      model,
      chatMode,
      sessionState: detectedState,
      blueprintVersion: '3.1',
      aiProvider: useOpenAI ? 'OpenAI' : 'Claude',
      ragEnhanced: ragMetadata.ragEnabled || false
    });

    // Handle tool usage (only for Claude/personal mode currently)
    if (!useOpenAI && data.stop_reason === 'tool_use') {
      const toolResults = await handleToolCalls(data, userId, chatMode);
      
      if (toolResults.length > 0) {
        console.log('🔄 Sending tool results back to Claude...');

        const finalMessages = [
          ...messages,
          {
            role: 'assistant',
            content: data.content
          },
          {
            role: 'user',
            content: toolResults
          }
        ];

        const finalData = await callClaude(finalMessages, model, chatMode);
        let aiResponse = finalData.content?.[0]?.text || "I've analyzed your request with enhanced knowledge and I'm here to help guide your learning journey! 📚";
        
        aiResponse = postProcessResponse(aiResponse, chatMode);
        
        console.log('✅ Final blueprint-enhanced AI response generated successfully with tool data');

        return new Response(
          JSON.stringify({ 
            response: aiResponse,
            voiceEnabled: voiceActive,
            toolsUsed: true,
            queryMode,
            chatMode,
            model,
            sessionState: detectedState,
            blueprintVersion: '3.1',
            aiProvider: 'Claude',
            hasPersonalData: chatMode === 'personal' && queryMode === 'personal',
            ragMetadata
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Direct response handling
    let aiResponse;
    if (useOpenAI) {
      // OpenAI response format
      aiResponse = data.choices?.[0]?.message?.content || "I'm here to help you explore any topic with enhanced knowledge access! What would you like to learn about? 🌟";
    } else {
      // Claude response format
      aiResponse = data.content?.[0]?.text || "I'm here to guide your personalized learning journey with enhance knowledge retrieval! What would you like to work on together? 📚";
    }
    
    // Post-process the response
    aiResponse = postProcessResponse(aiResponse, chatMode);
    
    console.log('✅ Direct blueprint-enhanced AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        voiceEnabled: voiceActive,
        toolsUsed: false,
        queryMode,
        chatMode,
        model,
        sessionState: detectedState,
        blueprintVersion: '3.1',
        aiProvider: useOpenAI ? 'OpenAI' : 'Claude',
        hasPersonalData: chatMode === 'personal',
        ragMetadata
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Error in Blueprint-enhanced AI coach function:', error);
    
    const smartFallback = "I'm here to support your learning journey with the AI Study Coach Blueprint! 🎯 I can help with quizzes, study sessions, Socratic learning, and more. What would you like to explore?";
    
    return new Response(
      JSON.stringify({ 
        response: smartFallback,
        error: 'fallback_mode',
        blueprintVersion: '3.1',
        ragMetadata: { ragEnabled: false, error: 'System error' }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Utility functions for session management
function extractQuizTopic(message: string): string {
  const quizKeywords = BLUEPRINT_PROMPTS.initiate_quiz.keywords_to_recognize || [];
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
  const studyKeywords = BLUEPRINT_PROMPTS.initiate_study_session.keywords_to_recognize || [];
  for (const keyword of studyKeywords) {
    const regex = new RegExp(`${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(.+)`, 'i');
    const match = message.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

function extractTopic(message: string): string {
  // Simple topic extraction for new academic questions
  const words = message.toLowerCase().split(' ');
  const commonQuestionWords = ['what', 'how', 'why', 'when', 'where', 'is', 'are', 'can', 'do', 'does'];
  const meaningfulWords = words.filter(word => 
    word.length > 3 && 
    !commonQuestionWords.includes(word) &&
    !/[^\w\s]/.test(word)
  );
  return meaningfulWords.slice(0, 3).join(' ') || 'general topic';
}
