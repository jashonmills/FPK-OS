import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { document_id } = await req.json();

    if (!document_id) {
      throw new Error("document_id is required");
    }

    console.log(`🔍 Extracting metrics from Bedrock document: ${document_id}`);

    // Fetch the Bedrock document
    const { data: document, error: fetchError } = await supabase
      .from("bedrock_documents")
      .select("*")
      .eq("id", document_id)
      .in("status", ["complete", "completed"])
      .single();

    if (fetchError || !document) {
      throw new Error(`Failed to fetch document: ${fetchError?.message}`);
    }

    if (!document.analysis_data) {
      throw new Error("No analysis data available");
    }

    // Parse the analysis_data JSONB
    const analysisData = document.analysis_data as any;
    console.log(`📊 Analysis data structure:`, Object.keys(analysisData));

    let metricsInserted = 0;
    const errors: string[] = [];

    // Extract metrics from various sections of the analysis
    const metricsToInsert: any[] = [];

    // 1. Extract Academic Metrics
    if (analysisData.academic_metrics || analysisData.academicMetrics) {
      const academics = analysisData.academic_metrics || analysisData.academicMetrics;
      if (Array.isArray(academics)) {
        for (const metric of academics) {
          metricsToInsert.push({
            document_id,
            family_id: document.family_id,
            organization_id: document.organization_id,
            student_id: document.student_id,
            metric_type: "academic_fluency",
            metric_name: metric.skill_area || metric.metric_name || "Academic Performance",
            metric_value: metric.current_level || metric.score || metric.value,
            target_value: metric.target_level || metric.target,
            measurement_date: document.document_date || document.created_at.split('T')[0],
            context: metric.context || metric.notes,
            duration_minutes: metric.duration_minutes,
            metadata: { raw: metric },
          });
        }
      }
    }

    // 2. Extract Behavioral Metrics
    if (analysisData.behavioral_metrics || analysisData.behavioralMetrics) {
      const behavioral = analysisData.behavioral_metrics || analysisData.behavioralMetrics;
      if (Array.isArray(behavioral)) {
        for (const metric of behavioral) {
          metricsToInsert.push({
            document_id,
            family_id: document.family_id,
            organization_id: document.organization_id,
            student_id: document.student_id,
            metric_type: "behavior_frequency",
            metric_name: metric.behavior_type || metric.incident_type || "Behavioral Incident",
            metric_value: metric.frequency || metric.count || 1,
            measurement_date: metric.date || document.document_date || document.created_at.split('T')[0],
            context: metric.antecedent || metric.context,
            intervention_used: metric.intervention || metric.consequence,
            duration_minutes: metric.duration_minutes,
            metadata: { raw: metric },
          });
        }
      }
    }

    // 3. Extract Communication Metrics
    if (analysisData.communication_metrics || analysisData.communicationMetrics) {
      const communication = analysisData.communication_metrics || analysisData.communicationMetrics;
      if (Array.isArray(communication)) {
        for (const metric of communication) {
          metricsToInsert.push({
            document_id,
            family_id: document.family_id,
            organization_id: document.organization_id,
            student_id: document.student_id,
            metric_type: "communication",
            metric_name: metric.skill_area || "Communication Skill",
            metric_value: metric.score || metric.level,
            target_value: metric.target,
            measurement_date: document.document_date || document.created_at.split('T')[0],
            context: metric.context,
            metadata: { raw: metric },
          });
        }
      }
    }

    // 4. Extract Executive Function Metrics
    if (analysisData.executive_function || analysisData.executiveFunction) {
      const ef = analysisData.executive_function || analysisData.executiveFunction;
      if (Array.isArray(ef)) {
        for (const metric of ef) {
          metricsToInsert.push({
            document_id,
            family_id: document.family_id,
            organization_id: document.organization_id,
            student_id: document.student_id,
            metric_type: "executive_function",
            metric_name: metric.skill_area || metric.domain,
            metric_value: metric.score || metric.rating,
            target_value: metric.target,
            measurement_date: document.document_date || document.created_at.split('T')[0],
            context: metric.context,
            metadata: { raw: metric },
          });
        }
      }
    }

    // 5. Extract Progress Tracking Data (if present)
    if (analysisData.progress || analysisData.progressTracking) {
      const progress = analysisData.progress || analysisData.progressTracking;
      if (Array.isArray(progress)) {
        for (const item of progress) {
          metricsToInsert.push({
            document_id,
            family_id: document.family_id,
            organization_id: document.organization_id,
            student_id: document.student_id,
            metric_type: item.goal_type || "progress_tracking",
            metric_name: item.goal_title || item.metric_name,
            metric_value: item.current_value,
            target_value: item.target_value,
            measurement_date: item.measurement_date || document.document_date || document.created_at.split('T')[0],
            context: item.notes,
            metadata: { raw: item },
          });
        }
      }
    }

    // 6. Generic metrics array (fallback)
    if (analysisData.metrics && Array.isArray(analysisData.metrics)) {
      for (const metric of analysisData.metrics) {
        metricsToInsert.push({
          document_id,
          family_id: document.family_id,
          organization_id: document.organization_id,
          student_id: document.student_id,
          metric_type: metric.type || "general",
          metric_name: metric.name || metric.metric_name || "Metric",
          metric_value: metric.value || metric.score,
          target_value: metric.target,
          measurement_date: metric.date || document.document_date || document.created_at.split('T')[0],
          context: metric.context || metric.notes,
          intervention_used: metric.intervention,
          duration_minutes: metric.duration_minutes,
          metadata: { raw: metric },
        });
      }
    }

    console.log(`📦 Prepared ${metricsToInsert.length} metrics for insertion`);

    // Insert all metrics
    if (metricsToInsert.length > 0) {
      for (const metric of metricsToInsert) {
        try {
          // Skip if missing required fields
          if (!metric.metric_type || !metric.metric_name || !metric.measurement_date) {
            console.warn(`⚠️ Skipping metric with missing fields:`, metric);
            continue;
          }

          const { error: insertError } = await supabase
            .from("bedrock_metrics")
            .insert(metric);

          if (insertError) {
            // Check if it's a unique constraint violation (already exists)
            if (insertError.code === '23505') {
              console.log(`⚠️ Metric already exists, skipping: ${metric.metric_name}`);
            } else {
              console.error(`❌ Error inserting metric:`, insertError);
              errors.push(`${metric.metric_name}: ${insertError.message}`);
            }
          } else {
            metricsInserted++;
            console.log(`✅ Inserted metric: ${metric.metric_name} = ${metric.metric_value}`);
          }
        } catch (metricError) {
          const errorMessage = metricError instanceof Error ? metricError.message : String(metricError);
          console.error(`❌ Failed to insert metric:`, errorMessage);
          errors.push(errorMessage);
        }
      }
    }

    console.log(`✅ Metrics extraction complete: ${metricsInserted} inserted, ${errors.length} errors`);

    return new Response(
      JSON.stringify({
        success: metricsInserted > 0,
        document_id,
        metrics_inserted: metricsInserted,
        metrics_skipped: metricsToInsert.length - metricsInserted,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: metricsInserted > 0 ? 200 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error in bedrock-extract-metrics:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
