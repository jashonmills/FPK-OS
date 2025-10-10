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
    const { family_id } = await req.json();

    if (!family_id) {
      return new Response(
        JSON.stringify({ error: "family_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check family status
    const { data: family, error: familyError } = await supabase
      .from("families")
      .select("*")
      .eq("id", family_id)
      .single();

    if (familyError || !family) {
      return new Response(
        JSON.stringify({ error: "Family not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (family.initial_doc_analysis_status !== "pending") {
      return new Response(
        JSON.stringify({ message: "First look analysis already completed or in progress" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check document count
    const { count, error: countError } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("family_id", family_id);

    if (countError) {
      console.error("Error counting documents:", countError);
      return new Response(
        JSON.stringify({ error: "Failed to count documents" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (count !== 5) {
      return new Response(
        JSON.stringify({ message: `Family has ${count} documents, need exactly 5` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update status to in_progress
    await supabase
      .from("families")
      .update({ initial_doc_analysis_status: "in_progress" })
      .eq("id", family_id);

    // Fetch all 5 documents
    const { data: documents, error: docsError } = await supabase
      .from("documents")
      .select("extracted_content, file_name")
      .eq("family_id", family_id)
      .limit(5);

    if (docsError || !documents) {
      console.error("Error fetching documents:", docsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch documents" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Combine document content
    const combinedText = documents
      .map((doc, i) => `=== Document ${i + 1}: ${doc.file_name} ===\n${doc.extracted_content || "No content"}`)
      .join("\n\n");

    // Call AI for first look analysis
    const systemPrompt = `You are an AI Onboarding Specialist. You will be given text from a new user's first 5 documents. Your job is to backfill their historical data and recommend specialized analytics.

**Function 1: Extract Historical Data.** Scan all documents for any mention of sleep, mood, or incidents with associated dates. Only extract data that is explicitly stated with dates.

**Function 2: Recommend New Charts.** Analyze the content for recurring themes and suggest new chart types that would be valuable for this family.

**Chart Recommendation Library:**
When you recommend charts, you MUST use one of the following chart_type names in your JSON output:
1. behavior_function_analysis: Use this for documents focused on FBA/BIPs and behavioral functions (escape, tangible, sensory, attention).
2. iep_goal_service_tracker: Use this for IEPs with clear goals and service minutes.
3. academic_fluency_trends: Use this for students with learning disabilities and academic fluency goals (reading WPM, math facts).
4. sensory_profile_heatmap: Use this when documents frequently mention sensory sensitivities or SPD.
5. social_interaction_funnel: Use this when social skills and peer interaction are a primary focus.

Format your response as a single JSON object:
{
  "historical_data": {
    "sleep_records": [
      { "record_date": "YYYY-MM-DD", "total_sleep_hours": 6.5, "sleep_quality_rating": 2, "notes": "From document" }
    ],
    "mood_observations": [
      { "observation_date": "YYYY-MM-DD", "mood": "anxious", "context": "From IEP notes" }
    ]
  },
  "chart_recommendations": [
    { 
      "chart_type": "behavior_function_analysis", 
      "reason": "Document includes FBA data with hypothesized functions for challenging behaviors.",
      "priority": "high"
    },
    { 
      "chart_type": "iep_goal_service_tracker", 
      "reason": "IEP contains 8 goals across multiple domains with service delivery hours.",
      "priority": "high"
    }
  ]
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
          { role: "user", content: `Analyze these 5 documents:\n\n${combinedText}` },
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
      // Strip markdown code fences if present
      let cleanedContent = aiContent.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.slice(7);
      }
      if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      
      analysisResult = JSON.parse(cleanedContent.trim());
      console.log("Successfully parsed AI response:", analysisResult);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw AI content:", aiContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Store chart recommendations
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30); // 30 day trial

    await supabase
      .from("families")
      .update({
        suggested_charts_config: analysisResult.chart_recommendations || [],
        special_chart_trial_ends_at: trialEndsAt.toISOString(),
        initial_doc_analysis_status: "complete",
      })
      .eq("id", family_id);

    // Insert historical sleep records if any (with ai_import flag in metadata)
    if (analysisResult.historical_data?.sleep_records?.length > 0) {
      const { data: students } = await supabase
        .from("students")
        .select("id")
        .eq("family_id", family_id)
        .limit(1)
        .single();

      if (students) {
        const sleepRecords = analysisResult.historical_data.sleep_records.map((record: any) => ({
          family_id,
          student_id: students.id,
          sleep_date: record.record_date,
          total_sleep_hours: record.total_sleep_hours,
          sleep_quality_rating: record.sleep_quality_rating || null,
          notes: `AI Import: ${record.notes || ""}`,
          bedtime: "00:00",
          wake_time: "00:00",
          created_by: family.created_by,
        }));

        await supabase.from("sleep_records").insert(sleepRecords);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        chart_recommendations: analysisResult.chart_recommendations || [],
        historical_records_imported: analysisResult.historical_data?.sleep_records?.length || 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in first-look-analysis function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});