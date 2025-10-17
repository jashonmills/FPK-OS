import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { DOCUMENT_INTELLIGENCE_MATRIX, identifyDocumentType } from "../_shared/document-matrix.ts";
import { getSpecializedPrompt } from "../_shared/prompts/index.ts";
import { aiIdentifyDocumentType, analyzeWithRetry } from "./ai-helpers.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📥 Received analyze request');
    const { document_id, bypass_limit } = await req.json();
    console.log(`📄 Analyzing document: ${document_id}`);

    if (!document_id) {
      console.error('❌ Missing document_id');
      return new Response(
        JSON.stringify({ error: "document_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    
    console.log('🔑 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasLovableKey: !!lovableApiKey
    });

    if (!supabaseUrl || !supabaseKey || !lovableApiKey) {
      console.error('❌ Missing required environment variables');
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    const startTime = Date.now();
    
    // Stage 1: Identify document type using AI-powered classification
    console.log('🔍 Identifying document type...');
    const identifiedType = await aiIdentifyDocumentType(
      document.extracted_content, 
      lovableApiKey
    );
    
    if (identifiedType) {
      console.log(`✅ Document identified as: ${identifiedType.doc_type} (confidence: ${identifiedType.confidence})`);
    } else {
      console.log("⚠️ Could not identify document type, using generic analysis");
    }

    // Stage 2: Build type-specific system prompt using specialized prompts
    let systemPrompt: string;
    
    if (identifiedType) {
      const specializedPrompt = getSpecializedPrompt(identifiedType.doc_type);
      
      if (specializedPrompt) {
        console.log(`✅ Using specialized "Deep Read" prompt for: ${identifiedType.doc_type}`);
        systemPrompt = specializedPrompt;
      } else {
        console.log(`⚠️ No specialized prompt found for ${identifiedType.doc_type}, using enhanced generic prompt`);
        systemPrompt = `You are analyzing a **${identifiedType.doc_type}** document.

**CRITICAL INSTRUCTIONS:**
1. Extract ONLY data that is explicitly present in the text - DO NOT INFER OR HALLUCINATE
2. If expected data is not found, return empty arrays
3. For metrics: Extract exact values, dates, times, and units
4. For insights: Only create insights based on explicit recommendations in the document
5. PRIORITIZE TIME-BASED DATA: Extract exact timestamps, start/end times, and durations

Format your response as a single, valid JSON object with the following structure:`;
      }
    } else {
      systemPrompt = `You are an expert AI data analyst specializing in special education documents.

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
4. **ALWAYS EXTRACT DATES**: Look for assessment dates, report dates, observation dates, or date ranges in the document. If you find "March 15, 2024" or "3/15/2024", format it as "2024-03-15". If multiple dates exist, use the observation/assessment date. If no date is found, return null (we'll use document upload date as fallback).

Format your entire response as a single, valid JSON object with the following structure:
{
  "metrics": [
    {
      "metric_name": "Self-Injurious Behavior (Hand Biting)",
      "metric_type": "behavioral_incident",
      "metric_value": 3,
      "metric_unit": "episodes",
      "measurement_date": "2024-03-15",
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
    }

    // Use retry logic for robust analysis
    console.log('🔬 Starting AI analysis...');
    let analysisResult;
    let analysisRetryCount = 0;
    
    try {
      const analysisData = await analyzeWithRetry(
        document,
        document.extracted_content,
        identifiedType,
        lovableApiKey,
        systemPrompt
      );
      analysisResult = analysisData.result;
      analysisRetryCount = analysisData.retryCount;
    } catch (analysisError: any) {
      console.error('❌ Analysis failed:', analysisError);
      
      // Return user-friendly error
      return new Response(
        JSON.stringify({ 
          error: analysisError.message || "Analysis failed",
          details: "Unable to analyze document. Please try again later.",
          document_id: document_id
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert metrics
    if (analysisResult.metrics && analysisResult.metrics.length > 0) {
      const documentUploadDate = document.created_at ? new Date(document.created_at).toISOString().split('T')[0] : null;
      
      const metricsToInsert = analysisResult.metrics.map((metric: any) => ({
        document_id: document.id,
        family_id: document.family_id,
        student_id: document.student_id,
        metric_name: metric.metric_name,
        metric_type: metric.metric_type,
        metric_value: metric.metric_value,
        metric_unit: metric.metric_unit || null,
        // Use extracted date, or fallback to document upload date (never leave NULL)
        measurement_date: metric.measurement_date || documentUploadDate || new Date().toISOString().split('T')[0],
        start_time: metric.start_time || null,
        end_time: metric.end_time || null,
        duration_minutes: metric.duration_minutes || null,
        context: metric.context || null,
        intervention_used: metric.intervention_used || null,
        target_value: metric.target_value || null,
      }));
      
      console.log(`📅 Inserting ${metricsToInsert.length} metrics with dates:`, 
        metricsToInsert.map((m: any) => ({ name: m.metric_name, date: m.measurement_date })));

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

    // ========================================================================
    // PHASE 2: AI Chart Recommendation System with Data Validation
    // ========================================================================
    console.log('🧠 Requesting chart recommendations from AI...');
    
    // Extract available metric types from the analysis
    const availableMetricTypes = new Set(
      (analysisResult.metrics || []).map((m: any) => m.metric_type)
    );
    
    console.log('📊 Available metric types:', Array.from(availableMetricTypes));
    
    // Define chart requirements
    const chartRequirements: Record<string, string[]> = {
      "iep_goal_service_tracker": ["academic_fluency", "social_skill", "behavioral_incident"],
      "academic_fluency_trends": ["academic_fluency", "academic_performance"],
      "behavior_function_analysis": ["behavioral_incident", "behavior_frequency"],
      "sensory_profile_heatmap": ["sensory_profile"],
      "social_interaction_funnel": ["social_skill"],
      "intervention_effectiveness": ["behavioral_incident"],
    };
    
    // Filter charts to only include those with supporting data
    const eligibleCharts = Object.entries(chartRequirements)
      .filter(([_chartId, requiredTypes]) => 
        requiredTypes.some(reqType => availableMetricTypes.has(reqType))
      )
      .map(([chartId]) => chartId);
    
    console.log('✅ Eligible charts based on data:', eligibleCharts);
    
    const chartRecommendationPrompt = `Based on the analysis you just performed, determine which specialized analytics charts this document should populate.

Available chart identifiers (ONLY recommend from this filtered list based on available data):
${eligibleCharts.map(id => `- "${id}"`).join('\n')}

Return ONLY a JSON object in this exact format:
{ "recommended_charts": ["identifier1", "identifier2"] }

Rules:
- ONLY recommend charts from the list above
- Only include identifiers where this document provides QUANTIFIABLE data
- Minimum 3 data points per chart to recommend it
- If uncertain, do NOT recommend the chart`;

    try {
      const chartRecommendationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: document.extracted_content },
            { role: 'assistant', content: JSON.stringify(analysisResult) },
            { role: 'user', content: chartRecommendationPrompt }
          ],
          temperature: 0.3,
        }),
      });

      if (!chartRecommendationResponse.ok) {
        const errorText = await chartRecommendationResponse.text();
        console.error('Chart recommendation AI error:', chartRecommendationResponse.status, errorText);
      } else {
        const chartData = await chartRecommendationResponse.json();
        const chartContent = chartData.choices?.[0]?.message?.content || '{}';
        
        console.log('Raw chart recommendation response:', chartContent);
        
        const cleanedChartContent = chartContent
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        const chartRecommendations = JSON.parse(cleanedChartContent);
        
        if (chartRecommendations.recommended_charts && Array.isArray(chartRecommendations.recommended_charts)) {
          console.log(`📊 AI recommended ${chartRecommendations.recommended_charts.length} charts:`, chartRecommendations.recommended_charts);
          
          const chartMappings = chartRecommendations.recommended_charts.map((chartId: string) => ({
            document_id: document.id,
            family_id: document.family_id,
            chart_identifier: chartId,
            confidence_score: 1.0
          }));
          
          if (chartMappings.length > 0) {
            const { error: mappingError } = await supabase
              .from('document_chart_mapping')
              .insert(chartMappings);
            
            if (mappingError) {
              console.error('Error inserting chart mappings:', mappingError);
            } else {
              console.log(`✅ Successfully created ${chartMappings.length} chart mappings`);
            }
          }
        }
      }
    } catch (chartError) {
      console.error('Error in chart recommendation system:', chartError);
      // Continue with analysis even if chart recommendation fails
    }

    // Update document with last_analyzed_at timestamp
    const { error: updateError } = await supabase
      .from("documents")
      .update({ last_analyzed_at: new Date().toISOString() })
      .eq("id", document_id);

    if (updateError) {
      console.error("Error updating document:", updateError);
    }

    // Log comprehensive diagnostics
    const processingTime = Date.now() - startTime;
    
    // Get chart mapping count from database
    const { count: chartMappingCount } = await supabase
      .from('document_chart_mapping')
      .select('*', { count: 'exact', head: true })
      .eq('document_id', document_id);
    
    await supabase
      .from('document_extraction_diagnostics')
      .update({
        identified_type: identifiedType?.doc_type || 'Unknown',
        type_confidence: identifiedType?.confidence || null,
        classification_method: 'ai',
        metrics_extracted: analysisResult.metrics?.length || 0,
        insights_generated: analysisResult.insights?.length || 0,
        progress_records: analysisResult.progress?.length || 0,
        charts_mapped: chartMappingCount || 0,
        ai_model_used: 'google/gemini-2.5-flash',
        retry_count: analysisRetryCount,
        processing_time_ms: processingTime
      })
      .eq('document_id', document_id)
      .order('created_at', { ascending: false })
      .limit(1);

    console.log(`✅ Analysis complete in ${processingTime}ms (${analysisRetryCount} retries)`);

    return new Response(
      JSON.stringify({ 
        success: true,
        identified_doc_type: identifiedType?.doc_type || "Unknown",
        confidence: identifiedType?.confidence || null,
        metrics_count: analysisResult.metrics?.length || 0,
        insights_count: analysisResult.insights?.length || 0,
        progress_count: analysisResult.progress?.length || 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ CRITICAL ERROR in analyze-document:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : 'unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.name : "UnknownError"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});