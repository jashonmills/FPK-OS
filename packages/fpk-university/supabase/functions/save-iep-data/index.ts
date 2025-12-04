import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SaveDataRequest {
  sessionId: string;
  sectionId: string;
  formData: Record<string, any>;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, sectionId, formData }: SaveDataRequest = await req.json();

    if (!sessionId || !sectionId) {
      throw new Error('Session ID and section ID are required');
    }

    // Verify the session exists and is active
    const { data: session, error: sessionError } = await supabase
      .from('parent_iep_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      throw new Error('Invalid or expired session');
    }

    // Save or update the form data
    const { data: existingData } = await supabase
      .from('parent_iep_data')
      .select('id')
      .eq('session_id', session.id)
      .eq('form_section', sectionId)
      .single();

    if (existingData) {
      // Update existing data
      const { error: updateError } = await supabase
        .from('parent_iep_data')
        .update({
          form_data: formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);

      if (updateError) {
        throw new Error('Failed to update form data');
      }
    } else {
      // Insert new data
      const { error: insertError } = await supabase
        .from('parent_iep_data')
        .insert({
          session_id: session.id,
          org_id: session.org_id,
          form_section: sectionId,
          form_data: formData
        });

      if (insertError) {
        throw new Error('Failed to save form data');
      }
    }

    // Update session last activity
    await supabase
      .from('parent_iep_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', session.id);

    return new Response(
      JSON.stringify({
        success: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in save-iep-data:', error);
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});