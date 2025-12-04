import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { parse } from "https://esm.sh/node-html-parser@6.1.13";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { source_url } = await req.json();
    
    if (!source_url) {
      return new Response(
        JSON.stringify({ error: 'source_url is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check cache (7 days freshness)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: cached, error: cacheError } = await supabaseClient
      .from('ai_knowledge_cache')
      .select('*')
      .eq('source_url', source_url)
      .gte('last_scraped_at', sevenDaysAgo.toISOString())
      .maybeSingle();

    if (cached && !cacheError) {
      console.log(`Cache hit for ${source_url}`);
      return new Response(
        JSON.stringify({ 
          content: cached.cleaned_text_content,
          cached: true,
          last_scraped: cached.last_scraped_at 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch and parse
    console.log(`Fetching ${source_url}`);
    const response = await fetch(source_url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${source_url}: ${response.status}`);
    }

    const html = await response.text();
    const root = parse(html);

    // Extract main content
    let cleanedText = '';
    const mainContent = root.querySelector('article') || 
                       root.querySelector('main') || 
                       root.querySelector('[role="main"]') ||
                       root.querySelector('.content') ||
                       root.querySelector('#content');

    if (mainContent) {
      // Remove scripts, styles, nav, footer, ads
      mainContent.querySelectorAll('script, style, nav, footer, .ad, .advertisement, aside').forEach(el => el.remove());
      cleanedText = mainContent.textContent || '';
    } else {
      // Fallback to body
      const body = root.querySelector('body');
      if (body) {
        body.querySelectorAll('script, style, nav, footer, header, .ad, .advertisement, aside').forEach(el => el.remove());
        cleanedText = body.textContent || '';
      }
    }

    // Clean up whitespace
    cleanedText = cleanedText
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    // Generate simple hash
    const encoder = new TextEncoder();
    const data = encoder.encode(cleanedText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Store in cache
    const { error: upsertError } = await supabaseClient
      .from('ai_knowledge_cache')
      .upsert({
        source_url,
        cleaned_text_content: cleanedText,
        last_scraped_at: new Date().toISOString(),
        content_hash: contentHash,
        etag: response.headers.get('etag') || null,
        metadata: {
          content_length: cleanedText.length,
          scraped_at: new Date().toISOString()
        }
      }, {
        onConflict: 'source_url'
      });

    if (upsertError) {
      console.error('Cache upsert error:', upsertError);
    }

    return new Response(
      JSON.stringify({ 
        content: cleanedText,
        cached: false,
        content_length: cleanedText.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Scraping error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
