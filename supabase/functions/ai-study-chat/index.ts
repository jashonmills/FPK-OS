import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, SYSTEM_PROMPT, OPENAI_MODEL, MAX_TOKENS, BLUEPRINT_VERSION } from './constants.ts';

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
    } else {
      // Standard Socratic coaching
      finalPrompt = `${SYSTEM_PROMPT}

Current date: ${new Date().toISOString().split('T')[0]}

User message: "${message}"`;
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