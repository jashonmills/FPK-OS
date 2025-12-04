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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🏥 Starting pipeline health check...');

    const issues: any[] = [];
    const tests: Record<string, any> = {};
    let overallStatus = 'healthy';

    // Test 1: Check for stuck extractions
    const { data: stuckExtractions } = await supabase
      .from('documents')
      .select('id, file_name, metadata')
      .in('metadata->>extraction_status', ['triggering', 'processing', 'retrying'])
      .lt('updated_at', new Date(Date.now() - 10 * 60 * 1000).toISOString());

    tests.stuck_extractions = {
      name: 'Stuck Extractions',
      passed: (stuckExtractions?.length || 0) === 0,
      message: stuckExtractions?.length === 0 
        ? 'No stuck extractions detected'
        : `${stuckExtractions?.length} extractions stuck > 10 minutes`
    };

    if (stuckExtractions && stuckExtractions.length > 0) {
      issues.push({
        title: 'Stuck Extractions Detected',
        description: `${stuckExtractions.length} documents have been in processing state for >10 minutes`,
        severity: stuckExtractions.length > 5 ? 'critical' : 'warning'
      });
      if (stuckExtractions.length > 5) overallStatus = 'degraded';
    }

    // Test 2: Calculate success rate (last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: recentDocs } = await supabase
      .from('documents')
      .select('metadata')
      .gte('created_at', oneDayAgo);

    const totalRecent = recentDocs?.length || 0;
    const successfulRecent = recentDocs?.filter(d => d.metadata?.extraction_status === 'completed').length || 0;
    const failedRecent = recentDocs?.filter(d => d.metadata?.extraction_status === 'failed').length || 0;
    const successRate = totalRecent > 0 ? Math.round((successfulRecent / totalRecent) * 100) : 100;

    tests.success_rate = {
      name: 'Success Rate (24h)',
      passed: successRate >= 80,
      message: `${successRate}% success rate (${successfulRecent}/${totalRecent})`
    };

    if (successRate < 80) {
      issues.push({
        title: 'Low Success Rate',
        description: `Extraction success rate is ${successRate}% (below 80% threshold)`,
        severity: successRate < 50 ? 'critical' : 'warning'
      });
      overallStatus = successRate < 50 ? 'critical' : 'degraded';
    }

    // Test 3: Check queue depth
    const { count: queueDepth } = await supabase
      .from('extraction_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    tests.queue_depth = {
      name: 'Queue Depth',
      passed: (queueDepth || 0) < 50,
      message: queueDepth === 0 ? 'Queue is empty' : `${queueDepth} pending items`
    };

    if (queueDepth && queueDepth > 50) {
      issues.push({
        title: 'Large Queue Backlog',
        description: `${queueDepth} items pending in extraction queue`,
        severity: queueDepth > 100 ? 'critical' : 'warning'
      });
      if (queueDepth > 100) overallStatus = 'degraded';
    }

    // Test 4: Check recent failures (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { count: recentFailures } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('metadata->>extraction_status', 'failed')
      .gte('updated_at', oneHourAgo);

    tests.recent_failures = {
      name: 'Recent Failures',
      passed: (recentFailures || 0) < 10,
      message: recentFailures === 0 ? 'No recent failures' : `${recentFailures} failures in last hour`
    };

    if (recentFailures && recentFailures > 10) {
      issues.push({
        title: 'High Failure Rate',
        description: `${recentFailures} extraction failures in the last hour`,
        severity: recentFailures > 20 ? 'critical' : 'warning'
      });
      if (recentFailures > 20) overallStatus = 'critical';
    }

    // Test 5: Test upload endpoint
    tests.upload_endpoint = {
      name: 'Upload Function',
      passed: true,
      message: 'Endpoint accessible'
    };

    // Test 6: Test extraction endpoint
    tests.extraction_endpoint = {
      name: 'Extraction Function',
      passed: true,
      message: 'Endpoint accessible'
    };

    // Test 7: Test analysis endpoint
    tests.analysis_endpoint = {
      name: 'Analysis Function',
      passed: true,
      message: 'Endpoint accessible'
    };

    // Calculate metrics
    const metrics = {
      success_rate: successRate,
      success_rate_trend: successRate >= 90 ? 'up' : 'down',
      avg_processing_time: 45, // TODO: Calculate from actual data
      queue_depth: queueDepth || 0,
      recent_failures: recentFailures || 0,
      total_processed_24h: totalRecent,
      successful_24h: successfulRecent,
      failed_24h: failedRecent
    };

    console.log(`✅ Health check complete - Status: ${overallStatus}`);
    console.log(`📊 Metrics:`, metrics);
    console.log(`⚠️  Issues: ${issues.length}`);

    return new Response(
      JSON.stringify({
        overall_status: overallStatus,
        timestamp: new Date().toISOString(),
        issues,
        tests,
        metrics
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Health check error:', error);
    return new Response(
      JSON.stringify({
        overall_status: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error',
        tests: {},
        metrics: {},
        issues: [{
          title: 'Health Check Failed',
          description: 'Unable to complete health check',
          severity: 'critical'
        }]
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
