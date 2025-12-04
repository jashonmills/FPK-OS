import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncResult {
  slug: string;
  status: 'success' | 'failed' | 'missing_db' | 'invalid_manifest';
  error?: string;
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

    console.log('[SYNC-ALL] Starting automatic course discovery...');

    const results: SyncResult[] = [];
    const coursesPath = './src/content/courses';

    // Scan the courses directory
    console.log(`[SYNC-ALL] Scanning directory: ${coursesPath}`);
    
    try {
      for await (const dirEntry of Deno.readDir(coursesPath)) {
        if (!dirEntry.isDirectory) continue;

        const slug = dirEntry.name;
        const manifestPath = `${coursesPath}/${slug}/manifest.json`;

        console.log(`[SYNC-ALL] Processing course: ${slug}`);

        try {
          // Read manifest.json
          const manifestContent = await Deno.readTextFile(manifestPath);
          const manifest = JSON.parse(manifestContent);

          // Validate basic manifest structure
          if (!manifest.courseId || !manifest.lessons) {
            console.error(`[SYNC-ALL] Invalid manifest for ${slug}: missing required fields`);
            results.push({
              slug,
              status: 'invalid_manifest',
              error: 'Missing courseId or lessons',
            });
            continue;
          }

          // Update the course in database
          const { data: existingCourse, error: checkError } = await supabase
            .from('courses')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();

          if (checkError) {
            console.error(`[SYNC-ALL] Database check error for ${slug}:`, checkError);
            results.push({
              slug,
              status: 'failed',
              error: checkError.message,
            });
            continue;
          }

          if (!existingCourse) {
            console.warn(`[SYNC-ALL] Course ${slug} not found in database - skipping`);
            results.push({
              slug,
              status: 'missing_db',
              error: 'Course record not found in database',
            });
            continue;
          }

          // Update the manifest
          const { error: updateError } = await supabase
            .from('courses')
            .update({ content_manifest: manifest })
            .eq('slug', slug);

          if (updateError) {
            console.error(`[SYNC-ALL] Failed to update ${slug}:`, updateError);
            results.push({
              slug,
              status: 'failed',
              error: updateError.message,
            });
          } else {
            console.log(`[SYNC-ALL] ✅ Successfully synced ${slug}`);
            results.push({
              slug,
              status: 'success',
            });
          }
        } catch (manifestError) {
          console.error(`[SYNC-ALL] Error reading manifest for ${slug}:`, manifestError);
          results.push({
            slug,
            status: 'invalid_manifest',
            error: manifestError instanceof Error ? manifestError.message : 'Failed to read manifest',
          });
        }
      }
    } catch (dirError) {
      console.error('[SYNC-ALL] Error reading courses directory:', dirError);
      throw new Error(`Failed to read courses directory: ${dirError instanceof Error ? dirError.message : 'Unknown error'}`);
    }

    // Summarize results
    const summary = {
      total: results.length,
      success: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
      missing_db: results.filter(r => r.status === 'missing_db').length,
      invalid_manifest: results.filter(r => r.status === 'invalid_manifest').length,
    };

    console.log('[SYNC-ALL] Summary:', summary);

    return new Response(
      JSON.stringify({
        success: true,
        summary,
        results,
        message: `Discovered and synced ${summary.success} of ${summary.total} courses`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[SYNC-ALL] Fatal error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
