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

    console.log('🧹 Starting duplicate student data cleanup...');

    const results = {
      metrics_deleted: 0,
      students_deactivated: 0,
      goals_deleted: 0,
      insights_deleted: 0,
      errors: [] as string[]
    };

    // Step 1: Delete Old JACE's test metrics
    const oldJaceId = '18b96ce8-6bc3-48bb-98a8-2affdbc56ab6';
    const middleJaceId = '215b7244-34ec-4a23-8efb-aee26785c0f1';
    
    console.log('Deleting test metrics for old JACE...');
    const { error: metricsError, count: metricsCount } = await supabase
      .from('document_metrics')
      .delete()
      .eq('student_id', oldJaceId);

    if (metricsError) {
      console.error('Error deleting metrics:', metricsError);
      results.errors.push(`Metrics deletion failed: ${metricsError.message}`);
    } else {
      results.metrics_deleted = metricsCount || 0;
      console.log(`✅ Deleted ${metricsCount} test metrics`);
    }

    // Step 2: Deactivate duplicate student records
    console.log('Deactivating duplicate JACE students...');
    const { error: deactivateError, count: deactivateCount } = await supabase
      .from('students')
      .update({ is_active: false })
      .in('id', [oldJaceId, middleJaceId]);

    if (deactivateError) {
      console.error('Error deactivating students:', deactivateError);
      results.errors.push(`Student deactivation failed: ${deactivateError.message}`);
    } else {
      results.students_deactivated = deactivateCount || 0;
      console.log(`✅ Deactivated ${deactivateCount} duplicate students`);
    }

    // Step 3: Clean up goals for inactive students
    console.log('Cleaning up orphaned goals...');
    const { data: inactiveStudents } = await supabase
      .from('students')
      .select('id')
      .eq('is_active', false);

    if (inactiveStudents && inactiveStudents.length > 0) {
      const inactiveIds = inactiveStudents.map(s => s.id);
      
      const { error: goalsError, count: goalsCount } = await supabase
        .from('goals')
        .delete()
        .in('student_id', inactiveIds);

      if (goalsError) {
        console.error('Error deleting goals:', goalsError);
        results.errors.push(`Goals deletion failed: ${goalsError.message}`);
      } else {
        results.goals_deleted = goalsCount || 0;
        console.log(`✅ Deleted ${goalsCount} orphaned goals`);
      }

      // Step 4: Clean up AI insights for inactive students
      console.log('Cleaning up orphaned AI insights...');
      const { error: insightsError, count: insightsCount } = await supabase
        .from('ai_insights')
        .delete()
        .in('student_id', inactiveIds);

      if (insightsError) {
        console.error('Error deleting insights:', insightsError);
        results.errors.push(`Insights deletion failed: ${insightsError.message}`);
      } else {
        results.insights_deleted = insightsCount || 0;
        console.log(`✅ Deleted ${insightsCount} orphaned insights`);
      }
    }

    console.log('✅ Cleanup completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Duplicate student data cleanup completed',
        results
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in cleanup-duplicate-students:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
