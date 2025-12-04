import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Syncs Garmin sleep data for all connected users
 * In development mode, uses simulated data
 * Will be updated to use real Garmin Health API once keys are available
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting Garmin data sync...");

    // Get all active Garmin integrations
    const { data: integrations, error: integrationsError } = await supabase
      .from("external_integrations")
      .select("family_id, provider, access_token, is_active")
      .eq("provider", "garmin")
      .eq("is_active", true);

    if (integrationsError) {
      throw new Error(`Failed to fetch integrations: ${integrationsError.message}`);
    }

    console.log(`Found ${integrations?.length || 0} active Garmin integrations`);

    let successCount = 0;
    let errorCount = 0;

    for (const integration of integrations || []) {
      try {
        // Get students for this family
        const { data: students, error: studentsError } = await supabase
          .from("students")
          .select("id, student_name")
          .eq("family_id", integration.family_id)
          .eq("is_active", true);

        if (studentsError) throw studentsError;

        for (const student of students || []) {
          // SIMULATOR MODE: Generate fake sleep data
          // TODO: Replace with real Garmin API call when keys are available
          const sleepData = generateSimulatedSleepData();

          // Insert sleep data
          const { error: insertError } = await supabase
            .from("wearable_sleep_data")
            .upsert({
              family_id: integration.family_id,
              student_id: student.id,
              sleep_date: sleepData.sleepDate,
              sleep_score: sleepData.sleepScore,
              deep_sleep_seconds: sleepData.deepSleepSeconds,
              light_sleep_seconds: sleepData.lightSleepSeconds,
              rem_sleep_seconds: sleepData.remSleepSeconds,
              awake_seconds: sleepData.awakeSeconds,
              avg_heart_rate: sleepData.avgHeartRate,
              avg_respiration_rate: sleepData.avgRespirationRate,
              avg_spo2: sleepData.avgSpo2,
              restlessness_score: sleepData.restlessnessScore,
              sleep_start_time: sleepData.sleepStartTime,
              sleep_end_time: sleepData.sleepEndTime,
              raw_data: sleepData,
            }, {
              onConflict: "family_id,student_id,sleep_date"
            });

          if (insertError) {
            console.error(`Error inserting sleep data for student ${student.student_name}:`, insertError);
            errorCount++;
          } else {
            console.log(`✓ Synced sleep data for ${student.student_name}`);
            successCount++;
          }
        }

        // Update last sync time
        await supabase
          .from("external_integrations")
          .update({ last_sync_at: new Date().toISOString() })
          .eq("family_id", integration.family_id)
          .eq("provider", "garmin");

      } catch (error) {
        console.error(`Error processing family ${integration.family_id}:`, error);
        errorCount++;
      }
    }

    console.log(`Sync complete: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        synced: successCount,
        errors: errorCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

/**
 * Generate simulated sleep data
 * This mimics the structure we'll get from the real Garmin Health API
 */
function generateSimulatedSleepData() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const sleepScore = Math.floor(Math.random() * 35) + 60; // 60-95
  
  const totalSleepMinutes = Math.floor(Math.random() * 180) + 360; // 6-9 hours
  const totalSleepSeconds = totalSleepMinutes * 60;
  
  const deepSleepPercent = (Math.random() * 10 + 15) / 100; // 15-25%
  const remSleepPercent = (Math.random() * 5 + 20) / 100; // 20-25%
  const lightSleepPercent = (Math.random() * 10 + 45) / 100; // 45-55%
  const awakePercent = 1 - (deepSleepPercent + remSleepPercent + lightSleepPercent);
  
  const deepSleepSeconds = Math.round(totalSleepSeconds * deepSleepPercent);
  const remSleepSeconds = Math.round(totalSleepSeconds * remSleepPercent);
  const lightSleepSeconds = Math.round(totalSleepSeconds * lightSleepPercent);
  const awakeSeconds = totalSleepSeconds - (deepSleepSeconds + remSleepSeconds + lightSleepSeconds);
  
  const bedtime = new Date(yesterday);
  bedtime.setHours(22, Math.floor(Math.random() * 45), 0, 0);
  
  const wakeTime = new Date(bedtime);
  wakeTime.setMinutes(wakeTime.getMinutes() + totalSleepMinutes + awakeSeconds / 60);
  
  return {
    sleepDate: yesterday.toISOString().split('T')[0],
    sleepScore,
    deepSleepSeconds,
    lightSleepSeconds,
    remSleepSeconds,
    awakeSeconds,
    avgHeartRate: Math.floor(Math.random() * 10) + 55,
    avgRespirationRate: Math.random() * 4 + 12,
    avgSpo2: Math.random() * 4 + 95,
    restlessnessScore: Math.floor(Math.random() * 30) + 10,
    sleepStartTime: bedtime.toISOString(),
    sleepEndTime: wakeTime.toISOString()
  };
}
