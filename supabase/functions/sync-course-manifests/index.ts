import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CourseManifestSync {
  slug: string;
  manifest: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { courses } = await req.json() as { courses: CourseManifestSync[] };

    if (!courses || !Array.isArray(courses)) {
      throw new Error('Invalid request: courses array required');
    }

    console.log(`[SYNC] Starting sync for ${courses.length} courses`);

    const results = {
      success: [] as string[],
      failed: [] as { slug: string; error: string }[],
    };

    for (const { slug, manifest } of courses) {
      try {
        console.log(`[SYNC] Processing course: ${slug}`);

        // Update the course with the manifest
        const { error } = await supabase
          .from('courses')
          .update({ content_manifest: manifest })
          .eq('slug', slug);

        if (error) {
          console.error(`[SYNC] Failed to update ${slug}:`, error);
          results.failed.push({ slug, error: error.message });
        } else {
          console.log(`[SYNC] ✅ Successfully synced ${slug}`);
          results.success.push(slug);
        }
      } catch (error) {
        console.error(`[SYNC] Exception for ${slug}:`, error);
        results.failed.push({ 
          slug, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    console.log(`[SYNC] Complete: ${results.success.length} succeeded, ${results.failed.length} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: `Synced ${results.success.length} of ${courses.length} courses`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[SYNC] Fatal error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
