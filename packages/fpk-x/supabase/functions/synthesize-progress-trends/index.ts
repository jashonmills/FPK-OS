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

    if (!family_id || !student_id) {
      throw new Error('family_id and student_id are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all metrics for the student, grouped by metric_type
    const { data: metrics, error: metricsError } = await supabase
      .from('document_metrics')
      .select('*')
      .eq('family_id', family_id)
      .eq('student_id', student_id)
      .order('measurement_date', { ascending: true });

    if (metricsError) throw metricsError;

    if (!metrics || metrics.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No metrics found to analyze' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Group metrics by type
    const metricsByType = metrics.reduce((acc, metric) => {
      const key = metric.metric_type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(metric);
      return acc;
    }, {} as Record<string, any[]>);

    const progressRecords = [];

    // Analyze each metric type
    for (const [metricType, metricList] of Object.entries(metricsByType)) {
      const typedMetricList = metricList as any[];
      
      if (typedMetricList.length < 2) continue; // Need at least 2 data points

      // Sort by date
      typedMetricList.sort((a: any, b: any) => 
        new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime()
      );

      const baseline = typedMetricList[0];
      const current = typedMetricList[typedMetricList.length - 1];
      const target = baseline.target_value || current.target_value;

      // Calculate trend
      let trend = 'stable';
      const percentChange = ((current.metric_value - baseline.metric_value) / baseline.metric_value) * 100;

      // Determine if we want values to increase or decrease
      const isReductionMetric = metricType.includes('incident') || 
                                metricType.includes('dysregulation') ||
                                metricType.includes('behavioral');

      if (Math.abs(percentChange) < 10) {
        trend = 'stable';
      } else if (percentChange > 10) {
        trend = isReductionMetric ? 'regressing' : 'improving';
      } else {
        trend = isReductionMetric ? 'improving' : 'regressing';
      }

      // Check if target is achieved
      if (target !== null) {
        if (isReductionMetric && current.metric_value <= target) {
          trend = 'achieved';
        } else if (!isReductionMetric && current.metric_value >= target) {
          trend = 'achieved';
        }
      }

      // Calculate progress percentage
      let progressPercentage = 0;
      if (target !== null && baseline.metric_value !== target) {
        progressPercentage = Math.min(100, Math.max(0,
          ((current.metric_value - baseline.metric_value) / (target - baseline.metric_value)) * 100
        ));
      }

      progressRecords.push({
        family_id,
        student_id,
        document_id: current.document_id,
        metric_type: metricType,
        baseline_value: baseline.metric_value,
        current_value: current.metric_value,
        target_value: target,
        progress_percentage: Math.round(progressPercentage),
        trend,
        period_start: baseline.measurement_date,
        period_end: current.measurement_date,
        notes: `Analyzed ${typedMetricList.length} data points. Change: ${percentChange.toFixed(1)}%`
      });
    }

    // Upsert progress tracking records
    if (progressRecords.length > 0) {
      const { error: insertError } = await supabase
        .from('progress_tracking')
        .upsert(progressRecords, {
          onConflict: 'family_id,student_id,metric_type',
          ignoreDuplicates: false
        });

      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        records_created: progressRecords.length,
        trends_summary: {
          improving: progressRecords.filter(r => r.trend === 'improving').length,
          stable: progressRecords.filter(r => r.trend === 'stable').length,
          regressing: progressRecords.filter(r => r.trend === 'regressing').length,
          achieved: progressRecords.filter(r => r.trend === 'achieved').length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Synthesize progress trends error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});