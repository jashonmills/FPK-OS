import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildContextPrompt } from './prompt-builder.ts';
import { corsHeaders, CLAUDE_MODEL, MAX_TOKENS, BLUEPRINT_VERSION } from './constants.ts';
import type { ChatRequest } from './types.ts';

// Simplified AI Study Coach v6.0 - Hybrid Implementation

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ChatRequest = await req.json();
    const { message, userId, sessionId, chatMode = 'personal', voiceActive = false, clientHistory = [] } = requestData;
    
    console.log('🚀 AI STUDY COACH v6.0 HYBRID - PROCESSING:', { 
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

    // Check for Anthropic API key
    if (!anthropicApiKey) {
      const fallbackResponse = `I'm your AI study coach, ready to guide your learning through thoughtful questions! 🎓

Rather than giving you direct answers, I'll help you discover knowledge through guided inquiry. This approach builds deeper understanding and critical thinking skills.

What topic or concept would you like to explore together? I'll ask questions that help you think through it step by step.`;
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          source: 'fallback',
          blueprintVersion: BLUEPRINT_VERSION
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build contextual prompt using simplified Blueprint v6.0 system
    const contextPrompt = buildContextPrompt(
      null, // learningContext managed by backend hooks
      clientHistory,
      'personal',
      voiceActive,
      message,
      chatMode
    );
    
    console.log('🧠 HYBRID PROCESSING: Using simplified prompt system');
    console.log('🤖 Calling Anthropic Claude with Blueprint v6.0');

    // Call Anthropic API with simplified prompt
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
            content: contextPrompt
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
    const aiResponse = anthropicData.content?.[0]?.text || "Let me ask you a question to help guide your learning. What specific part of this topic would you like to explore first?";

    console.log('✅ HYBRID response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        source: 'hybrid_blueprint',
        blueprintVersion: BLUEPRINT_VERSION,
        model: CLAUDE_MODEL
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in AI Study Coach Hybrid:', error);
    
    // Simple error fallback
    const errorResponse = `I'm your AI study coach, ready to guide your learning through thoughtful questions! 🎓

Rather than giving you direct answers, I'll help you discover knowledge through guided inquiry. This approach builds deeper understanding and critical thinking skills.

What topic or concept would you like to explore together? I'll ask questions that help you think through it step by step.`;
    
    return new Response(
      JSON.stringify({ 
        response: errorResponse,
        source: 'error_fallback',
        blueprintVersion: BLUEPRINT_VERSION,
        error: error.message
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});