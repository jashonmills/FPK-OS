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
    const systemPrompt = `You are an AI Onboarding Specialist. You will be given text from a new user's first 5 documents. Your job is to extract baseline data that can populate analytics charts.

**CRITICAL: Extract ALL historical baseline data with dates when mentioned in documents.**

**Data to Extract:**
1. IEP Goals: Extract any goals mentioned with baseline/current/target values
2. Behavioral Incidents: Extract any behavioral data points with dates and metrics
3. Academic Fluency: Extract reading fluency (WPM) or math fluency baselines if mentioned
4. Progress Tracking: Extract any progress metrics mentioned with values

Format your response as a single JSON object:
{
  "baseline_data": {
    "iep_goals": [
      { 
        "goal_title": "Communication Skills",
        "goal_type": "communication",
        "goal_description": "Use AAC device to make requests",
        "current_value": 50,
        "target_value": 90,
        "unit": "percent",
        "start_date": "2025-09-01"
      }
    ],
    "behavioral_metrics": [
      {
        "metric_name": "Elopement",
        "metric_type": "behavioral_incident",
        "metric_value": 2,
        "metric_unit": "per week",
        "measurement_date": "2025-09-23",
        "context": "From BIP baseline data"
      }
    ],
    "academic_fluency": [
      {
        "metric_name": "Reading Fluency",
        "metric_value": 35,
        "target_value": 60,
        "metric_unit": "WPM",
        "measurement_date": "2025-09-23"
      }
    ],
    "progress_tracking": [
      {
        "metric_type": "communication_skills",
        "current_value": 50,
        "target_value": 90,
        "trend": "improving",
        "notes": "Beginning to use AAC for requests"
      }
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
      "reason": "IEP contains goals across multiple domains with service delivery hours.",
      "priority": "high"
    },
    {
      "chart_type": "academic_fluency_trends",
      "reason": "Specific academic fluency baseline data mentioned (Reading/Math WPM).",
      "priority": "medium"
    }
  ]
}

**Chart Type Options:**
- behavior_function_analysis: For FBA/BIP behavioral data
- iep_goal_service_tracker: For IEP goals with measurable targets
- academic_fluency_trends: For reading/math fluency data
- sensory_profile_heatmap: For sensory sensitivities/SPD data
- social_interaction_funnel: For social skills data`;

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

    // Get student for data insertion
    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq("family_id", family_id)
      .limit(1)
      .single();

    if (!student) {
      console.error("No student found for family");
      return new Response(
        JSON.stringify({ error: "No student found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let importedCounts = {
      goals: 0,
      behavioral_metrics: 0,
      academic_metrics: 0,
      progress_tracking: 0,
    };

    // Insert IEP goals if any
    if (analysisResult.baseline_data?.iep_goals?.length > 0) {
      const goals = analysisResult.baseline_data.iep_goals
        .filter((goal: any) => typeof goal.current_value === 'number') // Only insert if current_value is numeric
        .map((goal: any) => ({
          family_id,
          student_id: student.id,
          goal_title: goal.goal_title,
          goal_type: goal.goal_type,
          goal_description: goal.goal_description || null,
          current_value: goal.current_value || 0,
          target_value: goal.target_value || null,
          unit: goal.unit || null,
          start_date: goal.start_date || new Date().toISOString().split('T')[0],
          is_active: true,
        }));

      if (goals.length > 0) {
        const { error: goalsError } = await supabase.from("goals").insert(goals);
        if (!goalsError) importedCounts.goals = goals.length;
        else console.error("Error inserting goals:", goalsError);
      }
    }

    // Insert behavioral metrics
    if (analysisResult.baseline_data?.behavioral_metrics?.length > 0) {
      const behavioralMetrics = analysisResult.baseline_data.behavioral_metrics.map((metric: any) => ({
        family_id,
        student_id: student.id,
        document_id: null,
        metric_type: metric.metric_type || "behavioral_incident",
        metric_name: metric.metric_name,
        metric_value: metric.metric_value,
        metric_unit: metric.metric_unit || null,
        measurement_date: metric.measurement_date || null,
        context: metric.context || "AI Import from document analysis",
      }));

      const { error: behavioralError } = await supabase.from("document_metrics").insert(behavioralMetrics);
      if (!behavioralError) importedCounts.behavioral_metrics = behavioralMetrics.length;
      else console.error("Error inserting behavioral metrics:", behavioralError);
    }

    // Insert academic fluency data
    if (analysisResult.baseline_data?.academic_fluency?.length > 0) {
      const academicMetrics = analysisResult.baseline_data.academic_fluency.map((metric: any) => ({
        family_id,
        student_id: student.id,
        document_id: null,
        metric_type: "academic_fluency",
        metric_name: metric.metric_name,
        metric_value: metric.metric_value,
        target_value: metric.target_value || null,
        metric_unit: metric.metric_unit || "WPM",
        measurement_date: metric.measurement_date || null,
        context: "AI Import: Baseline from documents",
      }));

      const { error: academicError } = await supabase.from("document_metrics").insert(academicMetrics);
      if (!academicError) importedCounts.academic_metrics = academicMetrics.length;
      else console.error("Error inserting academic metrics:", academicError);
    }

    // Insert progress tracking data
    if (analysisResult.baseline_data?.progress_tracking?.length > 0) {
      const progressData = analysisResult.baseline_data.progress_tracking
        .filter((progress: any) => {
          // Only include if values are numeric or null
          const currentIsValid = progress.current_value === null || typeof progress.current_value === 'number';
          const targetIsValid = progress.target_value === null || typeof progress.target_value === 'number';
          return currentIsValid && targetIsValid;
        })
        .map((progress: any) => ({
          family_id,
          student_id: student.id,
          metric_type: progress.metric_type,
          current_value: progress.current_value || null,
          target_value: progress.target_value || null,
          trend: progress.trend || "stable",
          notes: progress.notes || "AI Import from document analysis",
        }));

      if (progressData.length > 0) {
        const { error: progressError } = await supabase.from("progress_tracking").insert(progressData);
        if (!progressError) importedCounts.progress_tracking = progressData.length;
        else console.error("Error inserting progress tracking:", progressError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        chart_recommendations: analysisResult.chart_recommendations || [],
        imported_data: importedCounts,
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