import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { family_id } = await req.json();
    console.log('🔄 Triggering re-analysis for family:', family_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call re-analyze-all-documents
    const { data: reanalyzeData, error: reanalyzeError } = await supabase.functions.invoke(
      're-analyze-all-documents',
      {
        body: { family_id }
      }
    );

    if (reanalyzeError) {
      console.error('❌ Re-analysis error:', reanalyzeError);
      throw reanalyzeError;
    }

    console.log('✅ Re-analysis complete:', reanalyzeData);

    // After re-analysis, sync metrics to tracking
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('id')
      .eq('family_id', family_id)
      .eq('is_active', true);

    if (studentsError) {
      console.error('❌ Error fetching students:', studentsError);
      throw studentsError;
    }

    let syncResults = [];
    for (const student of studentsData || []) {
      console.log(`🔄 Syncing metrics for student: ${student.id}`);
      
      const { data: syncData, error: syncError } = await supabase.functions.invoke(
        'sync-document-metrics-to-tracking',
        {
          body: {
            family_id,
            student_id: student.id
          }
        }
      );

      if (syncError) {
        console.error(`❌ Sync error for student ${student.id}:`, syncError);
      } else {
        console.log(`✅ Sync complete for student ${student.id}:`, syncData);
        syncResults.push(syncData);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        re_analysis: reanalyzeData,
        sync_results: syncResults,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
