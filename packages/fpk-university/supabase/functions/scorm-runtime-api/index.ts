import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScormRuntimeData {
  lesson_location?: string;
  credit?: string;
  lesson_status?: string;
  entry?: string;
  score_raw?: number;
  score_min?: number;
  score_max?: number;
  total_time?: string;
  session_time?: string;
  suspend_data?: string;
  launch_data?: string;
  mastery_score?: number;
  interactions?: any[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const enrollmentId = pathParts[pathParts.length - 3];
    const scoId = pathParts[pathParts.length - 2];
    const action = pathParts[pathParts.length - 1];

    if (!enrollmentId || !scoId || !action) {
      return new Response(
        JSON.stringify({ error: 'Invalid API path. Expected: /enrollmentId/scoId/action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('SCORM Runtime API:', action, 'for enrollment:', enrollmentId, 'SCO:', scoId);

    switch (action) {
      case 'initialize': {
        // Initialize a new SCORM session
        const { error } = await supabaseClient
          .from('scorm_runtime')
          .upsert({
            enrollment_id: enrollmentId,
            sco_id: scoId,
            initialized_at: new Date().toISOString(),
            lesson_status: 'incomplete',
            entry: 'ab-initio'
          });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, initialized: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'getvalue': {
        const { element } = await req.json();
        
        // Get current runtime data
        const { data: runtime, error } = await supabaseClient
          .from('scorm_runtime')
          .select('*')
          .eq('enrollment_id', enrollmentId)
          .eq('sco_id', scoId)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"

        let value = '';
        if (runtime) {
          switch (element) {
            case 'cmi.core.lesson_location': value = runtime.lesson_location || ''; break;
            case 'cmi.core.credit': value = runtime.credit || 'credit'; break;
            case 'cmi.core.lesson_status': value = runtime.lesson_status || 'not attempted'; break;
            case 'cmi.core.entry': value = runtime.entry || 'ab-initio'; break;
            case 'cmi.core.score.raw': value = runtime.score_raw?.toString() || ''; break;
            case 'cmi.core.score.min': value = runtime.score_min?.toString() || '0'; break;
            case 'cmi.core.score.max': value = runtime.score_max?.toString() || '100'; break;
            case 'cmi.core.total_time': value = runtime.total_time || '00:00:00'; break;
            case 'cmi.core.session_time': value = runtime.session_time || '00:00:00'; break;
            case 'cmi.suspend_data': value = runtime.suspend_data || ''; break;
            case 'cmi.launch_data': value = runtime.launch_data || ''; break;
            default: value = '';
          }
        }

        return new Response(
          JSON.stringify({ value }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'setvalue': {
        const { element, value } = await req.json();
        
        const updates: Partial<ScormRuntimeData> = {};

        // Map CMI elements to database fields
        switch (element) {
          case 'cmi.core.lesson_location': updates.lesson_location = value; break;
          case 'cmi.core.lesson_status': updates.lesson_status = value; break;
          case 'cmi.core.score.raw': updates.score_raw = parseInt(value); break;
          case 'cmi.core.score.min': updates.score_min = parseInt(value); break;
          case 'cmi.core.score.max': updates.score_max = parseInt(value); break;
          case 'cmi.core.session_time': updates.session_time = value; break;
          case 'cmi.suspend_data': updates.suspend_data = value; break;
          default: 
            // Ignore unknown elements
            break;
        }

        if (Object.keys(updates).length > 0) {
          const { error } = await supabaseClient
            .from('scorm_runtime')
            .upsert({
              enrollment_id: enrollmentId,
              sco_id: scoId,
              ...updates,
              last_commit_at: new Date().toISOString()
            });

          if (error) throw error;
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'commit': {
        // Commit current runtime data
        const { error } = await supabaseClient
          .from('scorm_runtime')
          .update({
            last_commit_at: new Date().toISOString()
          })
          .eq('enrollment_id', enrollmentId)
          .eq('sco_id', scoId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, committed: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'terminate': {
        // Terminate SCORM session
        const { error } = await supabaseClient
          .from('scorm_runtime')
          .update({
            terminated_at: new Date().toISOString(),
            last_commit_at: new Date().toISOString()
          })
          .eq('enrollment_id', enrollmentId)
          .eq('sco_id', scoId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, terminated: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'state': {
        // Get current runtime state for resuming
        const { data: runtime, error } = await supabaseClient
          .from('scorm_runtime')
          .select('*')
          .eq('enrollment_id', enrollmentId)
          .eq('sco_id', scoId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        return new Response(
          JSON.stringify({ runtime: runtime || null }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error in scorm-runtime-api function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'SCORM Runtime API error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});