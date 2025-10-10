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

    const { sources = ["pubmed"], queries = ["autism", "adhd"] } = await req.json();

    console.log("Starting academic ingestion:", { sources, queries });

    const results: any[] = [];

    // Process each source
    for (const source of sources) {
      if (source === "pubmed") {
        // Call the existing PubMed function for each query
        for (const query of queries) {
          console.log(`Processing PubMed query: ${query}`);
          
          const { data, error } = await supabase.functions.invoke("ingest-pubmed", {
            body: { focus_areas: [query] },
          });

          if (error) {
            console.error(`Error processing PubMed query ${query}:`, error);
            results.push({
              source: "pubmed",
              query,
              status: "error",
              error: error.message,
            });
          } else {
            results.push({
              source: "pubmed",
              query,
              status: "success",
              data,
            });
          }

          // Rate limiting between queries
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } else if (source === "semantic-scholar") {
        // Placeholder for Semantic Scholar integration
        results.push({
          source: "semantic-scholar",
          status: "not_implemented",
          message: "Semantic Scholar integration coming soon",
        });
      }
    }

    const successCount = results.filter(r => r.status === "success").length;
    const errorCount = results.filter(r => r.status === "error").length;

    return new Response(
      JSON.stringify({
        message: "Academic ingestion completed",
        summary: {
          total: results.length,
          successful: successCount,
          failed: errorCount,
        },
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ingest-academic-sources:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});