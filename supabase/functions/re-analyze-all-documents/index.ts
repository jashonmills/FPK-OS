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
      .select("id, file_name, file_path, extracted_content, family_id, student_id")
      .eq("family_id", family_id);

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

    console.log(`📄 Found ${documents.length} documents to process`);

    // Identify documents that need extraction
    const needsExtraction = documents.filter((doc: any) => 
      !doc.extracted_content || 
      doc.extracted_content.startsWith('Document uploaded:') ||
      doc.extracted_content.length < 100
    );

    console.log(`🔄 ${needsExtraction.length} documents need text extraction`);

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

    // Step 3: Extract and re-analyze each document
    let extractedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const doc of documents) {
      try {
        // Step 3a: Extract text if needed
        if (needsExtraction.some((d: any) => d.id === doc.id)) {
          console.log(`📄 Extracting text from: ${doc.file_name}`);
          
          const { data: extractData, error: extractError } = await supabase.functions.invoke(
            'extract-document-text',
            { body: { document_id: doc.id } }
          );
          
          if (extractError) {
            throw new Error(`Extraction failed: ${extractError.message || extractError}`);
          }
          
          console.log(`✅ Extracted ${extractData?.text_length || 0} characters from: ${doc.file_name}`);
          extractedCount++;
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Step 3b: Analyze document
        console.log(`🔍 Re-analyzing: ${doc.file_name}`);
        
        const analyzeResponse = await supabase.functions.invoke("analyze-document", {
          body: {
            document_id: doc.id,
            bypass_limit: true
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
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Exception processing ${doc.file_name}:`, error);
        errorCount++;
      }
    }

    console.log(`🎉 Processing complete: ${extractedCount} extracted, ${successCount} analyzed, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        total_documents: documents.length,
        extracted: extractedCount,
        analyzed: successCount,
        failed: errorCount,
        message: `Processed ${documents.length} documents: ${extractedCount} extracted, ${successCount} analyzed`
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