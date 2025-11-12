import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ErrorPattern {
  type: string;
  severity: 'critical' | 'warning';
  description: string;
  affectedUsers: number;
  errorCount: number;
  errors: Array<{
    message: string;
    user_id?: string;
    context?: any;
    timestamp: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔍 Starting error monitoring check...");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Check rate limiting - get last notification times from a simple JSON storage
    const { data: lastNotifications } = await supabase
      .from('system_config')
      .select('config_value')
      .eq('config_key', 'last_error_notifications')
      .single();

    const lastSent = lastNotifications?.config_value || {};
    const patterns: ErrorPattern[] = [];

    // 1. Check for multiple upload failures from same user (3+ in 15 mins)
    const { data: userUploadFailures } = await supabase
      .from('system_error_log')
      .select('user_id, error_message, context_data, created_at')
      .eq('error_type', 'document_upload_failure')
      .gte('created_at', fifteenMinutesAgo.toISOString());

    if (userUploadFailures) {
      const userFailureMap = new Map<string, typeof userUploadFailures>();
      userUploadFailures.forEach(error => {
        const userId = error.user_id || 'anonymous';
        if (!userFailureMap.has(userId)) {
          userFailureMap.set(userId, []);
        }
        userFailureMap.get(userId)!.push(error);
      });

      userFailureMap.forEach((failures, userId) => {
        if (failures.length >= 3 && (!lastSent['user_upload_failures'] || 
            new Date(lastSent['user_upload_failures']) < oneHourAgo)) {
          patterns.push({
            type: 'user_upload_failures',
            severity: 'warning',
            description: `User experiencing repeated upload failures`,
            affectedUsers: 1,
            errorCount: failures.length,
            errors: failures.map(f => ({
              message: f.error_message,
              user_id: f.user_id,
              context: f.context_data,
              timestamp: f.created_at,
            })),
          });
        }
      });
    }

    // 2. Check for system-wide upload issues (5+ failures from different users in 15 mins)
    if (userUploadFailures && userUploadFailures.length >= 5) {
      const uniqueUsers = new Set(userUploadFailures.map(e => e.user_id).filter(Boolean));
      if (uniqueUsers.size >= 3 && (!lastSent['system_upload_failures'] || 
          new Date(lastSent['system_upload_failures']) < oneHourAgo)) {
        patterns.push({
          type: 'system_upload_failures',
          severity: 'critical',
          description: `System-wide upload failures detected`,
          affectedUsers: uniqueUsers.size,
          errorCount: userUploadFailures.length,
          errors: userUploadFailures.slice(0, 10).map(f => ({
            message: f.error_message,
            user_id: f.user_id,
            context: f.context_data,
            timestamp: f.created_at,
          })),
        });
      }
    }

    // 3. Check for high error rate (10+ errors of any type in 15 mins)
    const { data: allRecentErrors, count: errorCount } = await supabase
      .from('system_error_log')
      .select('*', { count: 'exact' })
      .gte('created_at', fifteenMinutesAgo.toISOString());

    if (errorCount && errorCount >= 10 && (!lastSent['high_error_rate'] || 
        new Date(lastSent['high_error_rate']) < oneHourAgo)) {
      const uniqueUsers = new Set(allRecentErrors?.map(e => e.user_id).filter(Boolean) || []);
      patterns.push({
        type: 'high_error_rate',
        severity: 'critical',
        description: `Unusually high error rate detected`,
        affectedUsers: uniqueUsers.size,
        errorCount: errorCount,
        errors: (allRecentErrors || []).slice(0, 10).map(e => ({
          message: e.error_message,
          user_id: e.user_id,
          context: e.context_data,
          timestamp: e.created_at,
        })),
      });
    }

    // 4. Check for 404 spikes (5+ in 15 mins)
    const { data: notFoundErrors, count: notFoundCount } = await supabase
      .from('system_error_log')
      .select('*', { count: 'exact' })
      .eq('error_type', 'page_not_found')
      .gte('created_at', fifteenMinutesAgo.toISOString());

    if (notFoundCount && notFoundCount >= 5 && (!lastSent['404_spike'] || 
        new Date(lastSent['404_spike']) < oneHourAgo)) {
      patterns.push({
        type: '404_spike',
        severity: 'warning',
        description: `Spike in 404 errors detected`,
        affectedUsers: new Set(notFoundErrors?.map(e => e.user_id).filter(Boolean) || []).size,
        errorCount: notFoundCount,
        errors: (notFoundErrors || []).slice(0, 10).map(e => ({
          message: e.error_message,
          user_id: e.user_id,
          context: e.context_data,
          timestamp: e.created_at,
        })),
      });
    }

    console.log(`📊 Found ${patterns.length} error patterns to notify`);

    // Send notifications for detected patterns
    if (patterns.length > 0) {
      const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@example.com";
      
      for (const pattern of patterns) {
        const emailHtml = generateAlertEmail(pattern);
        
        const { error: emailError } = await resend.emails.send({
          from: "System Alerts <alerts@resend.dev>",
          to: [adminEmail],
          subject: `🚨 ${pattern.severity === 'critical' ? 'CRITICAL' : 'Warning'}: ${pattern.description}`,
          html: emailHtml,
        });

        if (emailError) {
          console.error(`Failed to send email for ${pattern.type}:`, emailError);
        } else {
          console.log(`✅ Sent alert email for ${pattern.type}`);
          
          // Update last sent time
          lastSent[pattern.type] = now.toISOString();
        }
      }

      // Store updated notification times
      await supabase
        .from('system_config')
        .upsert({
          config_key: 'last_error_notifications',
          config_value: lastSent,
          updated_at: now.toISOString(),
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        patternsDetected: patterns.length,
        patterns: patterns.map(p => ({
          type: p.type,
          severity: p.severity,
          errorCount: p.errorCount,
          affectedUsers: p.affectedUsers,
        }))
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in monitor-critical-errors:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateAlertEmail(pattern: ErrorPattern): string {
  const severityColor = pattern.severity === 'critical' ? '#dc2626' : '#f59e0b';
  const severityIcon = pattern.severity === 'critical' ? '🚨' : '⚠️';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${severityColor}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .metric { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid ${severityColor}; border-radius: 4px; }
          .error-list { background: white; padding: 15px; margin: 15px 0; border-radius: 4px; max-height: 400px; overflow-y: auto; }
          .error-item { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
          .error-item:last-child { border-bottom: none; }
          .timestamp { color: #6b7280; font-size: 12px; }
          .action-button { display: inline-block; background: ${severityColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${severityIcon} ${pattern.description}</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.95;">Detected at ${new Date().toLocaleString()}</p>
          </div>
          <div class="content">
            <div class="metric">
              <strong>Severity:</strong> ${pattern.severity.toUpperCase()}
            </div>
            <div class="metric">
              <strong>Affected Users:</strong> ${pattern.affectedUsers}
            </div>
            <div class="metric">
              <strong>Error Count:</strong> ${pattern.errorCount} errors in the last 15 minutes
            </div>
            
            <h3 style="margin-top: 25px;">Recent Errors:</h3>
            <div class="error-list">
              ${pattern.errors.map(error => `
                <div class="error-item">
                  <div><strong>Message:</strong> ${error.message}</div>
                  ${error.user_id ? `<div><strong>User ID:</strong> ${error.user_id}</div>` : ''}
                  ${error.context ? `<div><strong>Context:</strong> ${JSON.stringify(error.context).slice(0, 200)}</div>` : ''}
                  <div class="timestamp">${new Date(error.timestamp).toLocaleString()}</div>
                </div>
              `).join('')}
            </div>
            
            <p style="margin-top: 20px;">
              <strong>Recommended Action:</strong> 
              ${pattern.severity === 'critical' 
                ? 'This is a critical issue that requires immediate attention. Check system logs and investigate the root cause.'
                : 'Monitor the situation. If errors continue, investigate potential issues with affected features.'}
            </p>
            
            <a href="${Deno.env.get("VITE_SUPABASE_URL")}/project/_/editor" class="action-button">
              View Super Admin Dashboard
            </a>
          </div>
        </div>
      </body>
    </html>
  `;
}

serve(handler);
