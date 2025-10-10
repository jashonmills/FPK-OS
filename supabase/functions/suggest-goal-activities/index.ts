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
    const { goal_id } = await req.json();

    if (!goal_id) {
      return new Response(
        JSON.stringify({ error: "goal_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the goal
    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("*")
      .eq("id", goal_id)
      .single();

    if (goalError || !goal) {
      console.error("Error fetching goal:", goalError);
      return new Response(
        JSON.stringify({ error: "Goal not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call AI to suggest activities
    const systemPrompt = `You are a special education curriculum specialist. A user wants to work on a specific IEP goal. Generate a list of 3 simple, fun, at-home activities a parent can do to support this goal. The activities should be practical and require minimal special equipment.

Format your response as a single JSON object:
{
  "activities": [
    {
      "title": "Activity Name",
      "description": "Clear, step-by-step instructions",
      "materials": ["item 1", "item 2"],
      "duration": "15-20 minutes",
      "tip": "Helpful advice for success"
    }
  ]
}`;

    const userPrompt = `Goal Title: ${goal.goal_title}
Goal Description: ${goal.goal_description || "No additional details"}
Goal Type: ${goal.goal_type}

Generate 3 practical, at-home activities to support this goal.`;

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
        JSON.stringify({ error: "AI suggestion failed" }),
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
      result = JSON.parse(aiContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, aiContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        goal_title: goal.goal_title,
        activities: result.activities || [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in suggest-goal-activities function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});