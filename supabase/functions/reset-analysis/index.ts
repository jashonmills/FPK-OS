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
    const { family_id } = await req.json();

    if (!family_id) {
      return new Response(
        JSON.stringify({ error: "family_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Reset family analysis status
    await supabase
      .from("families")
      .update({
        initial_doc_analysis_status: "pending",
        suggested_charts_config: [],
        special_chart_trial_ends_at: null,
      })
      .eq("id", family_id);

    // Delete imported goals
    await supabase
      .from("goals")
      .delete()
      .eq("family_id", family_id);

    // Delete imported document metrics
    await supabase
      .from("document_metrics")
      .delete()
      .eq("family_id", family_id);

    // Delete imported progress tracking
    await supabase
      .from("progress_tracking")
      .delete()
      .eq("family_id", family_id);

    return new Response(
      JSON.stringify({ success: true, message: "Analysis reset complete" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in reset-analysis function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
