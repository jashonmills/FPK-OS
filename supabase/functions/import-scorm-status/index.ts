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

    const url = new URL(req.url);
    const importId = url.pathname.split('/').pop();

    if (!importId) {
      return new Response(
        JSON.stringify({ error: 'Import ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Get user ID from JWT for security
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

    // Get import status
    const { data: importRecord, error: importError } = await supabase
      .from('scorm_imports')
      .select('*')
      .eq('id', importId)
      .eq('user_id', user.id) // Ensure user can only access their own imports
      .single();

    if (importError || !importRecord) {
      return new Response(
        JSON.stringify({ error: 'Import not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        id: importRecord.id,
        status: importRecord.status,
        progress_percentage: importRecord.progress_percentage,
        steps_log: importRecord.steps_log,
        warnings: importRecord.warnings_json,
        error_message: importRecord.error_message,
        created_at: importRecord.created_at,
        completed_at: importRecord.completed_at,
        mapped_structure: importRecord.mapped_structure,
        manifest_data: importRecord.manifest_data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error fetching import status:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});