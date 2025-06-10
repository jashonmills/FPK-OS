
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

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

    // Check if Anthropic API key is available
    if (!anthropicApiKey) {
      console.log('Anthropic API key not found, returning fallback');
      return new Response(
        JSON.stringify({ 
          response: "I'm here to help with your studies! While the AI service is being configured, you can still use all the other study features on this page. Try creating flashcards or reviewing your notes!" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${anthropicApiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': anthropicApiKey,
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 150,
          messages: [
            {
              role: 'user',
              content: `You are a helpful study assistant. Give brief, encouraging advice in 30 words or less. Question: ${message}`
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Anthropic API error: ${response.status} - ${errorText}`);
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.content?.[0]?.text || "I'm here to help with your studies!";
      
      console.log('Claude response generated successfully');

      return new Response(
        JSON.stringify({ response: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }

  } catch (error) {
    console.error('Error in AI chat:', error);
    
    // Quick, helpful fallback responses based on common study queries
    const fallbackResponses = [
      "Try breaking your study session into 25-minute focused blocks with 5-minute breaks!",
      "Active recall works better than just re-reading. Test yourself regularly!",
      "Space out your review sessions over time for better retention.",
      "Create connections between new concepts and what you already know.",
      "Practice explaining concepts out loud to check your understanding."
    ];
    
    const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return new Response(
      JSON.stringify({ response: randomFallback }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
