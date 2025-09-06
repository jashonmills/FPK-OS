import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { organizationId, export_type, format } = await req.json();

    let data = {};
    
    // Get organization info
    const { data: org } = await supabaseClient
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (export_type === 'members' || export_type === 'complete') {
      const { data: members } = await supabaseClient
        .from('org_members')
        .select(`*, profiles(full_name, display_name)`)
        .eq('organization_id', organizationId);
      data.members = members;
    }

    // Create export record
    const { data: exportRecord } = await supabaseClient
      .from('organization_exports')
      .insert({
        organization_id: organizationId,
        requested_by: (await supabaseClient.auth.getUser()).data.user?.id,
        export_type,
        status: 'completed',
        completed_at: new Date().toISOString(),
        metadata: { format, record_count: Object.keys(data).length }
      })
      .select()
      .single();

    return new Response(JSON.stringify({ 
      success: true, 
      export_id: exportRecord?.id,
      data: format === 'json' ? data : 'CSV export completed'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});