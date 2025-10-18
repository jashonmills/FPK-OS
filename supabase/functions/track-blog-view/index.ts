import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlogViewRequest {
  post_slug: string;
  referrer?: string;
  user_agent?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { post_slug, referrer, user_agent }: BlogViewRequest = await req.json();
    
    console.log('[TRACK-BLOG-VIEW] Request received:', { post_slug, referrer, hasUserAgent: !!user_agent });

    if (!post_slug) {
      console.error('[TRACK-BLOG-VIEW] Missing post_slug');
      return new Response(
        JSON.stringify({ error: 'post_slug is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('[TRACK-BLOG-VIEW] Missing Supabase credentials');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    console.log('[TRACK-BLOG-VIEW] Calling increment_blog_post_views RPC');

    // Call the increment function
    const { data, error } = await supabaseClient
      .rpc('increment_blog_post_views', { post_slug });

    if (error) {
      console.error('[TRACK-BLOG-VIEW] RPC Error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return new Response(
        JSON.stringify({ 
          error: 'Failed to track view',
          details: error.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const viewsCount = data?.[0]?.views_count || 0;
    
    console.log('[TRACK-BLOG-VIEW] Success:', {
      post_slug,
      views_count: viewsCount,
      referrer: referrer || 'direct',
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        views_count: viewsCount 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('[TRACK-BLOG-VIEW] Unexpected error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});