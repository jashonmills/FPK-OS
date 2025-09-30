import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔑 OpenAI Key length:', openaiApiKey.length);
    console.log('🔑 OpenAI Key prefix:', openaiApiKey.substring(0, 8));

    // List all assistants accessible by this API key
    const response = await fetch('https://api.openai.com/v1/assistants?limit=100', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    const data = await response.json();

    console.log('📋 OpenAI Response Status:', response.status);
    console.log('📋 Assistants found:', data.data?.length || 0);
    
    if (data.data) {
      data.data.forEach((assistant: any) => {
        console.log(`  - ${assistant.name} (${assistant.id})`);
      });
    }

    // Also try to fetch the specific assistant
    const targetId = 'asst_ZHsH0kICjxcNCKmRvd8ZUtsM';
    console.log(`\n🎯 Trying to fetch specific assistant: ${targetId}`);
    
    const specificResponse = await fetch(`https://api.openai.com/v1/assistants/${targetId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    const specificData = await specificResponse.json();
    console.log('🎯 Specific assistant response:', specificResponse.status);
    console.log('🎯 Specific assistant data:', JSON.stringify(specificData, null, 2));

    return new Response(
      JSON.stringify({
        keyPrefix: openaiApiKey.substring(0, 8),
        keyLength: openaiApiKey.length,
        listResponse: {
          status: response.status,
          assistantsFound: data.data?.length || 0,
          assistants: data.data?.map((a: any) => ({
            id: a.id,
            name: a.name,
            model: a.model
          })) || []
        },
        specificAssistantResponse: {
          status: specificResponse.status,
          found: specificResponse.status === 200,
          data: specificData
        }
      }, null, 2),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
