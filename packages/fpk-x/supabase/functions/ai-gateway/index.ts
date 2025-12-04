import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIRequest {
  job_type: 'extract_text' | 'analyze_content';
  data: {
    base64_file?: string;
    media_type?: string;
    extracted_text?: string;
    document_type?: string;
    chunk_index?: number;
    total_chunks?: number;
  };
}

interface ProviderConfig {
  name: string;
  status: string;
  cooldown_until: string | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { job_type, data }: AIRequest = await req.json();
    console.log(`🌐 AI Gateway request: ${job_type}`);

    // Get healthy providers for this job type
    const providers = await getHealthyProviders(supabase, job_type);
    
    if (providers.length === 0) {
      console.error('❌ No healthy providers available');
      return new Response(
        JSON.stringify({ error: 'No healthy AI providers available' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try each provider in order
    let lastError: any = null;
    for (const provider of providers) {
      console.log(`🔄 Trying provider: ${provider.name}`);
      const startTime = Date.now();
      
      try {
        const result = await callProvider(provider.name, job_type, data);
        const latency = Date.now() - startTime;
        
        // Record success
        await supabase.rpc('update_provider_health', {
          p_provider_name: provider.name,
          p_success: true,
          p_latency_ms: latency
        });
        
        console.log(`✅ Success with ${provider.name} (${latency}ms)`);
        return new Response(
          JSON.stringify({ ...result, provider: provider.name, latency }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        lastError = error;
        const latency = Date.now() - startTime;
        console.error(`❌ Provider ${provider.name} failed:`, error.message);
        
        // Record failure
        await supabase.rpc('update_provider_health', {
          p_provider_name: provider.name,
          p_success: false,
          p_latency_ms: latency,
          p_error_message: error.message
        });
        
        // Continue to next provider
        continue;
      }
    }

    // All providers failed
    console.error('❌ All providers failed');
    return new Response(
      JSON.stringify({ 
        error: 'All AI providers failed',
        last_error: lastError?.message || 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('💥 Gateway error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function getHealthyProviders(supabase: any, jobType: string): Promise<ProviderConfig[]> {
  // Define provider order based on job type
  const extractionOrder = ['google', 'openai', 'anthropic'];
  const analysisOrder = ['anthropic', 'google', 'openai'];
  const order = jobType === 'extract_text' ? extractionOrder : analysisOrder;

  // Fetch all providers
  const { data: providers } = await supabase
    .from('ai_provider_health')
    .select('*')
    .in('provider_name', order);

  if (!providers) return [];

  // Filter out unhealthy providers still in cooldown
  const now = new Date();
  const healthy = providers
    .filter((p: any) => {
      if (p.status === 'healthy') return true;
      if (p.status === 'degraded') return true; // Still try degraded providers
      if (p.cooldown_until && new Date(p.cooldown_until) > now) return false; // Skip if in cooldown
      return true;
    })
    .sort((a: any, b: any) => order.indexOf(a.provider_name) - order.indexOf(b.provider_name));

  return healthy;
}

async function callProvider(provider: string, jobType: string, data: any): Promise<any> {
  if (jobType === 'extract_text') {
    return await extractWithProvider(provider, data);
  } else {
    return await analyzeWithProvider(provider, data);
  }
}

async function extractWithProvider(provider: string, data: any): Promise<any> {
  const { base64_file, media_type, chunk_index, total_chunks } = data;

  if (provider === 'google') {
    return await extractWithGoogle(base64_file, media_type, chunk_index, total_chunks);
  } else if (provider === 'openai') {
    return await extractWithOpenAI(base64_file, media_type, chunk_index, total_chunks);
  } else if (provider === 'anthropic') {
    return await extractWithAnthropic(base64_file, media_type, chunk_index, total_chunks);
  }
  
  throw new Error(`Unknown provider: ${provider}`);
}

async function extractWithGoogle(base64: string, mediaType: string, chunkIndex?: number, totalChunks?: number): Promise<any> {
  const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY not configured');

  const chunkInfo = (chunkIndex !== undefined && totalChunks !== undefined) 
    ? `\n\nThis is chunk ${chunkIndex + 1} of ${totalChunks}. Extract all visible text from this section.`
    : '';

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro-vision:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: `Extract all text from this document. Preserve formatting, structure, tables, and lists.${chunkInfo}` },
          {
            inline_data: {
              mime_type: mediaType,
              data: base64
            }
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google AI error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  return { text, cost: estimateCost('google', text.length) };
}

async function extractWithOpenAI(base64: string, mediaType: string, chunkIndex?: number, totalChunks?: number): Promise<any> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const chunkInfo = (chunkIndex !== undefined && totalChunks !== undefined)
    ? `\n\nThis is chunk ${chunkIndex + 1} of ${totalChunks}. Extract all visible text from this section.`
    : '';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4-vision-preview',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: `Extract all text from this document. Preserve formatting, structure, tables, and lists.${chunkInfo}` },
          { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64}` } }
        ]
      }],
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  const text = result.choices?.[0]?.message?.content || '';
  
  return { text, cost: estimateCost('openai', text.length) };
}

async function extractWithAnthropic(base64: string, mediaType: string, chunkIndex?: number, totalChunks?: number): Promise<any> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const chunkInfo = (chunkIndex !== undefined && totalChunks !== undefined)
    ? `\n\nThis is chunk ${chunkIndex + 1} of ${totalChunks}. Extract all visible text from this section.`
    : '';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64
            }
          },
          {
            type: 'text',
            text: `Extract all text from this document. Preserve formatting, structure, tables, and lists.${chunkInfo}`
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  const text = result.content?.[0]?.text || '';
  
  return { text, cost: estimateCost('anthropic', text.length) };
}

async function analyzeWithProvider(provider: string, data: any): Promise<any> {
  const { extracted_text, document_type } = data;

  if (provider === 'anthropic') {
    return await analyzeWithAnthropic2(extracted_text, document_type);
  } else if (provider === 'google') {
    return await analyzeWithGoogle2(extracted_text, document_type);
  } else if (provider === 'openai') {
    return await analyzeWithOpenAI2(extracted_text, document_type);
  }
  
  throw new Error(`Unknown provider: ${provider}`);
}

async function analyzeWithAnthropic2(text: string, docType: string): Promise<any> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: `Analyze this ${docType} document and extract structured data:\n\n${text}`
      }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  const analysis = result.content?.[0]?.text || '';
  
  return { analysis, cost: estimateCost('anthropic', analysis.length) };
}

async function analyzeWithGoogle2(text: string, docType: string): Promise<any> {
  const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY not configured');

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `Analyze this ${docType} document and extract structured data:\n\n${text}` }]
      }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google AI error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  const analysis = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  return { analysis, cost: estimateCost('google', analysis.length) };
}

async function analyzeWithOpenAI2(text: string, docType: string): Promise<any> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [{
        role: 'user',
        content: `Analyze this ${docType} document and extract structured data:\n\n${text}`
      }],
      max_tokens: 8192
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  const analysis = result.choices?.[0]?.message?.content || '';
  
  return { analysis, cost: estimateCost('openai', analysis.length) };
}

function estimateCost(provider: string, outputTokens: number): number {
  const costPer1k = {
    google: 0.001,
    openai: 0.01,
    anthropic: 0.015
  };
  return (outputTokens / 1000) * (costPer1k[provider as keyof typeof costPer1k] || 0.01);
}
