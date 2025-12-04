import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message, title, type = 'info' } = await req.json();

    if (!message || !title) {
      return new Response(
        JSON.stringify({ error: 'Message and title are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('Broadcasting beta update:', { title, message, type });

    // Get all beta users
    const { data: betaUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id, display_name, full_name')
      .eq('beta_access', true);

    if (usersError) {
      console.error('Error fetching beta users:', usersError);
      throw usersError;
    }

    console.log(`Found ${betaUsers?.length || 0} beta users`);

    // Broadcast the update via Supabase realtime
    const broadcastPayload = {
      type: 'beta_update',
      data: {
        title,
        message,
        type,
        timestamp: new Date().toISOString(),
        broadcast_id: crypto.randomUUID()
      }
    };

    // Send to beta updates channel
    const { error: broadcastError } = await supabase
      .channel('beta_updates')
      .send({
        type: 'broadcast',
        event: 'beta_update',
        payload: broadcastPayload
      });

    if (broadcastError) {
      console.error('Broadcast error:', broadcastError);
    }

    // Also store the update in a beta_updates table for history
    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        name: 'System',
        email: 'system@fpkuniversity.com',
        category: 'beta_update',
        message: `${title}\n\n${message}`,
        status: 'broadcast',
        user_id: null
      });

    if (insertError) {
      console.error('Error storing update:', insertError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        broadcast_id: broadcastPayload.data.broadcast_id,
        users_notified: betaUsers?.length || 0 
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});