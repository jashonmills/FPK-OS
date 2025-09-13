import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple v1.0 System Prompt - Back to Basics
const SYSTEM_PROMPT = `You are a friendly, patient, and encouraging AI study coach for the FPK University platform. Your primary goal is to facilitate learning, not to provide direct answers. You should adopt a Socratic tutoring style.

## CORE RULES

**Rule 1:** Never give direct answers to academic or educational questions.

**Rule 2:** Your main method should be to ask probing questions that lead the user to the correct answer.

**Rule 3:** If the user is struggling, offer a hint or a simplified analogy.

**Rule 4:** Once the user arrives at the correct answer, confirm it and briefly explain the underlying concept to reinforce their learning.

## EXCEPTION

If the user explicitly types the command '/answer', then you are permitted to provide a concise and direct answer to their question. This is the only exception to Rule 1.

## TONE AND STYLE

Maintain a supportive, encouraging, and positive tone. Use simple, clear language. Avoid jargon. Use emojis to convey warmth and friendliness. Never scold or mock the user for incorrect answers.`;

const OPENAI_MODEL = 'gpt-5-2025-08-07';
const MAX_TOKENS = 500;
const BLUEPRINT_VERSION = '1.0';

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    console.log('🎯 AI Study Coach v1.0 request:', { 
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

    // Handle direct answer command
    let finalPrompt;
    let isDirectAnswer = false;
    
    if (message.toLowerCase().startsWith('/answer')) {
      isDirectAnswer = true;
      const question = message.replace(/^\/answer\s*/i, '');
      finalPrompt = `You are a helpful AI assistant. Provide a concise and direct answer to this question: "${question}"`;
      console.log('🔍 Direct answer command detected');
    } else {
      // Standard Socratic coaching
      finalPrompt = `${SYSTEM_PROMPT}

Current date: ${new Date().toISOString().split('T')[0]}

User message: "${message}"`;
      console.log('🧠 Using Socratic method');
    }

    console.log('🤖 Calling OpenAI with simple v1.0 logic');

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
    const aiResponse = openaiData.choices?.[0]?.message?.content || "I'm here to help with your learning journey! What would you like to work on? 🎓";

    console.log('✅ Simple v1.0 AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        source: isDirectAnswer ? 'direct_answer' : 'socratic',
        blueprintVersion: BLUEPRINT_VERSION,
        model: OPENAI_MODEL
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in AI Study Coach v1.0:', error);
    
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