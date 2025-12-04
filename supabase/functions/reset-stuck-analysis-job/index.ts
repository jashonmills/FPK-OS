import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { job_id } = await req.json();
    
    if (!job_id) {
      return new Response(
        JSON.stringify({ error: "job_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update the stuck job to failed
    const { error: jobError } = await supabase
      .from('analysis_jobs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: 'Job manually reset due to timeout. Please retry analysis.'
      })
      .eq('id', job_id);

    if (jobError) {
      console.error('Error updating job:', jobError);
      return new Response(
        JSON.stringify({ error: 'Failed to update job status' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update all pending/analyzing documents in this job to failed
    const { error: statusError } = await supabase
      .from('document_analysis_status')
      .update({
        status: 'failed',
        error_message: 'timeout: Analysis timed out. Please retry.',
        completed_at: new Date().toISOString()
      })
      .eq('job_id', job_id)
      .in('status', ['pending', 'extracting', 'analyzing']);

    if (statusError) {
      console.error('Error updating document statuses:', statusError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Job reset successfully. You can now retry analysis.'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error resetting job:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
