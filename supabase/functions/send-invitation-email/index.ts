import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationEmailRequest {
  email: string;
  organizationName: string;
  invitationCode: string;
  inviterName?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { email, organizationName, invitationCode, inviterName }: InvitationEmailRequest = await req.json();

    console.log(`Sending invitation email to ${email} for organization ${organizationName}`);

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    // Use the current deployment URL for now, can be updated when custom domain is ready
    const baseUrl = "https://37f15120-5ac1-49d9-9773-7dabbcb6a72b.sandbox.lovable.dev";
    const inviteUrl = `${baseUrl}/join/${invitationCode}`;
    
    const emailResponse = await resend.emails.send({
      from: "FPK University <noreply@fpkuniversity.com>",
      to: [email],
      subject: `You're invited to join ${organizationName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">FPK University</h1>
            <p style="color: #64748b; margin: 10px 0 0 0;">Learning Management Platform</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin: 0 0 20px 0;">You're invited to join ${organizationName}!</h2>
            
            ${inviterName ? `<p style="color: #475569; margin: 0 0 20px 0;">${inviterName} has invited you to join their organization on FPK University.</p>` : ''}
            
            <p style="color: #475569; margin: 0 0 30px 0;">Click the button below to accept your invitation and get started with your learning journey.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" style="background: #2563eb; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                If the button doesn't work, you can also copy and paste this link:
              </p>
              <p style="color: #2563eb; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
                ${inviteUrl}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              This invitation was sent to ${email}. If you didn't expect this email, you can safely ignore it.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, messageId: emailResponse.data?.id }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending invitation email:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send invitation email" 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});