import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ForceClockOutRequest {
  sessionId?: string; // Optional: if provided, clock out specific session
  userId?: string;    // Optional: for admins to clock out other users
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: ForceClockOutRequest = await req.json();
    console.log('Force clock out request:', { user: user.id, body });

    // Check if user is admin (for clocking out other users)
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const isAdmin = roleData?.role === 'admin';
    const targetUserId = body.userId || user.id;

    // Only admins can clock out other users
    if (targetUserId !== user.id && !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Only admins can clock out other users' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the active session
    let query = supabase
      .from('active_time_sessions')
      .select('*, projects(name)')
      .eq('user_id', targetUserId);

    if (body.sessionId) {
      query = query.eq('id', body.sessionId);
    }

    const { data: sessions, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching session:', fetchError);
      throw fetchError;
    }

    if (!sessions || sessions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No active session found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const session = sessions[0];
    const endTime = new Date();
    const startTime = new Date(session.start_time);
    const hoursLogged = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    console.log('Force clocking out session:', {
      sessionId: session.id,
      userId: session.user_id,
      projectId: session.project_id,
      hoursLogged: hoursLogged.toFixed(2)
    });

    // Create time entry
    const { error: insertError } = await supabase
      .from('time_entries')
      .insert({
        user_id: session.user_id,
        project_id: session.project_id,
        task_id: session.task_id,
        entry_date: startTime.toISOString().split('T')[0],
        hours_logged: Math.round(hoursLogged * 100) / 100,
        description: `Force clocked out by ${isAdmin && targetUserId !== user.id ? 'admin' : 'user'} - Started ${startTime.toLocaleString()}, Ended ${endTime.toLocaleString()}`,
        is_billable: false
      });

    if (insertError) {
      console.error('Error creating time entry:', insertError);
      throw insertError;
    }

    // Delete the active session
    const { error: deleteError } = await supabase
      .from('active_time_sessions')
      .delete()
      .eq('id', session.id);

    if (deleteError) {
      console.error('Error deleting session:', deleteError);
      throw deleteError;
    }

    console.log('Successfully force clocked out session');

    return new Response(
      JSON.stringify({
        success: true,
        hoursLogged: Math.round(hoursLogged * 100) / 100,
        projectName: session.projects?.name,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        wasStale: (new Date().getTime() - new Date(session.last_heartbeat).getTime()) > (12 * 60 * 60 * 1000)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in force-clock-out:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
