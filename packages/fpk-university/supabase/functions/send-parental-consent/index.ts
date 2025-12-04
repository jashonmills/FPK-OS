import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConsentEmailRequest {
  userId: string;
  parentEmail: string;
  childName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId, parentEmail, childName }: ConsentEmailRequest = await req.json();

    if (!userId || !parentEmail || !childName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Creating consent request for user ${userId} to parent ${parentEmail}`);

    // Create consent request record
    const { data: consentRequest, error: insertError } = await supabaseAdmin
      .from("parental_consent_requests")
      .insert({
        user_id: userId,
        parent_email: parentEmail,
        status: "pending"
      })
      .select("consent_token")
      .single();

    if (insertError) {
      console.error("Error creating consent request:", insertError);
      throw insertError;
    }

    // Update user profile
    await supabaseAdmin
      .from("profiles")
      .update({
        parental_consent_status: "pending",
        parent_email: parentEmail,
        is_minor: true
      })
      .eq("id", userId);

    // Build consent URL
    const siteUrl = Deno.env.get("SITE_URL") || "https://fpkuniversity.com";
    const consentUrl = `${siteUrl}/parental-consent?token=${consentRequest.consent_token}`;

    // Send email
    const emailResponse = await resend.emails.send({
      from: "FPK University <noreply@fpkuniversity.com>",
      to: [parentEmail],
      subject: `Parental Consent Required for ${childName}'s FPK University Account`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #7c3aed, #f59e0b); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">FPK University</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Parental Consent Request</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Hello,</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              <strong>${childName}</strong> has requested to create an account on FPK University, 
              an educational learning platform. Since they are under 13 years old, we need your 
              consent to comply with the Children's Online Privacy Protection Act (COPPA).
            </p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0; font-size: 16px;">About FPK University:</h3>
              <ul style="color: #4b5563; padding-left: 20px; margin: 10px 0;">
                <li>Educational platform for learning</li>
                <li>AI-powered study assistance</li>
                <li>Progress tracking and gamification</li>
                <li>No advertising or in-app purchases</li>
              </ul>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Please review and respond to this consent request by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${consentUrl}" 
                 style="background: linear-gradient(135deg, #7c3aed, #f59e0b); 
                        color: white; 
                        padding: 14px 32px; 
                        border-radius: 8px; 
                        text-decoration: none; 
                        font-weight: 600;
                        display: inline-block;">
                Review Consent Request
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; line-height: 1.5;">
              This request will expire in 7 days. If you did not expect this email, 
              please ignore it or contact us at support@fpkuniversity.com.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              FPK University • COPPA Compliant Educational Platform<br>
              <a href="${siteUrl}" style="color: #7c3aed;">fpkuniversity.com</a>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Consent email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        consentToken: consentRequest.consent_token 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-parental-consent function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
