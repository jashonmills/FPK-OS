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
        url: "https://exceptionalchildren.org/standards/ethical-principles-and-practice-standards",
        title: "CEC Ethical Principles and Practice Standards",
      },
      {
        url: "https://exceptionalchildren.org/standards/special-education-professional-practice-standards",
        title: "CEC Professional Practice Standards",
      },
    ];

    console.log("Starting CEC content scraping...");
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
        const html = await response.text();

        const doc = new DOMParser().parseFromString(html, "text/html");
        if (!doc) {
          console.error(`Failed to parse HTML for ${target.url}`);
          continue;
        }

        const contentElement = doc.querySelector("article") || doc.querySelector("main") || doc.querySelector(".content") || doc.body;
        let textContent = contentElement?.textContent || "";

        textContent = textContent
          .replace(/\s+/g, " ")
          .replace(/\n+/g, "\n")
          .trim();

        console.log(`✅ Extracted ${textContent.length} characters from ${target.url}`);

        if (!validateContent(textContent, target.url, 100)) {
          skippedCount++;
          continue;
        }

        const { data: kbEntry, error: kbError } = await supabase
          .from("knowledge_base")
          .insert({
            source_name: "CEC",
            document_type: "professional_standards",
            title: target.title,
            source_url: target.url,
            focus_areas: ["special-education", "ethics", "professional-development"],
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

            await new Promise((resolve) => setTimeout(resolve, 100));
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
        message: "CEC content scraping completed",
        processed: processedCount,
        skipped: skippedCount,
        total: targetUrls.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in scrape-cec-content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
