import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AlertRequest {
  familyId: string;
  studentId: string;
  alertType: 'heart_rate_elevated' | 'stress_level_high' | 'low_battery';
  triggerValue: number;
  baselineValue?: number;
}

/**
 * Handles biometric alerts from the Hub App
 * Creates alert records and notifies family members
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { familyId, studentId, alertType, triggerValue, baselineValue }: AlertRequest = await req.json();

    console.log(`Alert triggered: ${alertType} for student ${studentId}`);

    // Get student name
    const { data: student } = await supabase
      .from("students")
      .select("student_name")
      .eq("id", studentId)
      .single();

    // Create alert record
    const { data: alert, error: alertError } = await supabase
      .from("biometric_alerts")
      .insert({
        family_id: familyId,
        student_id: studentId,
        alert_type: alertType,
        trigger_value: triggerValue,
        baseline_value: baselineValue,
      })
      .select()
      .single();

    if (alertError) {
      throw new Error(`Failed to create alert: ${alertError.message}`);
    }

    // Get family members to notify
    const { data: members } = await supabase
      .from("family_members")
      .select("user_id")
      .eq("family_id", familyId);

    // Create notification message
    let message = "";
    switch (alertType) {
      case "heart_rate_elevated":
        message = `${student?.student_name}'s heart rate is elevated (${triggerValue} bpm). A sensory break may be needed.`;
        break;
      case "stress_level_high":
        message = `${student?.student_name}'s stress level is high (${triggerValue}%). Consider intervention strategies.`;
        break;
      case "low_battery":
        message = `${student?.student_name}'s Garmin watch battery is low (${triggerValue}%). Please charge soon.`;
        break;
    }

    // Create notifications for all family members
    const notifications = (members || []).map(member => ({
      user_id: member.user_id,
      type: "biometric_alert",
      title: "Biometric Alert",
      message,
      reference_id: alert.id,
      reference_table: "biometric_alerts",
    }));

    if (notifications.length > 0) {
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert(notifications);

      if (notificationError) {
        console.error("Failed to create notifications:", notificationError);
      } else {
        console.log(`Created ${notifications.length} notifications`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        alertId: alert.id,
        notificationsSent: notifications.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Alert error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
