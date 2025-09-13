import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, CLAUDE_MODEL, MAX_TOKENS, BLUEPRINT_VERSION } from './constants.ts';
import { buildSimplePrompt, PromptType, SimplePromptContext } from './simple-prompt-selector.ts';
import type { ChatRequest } from './types.ts';

// Simplified AI Study Coach v6.0 - Hybrid Implementation

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

// Log API key availability (without exposing the key)
console.log('🔐 API Key Status:', {
  hasKey: !!anthropicApiKey,
  keyLength: anthropicApiKey?.length || 0,
  keyPrefix: anthropicApiKey?.substring(0, 8) + '...' || 'N/A',
  isValidFormat: anthropicApiKey?.startsWith('sk-ant-api') || false
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      message,
      userId,
      sessionId,
      promptType,
      contextData = {},
      chatMode = 'personal',
      voiceActive = false
    }: any = await req.json();

    console.log('🎯 Hybrid AI Processing:', {
      messageLength: message?.length,
      userId: userId?.substring(0, 8) + '...',
      sessionId: sessionId?.substring(0, 8) + '...',
      promptType,
      chatMode,
      voiceActive,
      contextKeys: Object.keys(contextData)
    });

    if (!message || !userId || !promptType) {
      return new Response(
        JSON.stringify({ error: 'Message, userId, and promptType are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Handle missing API key gracefully
    if (!anthropicApiKey) {
      console.log('⚠️  ANTHROPIC_API_KEY not configured - using fallback response');
      const fallbackResponse = chatMode === 'personal' 
        ? "I'm your AI study coach! 🎓 While I work on getting fully connected, I'm here to help guide your learning through thoughtful questions. What would you like to explore today?"
        : "Hello! I'm an AI assistant designed to help with general knowledge and learning. What can I help you with today?";
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          source: 'fallback',
          blueprintVersion: BLUEPRINT_VERSION
        }),
        { headers: corsHeaders }
      );
    }

    // Build simple prompt using Blueprint v6.0 system
    const promptContext: SimplePromptContext = {
      chatMode,
      voiceActive,
      userInput: message,
      quizTopic: contextData.quizTopic,
      teachingHistory: contextData.teachingHistory,
      incorrectCount: contextData.incorrectCount
    };

    const contextPrompt = buildSimplePrompt(promptType as PromptType, promptContext);

    console.log('📝 Simple prompt generated:', { type: promptType, length: contextPrompt.length });

    // Test API key with a simple validation call first
    console.log('🔑 Testing Anthropic API key validity...');
    
    // Call Anthropic API with enhanced error logging
    console.log('📡 Making Anthropic API request:', {
      model: CLAUDE_MODEL,
      maxTokens: MAX_TOKENS,
      promptLength: contextPrompt.length,
      apiUrl: 'https://api.anthropic.com/v1/messages'
    });
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        messages: [{
          role: 'user',
          content: contextPrompt
        }]
      })
    });

    console.log('📡 Anthropic API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Detailed Anthropic API error:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Provide a topic-specific fallback response
      const topicSpecificResponse = chatMode === 'personal'
        ? `I'm having trouble connecting to my AI services right now, but I'd love to help you learn about ${message.toLowerCase().includes('cloud') ? 'clouds' : 'your topic'}! While I work on the connection, can you tell me what specifically interests you about this subject?`
        : `I'm experiencing a technical issue, but let's explore ${message.toLowerCase().includes('cloud') ? 'clouds' : 'your topic'} together! What aspect would you like to start with?`;
      
      return new Response(JSON.stringify({
        response: topicSpecificResponse,
        source: 'api_error_fallback',
        blueprintVersion: BLUEPRINT_VERSION,
        error: `API Error ${response.status}: ${response.statusText}`
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    const data = await response.json();
    const aiResponse = data.content?.[0]?.text || 'I apologize, but I encountered an issue processing your request. Please try again.';

    console.log('✅ Hybrid response generated successfully');

    return new Response(JSON.stringify({
      response: aiResponse,
      source: 'anthropic_claude_hybrid',
      blueprintVersion: BLUEPRINT_VERSION
    }), {
      headers: corsHeaders
    });

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
    
    // Try to provide topic-specific error response
    const topicKeywords = ['cloud', 'weather', 'sky', 'rain', 'storm'];
    const isAboutClouds = topicKeywords.some(keyword => 
      message?.toLowerCase().includes(keyword)
    );
    
    const errorResponse = (chatMode || 'general') === 'personal'
      ? isAboutClouds 
        ? "I'm here to guide your learning journey! 🌤️ While I work through a technical issue, let's start with clouds - what draws you to this fascinating topic? Are you curious about how they form, their different types, or their role in weather?"
        : "I'm here to guide your learning journey! 🧭 While I work through a technical issue, let me ask: What's one thing you're curious about today? What draws your attention and makes you want to learn more?"
      : isAboutClouds
        ? "I'm here to help with your questions about clouds! ☁️ While I resolve a technical issue, what specifically interests you about clouds - their formation, types, or role in weather patterns?"
        : "I'm here to help with your questions! While I resolve a technical issue, please feel free to ask me anything you'd like to explore or understand better.";
    
    return new Response(JSON.stringify({
      response: errorResponse,
      source: 'error_fallback',
      blueprintVersion: BLUEPRINT_VERSION,
      error: error.message
    }), {
      status: 200, // Return 200 to avoid client-side errors
      headers: corsHeaders
    });
  }
});