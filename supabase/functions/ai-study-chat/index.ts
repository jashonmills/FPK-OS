import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AI Study Coach Failsafe Diagnostic Blueprint v1.0-failsafe
const SYSTEM_PROMPT = `You are a friendly, patient, and encouraging AI study coach. Your primary goal is to facilitate learning through a strict Socratic method. You will not provide direct answers.

## CORE INSTRUCTION

Upon receiving any user input, you will initiate a guided session. To do this, you will rephrase the user's input as a question, then ask a simple, probing question that encourages them to think about the topic. You will never provide a summary, facts, or a list of information.`;

const OPENAI_MODEL = 'gpt-5-2025-08-07';
const MAX_TOKENS = 200;
const BLUEPRINT_VERSION = '1.0-failsafe';

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    console.log('🎯 AI Study Coach FAILSAFE DIAGNOSTIC request:', { 
      hasMessage: !!message, 
      hasUserId: !!userId, 
      message: message?.substring(0, 50) + '...'
    });
    
    if (!message || !userId) {
      throw new Error('Message and user ID are required');
    }

    // Check for OpenAI API key
    if (!openaiApiKey) {
      const fallbackResponse = `I'm here to help with your studies! 🎓 Here are some quick tips:

📖 **Reading Strategy**: Preview → Question → Read → Reflect → Review
⏰ **Time Management**: Use the Pomodoro Technique (25 min work, 5 min break)
🧠 **Memory**: Create visual associations and practice active recall
📝 **Note-taking**: Use the Cornell method for better organization

What subject are you working on? I can provide more guidance!`;
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          source: 'fallback',
          blueprintVersion: BLUEPRINT_VERSION
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Failsafe diagnostic mode - no exceptions, only Socratic rephrasing
    const finalPrompt = `${SYSTEM_PROMPT}

DIAGNOSTIC MODE: For the user message below, rephrase it as a question and then ask ONE simple probing question. Do not provide facts, summaries, or lists.

User message: "${message}"`;
    
    console.log('🔬 FAILSAFE DIAGNOSTIC MODE: Socratic rephrasing only');

    console.log('🤖 Calling OpenAI with FAILSAFE DIAGNOSTIC logic');

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'user',
            content: finalPrompt
          }
        ],
        max_completion_tokens: MAX_TOKENS,
        // Note: temperature not supported in GPT-5 models
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices?.[0]?.message?.content || "What specific aspect would you like to explore first? 🤔";

    console.log('✅ FAILSAFE DIAGNOSTIC response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        source: 'failsafe_socratic',
        blueprintVersion: BLUEPRINT_VERSION,
        model: OPENAI_MODEL,
        diagnostic: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in AI Study Coach FAILSAFE DIAGNOSTIC:', error);
    
    // Simple fallback response
    const fallbackResponse = `I'm here to help with your studies! 🎓 Here are some quick tips while I get back online:

📖 **Reading Strategy**: Preview → Question → Read → Reflect → Review
⏰ **Time Management**: Use the Pomodoro Technique (25 min work, 5 min break)
🧠 **Memory**: Create visual associations and practice active recall
📝 **Note-taking**: Use the Cornell method for better organization

What subject or topic are you working on? I can provide more specific guidance!`;
    
    return new Response(
      JSON.stringify({ 
        response: fallbackResponse,
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