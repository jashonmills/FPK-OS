import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { family_id, student_id } = await req.json();
    console.log('🔄 Syncing document metrics to tracking for family:', family_id, 'student:', student_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all document metrics for this student
    const { data: metrics, error: metricsError } = await supabase
      .from('document_metrics')
      .select('*')
      .eq('family_id', family_id)
      .eq('student_id', student_id);

    if (metricsError) {
      console.error('❌ Error fetching metrics:', metricsError);
      throw metricsError;
    }

    console.log(`📊 Found ${metrics?.length || 0} document metrics`);

    // Group metrics by type and name
    const metricGroups = new Map<string, typeof metrics>();
    metrics?.forEach(metric => {
      const key = `${metric.metric_type}:${metric.metric_name}`;
      if (!metricGroups.has(key)) {
        metricGroups.set(key, []);
      }
      metricGroups.get(key)?.push(metric);
    });

    let goalsCreated = 0;
    let progressRecordsCreated = 0;

    // For each metric group, create a goal and progress tracking records
    for (const [key, groupMetrics] of metricGroups) {
      const [metricType, metricName] = key.split(':');
      
      // Calculate average and max values
      const values = groupMetrics.map(m => m.metric_value).filter(v => v !== null);
      const targets = groupMetrics.map(m => m.target_value).filter(v => v !== null);
      
      if (values.length === 0) continue;

      const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
      const maxTarget = targets.length > 0 ? Math.max(...targets) : avgValue * 1.2;

      // Check if goal already exists
      const { data: existingGoal } = await supabase
        .from('goals')
        .select('id')
        .eq('family_id', family_id)
        .eq('student_id', student_id)
        .eq('goal_type', metricType)
        .eq('goal_title', metricName)
        .maybeSingle();

      let goalId = existingGoal?.id;

      // Create goal if it doesn't exist
      if (!goalId) {
        const { data: newGoal, error: goalError } = await supabase
          .from('goals')
          .insert({
            family_id,
            student_id,
            goal_type: metricType,
            goal_title: metricName,
            goal_description: `Goal auto-generated from document analysis`,
            current_value: avgValue,
            target_value: maxTarget,
            unit: groupMetrics[0].metric_unit || 'points',
            is_active: true,
            start_date: new Date().toISOString().split('T')[0],
            target_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months
          })
          .select('id')
          .single();

        if (goalError) {
          console.error('❌ Error creating goal:', goalError);
          continue;
        }

        goalId = newGoal.id;
        goalsCreated++;
        console.log(`✅ Created goal: ${metricName} (${metricType})`);
      }

      // Create progress tracking records for each metric
      for (const metric of groupMetrics) {
        if (!metric.metric_value || !metric.measurement_date) continue;

        // Check if progress record already exists
        const { data: existingProgress } = await supabase
          .from('progress_tracking')
          .select('id')
          .eq('family_id', family_id)
          .eq('student_id', student_id)
          .eq('metric_type', metricType)
          .eq('tracking_period', metric.measurement_date)
          .maybeSingle();

        if (existingProgress) continue;

        const progressPercentage = maxTarget > 0 
          ? Math.min(100, (metric.metric_value / maxTarget) * 100)
          : 0;

        const { error: progressError } = await supabase
          .from('progress_tracking')
          .insert({
            family_id,
            student_id,
            metric_type: metricType,
            current_value: metric.metric_value,
            target_value: metric.target_value || maxTarget,
            progress_percentage: progressPercentage,
            tracking_period: metric.measurement_date,
            notes: `Auto-synced from document: ${metric.metric_name}`,
            trend: 'stable',
          });

        if (progressError) {
          console.error('❌ Error creating progress record:', progressError);
          continue;
        }

        progressRecordsCreated++;
      }
    }

    console.log(`✅ Sync complete: ${goalsCreated} goals, ${progressRecordsCreated} progress records`);

    return new Response(
      JSON.stringify({
        success: true,
        goals_created: goalsCreated,
        progress_records_created: progressRecordsCreated,
        metrics_processed: metrics?.length || 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Sync error:', error);
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
