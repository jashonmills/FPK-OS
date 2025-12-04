import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { importId, overrides } = await req.json();

    if (!importId) {
      return new Response(
        JSON.stringify({ error: 'Import ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Get user ID from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Get import record
    const { data: importRecord, error: importError } = await supabase
      .from('scorm_imports')
      .select('*')
      .eq('id', importId)
      .eq('user_id', user.id)
      .single();

    if (importError || !importRecord) {
      return new Response(
        JSON.stringify({ error: 'Import not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    if (importRecord.status !== 'ready' && importRecord.status !== 'partial') {
      return new Response(
        JSON.stringify({ error: 'Import is not ready to be applied' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Apply overrides to the mapped structure
    const courseData = {
      ...importRecord.mapped_structure,
      ...overrides // Allow title, description, level, etc. overrides
    };

    // Create the course in org_courses
    const { data: course, error: courseError } = await supabase
      .from('org_courses')
      .insert({
        org_id: importRecord.org_id,
        title: courseData.title,
        description: courseData.description,
        level: courseData.level,
        published: false,
        background_image_url: courseData.backgroundImageUrl,
        framework: courseData.framework,
        lesson_structure: courseData.modules,
        micro_lesson_data: courseData.modules,
        duration_estimate_mins: courseData.durationEstimateMins,
        objectives: courseData.objectives,
        prerequisites: courseData.prerequisites,
        source: courseData.source,
        processing_status: 'ready',
        import_id: importId,
        created_by: user.id
      })
      .select()
      .single();

    if (courseError) {
      console.error('❌ Failed to create course:', courseError);
      return new Response(
        JSON.stringify({ error: 'Failed to create course', details: courseError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('✅ Course created successfully from SCORM import:', course.id);

    return new Response(
      JSON.stringify({
        success: true,
        course: course,
        message: 'Course created successfully from SCORM import'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error applying import:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});