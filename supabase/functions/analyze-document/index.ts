import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { DOCUMENT_INTELLIGENCE_MATRIX, identifyDocumentType } from "../_shared/document-matrix.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { document_id, bypass_limit } = await req.json();

    if (!document_id) {
      return new Response(
        JSON.stringify({ error: "document_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the document
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", document_id)
      .single();

    if (fetchError || !document) {
      console.error("Error fetching document:", fetchError);
      return new Response(
        JSON.stringify({ error: "Document not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!document.extracted_content) {
      return new Response(
        JSON.stringify({ error: "Document has no extracted content to analyze" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check usage limits (unless bypassed for à la carte purchases)
    if (!bypass_limit) {
      const { data: family } = await supabase
        .from("families")
        .select("subscription_tier")
        .eq("id", document.family_id)
        .single();

      if (family?.subscription_tier === "team") {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

        // Get or create usage record
        const { data: usage } = await supabase
          .from("document_analysis_usage")
          .select("*")
          .eq("family_id", document.family_id)
          .eq("month_year", currentMonth)
          .single();

        if (usage && usage.documents_analyzed >= 20) {
          return new Response(
            JSON.stringify({
              error: "Monthly document analysis limit reached",
              limit: 20,
              used: usage.documents_analyzed,
              upgrade_required: true,
            }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Increment usage counter
        if (usage) {
          await supabase
            .from("document_analysis_usage")
            .update({ documents_analyzed: usage.documents_analyzed + 1 })
            .eq("id", usage.id);
        } else {
          await supabase
            .from("document_analysis_usage")
            .insert({
              family_id: document.family_id,
              month_year: currentMonth,
              documents_analyzed: 1,
            });
        }
      }
    }

    // Stage 1: Identify document type using the matrix
    const identifiedType = identifyDocumentType(document.extracted_content);
    
    if (identifiedType) {
      console.log(`✅ Document identified as: ${identifiedType.doc_type}`);
    } else {
      console.log("⚠️ Could not identify document type, using generic analysis");
    }

    // Stage 2: Build type-specific system prompt
    const systemPrompt = identifiedType 
      ? `You are analyzing a **${identifiedType.doc_type}** document.

**Expected Data to Extract:**
${identifiedType.expected_data}

**CRITICAL INSTRUCTIONS:**
1. This document should contain: ${identifiedType.expected_data}
2. ONLY extract data that is explicitly present in the text - DO NOT INFER OR HALLUCINATE
3. If the expected data is not found, return empty arrays
4. For metrics: Extract exact values, dates, times, and units
5. For insights: Only create insights based on explicit recommendations in the document
6. PRIORITIZE TIME-BASED DATA: Extract exact timestamps, start/end times, and durations

${identifiedType.generates_chart ? `**Chart Generation:** This document type typically populates the "${identifiedType.generates_chart}" chart.` : ''}

Format your response as a single, valid JSON object with the following structure:`
      : `You are an expert AI data analyst specializing in special education documents.
  
**Document Type:** Unknown/Generic
  
Extract any structured data you can find. Focus on:
- Quantifiable metrics (frequencies, percentages, scores)
- Goals or targets with baseline/current/target values
- Recommendations or action items
- Progress indicators

**CRITICAL RULES:**
1. DO NOT INFER OR HALLUCINATE. Only extract data that is explicitly stated.
2. PRIORITIZE TIME-BASED DATA. Extract exact timestamps, start/end times, and durations.
3. QUANTIFY EVERYTHING. Convert phrases like "five instances" into a numeric value.

Format your entire response as a single, valid JSON object with the following structure:
{
  "metrics": [
    {
      "metric_name": "Self-Injurious Behavior (Hand Biting)",
      "metric_type": "behavioral_incident",
      "metric_value": 3,
      "metric_unit": "episodes",
      "measurement_date": "YYYY-MM-DD",
      "start_time": "1:44",
      "end_time": "2:14",
      "duration_minutes": 30,
      "context": "During dysregulation episode",
      "intervention_used": "Deep pressure"
    }
  ],
  "insights": [
    {
      "title": "Improving Emotional Regulation",
      "content": "The document highlights a need for strategies to manage dysregulation, particularly in the afternoon.",
      "priority": "high",
      "insight_type": "recommendation"
    }
  ],
  "progress": [
    {
      "metric_type": "communication_skills",
      "current_value": 80,
      "target_value": 100,
      "trend": "improving",
      "notes": "Student is using AAC device more independently"
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
          { role: "user", content: `Analyze this document:\n\n${document.extracted_content}` },
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
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "AI returned no content" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the AI response - strip markdown code blocks if present
    let analysisResult;
    try {
      let cleanContent = aiContent.trim();
      
      // Remove markdown code blocks (handles both ```json and ``` formats)
      cleanContent = cleanContent.replace(/^```(?:json)?\s*/g, '').replace(/\s*```$/g, '');
      
      analysisResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, aiContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert metrics
    if (analysisResult.metrics && analysisResult.metrics.length > 0) {
      const metricsToInsert = analysisResult.metrics.map((metric: any) => ({
        document_id: document.id,
        family_id: document.family_id,
        student_id: document.student_id,
        metric_name: metric.metric_name,
        metric_type: metric.metric_type,
        metric_value: metric.metric_value,
        metric_unit: metric.metric_unit || null,
        measurement_date: metric.measurement_date || null,
        start_time: metric.start_time || null,
        end_time: metric.end_time || null,
        duration_minutes: metric.duration_minutes || null,
        context: metric.context || null,
        intervention_used: metric.intervention_used || null,
        target_value: metric.target_value || null,
      }));

      const { error: metricsError } = await supabase
        .from("document_metrics")
        .insert(metricsToInsert);

      if (metricsError) {
        console.error("Error inserting metrics:", metricsError);
      }
    }

    // Insert insights
    if (analysisResult.insights && analysisResult.insights.length > 0) {
      const insightsToInsert = analysisResult.insights.map((insight: any) => ({
        family_id: document.family_id,
        student_id: document.student_id,
        document_id: document.id,
        title: insight.title,
        content: insight.content,
        priority: insight.priority || "medium",
        insight_type: insight.insight_type || "recommendation",
      }));

      const { error: insightsError } = await supabase
        .from("ai_insights")
        .insert(insightsToInsert);

      if (insightsError) {
        console.error("Error inserting insights:", insightsError);
      }
    }

    // Insert progress tracking
    if (analysisResult.progress && analysisResult.progress.length > 0) {
      const progressToInsert = analysisResult.progress.map((prog: any) => ({
        family_id: document.family_id,
        student_id: document.student_id,
        document_id: document.id,
        metric_type: prog.metric_type,
        current_value: prog.current_value,
        target_value: prog.target_value || null,
        baseline_value: prog.baseline_value || null,
        trend: prog.trend || null,
        notes: prog.notes || null,
        progress_percentage: prog.target_value && prog.current_value
          ? Math.round((prog.current_value / prog.target_value) * 100)
          : null,
      }));

      const { error: progressError } = await supabase
        .from("progress_tracking")
        .insert(progressToInsert);

      if (progressError) {
        console.error("Error inserting progress:", progressError);
      }
    }

    // Update document with last_analyzed_at timestamp
    const { error: updateError } = await supabase
      .from("documents")
      .update({ last_analyzed_at: new Date().toISOString() })
      .eq("id", document_id);

    if (updateError) {
      console.error("Error updating document:", updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        identified_doc_type: identifiedType?.doc_type || "Unknown",
        metrics_count: analysisResult.metrics?.length || 0,
        insights_count: analysisResult.insights?.length || 0,
        progress_count: analysisResult.progress?.length || 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-document function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});