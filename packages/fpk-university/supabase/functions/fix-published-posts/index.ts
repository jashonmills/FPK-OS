import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update all published posts that don't have published_at set
    const { data: updatedPosts, error } = await supabase
      .from('blog_posts')
      .update({ published_at: supabase.from('blog_posts').select('created_at') })
      .eq('status', 'published')
      .is('published_at', null)
      .select();

    if (error) throw error;

    // Actually, let's do this properly with a simpler query
    const { data: postsToFix } = await supabase
      .from('blog_posts')
      .select('id, created_at')
      .eq('status', 'published')
      .is('published_at', null);

    if (postsToFix && postsToFix.length > 0) {
      for (const post of postsToFix) {
        await supabase
          .from('blog_posts')
          .update({ published_at: post.created_at })
          .eq('id', post.id);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        fixed: postsToFix?.length || 0,
        message: `Fixed ${postsToFix?.length || 0} published posts` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
