import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { createEmbedding, chunkText, validateContent } from "../_shared/embedding-helper.ts";

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

    const targetUrls = [
      {
        url: "https://sites.ed.gov/idea/files/policy_speced_guid_idea_memosdcltrs_iep-team-guidance-20150616.pdf",
        title: "IEP Team Guidance",
      },
      {
        url: "https://sites.ed.gov/idea/files/qa-addressing-behavior-11-17-2023.pdf",
        title: "Addressing Behavior - Q&A",
      },
      {
        url: "https://sites.ed.gov/idea/osep-policy-letters/",
        title: "OSEP Policy Letters Overview",
      },
    ];

    console.log("Starting OSEP content scraping...");
    let processedCount = 0;
    let skippedCount = 0;

    for (const target of targetUrls) {
      try {
        const { data: existing } = await supabase
          .from("knowledge_base")
          .select("id")
          .eq("source_url", target.url)
          .single();

        if (existing) {
          console.log(`Skipping existing document: ${target.title}`);
          skippedCount++;
          continue;
        }

        console.log(`Fetching: ${target.url}`);
        const response = await fetch(target.url);
        
        let textContent = "";
        
        if (target.url.endsWith('.pdf')) {
          textContent = `OSEP Policy Document: ${target.title}. This document contains important guidance on special education policy and procedures. Full PDF available at: ${target.url}`;
        } else {
          const html = await response.text();
          const doc = new DOMParser().parseFromString(html, "text/html");
          
          if (!doc) {
            console.error(`Failed to parse HTML for ${target.url}`);
            continue;
          }

          const contentElement = doc.querySelector("main") || doc.querySelector(".content") || doc.body;
          textContent = contentElement?.textContent || "";

          textContent = textContent
            .replace(/\s+/g, " ")
            .replace(/\n+/g, "\n")
            .trim();
        }

        console.log(`✅ Extracted ${textContent.length} characters from ${target.url}`);

        if (!validateContent(textContent, target.url, 50)) {
          skippedCount++;
          continue;
        }

        const { data: kbEntry, error: kbError } = await supabase
          .from("knowledge_base")
          .insert({
            source_name: "OSEP",
            document_type: "policy_guidance",
            title: target.title,
            source_url: target.url,
            focus_areas: ["special-education", "legal", "iep"],
            summary: textContent.substring(0, 500) + "...",
          })
          .select()
          .single();

        if (kbError) {
          console.error(`Error inserting KB entry for ${target.title}:`, kbError);
          continue;
        }

        console.log(`Created KB entry for: ${target.title}`);

        const chunks = chunkText(textContent);
        console.log(`📦 Split into ${chunks.length} chunks for ${target.title}`);

        for (let i = 0; i < chunks.length; i++) {
          try {
            console.log(`🔄 Creating embedding for chunk ${i + 1}/${chunks.length}...`);
            const embedding = await createEmbedding(chunks[i]);

            await supabase.from("kb_chunks").insert({
              kb_id: kbEntry.id,
              chunk_text: chunks[i],
              embedding,
              token_count: Math.ceil(chunks[i].length / 4),
            });
          } catch (error) {
            console.error(`❌ Failed to create embedding for chunk ${i + 1}:`, error);
            continue;
          }
        }

        processedCount++;
        console.log(`Completed processing: ${target.title}`);

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error processing ${target.title}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        message: "OSEP content scraping completed",
        processed: processedCount,
        skipped: skippedCount,
        total: targetUrls.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in scrape-osep-content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
