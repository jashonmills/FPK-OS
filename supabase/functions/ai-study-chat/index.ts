import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, SOCRATIC_BLUEPRINT_V7, GEMINI_MODEL, MAX_TOKENS, BLUEPRINT_VERSION } from './constants.ts';
import { buildSimplePrompt, PromptType, SimplePromptContext } from './simple-prompt-selector.ts';
import type { ChatRequest } from './types.ts';

// AI Study Coach v7.0 - Google Gemini Implementation
const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');

// Log API key availability
console.log('🔐 Gemini API Key Status:', {
  hasKey: !!geminiApiKey,
  keyLength: geminiApiKey?.length || 0,
  keyPrefix: geminiApiKey?.substring(0, 10) + '...' || 'N/A',
  isValidFormat: geminiApiKey?.length > 30 || false
});

serve(async (req) => {
  const startTime = performance.now();
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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
      clientHistory = []
    } = requestBody;

    const requestParseTime = performance.now() - requestParseStart;

    console.log('🎯 Gemini AI Processing (Enhanced Timing):', {
      messageLength: message?.length || 0,
      userId: userId?.substring(0, 8) + '...' || 'unknown',
      sessionId: sessionId?.substring(0, 8) + '...' || 'none',
      promptType: promptType || 'auto-detected',
      chatMode,
      voiceActive,
      contextKeys: Object.keys(contextData),
      historyLength: clientHistory?.length || 0,
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
          blueprintVersion: BLUEPRINT_VERSION
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build simple prompt using Blueprint v7.0 system
    const promptContext: SimplePromptContext = {
      chatMode,
      voiceActive,
      userInput: message,
      quizTopic: contextData.quizTopic,
      teachingHistory: contextData.teachingHistory,
      incorrectCount: contextData.incorrectCount
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

    // Call Google Gemini API with Socratic Blueprint v7.0
    const geminiRequestStart = performance.now();
    
    console.log('📡 Making Google Gemini API request (with timeout):', {
      model: GEMINI_MODEL,
      maxTokens: MAX_TOKENS,
      promptLength: contextPrompt.length,
      apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
      timeElapsed: `${(performance.now() - startTime).toFixed(2)}ms`
    });
    
    // Add timeout to Gemini API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏰ Gemini API timeout after 15 seconds');
      controller.abort();
    }, 15000);
    
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
            parts: [{ text: SOCRATIC_BLUEPRINT_V7 }]
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
        requestTime: `${geminiRequestTime.toFixed(2)}ms`,
        totalTimeElapsed: `${(performance.now() - startTime).toFixed(2)}ms`
      });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Detailed Google Gemini API error:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Provide a contextual response based on user's question
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

      const jsonParseStart = performance.now();
      const data = await response.json();
      const jsonParseTime = performance.now() - jsonParseStart;
      
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an issue processing your request. Please try again.';

      const totalTime = performance.now() - startTime;
      console.log('✅ Gemini response generated successfully:', {
        totalProcessingTime: `${totalTime.toFixed(2)}ms`,
        jsonParseTime: `${jsonParseTime.toFixed(2)}ms`,
        responseLength: aiResponse.length
      });

      return new Response(JSON.stringify({
        response: aiResponse,
        source: 'google_gemini_v7',
        blueprintVersion: BLUEPRINT_VERSION,
        metadata: {
          model: GEMINI_MODEL,
          promptType: detectedPromptType,
          chatMode,
          voiceActive,
          contextProcessed: Object.keys(contextData),
          historyLength: clientHistory?.length || 0,
          processingTime: `${totalTime.toFixed(2)}ms`
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('⏰ Gemini API request timed out');
        const timeoutResponse = getContextualResponse(message, chatMode, 'timeout');
        
        return new Response(JSON.stringify({
          response: timeoutResponse,
          source: 'timeout_fallback',
          blueprintVersion: BLUEPRINT_VERSION,
          error: 'Request timed out after 15 seconds'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      throw fetchError;
    }

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
  
  // Quiz requests
  if (trimmed.includes('quiz me') || trimmed.includes('test me') || trimmed.includes('give me a quiz')) {
    return 'initiate_quiz';
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

// Helper function to provide contextual responses based on user input
function getContextualResponse(message: string, chatMode: string, errorType: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Math questions
  if (lowerMessage.match(/\d+\s*[\+\-\*\/]\s*\d+/) || lowerMessage.includes('what') && (lowerMessage.includes('+') || lowerMessage.includes('-') || lowerMessage.includes('*') || lowerMessage.includes('/'))) {
    const mathMatch = message.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
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
  
  // Science topics
  if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || lowerMessage.includes('biology')) {
    if (chatMode === 'personal') {
      return "Science is everywhere around us! 🔬 What specific observation or question has sparked your curiosity? Let's explore it through questioning and discovery.";
    } else {
      return "Science offers so many fascinating areas to explore! What specific phenomenon or question interests you? I'd like to guide you to discover the answer yourself.";
    }
  }
  
  // Generic greetings or simple questions
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    if (chatMode === 'personal') {
      return "Hello! I'm your AI learning coach using the Socratic method! 🎓 Instead of giving direct answers, I'll guide you to discover knowledge through thoughtful questions. What topic has sparked your curiosity today?";
    } else {
      return "Hello! I'm here to help you learn through guided questioning. Rather than just providing answers, I'll help you think through problems step by step. What would you like to explore?";
    }
  }
  
  // Error-specific responses
  if (errorType === 'api_error') {
    if (chatMode === 'personal') {
      return `I'm having a temporary connection issue, but let's use this as a learning opportunity! 🤔 About "${message}" - what do you already know or think about this topic? What questions does it raise for you?`;
    } else {
      return `I'm experiencing a technical issue, but I can still guide your learning about "${message}"! What aspect of this topic would you like to explore first through questioning?`;
    }
  }
  
  if (errorType === 'timeout') {
    if (chatMode === 'personal') {
      return `That request took longer than expected, but I haven't forgotten about "${message}"! 🕐 While I process complex questions faster, let's break this down: What specific aspect of "${message}" interests you most? Sometimes the best learning happens through focused questions!`;
    } else {
      return `The request timed out, but I can still help with "${message}"! Let's approach this step by step - what particular aspect would you like to explore first? I work best with focused, specific questions.`;
    }
  }
  
  // Default contextual responses using Socratic method
  if (chatMode === 'personal') {
    return `That's an interesting question about "${message}"! 🧠 Following the Socratic method, let me guide your thinking: What do you already know about this topic? What connections can you make to things you've learned before?`;
  } else {
    return `I'd be happy to guide you through exploring "${message}"! Rather than just telling you the answer, what do you think you already know about this? What questions does it raise for you?`;
  }
}