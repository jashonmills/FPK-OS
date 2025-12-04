import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RuntimeSession {
  enrollmentId: string;
  scoId: string;
  userId: string;
  packageId: string;
  standard: 'SCORM 1.2' | 'SCORM 2004';
  cmiData: Record<string, any>;
  initialized: boolean;
  terminated: boolean;
  sessionStartTime: string;
  lastActivity: string;
  apiCallCount: number;
}

// In-memory session storage (in production, use Redis or similar)
const activeSessions = new Map<string, RuntimeSession>();

// Rate limiting per session
const RATE_LIMITS = {
  api_calls_per_minute: 100,
  commits_per_minute: 20,
  setvalue_per_minute: 200
};

// Security: Validate CMI element names and values
function validateCMIElement(element: string, value: string, standard: 'SCORM 1.2' | 'SCORM 2004'): { valid: boolean; error?: string } {
  if (standard === 'SCORM 1.2') {
    // SCORM 1.2 validation
    const validElements = [
      'cmi.core.student_id', 'cmi.core.student_name', 'cmi.core.lesson_location',
      'cmi.core.lesson_status', 'cmi.core.credit', 'cmi.core.entry', 'cmi.core.exit',
      'cmi.core.score.raw', 'cmi.core.score.min', 'cmi.core.score.max',
      'cmi.core.total_time', 'cmi.core.session_time', 'cmi.suspend_data',
      'cmi.launch_data', 'cmi.comments', 'cmi.comments_from_lms'
    ];

    // Check for array elements (objectives, interactions)
    const isArrayElement = /^cmi\.(objectives|interactions)\.\d+\./.test(element);
    const isValidElement = validElements.includes(element) || isArrayElement;

    if (!isValidElement) {
      return { valid: false, error: `Invalid SCORM 1.2 element: ${element}` };
    }

    // Validate specific element values
    if (element === 'cmi.core.lesson_status') {
      const validStatuses = ['not attempted', 'completed', 'incomplete', 'browsed', 'failed', 'passed'];
      if (!validStatuses.includes(value)) {
        return { valid: false, error: `Invalid lesson status: ${value}` };
      }
    }

    if (element === 'cmi.core.score.raw') {
      const score = parseFloat(value);
      if (isNaN(score) || score < 0 || score > 100) {
        return { valid: false, error: 'Score must be a number between 0 and 100' };
      }
    }

  } else {
    // SCORM 2004 validation
    const validElements = [
      'cmi.learner_id', 'cmi.learner_name', 'cmi.location', 'cmi.completion_status',
      'cmi.success_status', 'cmi.credit', 'cmi.entry', 'cmi.exit', 'cmi.mode',
      'cmi.score.scaled', 'cmi.score.raw', 'cmi.score.min', 'cmi.score.max',
      'cmi.total_time', 'cmi.session_time', 'cmi.progress_measure',
      'cmi.max_time_allowed', 'cmi.time_limit_action', 'cmi.scaled_passing_score',
      'cmi.suspend_data', 'cmi.launch_data'
    ];

    // Check for array elements
    const isArrayElement = /^cmi\.(objectives|interactions|comments_from_learner|comments_from_lms)\.\d+\./.test(element);
    const isValidElement = validElements.includes(element) || isArrayElement;

    if (!isValidElement) {
      return { valid: false, error: `Invalid SCORM 2004 element: ${element}` };
    }

    // Validate specific element values
    if (element === 'cmi.completion_status') {
      const validStatuses = ['completed', 'incomplete', 'not attempted', 'unknown'];
      if (!validStatuses.includes(value)) {
        return { valid: false, error: `Invalid completion status: ${value}` };
      }
    }

    if (element === 'cmi.success_status') {
      const validStatuses = ['passed', 'failed', 'unknown'];
      if (!validStatuses.includes(value)) {
        return { valid: false, error: `Invalid success status: ${value}` };
      }
    }

    if (element === 'cmi.score.scaled') {
      const score = parseFloat(value);
      if (isNaN(score) || score < -1.0 || score > 1.0) {
        return { valid: false, error: 'Scaled score must be a number between -1.0 and 1.0' };
      }
    }

    if (element === 'cmi.progress_measure') {
      const progress = parseFloat(value);
      if (isNaN(progress) || progress < 0.0 || progress > 1.0) {
        return { valid: false, error: 'Progress measure must be a number between 0.0 and 1.0' };
      }
    }
  }

  return { valid: true };
}

