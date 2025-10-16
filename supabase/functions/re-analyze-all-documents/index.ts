import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`🔄 Starting deep re-analysis for family: ${family_id}`);

    // Step 1: Fetch all documents for this family
    const { data: documents, error: fetchError } = await supabase
      .from("documents")
      .select("id, file_name, family_id, student_id")
      .eq("family_id", family_id)
      .not("extracted_content", "is", null);

    if (fetchError) {
      console.error("Error fetching documents:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch documents" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!documents || documents.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No documents found to re-analyze",
          documents_processed: 0 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`📄 Found ${documents.length} documents to re-analyze`);

    // Step 2: Clear existing analysis data for these documents
    const documentIds = documents.map(d => d.id);
    
    // Delete existing metrics
    const { error: metricsDeleteError } = await supabase
      .from("document_metrics")
      .delete()
      .in("document_id", documentIds);

    if (metricsDeleteError) {
      console.error("Error deleting old metrics:", metricsDeleteError);
    } else {
      console.log("✅ Cleared old metrics");
    }

    // Delete existing insights
    const { error: insightsDeleteError } = await supabase
      .from("ai_insights")
      .delete()
      .in("document_id", documentIds);

    if (insightsDeleteError) {
      console.error("Error deleting old insights:", insightsDeleteError);
    } else {
      console.log("✅ Cleared old insights");
    }

    // Delete existing progress tracking
    const { error: progressDeleteError } = await supabase
      .from("progress_tracking")
      .delete()
      .in("document_id", documentIds);

    if (progressDeleteError) {
      console.error("Error deleting old progress:", progressDeleteError);
    } else {
      console.log("✅ Cleared old progress tracking");
    }

    // Delete existing chart mappings
    const { error: chartDeleteError } = await supabase
      .from("document_chart_mapping")
      .delete()
      .in("document_id", documentIds);

    if (chartDeleteError) {
      console.error("Error deleting old chart mappings:", chartDeleteError);
    } else {
      console.log("✅ Cleared old chart mappings");
    }

    // Step 3: Re-analyze each document using the new specialized prompts
    let successCount = 0;
    let errorCount = 0;

    for (const doc of documents) {
      try {
        console.log(`🔍 Re-analyzing: ${doc.file_name}`);
        
        // Call analyze-document with bypass_limit: true (don't count against usage)
        const analyzeResponse = await supabase.functions.invoke("analyze-document", {
          body: {
            document_id: doc.id,
            bypass_limit: true // Don't count re-analysis against monthly limits
          }
        });

        if (analyzeResponse.error) {
          console.error(`❌ Error analyzing ${doc.file_name}:`, analyzeResponse.error);
          errorCount++;
        } else {
          console.log(`✅ Successfully re-analyzed: ${doc.file_name}`);
          console.log(`   Extracted: ${analyzeResponse.data?.metrics_count || 0} metrics, ${analyzeResponse.data?.insights_count || 0} insights`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Exception analyzing ${doc.file_name}:`, error);
        errorCount++;
      }
    }

    console.log(`🎉 Re-analysis complete: ${successCount} successful, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        total_documents: documents.length,
        successful: successCount,
        failed: errorCount,
        message: `Re-analyzed ${successCount} of ${documents.length} documents using specialized "Deep Read" prompts`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in re-analyze-all-documents:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});