import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationEmailRequest {
  orgId: string;
  email: string;
  role: string;
  organizationName?: string;
  inviterName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orgId, email, role, organizationName, inviterName }: InvitationEmailRequest = await req.json();
    
    console.log("Sending invitation email:", { orgId, email, role, organizationName });

    // Create Supabase client to get organization details if not provided
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let orgName = organizationName;
    if (!orgName) {
      const { data: org } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', orgId)
        .single();
      orgName = org?.name || 'the organization';
    }

    // Create an invitation code in the database
    const { data: inviteData, error: inviteError } = await supabase.rpc('org_create_invite', {
      p_org_id: orgId,
      p_role: role,
      p_max_uses: 1, // Single use for email invitations
      p_expires_interval: '7 days'
    });

    if (inviteError) {
      console.error('Error creating invite code:', inviteError);
      throw new Error('Failed to create invitation code');
    }

    const inviteCode = inviteData as string;
    
    // Generate invitation link with the code
    const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '') || 'https://fpkuniversity.com';
    const inviteUrl = `${baseUrl}/join?code=${inviteCode}`;

    const emailResponse = await resend.emails.send({
      from: "FPK University <noreply@fpkuniversity.com>",
      to: [email],
      subject: `You're invited to join ${orgName}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">You're Invited!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Join ${orgName} on FPK University</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">
              Hello! ${inviterName ? `${inviterName}` : 'Someone'} has invited you to join <strong>${orgName}</strong> as a <strong>${role}</strong>.
            </p>
            
            <p style="font-size: 16px; color: #374151; margin: 0 0 30px 0;">
              Click the button below to accept your invitation and get started:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" 
                 style="background: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                Accept Invitation
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin: 30px 0 0 0; text-align: center;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${inviteUrl}" style="color: #7c3aed; word-break: break-all;">${inviteUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="font-size: 12px; color: #9ca3af;">
              This invitation was sent by FPK University. If you weren't expecting this email, you can safely ignore it.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-invitation-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);