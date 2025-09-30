// Packaged copy for review/apply: supabase/functions/ai-study-chat/index.ts
// This file is the post-fix (current) content. Apply script will copy this over the repo file.

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, SOCRATIC_BLUEPRINT_V8, GEMINI_MODEL, MAX_TOKENS, TIMEOUT_MS, BLUEPRINT_VERSION } from './constants.ts';
import { buildSimplePrompt, PromptType, SimplePromptContext } from './simple-prompt-selector.ts';
import type { ChatRequest } from './types.ts';
import { handleSocraticSession, type SocraticRequest } from './socratic-handler.ts';

// AI Study Coach v8.0 - Enhanced Socratic Method
const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

// Your custom OpenAI Assistant ID
const OPENAI_ASSISTANT_ID = 'asst_ZHsH0kICjxcNCKmRvd8ZUtsM';

// Log API key availability
console.log('🔐 API Key Status:', {
  hasGemini: !!geminiApiKey,
  hasOpenAI: !!openaiApiKey,
  geminiKeyLength: geminiApiKey?.length || 0,
  openaiKeyLength: openaiApiKey?.length || 0,
  assistantId: OPENAI_ASSISTANT_ID
});

serve(async (req) => {
  const startTime = performance.now();
  
  // Add basic connectivity test
  console.log('🚀 AI Study Chat function invoked:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    hasGeminiKey: !!geminiApiKey
  });
  
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    return new Response(null, { headers: corsHeaders });
  }

  // Add health check endpoint
  if (req.method === 'GET') {
    console.log('🔍 Health check requested');
    return new Response(JSON.stringify({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      blueprintVersion: BLUEPRINT_VERSION,
      hasGeminiKey: !!geminiApiKey,
      timeout: TIMEOUT_MS
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const requestParseStart = performance.now();
    const requestBody = await req.json().catch(() => ({}));
    const {
      message,
      userId,
      sessionId,
      promptType,
      contextData = {},
      chatMode = 'general',
      voiceActive = false,
      clientHistory = [],
      originalTopic,
      lessonContext,
      // Socratic session parameters
      socraticMode,
      socraticIntent,
      socraticTopic,
      socraticObjective,
      socraticSessionId,
      // OpenAI Assistant parameters
      useOpenAIAssistant = true, // Default to using OpenAI Assistant
      threadId // Optional thread ID for conversation continuity
    } = requestBody;

    const requestParseTime = performance.now() - requestParseStart;

    // Handle OpenAI Assistant requests (non-Socratic mode)
    if (useOpenAIAssistant && openaiApiKey && !socraticMode) {
      console.log('🤖 Using OpenAI Assistant:', {
        assistantId: OPENAI_ASSISTANT_ID,
        hasThreadId: !!threadId,
        messageLength: message?.length || 0,
        userId
      });

      try {
        // Create or use existing thread
        let currentThreadId = threadId;
        
        if (!currentThreadId) {
          console.log('📝 Creating new OpenAI thread...');
          const threadResponse = await fetch('https://api.openai.com/v1/threads', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json',
              'OpenAI-Beta': 'assistants=v2'
            }
          });

          if (!threadResponse.ok) {
            const errorText = await threadResponse.text();
            console.error('❌ Failed to create thread:', errorText);
            throw new Error(`Failed to create thread: ${threadResponse.status}`);
          }

          const threadData = await threadResponse.json();
          currentThreadId = threadData.id;
          console.log('✅ Created thread:', currentThreadId);
        }

        // Add message to thread
        console.log('💬 Adding message to thread:', currentThreadId);
        const messageResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
          },
          body: JSON.stringify({
            role: 'user',
            content: message
          })
        });

        if (!messageResponse.ok) {
          const errorText = await messageResponse.text();
          console.error('❌ Failed to add message:', errorText);
          throw new Error(`Failed to add message: ${messageResponse.status}`);
        }

        // Create run
        console.log('🏃 Creating run with assistant:', OPENAI_ASSISTANT_ID);
        const runResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
          },
          body: JSON.stringify({
            assistant_id: OPENAI_ASSISTANT_ID
          })
        });

        if (!runResponse.ok) {
          const errorText = await runResponse.text();
          console.error('❌ Failed to create run:', errorText);
          throw new Error(`Failed to create run: ${runResponse.status}`);
        }

        const runData = await runResponse.json();
        const runId = runData.id;
        console.log('✅ Created run:', runId);

        // Poll for completion with shorter timeout
        let runStatus = runData.status;
        let attempts = 0;
        const maxAttempts = 12; // 12 seconds max wait (less than frontend timeout)

        while (runStatus !== 'completed' && runStatus !== 'failed' && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          attempts++;

          const statusResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs/${runId}`, {
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'OpenAI-Beta': 'assistants=v2'
            }
          });

          if (!statusResponse.ok) {
            console.error('❌ Failed to check run status');
            break;
          }

          const statusData = await statusResponse.json();
          runStatus = statusData.status;
          console.log(`⏳ Run status (attempt ${attempts}):`, runStatus);
        }

        if (runStatus !== 'completed') {
          throw new Error(`Run did not complete successfully. Final status: ${runStatus}`);
        }

        // Retrieve messages
        console.log('📥 Retrieving messages from thread...');
        const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages?limit=1&order=desc`, {
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        });

        if (!messagesResponse.ok) {
          const errorText = await messagesResponse.text();
          console.error('❌ Failed to retrieve messages:', errorText);
          throw new Error(`Failed to retrieve messages: ${messagesResponse.status}`);
        }

        const messagesData = await messagesResponse.json();
        const assistantMessage = messagesData.data[0];
        const responseText = assistantMessage.content[0]?.text?.value || 'I apologize, but I encountered an issue. Please try again.';

        console.log('✅ OpenAI Assistant response received:', {
          threadId: currentThreadId,
          responseLength: responseText.length
        });

        return new Response(
          JSON.stringify({
            response: responseText,
            threadId: currentThreadId,
            source: 'openai_assistant',
            assistantId: OPENAI_ASSISTANT_ID,
            blueprintVersion: 'openai-assistant'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (error: any) {
        console.error('❌ OpenAI Assistant error - FULL DETAILS:', {
          message: error.message,
          stack: error.stack,
          error: JSON.stringify(error, null, 2)
        });
        // Fall back to Gemini if OpenAI fails
        console.log('⚠️ Falling back to Gemini due to OpenAI error...');
      }
    }

    // Handle Socratic session requests
    if (socraticMode && socraticIntent) {
      console.log('🎓 Socratic session request detected:', {
        intent: socraticIntent,
        sessionId: socraticSessionId,
        userId,
        hasTopic: !!socraticTopic,
        hasObjective: !!socraticObjective
      });

      try {
        // Create Gemini call wrapper
        const geminiCall = async (prompt: string) => {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              systemInstruction: { parts: [{ text: SOCRATIC_BLUEPRINT_V8 }] },
              generationConfig: {
                maxOutputTokens: MAX_TOKENS,
                temperature: 0.7,
                topP: 0.9
              }
            })
          });

          if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
          }

          const data = await response.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        };

        const socraticRequest: SocraticRequest = {
          sessionId: socraticSessionId,
          userId,
          orgId: contextData.orgId,
          intent: socraticIntent,
          topic: socraticTopic,
          objective: socraticObjective,
          studentResponse: message
        };

        const socraticResponse = await handleSocraticSession(socraticRequest, geminiCall);

        return new Response(
          JSON.stringify({
            ...socraticResponse,
            source: 'socratic_session',
            blueprintVersion: 'v8.0'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        console.error('❌ Socratic session error:', error);
        return new Response(
          JSON.stringify({
            error: error.message || 'Socratic session failed',
            details: error.toString()
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Extract or detect original topic from conversation
    const detectedOriginalTopic = originalTopic || extractOriginalTopic(clientHistory, message);
    
    console.log('🎯 Gemini AI Processing (Enhanced Timing):', {
      messageLength: message?.length || 0,
      userId: userId?.substring(0, 8) + '...' || 'unknown',
      sessionId: sessionId?.substring(0, 8) + '...' || 'none',
      promptType: promptType || 'auto-detected',
      chatMode,
      voiceActive,
      contextKeys: Object.keys(contextData),
      historyLength: clientHistory?.length || 0,
      originalTopic: detectedOriginalTopic || 'none',
      hasValidRequest: !!(message && userId),
      requestParseTime: `${requestParseTime.toFixed(2)}ms`,
      totalTimeElapsed: `${(performance.now() - startTime).toFixed(2)}ms`
    });

    // Enhanced validation with detailed error responses
    if (!message || typeof message !== 'string') {
      console.error('❌ Invalid message parameter:', { message, type: typeof message });
      return new Response(
        JSON.stringify({ 
          error: 'Valid message string is required',
          received: { message: typeof message, length: message?.length }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!userId || typeof userId !== 'string') {
      console.error('❌ Invalid userId parameter:', { userId, type: typeof userId });
      return new Response(
        JSON.stringify({ 
          error: 'Valid userId string is required',
          received: { userId: typeof userId }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Auto-detect promptType if missing
    let detectedPromptType = promptType;
    if (!promptType || typeof promptType !== 'string') {
      console.log('🔍 Auto-detecting promptType from message and history...');
      detectedPromptType = autoDetectPromptType(message, clientHistory);
      console.log(`🎯 Auto-detected promptType: ${detectedPromptType}`);
    }

    // Handle missing API key gracefully
    if (!geminiApiKey) {
      console.log('⚠️  GOOGLE_GEMINI_API_KEY not configured - using fallback response');
      const fallbackResponse = getContextualResponse(message, chatMode, 'no_api_key');
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          source: 'no_api_key_fallback',
          blueprintVersion: BLUEPRINT_VERSION,
          debug: {
            hasMessage: !!message,
            messageLength: message?.length || 0,
            chatMode,
            functionWorking: true
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Test mode: If message starts with "test", return immediately without API call
    if (message.toLowerCase().startsWith('test')) {
      console.log('🧪 Test mode activated - skipping API call');
      return new Response(
        JSON.stringify({ 
          response: `Test successful! I received your message: "${message}". The AI function is working properly. Try asking a real question now!`,
          source: 'test_mode',
          blueprintVersion: BLUEPRINT_VERSION,
          debug: {
            hasGeminiKey: !!geminiApiKey,
            functionWorking: true,
            processingTime: `${(performance.now() - startTime).toFixed(2)}ms`
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build conversation history summary
    const conversationSummary = buildConversationSummary(clientHistory);
    
    // Build simple prompt using Blueprint v4.2 system
    const promptContext: SimplePromptContext = {
      chatMode,
      voiceActive,
      userInput: message,
      quizTopic: contextData.quizTopic,
      teachingHistory: contextData.teachingHistory,
      incorrectCount: contextData.incorrectCount,
      originalTopic: detectedOriginalTopic,
      conversationHistory: conversationSummary,
      lessonContent: lessonContext?.lessonContent,
      lessonTitle: lessonContext?.lessonTitle,
      courseId: lessonContext?.courseId,
      lessonId: lessonContext?.lessonId,
    };

    const contextPrompt = buildSimplePrompt(detectedPromptType as PromptType, promptContext);

    console.log('📝 Simple prompt generated:', { 
      type: detectedPromptType, 
      length: contextPrompt.length,
      context: {
        hasUserInput: !!message,
        voiceActive,
        chatMode,
        contextDataKeys: Object.keys(contextData)
      }
    });

    // Call Google Gemini API with Socratic Blueprint v4.4 and retry logic
    const geminiRequestStart = performance.now();
    
    console.log('📡 Making Google Gemini API request (with timeout and retry):', {
      model: GEMINI_MODEL,
      maxTokens: MAX_TOKENS,
      promptLength: contextPrompt.length,
      apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
      timeElapsed: `${(performance.now() - startTime).toFixed(2)}ms`
    });
    
    // Retry configuration
    const maxRetries = 2;
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Gemini API attempt ${attempt}/${maxRetries}`);
      
      // Add timeout to Gemini API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.error(`⏰ Gemini API timeout after ${TIMEOUT_MS/1000} seconds (attempt ${attempt})`);
        controller.abort();
      }, TIMEOUT_MS);
      
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: contextPrompt }]
            }],
            systemInstruction: {
              parts: [{ text: SOCRATIC_BLUEPRINT_V8 }]
            },
            generationConfig: {
              maxOutputTokens: MAX_TOKENS,
              temperature: 0.7,
              topP: 0.9,
              topK: 40
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH", 
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const geminiRequestTime = performance.now() - geminiRequestStart;
        
        console.log('📡 Google Gemini API response received:', {
          status: response.status,
          attempt,
          requestTime: `${geminiRequestTime.toFixed(2)}ms`,
          totalTimeElapsed: `${(performance.now() - startTime).toFixed(2)}ms`
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Gemini API error (attempt ${attempt}):`, {
            status: response.status,
            statusText: response.statusText,
            errorBody: errorText,
            attempt,
            willRetry: attempt < maxRetries
          });
          
          lastError = new Error(`API Error ${response.status}: ${response.statusText}`);
          
          // If this is the last attempt, provide contextual response
          if (attempt === maxRetries) {
            const contextualResponse = getContextualResponse(message, chatMode, 'api_error');
            
            return new Response(JSON.stringify({
              response: contextualResponse,
              source: 'api_error_fallback',
              blueprintVersion: BLUEPRINT_VERSION,
              error: `API Error ${response.status}: ${response.statusText}`,
              apiKeyStatus: {
                hasKey: !!geminiApiKey,
                keyLength: geminiApiKey?.length || 0,
                isValidFormat: geminiApiKey?.length > 30 || false
              }
            }), {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue; // Try next attempt
        }

        // Success! Process the response
        const jsonParseStart = performance.now();
        const data = await response.json();
        const jsonParseTime = performance.now() - jsonParseStart;
        
        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an issue processing your request. Please try again.';

        const totalTime = performance.now() - startTime;
        console.log('✅ Gemini response generated successfully:', {
          totalProcessingTime: `${totalTime.toFixed(2)}ms`,
          jsonParseTime: `${jsonParseTime.toFixed(2)}ms`,
          responseLength: aiResponse.length,
          attempt,
          success: true
        });

        return new Response(JSON.stringify({
          response: aiResponse,
          source: 'google_gemini_v4.4',
          blueprintVersion: BLUEPRINT_VERSION,
          metadata: {
            model: GEMINI_MODEL,
            promptType: detectedPromptType,
            chatMode,
            voiceActive,
            contextProcessed: Object.keys(contextData),
            historyLength: clientHistory?.length || 0,
            processingTime: `${totalTime.toFixed(2)}ms`,
            attempt,
            retryLogic: 'enabled'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error(`⏰ Gemini API request timed out after ${TIMEOUT_MS/1000} seconds (attempt ${attempt})`, {
            message: message.substring(0, 100),
            chatMode,
            promptType: detectedPromptType,
            totalTime: `${(performance.now() - startTime).toFixed(2)}ms`,
            attempt,
            willRetry: attempt < maxRetries
          });
          
          lastError = new Error(`Request timed out after ${TIMEOUT_MS/1000} seconds`);
          
          // If this is the last attempt, return timeout response
          if (attempt === maxRetries) {
            const timeoutResponse = getContextualResponse(message, chatMode, 'timeout');
            
            return new Response(JSON.stringify({
              response: timeoutResponse,
              source: 'timeout_fallback',
              blueprintVersion: BLUEPRINT_VERSION,
              error: `Request timed out after ${TIMEOUT_MS/1000} seconds`,
              retryAdvice: 'Please try rephrasing your question more concisely or try again in a moment.',
              attemptsExhausted: maxRetries
            }), {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue; // Try next attempt
        }
        
        // Other fetch errors
        console.error(`❌ Fetch error (attempt ${attempt}):`, fetchError);
        lastError = fetchError;
        
        if (attempt === maxRetries) {
          throw fetchError; // Let it fall through to main error handler
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        continue; // Try next attempt
      }
    }
    
    // This should never be reached, but just in case
    throw lastError || new Error('All retry attempts failed');

  } catch (error) {
    console.error('❌ Error in ai-study-chat function:', error);
    
    // Enhanced error logging
    console.error('❌ Full error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      chatMode: chatMode || 'general',
      promptType,
      messageLength: message?.length || 0
    });

    // Provide contextual error response
    const errorResponse = getContextualResponse(message, chatMode || 'general', 'system_error');
    
    return new Response(JSON.stringify({
      response: errorResponse,
      source: 'system_error_fallback',
      blueprintVersion: BLUEPRINT_VERSION,
      error: error.message
    }), {
      status: 200, // Return 200 to avoid client-side errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Auto-detect prompt type based on message content and conversation history
function autoDetectPromptType(message: string, history: any[]): string {
  const trimmed = message.toLowerCase().trim();
  
  // Direct answer command
  if (trimmed.startsWith('/answer')) {
    return 'direct_answer';
  }
  
  // Session ending signals
  if (isSessionEndingSignal(trimmed)) {
    return 'end_session';
  }
  
  // Topic transition requests
  if (isTopicTransitionRequest(trimmed)) {
    return 'topic_transition';
  }
  
  // Gratitude expressions (when not followed by new topic)
  if (isGratitudeExpression(trimmed) && !isTopicTransitionRequest(trimmed)) {
    return 'acknowledgment';
  }
  
  // Quiz requests
  if (trimmed.includes('quiz me') || trimmed.includes('test me') || trimmed.includes('give me a quiz')) {
    return 'initiate_quiz';
  }
  
  // Detect simple, foundational questions that need direct teaching first
  const isSimpleFoundational = isSimpleFoundationalQuestion(trimmed);
  if (isSimpleFoundational && (!history || history.length === 0)) {
    return 'direct_teaching';
  }
  
  // Struggle indicators
  const struggleIndicators = ['help', 'stuck', 'confused', 'don\'t understand', 'don\'t know'];
  if (struggleIndicators.some(indicator => trimmed.includes(indicator))) {
    return 'proactive_help';
  }
  
  // Check if user is responding to a previous question
  if (history && history.length > 0) {
    const lastAIMessage = history.filter(m => m.role === 'assistant').pop();
    if (lastAIMessage?.content?.includes('?')) {
      // User is likely answering a question
      return 'evaluate_answer';
    }
  }
  
  // Default to session initiation
  return 'initiate_session';
}

// Detection functions for session management
function isSessionEndingSignal(message: string): boolean {
  const endingSignals = [
    'i think i\'m done',
    'i\'m done',
    'that\'s enough',
    'i\'m finished',
    'i need to go',
    'thanks, that\'s all',
    'goodbye',
    'bye',
    'see you later',
    'i\'ll stop here',
    'enough for now',
    'i\'m good'
  ];
  
  return endingSignals.some(signal => message.includes(signal));
}

function isTopicTransitionRequest(message: string): boolean {
  const transitionPatterns = [
    'can we go over',
    'let\'s switch to',
    'let\'s talk about',
    'tell me about',
    'what about',
    'how about',
    'let\'s move to',
    'can we discuss',
    'i want to learn about',
    'explain',
    'teach me about'
  ];
  
  return transitionPatterns.some(pattern => message.includes(pattern));
}

function isGratitudeExpression(message: string): boolean {
  const gratitudePatterns = [
    'thank you',
    'thanks',
    'appreciate',
    'grateful',
    'that helped',
    'that\'s helpful',
    'nice',
    'good'
  ];
  
  // Only consider it gratitude if it\'s a short message focused on appreciation
  if (message.length > 50) return false;
  
  return gratitudePatterns.some(pattern => message.includes(pattern));
}

function isSimpleFoundationalQuestion(message: string): boolean {
  const simplePatterns = [
  /^\s*\d+\s*[+\-*/]\s*\d+\s*$/,  // Basic math like "2+2"
    /^what\s+(is|are)\s+\w+(\s+\w+){0,3}\??$/i,  // "What is water?"
    /^how\s+much\s+(is|are)\s+\w+(\s+\w+){0,3}\??$/i,  // "How much is 5+5?"
    /^what\s+color\s+(is|are)\s+\w+(\s+\w+){0,3}\??$/i,  // "What color is the sky?"
    /^where\s+(is|are)\s+\w+(\s+\w+){0,3}\??$/i,  // "Where is Paris?"
  ];
  
  return simplePatterns.some(pattern => pattern.test(message.trim()));
}

function extractOriginalTopic(clientHistory: any[], currentMessage: string): string | null {
  // If this is a topic transition request, extract the new topic from current message
  const trimmed = currentMessage.toLowerCase().trim();
  if (isTopicTransitionRequest(trimmed)) {
    // Reset and extract new topic from the transition request
    return extractTopicFromMessage(currentMessage);
  }
  
  // If this is the first user message, extract topic from it
  if (clientHistory.length === 0) {
    return extractTopicFromMessage(currentMessage);
  }
  
  // Look for the first user message to determine original topic
  const firstUserMessage = clientHistory.find(msg => msg.role === 'user');
  if (firstUserMessage) {
    return extractTopicFromMessage(firstUserMessage.content);
  }
  
  return null;
}

function extractTopicFromMessage(message: string): string | null {
  const trimmed = message.toLowerCase().trim();
  
  // Filter out greetings and social interactions that aren't learning topics
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'sup', 'what\'s up', 'how are you', 'ok', 'okay', 'yes', 'no', 'yeah', 'yep', 'sure', 'alright'];
  if (greetings.some(greeting => trimmed === greeting || trimmed === greeting + '!')) {
    return null;
  }
  
  // Single words or very short phrases aren't usually learning topics
  if (trimmed.length <= 3 || !trimmed.includes(' ') && !trimmed.includes('?')) {
    return null;
  }
  
  // Extract topics from explicit learning requests
  const topicPatterns = [
    /(?:learn about|tell me about|explain|teach me about|what (?:is|are)|how (?:does|do|to))\s+(.+?)(?:\?|$)/i,
    /^(.+?\?)/i  // Questions only
  ];
  
  for (const pattern of topicPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const topic = match[1].trim();
      // Validate topic has some substance
      if (topic.length > 2 && !greetings.includes(topic.toLowerCase())) {
        return topic;
      }
    }
  }
  
  return null;
}

function buildConversationSummary(clientHistory: any[]): string {
  if (clientHistory.length === 0) return '';
  
  // Take last 3 messages and compress them
  const recentHistory = clientHistory.slice(-3);
  return recentHistory
    .map(msg => {
      const content = msg.content.length > 80 ? msg.content.substring(0, 80) + '...' : msg.content;
      return `${msg.role}: ${content}`;
    })
    .join('\n');
}

// Helper function to provide contextual responses based on user input
function getContextualResponse(message: string, chatMode: string, errorType: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Math questions
  if (lowerMessage.match(/\d+\s*[+\-*/]\s*\d+/) || lowerMessage.includes('what') && (lowerMessage.includes('+') || lowerMessage.includes('-') || lowerMessage.includes('*') || lowerMessage.includes('/'))) {
    const mathMatch = message.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
    if (mathMatch) {
      const [, num1, op, num2] = mathMatch;
      const a = parseInt(num1), b = parseInt(num2);
      let result;
      switch(op) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = b !== 0 ? a / b : 'undefined (cannot divide by zero)'; break;
      }
      
      if (chatMode === 'personal') {
        return `Great math question! Let me guide your thinking about ${num1} ${op} ${num2}. Instead of just giving you the answer, what do you think happens when we ${op === '+' ? 'combine' : op === '-' ? 'take away' : op === '*' ? 'repeatedly add' : 'split up'} these numbers? 🧮`;
      } else {
        return `I see you're working on ${num1} ${op} ${num2}. Rather than just telling you the answer, can you think about what this operation means? What strategy could you use to solve it?`;
      }
    }
  }

  // Cloud/weather topics
  if (lowerMessage.includes('cloud') || lowerMessage.includes('weather') || lowerMessage.includes('sky')) {
    if (chatMode === 'personal') {
      return "I'd love to guide your exploration of clouds! 🌤️ Let's start with what fascinates you most: When you look up at the sky, what do you notice about the clouds? What questions come to mind?";
    } else {
      return "Clouds are fascinating! ☁️ Rather than explaining everything at once, let's explore together. What have you observed about clouds that makes you curious?";
    }
  }

  // Default fallback response
  return "That's an interesting question! Let's explore it together. What specifically would you like to understand better?";
}
