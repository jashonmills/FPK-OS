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
    const { family_id, student_id } = await req.json();

    if (!family_id || !student_id) {
      return new Response(
        JSON.stringify({ error: "family_id and student_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Fetch yesterday's sleep data
    const { data: sleepData } = await supabase
      .from("sleep_records")
      .select("*")
      .eq("student_id", student_id)
      .eq("sleep_date", yesterdayStr)
      .maybeSingle();

    // Fetch yesterday's mood data
    const { data: moodData } = await supabase
      .from("parent_logs")
      .select("*")
      .eq("student_id", student_id)
      .eq("log_date", yesterdayStr)
      .order("created_at", { ascending: false })
      .limit(3);

    // Fetch student info
    const { data: student } = await supabase
      .from("students")
      .select("student_name")
      .eq("id", student_id)
      .single();

    // Build data summary
    const dataSummary = {
      student_name: student?.student_name || "Student",
      yesterday: {
        sleep: sleepData ? {
          hours: sleepData.total_sleep_hours,
          quality: sleepData.sleep_quality_rating,
          awakenings: sleepData.nighttime_awakenings,
        } : null,
        moods: moodData?.map(m => ({
          mood: m.mood,
          observation: m.observation,
        })) || [],
      },
      today: {
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      },
    };

    // Call AI to generate briefing
    const systemPrompt = `You are an AI co-pilot for a family supporting a child with special needs. Generate a warm, concise daily briefing (2-3 sentences) that:
1. Acknowledges yesterday's highlights or challenges
2. Offers a gentle insight or encouragement for today
3. Is supportive and actionable

Keep it brief, warm, and helpful. Do not mention specific numbers unless particularly relevant.`;

    const userPrompt = `Student: ${dataSummary.student_name}
Today: ${dataSummary.today.date}

Yesterday's Data:
Sleep: ${dataSummary.yesterday.sleep ? `${dataSummary.yesterday.sleep.hours} hours, quality ${dataSummary.yesterday.sleep.quality}/5` : 'No data'}
Moods: ${dataSummary.yesterday.moods.length > 0 ? dataSummary.yesterday.moods.map(m => m.mood).join(', ') : 'No data'}

Generate a warm, brief daily briefing.`;

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
        JSON.stringify({ error: "AI briefing failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const briefingContent = aiData.choices?.[0]?.message?.content;

    if (!briefingContent) {
      return new Response(
        JSON.stringify({ error: "AI returned no content" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save briefing as an AI insight
    const { data: insight, error: insertError } = await supabase
      .from("ai_insights")
      .insert({
        family_id,
        student_id,
        title: `Daily Briefing - ${dataSummary.today.date}`,
        content: briefingContent,
        insight_type: "daily_briefing",
        priority: "medium",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting briefing:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save briefing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        briefing: briefingContent,
        insight_id: insight.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-daily-briefing function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});