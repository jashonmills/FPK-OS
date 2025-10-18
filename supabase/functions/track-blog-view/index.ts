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

    if (!post_slug) {
      return new Response(
        JSON.stringify({ error: 'post_slug is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Call the increment function
    const { data, error } = await supabaseClient
      .rpc('increment_blog_post_views', { post_slug });

    if (error) {
      console.error('Error incrementing blog views:', error);
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

    // Log the view for monitoring
    console.log(`Blog view tracked: ${post_slug}`, {
      views_count: data?.[0]?.views_count,
      referrer,
      user_agent: user_agent?.substring(0, 50) // Truncate for logging
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        views_count: data?.[0]?.views_count 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in track-blog-view function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});