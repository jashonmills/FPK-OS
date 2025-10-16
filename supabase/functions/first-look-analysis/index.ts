import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { CHART_MANIFEST, formatManifestForAI } from "../_shared/chart-manifest.ts";

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

    // === STEP 1: AI "PROPOSE" - Get chart recommendations with confidence scores ===
    
    const chartManifestJson = formatManifestForAI();
    
    const proposeSystemPrompt = `You are a data analyst specializing in special education document analysis. Your job is to analyze uploaded documents and recommend relevant analytics charts.

**CHART MANIFEST:**
${chartManifestJson}

**YOUR TASK:**
1. Analyze the provided documents
2. For each chart in the manifest above, determine if there is strong supporting evidence in the documents
3. For charts with good evidence, output the chartId and a confidence score (0.0 to 1.0)
4. A confidence score represents how relevant and useful that chart would be based on the document content

**OUTPUT FORMAT:**
Return ONLY a valid JSON array of objects. Each object must have:
- chartId: string (exact chartId from manifest)
- confidence: number (0.0 to 1.0)

Example output:
[
  {"chartId": "iep_goal_service_tracker", "confidence": 0.95},
  {"chartId": "behavior_function_analysis", "confidence": 0.85},
  {"chartId": "academic_fluency_trends", "confidence": 0.70}
]

**CONFIDENCE SCORING GUIDE:**
- 0.9-1.0: Document explicitly contains this data type with detailed metrics
- 0.7-0.89: Document mentions this area with some data points
- 0.5-0.69: Document references this area but limited data
- Below 0.5: Don't include (insufficient evidence)

Return ONLY the JSON array, no other text.`;

    const proposeResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: proposeSystemPrompt },
          { role: "user", content: `Analyze these 5 documents and recommend charts:\n\n${combinedText}` },
        ],
      }),
    });

    if (!proposeResponse.ok) {
      const errorText = await proposeResponse.text();
      console.error("AI Propose step error:", proposeResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Chart recommendation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const proposeData = await proposeResponse.json();
    const proposeContent = proposeData.choices?.[0]?.message?.content;

    if (!proposeContent) {
      return new Response(
        JSON.stringify({ error: "AI returned no chart recommendations" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === STEP 2: CODE "RANK" - Deterministically select top 3 charts ===
    
    let proposedCharts;
    try {
      // Clean the response
      let cleanedContent = proposeContent.trim();
      if (cleanedContent.startsWith('```json')) cleanedContent = cleanedContent.slice(7);
      if (cleanedContent.startsWith('```')) cleanedContent = cleanedContent.slice(3);
      if (cleanedContent.endsWith('```')) cleanedContent = cleanedContent.slice(0, -3);
      
      proposedCharts = JSON.parse(cleanedContent.trim());
      console.log("AI proposed charts:", proposedCharts);
    } catch (parseError) {
      console.error("Failed to parse chart proposals:", parseError);
      console.error("Raw content:", proposeContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse chart recommendations" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate and filter proposed charts
    if (!Array.isArray(proposedCharts)) {
      proposedCharts = [];
    }

    // Filter to only valid chartIds from manifest
    const validChartIds = CHART_MANIFEST.map(c => c.chartId);
    const validProposals = proposedCharts.filter((proposal: any) => 
      proposal.chartId && 
      validChartIds.includes(proposal.chartId) &&
      typeof proposal.confidence === 'number'
    );

    // Sort by confidence (descending) and take top 3
    const rankedCharts = validProposals
      .sort((a: any, b: any) => b.confidence - a.confidence)
      .slice(0, 3);

    // Extract just the chartIds for storage
    const recommendedChartIds = rankedCharts.map((chart: any) => chart.chartId);
    
    // Build chart recommendations in the expected format for backward compatibility
    const chartRecommendations = rankedCharts.map((chart: any) => {
      const manifestItem = CHART_MANIFEST.find(c => c.chartId === chart.chartId);
      return {
        chart_type: chart.chartId,
        reason: manifestItem?.description || "Recommended based on document content",
        priority: chart.confidence >= 0.85 ? "high" : chart.confidence >= 0.70 ? "medium" : "low",
        confidence: chart.confidence
      };
    });

    console.log("Final ranked chart recommendations:", chartRecommendations);

    // === STEP 3: Extract baseline data using separate AI call ===
    
    const extractSystemPrompt = `You are an AI data extraction specialist. Extract baseline data from these documents to populate analytics charts.

**CRITICAL: Extract ALL historical baseline data with dates when mentioned in documents.**

**GOAL TYPE MAPPING - Use ONLY these exact values:**
- "academic" - for reading, math, writing goals
- "behavioral" - for behavior regulation, self-management
- "social" - for social skills, interaction, communication
- "life_skill" - for functional skills, daily living, self-care

**Data to Extract:**
1. IEP Goals: Extract any goals mentioned with baseline/current/target values
2. Behavioral Incidents: Extract any behavioral data points with dates and metrics
3. Academic Fluency: Extract reading fluency (WPM) or math fluency baselines if mentioned
4. Progress Tracking: Extract any progress metrics mentioned with values
5. Social Skills: Extract social interaction, communication data with baseline percentages

Format your response as a single JSON object:
{
  "baseline_data": {
    "iep_goals": [
      { 
        "goal_title": "Communication Skills",
        "goal_type": "social",
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
    "social_skills": [
      {
        "metric_name": "Task Initiation",
        "metric_value": 0.20,
        "target_value": 0.80,
        "metric_unit": "proficiency",
        "measurement_date": "2025-09-23"
      }
    ],
    "progress_tracking": [
      {
        "metric_type": "task_initiation",
        "current_value": 20,
        "target_value": 80,
        "unit": "percent",
        "trend": "stable",
        "notes": "Beginning to initiate tasks",
        "measurement_date": "2025-09-23"
      }
    ]
  }
}`;

    const extractResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: extractSystemPrompt },
          { role: "user", content: `Extract baseline data from these 5 documents:\n\n${combinedText}` },
        ],
      }),
    });

    if (!extractResponse.ok) {
      const errorText = await extractResponse.text();
      console.error("AI extraction error:", extractResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Data extraction failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const extractData = await extractResponse.json();
    const extractContent = extractData.choices?.[0]?.message?.content;

    if (!extractContent) {
      return new Response(
        JSON.stringify({ error: "AI returned no extracted data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let analysisResult;
    try {
      // Strip markdown code fences if present
      let cleanedContent = extractContent.trim();
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
      console.log("Successfully parsed extracted data:", analysisResult);
    } catch (parseError) {
      console.error("Failed to parse extracted data:", parseError);
      console.error("Raw extraction content:", extractContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse extracted data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Store deterministic chart recommendations
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30); // 30 day trial

    await supabase
      .from("families")
      .update({
        suggested_charts_config: chartRecommendations, // Store the detailed recommendations
        special_chart_trial_ends_at: trialEndsAt.toISOString(),
        initial_doc_analysis_status: "complete",
      })
      .eq("id", family_id);

    console.log("Stored chart recommendations:", chartRecommendations);

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
      social_skills: 0,
      progress_tracking: 0,
    };

    // Insert IEP goals if any
    if (analysisResult.baseline_data?.iep_goals?.length > 0) {
      // Map goal types to allowed values
      const goalTypeMap: Record<string, string> = {
        'communication': 'social',
        'speech_language': 'social',
        'functional_skills': 'life_skill',
        'adaptive_self_management': 'behavioral',
        'adaptive_daily_living': 'life_skill',
        'reading_language_arts': 'academic',
        'reading_comprehension': 'academic',
        'written_language': 'academic',
        'mathematics': 'academic',
        'social_skills': 'social',
        'behavioral': 'behavioral',
        'academic': 'academic',
        'social': 'social',
        'life_skill': 'life_skill',
      };

      const goals = analysisResult.baseline_data.iep_goals
        .filter((goal: any) => typeof goal.current_value === 'number') // Only insert if current_value is numeric
        .map((goal: any) => {
          const mappedType = goalTypeMap[goal.goal_type.toLowerCase()] || 'life_skill';
          return {
            family_id,
            student_id: student.id,
            goal_title: goal.goal_title,
            goal_type: mappedType,
            goal_description: goal.goal_description || null,
            current_value: goal.current_value || 0,
            target_value: goal.target_value || null,
            unit: goal.unit || null,
            start_date: goal.start_date || new Date().toISOString().split('T')[0],
            is_active: true,
          };
        });

      if (goals.length > 0) {
        const { error: goalsError } = await supabase.from("goals").insert(goals);
        if (!goalsError) importedCounts.goals = goals.length;
        else console.error("Error inserting goals:", goalsError);
      }
    }

    // Insert behavioral metrics
    if (analysisResult.baseline_data?.behavioral_metrics?.length > 0) {
      const behavioralMetrics = analysisResult.baseline_data.behavioral_metrics
        .filter((metric: any) => {
          // Parse metric_value - handle ranges like "2-3" by taking the average
          let value = metric.metric_value;
          if (typeof value === 'string') {
            // Check if it's a range like "2-3"
            if (value.includes('-')) {
              const parts = value.split('-').map((p: string) => parseFloat(p.trim()));
              if (parts.every((p: number) => !isNaN(p))) {
                value = parts.reduce((sum: number, p: number) => sum + p, 0) / parts.length;
              } else {
                return false; // Skip invalid ranges
              }
            } else {
              value = parseFloat(value);
            }
          }
          return !isNaN(value) && value !== null && value !== undefined;
        })
        .map((metric: any) => {
          let value = metric.metric_value;
          if (typeof value === 'string') {
            if (value.includes('-')) {
              const parts = value.split('-').map((p: string) => parseFloat(p.trim()));
              value = parts.reduce((sum: number, p: number) => sum + p, 0) / parts.length;
            } else {
              value = parseFloat(value);
            }
          }
          
          return {
            family_id,
            student_id: student.id,
            document_id: null,
            metric_type: metric.metric_type || "behavioral_incident",
            metric_name: metric.metric_name,
            metric_value: value,
            metric_unit: metric.metric_unit || null,
            measurement_date: metric.measurement_date || null,
            context: metric.context || "AI Import from document analysis",
          };
        });

      if (behavioralMetrics.length > 0) {
        const { error: behavioralError } = await supabase.from("document_metrics").insert(behavioralMetrics);
        if (!behavioralError) importedCounts.behavioral_metrics = behavioralMetrics.length;
        else console.error("Error inserting behavioral metrics:", behavioralError);
      }
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

    // Insert social skills data
    if (analysisResult.baseline_data?.social_skills?.length > 0) {
      const socialMetrics = analysisResult.baseline_data.social_skills.map((metric: any) => ({
        family_id,
        student_id: student.id,
        document_id: null,
        metric_type: "social_skill",
        metric_name: metric.metric_name,
        metric_value: metric.metric_value,
        target_value: metric.target_value || null,
        metric_unit: metric.metric_unit || "proficiency",
        measurement_date: metric.measurement_date || null,
        context: "AI Import: Social skills baseline from documents",
      }));

      const { error: socialError } = await supabase.from("document_metrics").insert(socialMetrics);
      if (!socialError) importedCounts.social_skills = socialMetrics.length;
      else console.error("Error inserting social skills:", socialError);
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
          period_start: progress.measurement_date || null,
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
        chart_recommendations: chartRecommendations,
        imported_data: importedCounts,
        deterministic: true, // Flag to indicate we're using the new deterministic system
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