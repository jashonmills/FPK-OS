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
    const { student_id, family_id } = await req.json();

    if (!student_id || !family_id) {
      return new Response(
        JSON.stringify({ error: "student_id and family_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch student data
    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("id", student_id)
      .single();

    // Fetch recent logs
    const { data: recentLogs } = await supabase
      .from("parent_logs")
      .select("*")
      .eq("student_id", student_id)
      .order("log_date", { ascending: false })
      .limit(10);

    // Fetch active goals
    const { data: goals } = await supabase
      .from("goals")
      .select("*")
      .eq("student_id", student_id)
      .eq("is_active", true);

    // Fetch recent insights
    const { data: insights } = await supabase
      .from("ai_insights")
      .select("*")
      .eq("student_id", student_id)
      .eq("is_active", true)
      .order("generated_at", { ascending: false })
      .limit(5);

    // Build context for AI
    const contextSummary = `
Student Profile:
- Diagnosis: ${student?.diagnosis || "Not specified"}
- Age: ${student?.age || "Not specified"}
- Active Goals: ${goals?.length || 0} goals

Recent Challenges: ${recentLogs?.map((log) => log.challenges).filter(Boolean).join("; ") || "None reported"}
Recent Successes: ${recentLogs?.map((log) => log.successes).filter(Boolean).join("; ") || "None reported"}
Current Insights: ${insights?.map((i) => i.content).join("; ") || "None"}
`;

    const systemPrompt = `You are a special education resource curator. Based on the student's profile and recent progress, create a personalized resource pack with evidence-based strategies and activities.

Format your response as JSON:
{
  "resource_pack": {
    "title": "Personalized Resource Pack for [Student Name]",
    "summary": "Brief overview of this pack",
    "sections": [
      {
        "category": "Recommended Strategies",
        "items": [
          {
            "title": "Strategy name",
            "description": "How to implement this",
            "evidence_level": "Research-backed | Parent-tested | Expert-recommended"
          }
        ]
      },
      {
        "category": "Activities",
        "items": [
          {
            "title": "Activity name",
            "description": "Instructions",
            "materials": ["item 1", "item 2"],
            "duration": "15-20 minutes"
          }
        ]
      },
      {
        "category": "Resources",
        "items": [
          {
            "title": "Resource name",
            "description": "Brief description",
            "type": "Article | Video | Tool | Book"
          }
        ]
      }
    ]
  }
}`;

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
          { role: "user", content: contextSummary },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI generation failed" }),
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

    let result;
    try {
      let cleanContent = aiContent.trim();
      cleanContent = cleanContent.replace(/^```(?:json)?\s*/g, "").replace(/\s*```$/g, "");
      result = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-resource-pack:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
