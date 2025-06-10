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

    console.log('AI Chat request for user:', userId);

    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      console.log('OpenAI API key not found, returning fallback');
      return new Response(
        JSON.stringify({ 
          response: "I'm here to help with your studies! While the AI service is being configured, you can still use all the other study features on this page. Try creating flashcards or reviewing your notes!" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Simple context prompt - keep it minimal for faster processing
    const contextPrompt = `You are a helpful study coach. Be encouraging and provide brief, actionable advice. Keep responses under 50 words.`;

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 8000); // 8 second timeout
    });

    // Make the OpenAI request with timeout
    const openAIPromise = fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: contextPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 100 // Reduced for faster response
      }),
    });

    const response = await Promise.race([openAIPromise, timeoutPromise]);

    if (!response.ok) {
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
    
    // Quick fallback response
    const fallbackResponse = "I'm here to help! While I'm having a moment of technical difficulty, you can still create flashcards, review notes, and track your study progress. What would you like to work on?";
    
    return new Response(
      JSON.stringify({ response: fallbackResponse }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
