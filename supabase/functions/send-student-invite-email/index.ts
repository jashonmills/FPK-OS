import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@2.0.0';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentId, orgId, recipientEmail } = await req.json();

    if (!studentId || !orgId || !recipientEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch student and organization details
    const { data: student, error: studentError } = await supabaseAdmin
      .from('org_students')
      .select('*, activation_token, token_expires_at')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      console.error('Student fetch error:', studentError);
      throw new Error('Student not found');
    }

    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('name, slug, logo_url')
      .eq('id', orgId)
      .single();

    if (orgError || !org) {
      console.error('Organization fetch error:', orgError);
      throw new Error('Organization not found');
    }

    // Build activation URL
    const siteUrl = Deno.env.get('SITE_URL') || 'https://fpkuniversity.com';
    const activationUrl = `${siteUrl}/${org.slug}/activate?token=${student.activation_token}`;

    // Send email via Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `${org.name} <noreply@fpkuniversity.com>`,
      to: recipientEmail,
      subject: `Join ${org.name} on FPK University`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${org.logo_url ? `<img src="${org.logo_url}" alt="${org.name}" style="max-width: 150px; margin-bottom: 20px;">` : ''}
          <h2 style="color: #333;">You've been invited to join ${org.name}</h2>
          <p>Hello ${student.full_name},</p>
          <p>Your instructor has created a learning account for you. Click the button below to activate your account and start learning:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${activationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Activate My Account
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #4F46E5; word-break: break-all; font-size: 12px;">${activationUrl}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">This activation link will expire on ${new Date(student.token_expires_at).toLocaleDateString()}.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this invitation, please ignore this email.</p>
        </div>
      `
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      throw emailError;
    }

    console.log(`Student invitation email sent successfully to ${recipientEmail}`);

    return new Response(
      JSON.stringify({ success: true, emailId: emailData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-student-invite-email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
