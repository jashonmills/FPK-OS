import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, CLAUDE_MODEL, MAX_TOKENS, BLUEPRINT_VERSION } from './constants.ts';
import { buildSimplePrompt, PromptType, SimplePromptContext } from './simple-prompt-selector.ts';
import type { ChatRequest } from './types.ts';

// Simplified AI Study Coach v6.0 - Hybrid Implementation

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

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

    // Call Anthropic API
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Anthropic API error:', response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
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
    
    const errorResponse = (chatMode || 'general') === 'personal'
      ? "I'm here to guide your learning journey! 🧭 While I work through a technical issue, let me ask: What's one thing you're curious about today? What draws your attention and makes you want to learn more?"
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