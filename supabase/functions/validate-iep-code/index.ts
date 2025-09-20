import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidateRequest {
  code: string;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code }: ValidateRequest = await req.json();

    if (!code) {
      throw new Error('Invite code is required');
    }

    // Find the invite and check if it's valid
    const { data: invite, error: inviteError } = await supabase
      .from('iep_invites')
      .select('*')
      .eq('code', code)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (inviteError || !invite) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'Invalid or expired invite code'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Check if invite has reached max uses
    if (invite.current_uses >= invite.max_uses) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'Invite code has reached maximum usage limit'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Create a parent session
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 4); // 4 hour session

    const { data: session, error: sessionError } = await supabase
      .from('parent_iep_sessions')
      .insert({
        invite_code: code,
        session_id: sessionId,
        org_id: invite.org_id,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (sessionError) {
      throw new Error('Failed to create parent session');
    }

    // Increment the invite usage count
    await supabase
      .from('iep_invites')
      .update({ 
        current_uses: invite.current_uses + 1,
        status: invite.current_uses + 1 >= invite.max_uses ? 'used' : 'active'
      })
      .eq('id', invite.id);

    return new Response(
      JSON.stringify({
        valid: true,
        sessionId,
        orgId: invite.org_id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in validate-iep-code:', error);
    return new Response(
      JSON.stringify({
        valid: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});