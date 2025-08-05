import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailData {
  user: {
    email: string;
    id: string;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("🔥 Auth email function called at:", new Date().toISOString());
  console.log("📧 Request method:", req.method);
  console.log("🔑 Environment check - RESEND_API_KEY exists:", !!Deno.env.get("RESEND_API_KEY"));

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.error("❌ Invalid method:", req.method);
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    console.log("📨 Processing Supabase auth hook request...");
    
    let authData: AuthEmailData;
    try {
      authData = await req.json();
      console.log("✅ Auth hook payload parsed successfully");
      console.log("👤 User email:", authData.user?.email);
      console.log("📝 Email action type:", authData.email_data?.email_action_type);
    } catch (parseError: any) {
      console.error("❌ Failed to parse auth hook payload:", parseError.message);
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { user, email_data } = authData;
    
    if (!user?.email || !email_data) {
      console.error("❌ Missing required data in payload");
      return new Response(
        JSON.stringify({ error: "Missing user email or email_data" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("👤 Processing auth email for:", user.email);
    console.log("📝 Email action type:", email_data.email_action_type);
    console.log("🔄 Redirect URL:", email_data.redirect_to);
    console.log("🌐 Site URL:", email_data.site_url);

    let subject = "";
    let emailContent = "";
    let fromEmail = "FPK University <onboarding@resend.dev>";
    
    // Generate email content based on type
    switch (email_data.email_action_type) {
      case "signup":
        subject = "Welcome to FPK University - Confirm Your Account";
        emailContent = generateSignupEmail(email_data);
        break;
      case "recovery":
        subject = "FPK University - Reset Your Password";
        emailContent = generateRecoveryEmail(email_data);
        break;
      case "magiclink":
        subject = "FPK University - Your Magic Link";
        emailContent = generateMagicLinkEmail(email_data);
        break;
      default:
        subject = "FPK University - Account Action Required";
        emailContent = generateDefaultEmail(email_data);
        console.log("⚠️ Unknown email action type:", email_data.email_action_type);
    }

    console.log("📧 Sending email with subject:", subject);
    console.log("📤 From:", fromEmail);
    console.log("📥 To:", user.email);

    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [user.email],
      subject,
      html: emailContent,
    });

    if (emailResponse.error) {
      console.error("❌ Resend error:", emailResponse.error);
      throw new Error(`Resend API error: ${emailResponse.error.message || emailResponse.error}`);
    }

    console.log("✅ Email sent successfully!");
    console.log("📧 Resend email ID:", emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      id: emailResponse.data?.id,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("💥 Fatal error in send-auth-email function:");
    console.error("📍 Error message:", error.message);
    console.error("📚 Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        function: "send-auth-email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateSignupEmail(emailData: any): string {
  const confirmUrl = `${emailData.site_url}/auth/v1/verify?token=${emailData.token_hash}&type=signup&redirect_to=${emailData.redirect_to}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to FPK University</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome to FPK University!</h1>
        <p style="font-size: 18px; color: #666;">Thank you for joining our learning community</p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin: 20px 0;">
        <p style="margin: 0 0 20px 0;">Please confirm your email address to activate your account and start your learning journey.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmUrl}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Confirm Email Address
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${confirmUrl}" style="color: #2563eb; word-break: break-all;">${confirmUrl}</a>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 14px; color: #666;">
          This link will expire in 24 hours. If you didn't create this account, you can safely ignore this email.
        </p>
        <p style="font-size: 12px; color: #999; margin-top: 20px;">
          © 2024 FPK University. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
}

function generateRecoveryEmail(emailData: any): string {
  // Extract the base Supabase URL and construct the proper verification endpoint
  // emailData.site_url is typically https://PROJECT_ID.supabase.co/auth/v1
  const baseUrl = emailData.site_url.replace('/auth/v1', '');
  const resetUrl = `${baseUrl}/auth/v1/verify?token=${emailData.token_hash}&type=recovery&redirect_to=${encodeURIComponent(emailData.redirect_to)}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your FPK University Password</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #dc2626; margin-bottom: 10px;">Password Reset Request</h1>
        <p style="font-size: 18px; color: #666;">Reset your FPK University password</p>
      </div>
      
      <div style="background: #fef2f2; border-radius: 8px; padding: 24px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <p style="margin: 0 0 20px 0;">We received a request to reset your password. Click the button below to create a new password.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Reset Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 14px; color: #666;">
          This link will expire in 1 hour. If you didn't request this reset, you can safely ignore this email.
        </p>
        <p style="font-size: 12px; color: #999; margin-top: 20px;">
          © 2024 FPK University. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
}

function generateMagicLinkEmail(emailData: any): string {
  const magicUrl = `${emailData.site_url}/auth/v1/verify?token=${emailData.token_hash}&type=magiclink&redirect_to=${emailData.redirect_to}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your FPK University Magic Link</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7c3aed; margin-bottom: 10px;">Your Magic Link</h1>
        <p style="font-size: 18px; color: #666;">Quick sign-in to FPK University</p>
      </div>
      
      <div style="background: #faf5ff; border-radius: 8px; padding: 24px; margin: 20px 0; border-left: 4px solid #7c3aed;">
        <p style="margin: 0 0 20px 0;">Click the button below to instantly sign in to your FPK University account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${magicUrl}" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Sign In Instantly
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${magicUrl}" style="color: #7c3aed; word-break: break-all;">${magicUrl}</a>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 14px; color: #666;">
          This link will expire in 1 hour. If you didn't request this link, you can safely ignore this email.
        </p>
        <p style="font-size: 12px; color: #999; margin-top: 20px;">
          © 2024 FPK University. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
}

function generateDefaultEmail(emailData: any): string {
  const actionUrl = `${emailData.site_url}/auth/v1/verify?token=${emailData.token_hash}&type=${emailData.email_action_type}&redirect_to=${emailData.redirect_to}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>FPK University - Account Action Required</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin-bottom: 10px;">FPK University</h1>
        <p style="font-size: 18px; color: #666;">Account action required</p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin: 20px 0;">
        <p style="margin: 0 0 20px 0;">Please click the button below to complete the requested action on your account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${actionUrl}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Complete Action
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${actionUrl}" style="color: #2563eb; word-break: break-all;">${actionUrl}</a>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 14px; color: #666;">
          If you didn't request this action, you can safely ignore this email.
        </p>
        <p style="font-size: 12px; color: #999; margin-top: 20px;">
          © 2024 FPK University. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
}

serve(handler);