// Rate limiting check
function checkRateLimit(session: RuntimeSession, action: string): boolean {
  const now = Date.now();
  const sessionMinute = Math.floor(now / 60000);
  
  // Reset counters if we're in a new minute
  if (!session.lastActivity || Math.floor(new Date(session.lastActivity).getTime() / 60000) !== sessionMinute) {
    session.apiCallCount = 0;
  }

  session.apiCallCount++;
  session.lastActivity = new Date().toISOString();

  switch (action) {
    case 'api_call':
      return session.apiCallCount <= RATE_LIMITS.api_calls_per_minute;
    case 'commit':
      return session.apiCallCount <= RATE_LIMITS.commits_per_minute;
    case 'setvalue':
      return session.apiCallCount <= RATE_LIMITS.setvalue_per_minute;
    default:
      return true;
  }
}

// Generate session key
function generateSessionKey(enrollmentId: string, scoId: string): string {
  return `${enrollmentId}_${scoId}`;
}

// Security: Sanitize input data
function sanitizeValue(value: string): string {
  // Remove potentially dangerous characters
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from auth context
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, enrollmentId, scoId, element, value, cmiData } = await req.json();

    if (!action || !enrollmentId || !scoId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: action, enrollmentId, scoId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sessionKey = generateSessionKey(enrollmentId, scoId);
    console.log(`SCORM Runtime Production: ${action} for session ${sessionKey}`);

    // Global rate limiting check
    const globalRateOk = await supabaseClient.rpc('check_rate_limit', {
      p_user_id: user.id,
      p_action_type: 'scorm_api_call',
      p_limit: 1000, // 1000 API calls per minute
      p_window_seconds: 60
    });

    if (!globalRateOk) {
      return new Response(
        JSON.stringify({ error: 'API rate limit exceeded' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'initialize': {
        // Check if enrollment exists and user has access
        const { data: enrollment, error: enrollmentError } = await supabaseClient
          .from('scorm_enrollments')
          .select(`
            id,
            user_id,
            package_id,
            scorm_packages!inner(
              id,
              standard,
              status
            ),
            scorm_scos!inner(
              id,
              identifier,
              title,
              is_launchable
            )
          `)
          .eq('id', enrollmentId)
          .eq('user_id', user.id)
          .eq('scorm_scos.id', scoId)
          .single();

        if (enrollmentError || !enrollment) {
          return new Response(
            JSON.stringify({ error: 'Invalid enrollment or SCO access denied' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (enrollment.scorm_packages.status !== 'ready') {
          return new Response(
            JSON.stringify({ error: 'Package not ready for launch' }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!enrollment.scorm_scos.is_launchable) {
          return new Response(
            JSON.stringify({ error: 'SCO is not launchable' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get existing runtime data for resume capability
        const { data: existingRuntime } = await supabaseClient
          .from('scorm_runtime')
          .select('*')
          .eq('enrollment_id', enrollmentId)
          .eq('sco_id', scoId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Initialize session
        const session: RuntimeSession = {
          enrollmentId,
          scoId,
          userId: user.id,
          packageId: enrollment.package_id,
          standard: enrollment.scorm_packages.standard,
          cmiData: existingRuntime?.cmi_data || {},
          initialized: true,
          terminated: false,
          sessionStartTime: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          apiCallCount: 0
        };

        activeSessions.set(sessionKey, session);

        // Create or update runtime record
        const runtimeData = {
          enrollment_id: enrollmentId,
          sco_id: scoId,
          package_id: enrollment.package_id,
          standard: enrollment.scorm_packages.standard,
          initialized_at: new Date().toISOString(),
          session_start_time: session.sessionStartTime,
          cmi_data: session.cmiData,
          entry: existingRuntime ? 'resume' : 'ab-initio'
        };

        await supabaseClient
          .from('scorm_runtime')
          .upsert(runtimeData);

        // Log analytics
        await supabaseClient
          .from('scorm_analytics')
          .insert({
            user_id: user.id,
            package_id: enrollment.package_id,
            sco_id: scoId,
            enrollment_id: enrollmentId,
            event_type: 'initialize',
            event_data: {
              standard: session.standard,
              entry_mode: existingRuntime ? 'resume' : 'ab-initio',
              has_existing_data: !!existingRuntime
            }
          });

        return new Response(
          JSON.stringify({
            success: true,
            initialized: true,
            standard: session.standard,
            entryMode: existingRuntime ? 'resume' : 'ab-initio',
            cmiData: session.cmiData
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'getvalue': {
        const session = activeSessions.get(sessionKey);
        if (!session || !session.initialized || session.terminated) {
          return new Response(
            JSON.stringify({ error: 'Session not initialized or terminated' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!checkRateLimit(session, 'api_call')) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded for this session' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        let returnValue = '';

        // Handle standard-specific read-only elements
        if (session.standard === 'SCORM 1.2') {
          switch (element) {
            case 'cmi.core.student_id':
              returnValue = session.userId;
              break;
            case 'cmi.core.student_name':
              returnValue = 'Learner'; // Would fetch from user profile in production
              break;
            case 'cmi.core.credit':
              returnValue = 'credit';
              break;
            case 'cmi.core.entry':
              returnValue = session.cmiData['cmi.core.entry'] || 'ab-initio';
              break;
            default:
              returnValue = session.cmiData[element] || '';
          }
        } else {
          // SCORM 2004
          switch (element) {
            case 'cmi.learner_id':
              returnValue = session.userId;
              break;
            case 'cmi.learner_name':
              returnValue = 'Learner';
              break;
            case 'cmi.credit':
              returnValue = 'credit';
              break;
            case 'cmi.mode':
              returnValue = 'normal';
              break;
            case 'cmi.entry':
              returnValue = session.cmiData['cmi.entry'] || 'ab-initio';
              break;
            default:
              returnValue = session.cmiData[element] || '';
          }
        }

        return new Response(
          JSON.stringify({ value: returnValue }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'setvalue': {
        const session = activeSessions.get(sessionKey);
        if (!session || !session.initialized || session.terminated) {
          return new Response(
            JSON.stringify({ error: 'Session not initialized or terminated' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!checkRateLimit(session, 'setvalue')) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded for SetValue operations' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Security: Sanitize the value
        const sanitizedValue = sanitizeValue(value);

        // Validate the CMI element and value
        const validation = validateCMIElement(element, sanitizedValue, session.standard);
        if (!validation.valid) {
          return new Response(
            JSON.stringify({ error: validation.error }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Store the value
        session.cmiData[element] = sanitizedValue;
        session.lastActivity = new Date().toISOString();

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'commit': {
        const session = activeSessions.get(sessionKey);
        if (!session || !session.initialized || session.terminated) {
          return new Response(
            JSON.stringify({ error: 'Session not initialized or terminated' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!checkRateLimit(session, 'commit')) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded for Commit operations' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Use the database function for atomic commit
        const { data: commitResult, error: commitError } = await supabaseClient
          .rpc('scorm_commit_runtime', {
            p_enrollment_id: enrollmentId,
            p_sco_id: scoId,
            p_cmi_data: session.cmiData,
            p_analytics_data: {
              session_duration_ms: Date.now() - new Date(session.sessionStartTime).getTime(),
              api_calls: session.apiCallCount,
              timestamp: new Date().toISOString()
            }
          });

        if (commitError) {
          console.error('Commit error:', commitError);
          return new Response(
            JSON.stringify({ error: 'Failed to commit data' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        session.lastActivity = new Date().toISOString();

        return new Response(
          JSON.stringify({ success: true, committed: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'terminate': {
        const session = activeSessions.get(sessionKey);
        if (!session || !session.initialized) {
          return new Response(
            JSON.stringify({ error: 'Session not initialized' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Final commit before termination
        await supabaseClient.rpc('scorm_commit_runtime', {
          p_enrollment_id: enrollmentId,
          p_sco_id: scoId,
          p_cmi_data: session.cmiData,
          p_analytics_data: {
            session_duration_ms: Date.now() - new Date(session.sessionStartTime).getTime(),
            api_calls: session.apiCallCount,
            terminated: true
          }
        });

        // Update runtime with termination
        await supabaseClient
          .from('scorm_runtime')
          .update({
            terminated_at: new Date().toISOString(),
            last_commit_at: new Date().toISOString()
          })
          .eq('enrollment_id', enrollmentId)
          .eq('sco_id', scoId);

        // Log termination analytics
        await supabaseClient
          .from('scorm_analytics')
          .insert({
            user_id: user.id,
            package_id: session.packageId,
            sco_id: scoId,
            enrollment_id: enrollmentId,
            event_type: 'terminate',
            event_data: {
              session_duration_ms: Date.now() - new Date(session.sessionStartTime).getTime(),
              total_api_calls: session.apiCallCount,
              standard: session.standard
            },
            duration_ms: Date.now() - new Date(session.sessionStartTime).getTime()
          });

        // Clean up session
        activeSessions.delete(sessionKey);

        return new Response(
          JSON.stringify({ success: true, terminated: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'state': {
        // Get current runtime state for debugging or resume
        const { data: runtimeData, error: stateError } = await supabaseClient
          .from('scorm_runtime')
          .select('*')
          .eq('enrollment_id', enrollmentId)
          .eq('sco_id', scoId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (stateError) {
          return new Response(
            JSON.stringify({ error: 'Failed to retrieve state' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const session = activeSessions.get(sessionKey);

        return new Response(
          JSON.stringify({
            runtime: runtimeData,
            session: session ? {
              initialized: session.initialized,
              terminated: session.terminated,
              apiCallCount: session.apiCallCount,
              sessionDuration: Date.now() - new Date(session.sessionStartTime).getTime()
            } : null,
            canResume: runtimeData && !runtimeData.terminated_at
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
    console.error('SCORM Runtime Production error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});