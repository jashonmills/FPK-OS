import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResult {
  stalledJobs: number;
  stalledJobIds: string[];
  lastCompletionHoursAgo: number | null;
  alertTriggered: boolean;
  issues: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔔 OPERATION SENTINEL: Initiating pipeline health check...');

    // Initialize Supabase client with SERVICE ROLE for full access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const result: HealthCheckResult = {
      stalledJobs: 0,
      stalledJobIds: [],
      lastCompletionHoursAgo: null,
      alertTriggered: false,
      issues: []
    };

    // ============================================
    // QUERY A: Detect Stalled Jobs
    // ============================================
    console.log('🔍 Checking for stalled jobs (>1 hour old)...');
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: stalledJobs, error: stalledError } = await supabaseAdmin
      .from('embedding_queue')
      .select('id, status, created_at, source_id, source_table')
      .in('status', ['pending', 'processing'])
      .lt('created_at', oneHourAgo);

    if (stalledError) {
      console.error('❌ Error checking stalled jobs:', stalledError);
      throw stalledError;
    }

    if (stalledJobs && stalledJobs.length > 0) {
      result.stalledJobs = stalledJobs.length;
      result.stalledJobIds = stalledJobs.map(job => job.id);
      result.issues.push(
        `🚨 STALLED JOBS DETECTED: ${stalledJobs.length} items stuck in queue for over 1 hour`
      );
      
      console.log(`⚠️ Found ${stalledJobs.length} stalled jobs:`, stalledJobs);
    } else {
      console.log('✅ No stalled jobs found');
    }

    // ============================================
    // QUERY B: Detect Silent Pipeline
    // ============================================
    console.log('🔍 Checking for silent pipeline (no activity in 24 hours)...');
    
    const { data: lastCompletionData, error: completionError } = await supabaseAdmin
      .from('embedding_queue')
      .select('processed_at')
      .eq('status', 'completed')
      .order('processed_at', { ascending: false })
      .limit(1)
      .single();

    if (completionError && completionError.code !== 'PGRST116') {
      console.error('❌ Error checking last completion:', completionError);
      throw completionError;
    }

    if (lastCompletionData?.processed_at) {
      const lastCompletion = new Date(lastCompletionData.processed_at);
      const hoursSinceCompletion = (Date.now() - lastCompletion.getTime()) / (1000 * 60 * 60);
      result.lastCompletionHoursAgo = Math.round(hoursSinceCompletion * 10) / 10;

      console.log(`📊 Last completion: ${hoursSinceCompletion.toFixed(1)} hours ago`);

      if (hoursSinceCompletion > 24) {
        result.issues.push(
          `🚨 SILENT PIPELINE DETECTED: No embeddings completed in ${Math.floor(hoursSinceCompletion)} hours`
        );
        console.log(`⚠️ Silent pipeline detected: ${hoursSinceCompletion} hours since last completion`);
      } else {
        console.log('✅ Pipeline is active');
      }
    } else {
      result.issues.push('🚨 CRITICAL: No completed embeddings found in system');
      console.log('⚠️ No completed embeddings found in the entire system');
    }

    // ============================================
    // ALERT TRIGGER DECISION
    // ============================================
    result.alertTriggered = result.issues.length > 0;

    if (result.alertTriggered) {
      console.log('🚨 ALERT CONDITION MET - Sending critical notification...');
      
      // Construct alert email body
      const emailBody = `
        <div style="font-family: monospace; background: #1a1a1a; color: #00ff00; padding: 20px; border: 2px solid #ff0000;">
          <h1 style="color: #ff0000; text-align: center;">🚨 CRITICAL ALERT 🚨</h1>
          <h2 style="color: #ffaa00;">FPKx Pipeline Failure Detected</h2>
          
          <div style="background: #000; padding: 15px; margin: 20px 0; border-left: 4px solid #ff0000;">
            <h3 style="color: #ff6666;">DETECTED ISSUES:</h3>
            <ul style="line-height: 1.8;">
              ${result.issues.map(issue => `<li>${issue}</li>`).join('\n')}
            </ul>
          </div>

          ${result.stalledJobs > 0 ? `
          <div style="background: #000; padding: 15px; margin: 20px 0; border-left: 4px solid #ffaa00;">
            <h3 style="color: #ffaa00;">STALLED JOBS DETAIL:</h3>
            <p>Total Stalled: <strong>${result.stalledJobs}</strong></p>
            <p>Job IDs: ${result.stalledJobIds.slice(0, 5).join(', ')}${result.stalledJobIds.length > 5 ? '...' : ''}</p>
          </div>
          ` : ''}

          ${result.lastCompletionHoursAgo !== null ? `
          <div style="background: #000; padding: 15px; margin: 20px 0; border-left: 4px solid #00aaff;">
            <h3 style="color: #00aaff;">PIPELINE ACTIVITY:</h3>
            <p>Last Completion: <strong>${result.lastCompletionHoursAgo} hours ago</strong></p>
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 15px; background: #2a2a2a; border-top: 2px solid #ff0000;">
            <p style="color: #aaa; margin: 5px 0;">Alert Time: ${new Date().toISOString()}</p>
            <p style="color: #aaa; margin: 5px 0;">Source: Operation Sentinel - Automated Pipeline Monitor</p>
            <p style="color: #ff6666; margin: 15px 0 5px 0; font-weight: bold;">ACTION REQUIRED: Investigate embedding pipeline immediately</p>
          </div>
        </div>
      `;

      // Send alert via Resend API
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'FPKx Alerts <onboarding@resend.dev>',
          to: ['alerts-engineering@fpkx.com'],
          subject: '🚨 CRITICAL ALERT: FPKx Pipeline Failure Detected!',
          html: emailBody,
        }),
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        console.error('❌ Failed to send alert email:', errorText);
        throw new Error(`Email send failed: ${errorText}`);
      }

      const emailData = await resendResponse.json();
      console.log('✅ Alert email sent successfully:', emailData);
    } else {
      console.log('✅ All systems operational - No alerts triggered');
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        ...result
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Health check failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
