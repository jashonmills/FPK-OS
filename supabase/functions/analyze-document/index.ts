import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { masterAnalyzeDocument } from "./ai-helpers.ts";
import { classifyDocument } from "./classification-helpers.ts";
import { getSpecializedPrompt } from "../_shared/prompts/index.ts";

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
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    
    console.log('🔑 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasAnthropicKey: !!anthropicApiKey
    });

    if (!supabaseUrl || !supabaseKey || !anthropicApiKey) {
      console.error('❌ Missing required environment variables');
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the document with retry logic to handle race conditions
    let document;
    const { data: initialDocument, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", document_id)
      .single();

    if (fetchError || !initialDocument) {
      // Don't return 404 immediately - document might be mid-creation
      console.warn('⚠️ Document not found - checking if it\'s being created...');
      
      // Wait a moment and try again (handles race condition during upload)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { data: retryDoc } = await supabase
        .from('documents')
        .select('*')
        .eq('id', document_id)
        .single();
      
      if (!retryDoc) {
        console.error('💀 Document still not found after retry');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Document not found',
            message: 'Document not found. It may have been deleted or failed to upload.',
            document_not_found: true
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }
      
      // Found it on retry, continue with this document
      console.log('✅ Document found on retry, continuing...');
      document = retryDoc;
    } else {
      document = initialDocument;
    }

    // Verify extraction is complete - DON'T DELETE, just return error
    if (!document.extracted_content || document.extracted_content.length < 200) {
      
      console.error('❌ Document extraction not completed or content too short');
      console.error(`📊 Content length: ${document.extracted_content?.length || 0} chars`);
      console.error(`📊 Metadata:`, document.metadata);
      
      // Check if extraction is still in progress
      const extractionStatus = document.metadata?.extraction_status;
      
      if (extractionStatus === 'pending' || extractionStatus === 'triggering' || extractionStatus === 'retrying') {
        console.log('⏳ Extraction still in progress, will retry later');
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Extraction in progress',
            message: 'Document extraction is still in progress. Please wait.',
            status: extractionStatus,
            retry_after: 5
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 202 }
        );
      }
      
      // If extraction failed, don't delete - let cleanup functions handle it
      if (extractionStatus === 'failed') {
        console.error('💀 Extraction failed permanently');
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Extraction failed',
            message: 'Document extraction failed. Please re-upload the document.',
            extraction_error: document.metadata?.extraction_final_error
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 422 }
        );
      }

      // Unknown state - return error but don't delete
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Text extraction incomplete',
          message: 'Document text extraction is incomplete. Please wait or try re-uploading.',
          extraction_status: extractionStatus
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
    
    console.log('🚀 Starting checkpoint-based analysis...');
    
    // =============================================================================
    // CHECKPOINT SYSTEM: Check for existing progress and resume if needed
    // =============================================================================
    const { data: existingCheckpoints } = await supabase
      .from('analysis_checkpoints')
      .select('*')
      .eq('document_id', document_id)
      .order('created_at', { ascending: false });

    const completedPhases = new Set(
      existingCheckpoints?.filter(cp => cp.completed).map(cp => cp.phase) || []
    );

    console.log('📋 Checkpoint status:', {
      total: existingCheckpoints?.length || 0,
      completed: completedPhases.size,
      phases: Array.from(completedPhases)
    });

    // Update status with granular stage tracking
    await supabase
      .from('document_analysis_status')
      .update({ 
        status: 'analyzing',
        current_phase: 'classification',
        progress_percent: 10,
        started_at: new Date().toISOString()
      })
      .eq('document_id', document_id);

    // =============================================================================
    // PHASE 1: CLASSIFICATION (with hybrid keyword + AI approach)
    // =============================================================================
    let classificationResult;
    
    if (completedPhases.has('classification')) {
      console.log('✅ Classification already completed, loading from checkpoint...');
      const checkpoint = existingCheckpoints?.find(cp => cp.phase === 'classification' && cp.completed);
      classificationResult = checkpoint?.data;
    } else {
      console.log('🔍 Running hybrid classification...');
      
      try {
        classificationResult = await classifyDocument(
          document.extracted_content,
          document_id,
          anthropicApiKey
        );

        // Save classification checkpoint
        await supabase
          .from('analysis_checkpoints')
          .insert({
            document_id: document_id,
            family_id: document.family_id,
            phase: 'classification',
            completed: true,
            data: classificationResult,
            completed_at: new Date().toISOString()
          });

        console.log('✅ Classification checkpoint saved');
      } catch (classifyError: any) {
        console.error('❌ Classification failed:', classifyError);
        
        // Save failed checkpoint
        await supabase
          .from('analysis_checkpoints')
          .insert({
            document_id: document_id,
            family_id: document.family_id,
            phase: 'classification',
            completed: false,
            error_message: classifyError.message
          });

        throw classifyError;
      }
    }

    // Update progress
    await supabase
      .from('document_analysis_status')
      .update({ 
        current_phase: 'data_extraction',
        progress_percent: 30,
        status_message: `Classified as: ${classificationResult.document_type}`
      })
      .eq('document_id', document_id);
    
    // =============================================================================
    // PHASE 2: DATA EXTRACTION (Master Analysis)
    // =============================================================================
    let analysisResult;
    let analysisRetryCount = 0;
    
    if (completedPhases.has('data_extraction')) {
      console.log('✅ Data extraction already completed, loading from checkpoint...');
      const checkpoint = existingCheckpoints?.find(cp => cp.phase === 'data_extraction' && cp.completed);
      analysisResult = checkpoint?.data;
      analysisRetryCount = 0;
    } else {
      console.log('📊 Running master data extraction...');
      
      // Check if we should use a specialized extraction prompt
      const useSpecialized = classificationResult.confidence_score >= 0.80;
      const specializedPrompt = useSpecialized 
        ? getSpecializedPrompt(classificationResult.document_type) 
        : null;
      
      if (specializedPrompt) {
        console.log(`✨ Using specialized prompt for: ${classificationResult.document_type} (confidence: ${classificationResult.confidence_score})`);
      } else if (useSpecialized) {
        console.log(`⚠️ No specialized prompt available for: ${classificationResult.document_type}, using master prompt`);
      } else {
        console.log(`📋 Confidence too low (${classificationResult.confidence_score}), using master prompt`);
      }
      
      try {
        const analysisData = await masterAnalyzeDocument(
          document.extracted_content,
          anthropicApiKey,
          classificationResult.document_type,
          specializedPrompt || undefined,
          async (stage: string) => {
            const progressMap: Record<string, number> = {
              'calling_ai_model': 40,
              'processing_response': 60,
              'distributing_data': 80
            };
            
            await supabase
              .from('document_analysis_status')
              .update({ 
                progress_percent: progressMap[stage] || 50,
                status_message: stage.replace(/_/g, ' ')
              })
              .eq('document_id', document_id);
          }
        );
        
        analysisResult = analysisData.result;
        analysisRetryCount = analysisData.retryCount;

        // Save data extraction checkpoint
        await supabase
          .from('analysis_checkpoints')
          .insert({
            document_id: document_id,
            family_id: document.family_id,
            phase: 'data_extraction',
            completed: true,
            data: analysisResult,
            completed_at: new Date().toISOString()
          });

        console.log('✅ Data extraction checkpoint saved');
      } catch (analysisError: any) {
        console.error('❌ Data extraction failed:', analysisError);
        
        const isTimeout = analysisError.message?.includes('timed out') || analysisError.name === 'AbortError';
        const errorType = isTimeout ? 'timeout' : 'extraction_error';
        
        // Save failed checkpoint
        await supabase
          .from('analysis_checkpoints')
          .insert({
            document_id: document_id,
            family_id: document.family_id,
            phase: 'data_extraction',
            completed: false,
            error_message: analysisError.message
          });
        
        // Update document_analysis_status with failure
        await supabase
          .from('document_analysis_status')
          .update({
            status: 'failed',
            current_phase: 'data_extraction',
            error_message: `${errorType}: ${analysisError.message || 'AI analysis failed'}`,
            completed_at: new Date().toISOString()
          })
          .eq('document_id', document_id);
      
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
            error: isTimeout ? 'Analysis Timeout' : 'Critical Error: AI analysis failed',
            details: analysisError.message || 'Unable to analyze document. Please try again later.',
            document_id: document_id,
            can_retry: isTimeout, // Timeouts are retryable
            checkpoint_available: true // Can resume from last checkpoint
          }),
          { status: isTimeout ? 504 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Update progress
    await supabase
      .from('document_analysis_status')
      .update({ 
        current_phase: 'data_distribution',
        progress_percent: 85,
        status_message: 'Distributing extracted data'
      })
      .eq('document_id', document_id);

    // =============================================================================
    // PHASE 3: DATA DISTRIBUTION (Populate all target tables)
    // =============================================================================
    if (!completedPhases.has('data_distribution')) {
      console.log('💾 Distributing data to target tables...');
      
      const documentUploadDate = document.created_at ? 
        new Date(document.created_at).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0];

      // Update document with both classification and analysis results
      await supabase
        .from('documents')
        .update({ 
          category: classificationResult.document_type,
          last_analyzed_at: new Date().toISOString(),
          metadata: {
            ...document.metadata,
            analysis_status: 'completed',
            // Classification metadata
            identified_type: classificationResult.document_type,
            classification_confidence: classificationResult.confidence,
            classification_method: classificationResult.pre_classification_match ? 'keyword+ai' : 'ai_only',
            requires_manual_review: classificationResult.requires_manual_review,
            keywords_found: classificationResult.classification_metadata.keywords_found,
            // Analysis metadata
            ai_identified_type: analysisResult.identified_document_type,
            ai_confidence_score: analysisResult.confidence_score,
            analysis_completed_at: new Date().toISOString(),
            analysis_model: 'claude-sonnet-4-20250514'
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

      // Save data distribution checkpoint
      await supabase
        .from('analysis_checkpoints')
        .insert({
          document_id: document_id,
          family_id: document.family_id,
          phase: 'data_distribution',
          completed: true,
          completed_at: new Date().toISOString()
        });

      console.log('✅ Data distribution checkpoint saved');
    } else {
      console.log('✅ Data distribution already completed, skipping...');
    }

    const totalTime = Date.now() - startTime;
    console.log(`✅ Analysis complete in ${totalTime}ms (${analysisRetryCount} retries)`);
    console.log(`📊 Results: ${analysisResult.metrics?.length || 0} metrics, ${analysisResult.insights?.length || 0} insights, ${analysisResult.progress_tracking?.length || 0} progress, ${analysisResult.recommended_charts?.length || 0} charts`);
    
    // Log metric type breakdown for debugging
    if (analysisResult.metrics && analysisResult.metrics.length > 0) {
      const metricTypeBreakdown = analysisResult.metrics.reduce((acc: any, m: any) => {
        acc[m.metric_type] = (acc[m.metric_type] || 0) + 1;
        return acc;
      }, {});
      console.log(`📊 Metric types extracted:`, metricTypeBreakdown);
    }

    // Update document_analysis_status with completion
    await supabase
      .from('document_analysis_status')
      .update({
        status: 'complete',
        current_phase: 'completed',
        progress_percent: 100,
        status_message: 'Analysis complete',
        completed_at: new Date().toISOString(),
        metrics_extracted: analysisResult.metrics?.length || 0,
        insights_extracted: analysisResult.insights?.length || 0,
        error_message: null
      })
      .eq('document_id', document_id);

    return new Response(
      JSON.stringify({
        success: true,
        document_id: document.id,
        // Classification results
        classified_type: classificationResult.document_type,
        classification_confidence: classificationResult.confidence,
        classification_method: classificationResult.pre_classification_match ? 'hybrid' : 'ai',
        requires_review: classificationResult.requires_manual_review,
        // Analysis results
        ai_identified_type: analysisResult.identified_document_type,
        ai_confidence: analysisResult.confidence_score,
        metrics_extracted: analysisResult.metrics?.length || 0,
        insights_generated: analysisResult.insights?.length || 0,
        progress_records: analysisResult.progress_tracking?.length || 0,
        charts_recommended: analysisResult.recommended_charts?.length || 0,
        // Performance metrics
        retries: analysisRetryCount,
        processing_time_ms: totalTime,
        checkpoints_used: completedPhases.size > 0
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
