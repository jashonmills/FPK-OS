import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { organizationId, subject, message, notification_type } = await req.json();

    // Get organization members
    const { data: members, error: membersError } = await supabaseClient
      .from('org_members')
      .select(`
        user_id,
        profiles:profiles(full_name, display_name)
      `)
      .eq('organization_id', organizationId)
      .eq('status', 'active');

    if (membersError) throw membersError;

    // Get user emails from auth.users (requires service role)
    const userIds = members.map(m => m.user_id);
    const { data: users, error: usersError } = await supabaseClient.auth.admin.listUsers();
    if (usersError) throw usersError;

    const memberEmails = users.users
      .filter(user => userIds.includes(user.id))
      .map(user => user.email);

    // Send emails using Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    const emailPromises = memberEmails.map(email => 
      resend.emails.send({
        from: "FPK University <noreply@fpkuniversity.com>",
        to: [email],
        subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Organization Notification</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              This message was sent to all members of your organization.
            </p>
          </div>
        `,
      })
    );

    await Promise.all(emailPromises);

    // Log notification
    await supabaseClient.from('organization_notifications').insert({
      organization_id: organizationId,
      sent_by: (await supabaseClient.auth.getUser()).data.user?.id,
      subject,
      message,
      notification_type,
      recipient_count: memberEmails.length,
    });

    return new Response(JSON.stringify({ success: true, sent: memberEmails.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});