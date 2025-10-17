import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { masterAnalyzeDocument } from "./ai-helpers.ts";

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

    // Check if extraction completed
    if (!document.extracted_content || 
        document.extracted_content.includes('Extraction pending') ||
        document.extracted_content.length < 100) {
      
      console.error('❌ Document extraction not completed or content too short');
      
      // Update metadata to show analysis blocked
      await supabase
        .from('documents')
        .update({
          metadata: {
            ...document.metadata,
            analysis_status: 'blocked',
            analysis_error: 'Extraction must complete before analysis can begin'
          }
        })
        .eq('id', document_id);

      return new Response(
        JSON.stringify({ 
          error: 'Critical Error: Text extraction incomplete',
          message: 'Document text extraction has not completed. Analysis cannot proceed.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        const currentMonth = new Date().toISOString().slice(0, 7);

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
    
    console.log('🚀 Invoking Master Analysis (unified AI call)...');
    
    let analysisResult;
    let analysisRetryCount = 0;
    
    try {
      const analysisData = await masterAnalyzeDocument(
        document.extracted_content,
        lovableApiKey
      );
      analysisResult = analysisData.result;
      analysisRetryCount = analysisData.retryCount;
    } catch (analysisError: any) {
      console.error('❌ Master Analysis failed:', analysisError);
      
      // Update document with FAILED analysis status
      await supabase
        .from('documents')
        .update({
          metadata: {
            ...document.metadata,
            analysis_status: 'failed',
            analysis_error: analysisError.message || 'AI analysis failed to generate valid data'
          }
        })
        .eq('id', document_id);

      return new Response(
        JSON.stringify({ 
          error: 'Critical Error: AI analysis failed to generate valid data',
          details: analysisError.message || 'Unable to analyze document. Please try again later.',
          document_id: document_id
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ========================================================================
    // DATA DISTRIBUTION: Populate all target tables from Master JSON
    // ========================================================================
    const documentUploadDate = document.created_at ? 
      new Date(document.created_at).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0];

    // Update document category with identified type
    await supabase
      .from('documents')
      .update({ 
        category: analysisResult.identified_document_type,
        last_analyzed_at: new Date().toISOString(),
        metadata: {
          ...document.metadata,
          analysis_status: 'completed',
          identified_type: analysisResult.identified_document_type,
          confidence_score: analysisResult.confidence_score,
          analysis_completed_at: new Date().toISOString()
        }
      })
      .eq('id', document_id);

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
        measurement_date: metric.measurement_date || documentUploadDate,
        start_time: metric.start_time || null,
        end_time: metric.end_time || null,
        duration_minutes: metric.duration_minutes || null,
        context: metric.context || null,
        intervention_used: metric.intervention_used || null,
        target_value: metric.target_value || null,
      }));
      
      console.log(`📊 Inserting ${metricsToInsert.length} metrics`);

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

      console.log(`💡 Inserting ${insightsToInsert.length} insights`);

      const { error: insightsError } = await supabase
        .from("ai_insights")
        .insert(insightsToInsert);

      if (insightsError) {
        console.error("Error inserting insights:", insightsError);
      }
    }

    // Insert progress tracking
    if (analysisResult.progress_tracking && analysisResult.progress_tracking.length > 0) {
      const progressToInsert = analysisResult.progress_tracking.map((prog: any) => ({
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

      console.log(`📈 Inserting ${progressToInsert.length} progress records`);

      const { error: progressError } = await supabase
        .from("progress_tracking")
        .insert(progressToInsert);

      if (progressError) {
        console.error("Error inserting progress:", progressError);
      }
    }

    // Insert chart recommendations directly from Master JSON
    if (analysisResult.recommended_charts && analysisResult.recommended_charts.length > 0) {
      const chartMappings = analysisResult.recommended_charts.map((chartId: string) => ({
        document_id: document.id,
        family_id: document.family_id,
        chart_identifier: chartId,
        confidence_score: 1.0 // Master Prompt recommendations are trusted
      }));

      console.log(`📊 Inserting ${chartMappings.length} chart mappings:`, analysisResult.recommended_charts);

      const { error: mappingError } = await supabase
        .from('document_chart_mapping')
        .insert(chartMappings);

      if (mappingError) {
        console.error('Error inserting chart mappings:', mappingError);
      }
    }

    const totalTime = Date.now() - startTime;
    console.log(`✅ Analysis complete in ${totalTime}ms (${analysisRetryCount} retries)`);
    console.log(`📊 Results: ${analysisResult.metrics?.length || 0} metrics, ${analysisResult.insights?.length || 0} insights, ${analysisResult.progress_tracking?.length || 0} progress, ${analysisResult.recommended_charts?.length || 0} charts`);

    return new Response(
      JSON.stringify({
        success: true,
        document_id: document.id,
        identified_type: analysisResult.identified_document_type,
        confidence_score: analysisResult.confidence_score,
        metrics_extracted: analysisResult.metrics?.length || 0,
        insights_generated: analysisResult.insights?.length || 0,
        progress_records: analysisResult.progress_tracking?.length || 0,
        charts_recommended: analysisResult.recommended_charts?.length || 0,
        retries: analysisRetryCount,
        processing_time_ms: totalTime
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Critical analysis error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred during analysis",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
