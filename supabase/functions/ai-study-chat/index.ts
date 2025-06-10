
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, context } = await req.json();
    
    if (!message || !userId) {
      throw new Error('Message and user ID are required');
    }

    console.log('AI Chat request for user:', userId, 'Message:', message);

    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ 
          response: "I'm sorry, but the AI chat service is not properly configured. Please contact your administrator to set up the OpenAI API key." 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context about user's learning
    const contextPrompt = `
Student Context:
- Total completed study sessions: ${context?.totalSessions || 0}
- Total flashcards created: ${context?.totalCards || 0}
- Recent insights: ${context?.recentInsights?.map(i => i.title).join(', ') || 'None yet'}

You are an AI study coach helping a student with their learning. Be encouraging, specific, and provide actionable advice.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `${contextPrompt}

You are a helpful AI study coach. Keep responses concise (2-3 sentences max), encouraging, and actionable. Focus on study strategies, learning techniques, and motivation.` 
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in AI chat:', error);
    
    // Provide a helpful fallback response
    const fallbackResponse = "I'm here to help with your studies! While I'm experiencing some technical issues right now, you can try asking me about study techniques, flashcard strategies, or learning tips. Please try your question again in a moment.";
    
    return new Response(
      JSON.stringify({ response: fallbackResponse }),
      {
        status: 200, // Return 200 instead of 500 to avoid fetch errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
