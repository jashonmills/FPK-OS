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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('🗑️ Starting test data deletion...');

    // Delete all logs and records
    const tables = [
      'incident_logs',
      'parent_logs',
      'educator_logs',
      'sleep_records',
      'progress_metrics',
      'intervention_outcomes',
      'biometric_alerts',
      'ai_insights',
      'notifications',
      'family_data_embeddings'
    ];

    let totalDeleted = 0;

    for (const table of tables) {
      const { error, count } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
      } else {
        console.log(`✅ Deleted all records from ${table}`);
        if (count) totalDeleted += count;
      }
    }

    console.log(`✅ Test data cleared successfully. Total records deleted: ${totalDeleted}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Test data cleared successfully. Deleted ${totalDeleted} records.`,
        tables_cleared: tables
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in clear-test-data:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
