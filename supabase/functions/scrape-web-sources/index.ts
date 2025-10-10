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

    const { sources = [] } = await req.json();

    console.log("Starting web scraping for sources:", sources);

    const results: any[] = [];

    // Map of source IDs to their corresponding edge functions
    const sourceFunctionMap: Record<string, string> = {
      "cdc": "scrape-cdc-content",
      "aap": "scrape-aap-content",
      "wwc": "scrape-wwc-content",
      "idea": "scrape-idea-content",
      "osep": "scrape-osep-content",
      "bacb": "scrape-bacb-content",
      "nas": "scrape-nas-content",
      "cec": "scrape-cec-content",
      "kennedy-krieger": "scrape-kennedy-krieger",
      "ucdavis-mind": "scrape-ucdavis-mind",
      "vanderbilt-kennedy": "scrape-vanderbilt-kennedy",
      "autism-speaks": "scrape-autism-speaks",
      "chadd": "scrape-chadd",
      "understood": "scrape-understood",
      "aane": "scrape-aane",
      "state-doe": "scrape-state-doe",
      "autistic-blogs": "scrape-autistic-blogs",
      "prt-resources": "scrape-prt-resources",
      "esdm-resources": "scrape-esdm-resources",
      "social-thinking": "scrape-social-thinking",
      "opencourseware": "scrape-opencourseware",
    };

    // Process each source
    for (const source of sources) {
      const functionName = sourceFunctionMap[source];

      if (!functionName) {
        console.warn(`No scraper implemented for source: ${source}`);
        results.push({
          source,
          status: "not_implemented",
          message: `Scraper for ${source.toUpperCase()} coming soon`,
        });
        continue;
      }

      console.log(`Calling ${functionName} for ${source}`);

      const { data, error } = await supabase.functions.invoke(functionName);

      if (error) {
        console.error(`Error scraping ${source}:`, error);
        results.push({
          source,
          status: "error",
          error: error.message,
        });
      } else {
        results.push({
          source,
          status: "success",
          data,
        });
      }

      // Rate limiting between sources
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    const successCount = results.filter(r => r.status === "success").length;
    const errorCount = results.filter(r => r.status === "error").length;

    return new Response(
      JSON.stringify({
        message: "Web scraping completed",
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
    console.error("Error in scrape-web-sources:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});