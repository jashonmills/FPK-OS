import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { incident_id } = await req.json();

    if (!incident_id) {
      return new Response(
        JSON.stringify({ error: "incident_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the incident
    const { data: incident, error: incidentError } = await supabase
      .from("incident_logs")
      .select("*")
      .eq("id", incident_id)
      .single();

    if (incidentError || !incident) {
      console.error("Error fetching incident:", incidentError);
      return new Response(
        JSON.stringify({ error: "Incident not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate 48 hours before the incident
    const incidentTimestamp = new Date(`${incident.incident_date}T${incident.incident_time}`);
    const fortyEightHoursAgo = new Date(incidentTimestamp.getTime() - (48 * 60 * 60 * 1000));

    // Fetch sleep records from the past 48 hours
    const { data: sleepData } = await supabase
      .from("sleep_records")
      .select("*")
      .eq("student_id", incident.student_id)
      .gte("sleep_date", fortyEightHoursAgo.toISOString().split('T')[0])
      .order("sleep_date", { ascending: false });

    // Fetch parent logs from the past 48 hours
    const { data: parentLogs } = await supabase
      .from("parent_logs")
      .select("*")
      .eq("student_id", incident.student_id)
      .gte("log_date", fortyEightHoursAgo.toISOString().split('T')[0])
      .order("log_date", { ascending: false });

    // Fetch educator logs from the past 48 hours
    const { data: educatorLogs } = await supabase
      .from("educator_logs")
      .select("*")
      .eq("student_id", incident.student_id)
      .gte("log_date", fortyEightHoursAgo.toISOString().split('T')[0])
      .order("log_date", { ascending: false });

    // Build data summary
    const dataSummary = {
      incident: {
        date: incident.incident_date,
        time: incident.incident_time,
        type: incident.incident_type,
        severity: incident.severity,
        description: incident.behavior_description,
        location: incident.location,
        environmental: {
          weather: incident.weather_condition,
          temp_f: incident.weather_temp_f,
          aqi: incident.aqi_us,
          pollen_grass: incident.pollen_grass,
          pollen_birch: incident.pollen_birch,
        }
      },
      sleep: sleepData?.map(s => ({
        date: s.sleep_date,
        hours: s.total_sleep_hours,
        quality: s.sleep_quality_rating,
        awakenings: s.nighttime_awakenings,
      })) || [],
      moods: parentLogs?.map(p => ({
        date: p.log_date,
        time: p.log_time,
        mood: p.mood,
        observation: p.observation,
        challenges: p.challenges,
      })) || [],
      educator_observations: educatorLogs?.map(e => ({
        date: e.log_date,
        engagement: e.engagement_level,
        performance: e.performance_level,
        behavioral: e.behavioral_observations,
        challenges: e.challenges,
      })) || [],
    };

    // Call AI to analyze triggers
    const systemPrompt = `You are an AI behavioral analyst. A behavioral incident has just been logged. Your task is to analyze the provided data from the 48 hours preceding the incident to identify potential triggers or contributing factors.

**Your Task:** Identify the top 1-3 most likely contributing factors. Be specific and cite the data. Do not guess. If no clear correlation exists, state that.

Format your response as a single JSON object:
{
  "potential_triggers": [
    {
      "factor": "Poor Sleep",
      "confidence": "high",
      "evidence": "The student only had 5.5 hours of sleep the night before, which is below average."
    }
  ]
}`;

    const userPrompt = `Incident Details:
${JSON.stringify(dataSummary.incident, null, 2)}

Preceding Data (48 hours):
Sleep: ${JSON.stringify(dataSummary.sleep, null, 2)}
Mood Observations: ${JSON.stringify(dataSummary.moods, null, 2)}
Educator Observations: ${JSON.stringify(dataSummary.educator_observations, null, 2)}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      return new Response(
        JSON.stringify({ error: "AI returned no content" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let analysisResult;
    try {
      analysisResult = JSON.parse(aiContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, aiContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save triggers to the incident
    const { error: updateError } = await supabase
      .from("incident_logs")
      .update({ potential_triggers: analysisResult.potential_triggers })
      .eq("id", incident_id);

    if (updateError) {
      console.error("Error updating incident:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        triggers: analysisResult.potential_triggers,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-incident-triggers function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});