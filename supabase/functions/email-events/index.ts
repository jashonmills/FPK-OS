import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface EmailEvent {
  type: 'email.sent' | 'email.delivered' | 'email.delivery_delayed' | 'email.complained' | 'email.bounced' | 'email.opened' | 'email.clicked';
  created_at: string;
  data: {
    created_at: string;
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    tags?: Array<{ name: string; value: string }>;
    bounce?: {
      bounce_type: string;
      message: string;
    };
    complaint?: {
      complaint_type: string;
      message: string;
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("📧 Email event webhook called at:", new Date().toISOString());
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const event: EmailEvent = await req.json();
    console.log("📧 Email event received:", event.type);
    console.log("📧 Email ID:", event.data.email_id);
    console.log("📧 To:", event.data.to.join(', '));

    // Log email event to database for monitoring
    const { error } = await supabase
      .from('email_delivery_logs')
      .insert({
        email_id: event.data.email_id,
        event_type: event.type,
        recipient: event.data.to[0],
        subject: event.data.subject,
        from_address: event.data.from,
        event_data: event.data,
        created_at: event.created_at
      });

    if (error) {
      console.error("❌ Failed to log email event:", error);
    }

    // Handle critical events
    if (event.type === 'email.bounced' || event.type === 'email.complained') {
      console.warn(`⚠️ Critical email event: ${event.type} for ${event.data.to[0]}`);
      
      // Log bounce/complaint for further investigation
      const eventDetails = event.type === 'email.bounced' 
        ? event.data.bounce 
        : event.data.complaint;
        
      console.warn("📧 Event details:", eventDetails);
      
      // Could implement additional logic here:
      // - Mark email as undeliverable
      // - Add to suppression list
      // - Send alert to admin
    }

    if (event.type === 'email.delivered') {
      console.log("✅ Email successfully delivered to:", event.data.to[0]);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("💥 Error processing email event:", error.message);
    
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