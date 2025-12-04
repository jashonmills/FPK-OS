import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RuntimeState {
  enrollmentId: string;
  scoId: string;
  userId: string;
  packageId: string;
  standard: 'SCORM 1.2' | 'SCORM 2004';
  cmiData: Record<string, any>;
  initialized: boolean;
  terminated: boolean;
  sessionStartTime: string;
  lastCommitTime: string;
}

const runtimeSessions = new Map<string, RuntimeState>();

function generateSessionKey(enrollmentId: string, scoId: string): string {
  return `${enrollmentId}_${scoId}`;
}

function validateCMIElement(element: string, value: string, standard: 'SCORM 1.2' | 'SCORM 2004'): { valid: boolean; error?: string } {
  // Basic validation - would be more comprehensive in production
  if (standard === 'SCORM 1.2') {
    if (element === 'cmi.core.lesson_status') {
      const validStatuses = ['not attempted', 'completed', 'incomplete', 'browsed', 'failed', 'passed'];
      if (!validStatuses.includes(value)) {
        return { valid: false, error: 'Invalid lesson status' };
      }
    }
    if (element === 'cmi.core.score.raw') {
      const score = parseFloat(value);
      if (isNaN(score) || score < 0 || score > 100) {
        return { valid: false, error: 'Score must be between 0 and 100' };
      }
    }
  } else if (standard === 'SCORM 2004') {
    if (element === 'cmi.completion_status') {
      const validStatuses = ['completed', 'incomplete', 'not attempted', 'unknown'];
      if (!validStatuses.includes(value)) {
        return { valid: false, error: 'Invalid completion status' };
      }
    }
    if (element === 'cmi.success_status') {
      const validStatuses = ['passed', 'failed', 'unknown'];
      if (!validStatuses.includes(value)) {
        return { valid: false, error: 'Invalid success status' };
      }
    }
    if (element === 'cmi.score.scaled') {
      const score = parseFloat(value);
      if (isNaN(score) || score < -1.0 || score > 1.0) {
        return { valid: false, error: 'Scaled score must be between -1.0 and 1.0' };
      }
    }
  }
  
  return { valid: true };
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

    const { action, enrollmentId, scoId, element, value, cmiData } = await req.json();

    if (!action || !enrollmentId || !scoId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: action, enrollmentId, scoId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sessionKey = generateSessionKey(enrollmentId, scoId);
    console.log(`SCORM Runtime API - Action: ${action}, Session: ${sessionKey}`);

    // Get user from auth context
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'initialize': {
        // Get package info to determine SCORM standard
        const { data: scoData, error: scoError } = await supabaseClient
          .from('scorm_scos')
          .select('package_id, scorm_packages!inner(metadata)')
          .eq('id', scoId)
          .single();

        if (scoError || !scoData) {
          throw new Error('SCO not found');
        }

        const standard = scoData.scorm_packages.metadata?.manifest?.standard || 'SCORM 1.2';

        // Check for existing runtime state
        let existingState = null;
        const { data: runtimeData, error: runtimeError } = await supabaseClient
          .from('scorm_runtime')
          .select('*')
          .eq('enrollment_id', enrollmentId)
          .eq('sco_id', scoId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!runtimeError && runtimeData) {
          existingState = runtimeData;
        }

        // Initialize session state
        const sessionState: RuntimeState = {
          enrollmentId,
          scoId,
          userId: user.id,
          packageId: scoData.package_id,
          standard,
          cmiData: existingState?.cmi_data || {},
          initialized: true,
          terminated: false,
          sessionStartTime: new Date().toISOString(),
          lastCommitTime: new Date().toISOString()
        };

        runtimeSessions.set(sessionKey, sessionState);

        // Create or update runtime record
        const { error: upsertError } = await supabaseClient
          .from('scorm_runtime')
          .upsert({
            enrollment_id: enrollmentId,
            sco_id: scoId,
            user_id: user.id,
            package_id: scoData.package_id,
            initialized_at: new Date().toISOString(),
            cmi_data: sessionState.cmiData,
            session_start_time: sessionState.sessionStartTime,
            lesson_status: existingState?.lesson_status || 'incomplete',
            entry: existingState ? 'resume' : 'ab-initio'
          });

        if (upsertError) throw upsertError;

        return new Response(
          JSON.stringify({ 
            success: true, 
            initialized: true,
            standard,
            hasExistingState: !!existingState,
            entryMode: existingState ? 'resume' : 'ab-initio'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'getvalue': {
        const session = runtimeSessions.get(sessionKey);
        if (!session || !session.initialized || session.terminated) {
          return new Response(
            JSON.stringify({ error: 'Session not initialized or terminated' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        let returnValue = '';

        // Handle standard-specific elements
        if (session.standard === 'SCORM 1.2') {
          switch (element) {
            case 'cmi.core.student_id': returnValue = session.userId; break;
            case 'cmi.core.student_name': returnValue = 'Student'; break;
            case 'cmi.core.lesson_location': returnValue = session.cmiData['cmi.core.lesson_location'] || ''; break;
            case 'cmi.core.lesson_status': returnValue = session.cmiData['cmi.core.lesson_status'] || 'not attempted'; break;
            case 'cmi.core.credit': returnValue = 'credit'; break;
            case 'cmi.core.entry': returnValue = session.cmiData['cmi.core.entry'] || 'ab-initio'; break;
            case 'cmi.core.score.raw': returnValue = session.cmiData['cmi.core.score.raw'] || ''; break;
            case 'cmi.core.score.min': returnValue = session.cmiData['cmi.core.score.min'] || '0'; break;
            case 'cmi.core.score.max': returnValue = session.cmiData['cmi.core.score.max'] || '100'; break;
            case 'cmi.core.total_time': returnValue = session.cmiData['cmi.core.total_time'] || '00:00:00'; break;
            case 'cmi.core.session_time': returnValue = session.cmiData['cmi.core.session_time'] || '00:00:00'; break;
            case 'cmi.suspend_data': returnValue = session.cmiData['cmi.suspend_data'] || ''; break;
            case 'cmi.launch_data': returnValue = session.cmiData['cmi.launch_data'] || ''; break;
            default: returnValue = session.cmiData[element] || '';
          }
        } else {
          // SCORM 2004
          switch (element) {
            case 'cmi.learner_id': returnValue = session.userId; break;
            case 'cmi.learner_name': returnValue = 'Student'; break;
            case 'cmi.location': returnValue = session.cmiData['cmi.location'] || ''; break;
            case 'cmi.completion_status': returnValue = session.cmiData['cmi.completion_status'] || 'not attempted'; break;
            case 'cmi.success_status': returnValue = session.cmiData['cmi.success_status'] || 'unknown'; break;
            case 'cmi.credit': returnValue = 'credit'; break;
            case 'cmi.entry': returnValue = session.cmiData['cmi.entry'] || 'ab-initio'; break;
            case 'cmi.mode': returnValue = 'normal'; break;
            case 'cmi.score.scaled': returnValue = session.cmiData['cmi.score.scaled'] || ''; break;
            case 'cmi.score.raw': returnValue = session.cmiData['cmi.score.raw'] || ''; break;
            case 'cmi.score.min': returnValue = session.cmiData['cmi.score.min'] || ''; break;
            case 'cmi.score.max': returnValue = session.cmiData['cmi.score.max'] || ''; break;
            case 'cmi.total_time': returnValue = session.cmiData['cmi.total_time'] || 'PT0S'; break;
            case 'cmi.session_time': returnValue = session.cmiData['cmi.session_time'] || 'PT0S'; break;
            case 'cmi.suspend_data': returnValue = session.cmiData['cmi.suspend_data'] || ''; break;
            case 'cmi.launch_data': returnValue = session.cmiData['cmi.launch_data'] || ''; break;
            default: returnValue = session.cmiData[element] || '';
          }
        }

        return new Response(
          JSON.stringify({ value: returnValue }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'setvalue': {
        const session = runtimeSessions.get(sessionKey);
        if (!session || !session.initialized || session.terminated) {
          return new Response(
            JSON.stringify({ error: 'Session not initialized or terminated' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate the value
        const validation = validateCMIElement(element, value, session.standard);
        if (!validation.valid) {
          return new Response(
            JSON.stringify({ error: validation.error }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Store the value in session
        session.cmiData[element] = value;
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'commit': {
        const session = runtimeSessions.get(sessionKey);
        if (!session || !session.initialized || session.terminated) {
          return new Response(
            JSON.stringify({ error: 'Session not initialized or terminated' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        session.lastCommitTime = new Date().toISOString();

        // Update database with current CMI data
        const { error: updateError } = await supabaseClient
          .from('scorm_runtime')
          .update({
            cmi_data: session.cmiData,
            last_commit_at: session.lastCommitTime,
            lesson_status: session.cmiData['cmi.core.lesson_status'] || session.cmiData['cmi.completion_status'] || 'incomplete',
            score_raw: parseFloat(session.cmiData['cmi.core.score.raw'] || session.cmiData['cmi.score.raw'] || '0') || null,
            suspend_data: session.cmiData['cmi.suspend_data'] || null,
            lesson_location: session.cmiData['cmi.core.lesson_location'] || session.cmiData['cmi.location'] || null
          })
          .eq('enrollment_id', enrollmentId)
          .eq('sco_id', scoId);

        if (updateError) throw updateError;

        return new Response(
          JSON.stringify({ success: true, committed: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'terminate': {
        const session = runtimeSessions.get(sessionKey);
        if (!session || !session.initialized) {
          return new Response(
            JSON.stringify({ error: 'Session not initialized' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        session.terminated = true;
        session.initialized = false;

        // Final commit and termination
        const { error: terminateError } = await supabaseClient
          .from('scorm_runtime')
          .update({
            cmi_data: session.cmiData,
            terminated_at: new Date().toISOString(),
            last_commit_at: new Date().toISOString(),
            lesson_status: session.cmiData['cmi.core.lesson_status'] || session.cmiData['cmi.completion_status'] || 'incomplete',
            score_raw: parseFloat(session.cmiData['cmi.core.score.raw'] || session.cmiData['cmi.score.raw'] || '0') || null,
            suspend_data: session.cmiData['cmi.suspend_data'] || null,
            lesson_location: session.cmiData['cmi.core.lesson_location'] || session.cmiData['cmi.location'] || null
          })
          .eq('enrollment_id', enrollmentId)
          .eq('sco_id', scoId);

        if (terminateError) throw terminateError;

        // Clean up session
        runtimeSessions.delete(sessionKey);

        return new Response(
          JSON.stringify({ success: true, terminated: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'state': {
        // Get current runtime state for resuming
        const { data: runtimeData, error: stateError } = await supabaseClient
          .from('scorm_runtime')
          .select('*')
          .eq('enrollment_id', enrollmentId)
          .eq('sco_id', scoId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (stateError) throw stateError;

        return new Response(
          JSON.stringify({ 
            runtime: runtimeData,
            canResume: runtimeData && !runtimeData.terminated_at,
            lastAccess: runtimeData?.last_commit_at
          }),
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
    console.error('Error in scorm-runtime-advanced function:', error);
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