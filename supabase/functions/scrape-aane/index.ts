import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { createEmbedding, chunkText, validateContent } from "../_shared/embedding-helper.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TARGET_URLS = [
  {
    url: "https://www.aane.org/resources/",
    title: "AANE Resources for Autistic Individuals"
  },
  {
    url: "https://www.aane.org/life-skills/",
    title: "AANE Life Skills Resources"
  }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let processedCount = 0;
    let skippedCount = 0;

    for (const target of TARGET_URLS) {
      console.log(`Processing: ${target.url}`);

      const { data: existing } = await supabase
        .from("knowledge_base")
        .select("id")
        .eq("source_url", target.url)
        .maybeSingle();

      if (existing) {
        console.log(`Skipping ${target.url} - already exists`);
        skippedCount++;
        continue;
      }

      const response = await fetch(target.url);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      if (!doc) {
        console.error(`Failed to parse ${target.url}`);
        continue;
      }

      const mainContent = doc.querySelector("main") || doc.querySelector("article") || doc.body;
      let textContent = mainContent?.textContent || "";
      
      textContent = textContent
        .replace(/\s+/g, " ")
        .replace(/\n+/g, "\n")
        .trim();

      console.log(`✅ Extracted ${textContent.length} characters from ${target.url}`);

      if (!validateContent(textContent, target.url)) {
        skippedCount++;
        continue;
      }

      const { data: kbEntry, error: kbError } = await supabase
        .from("knowledge_base")
        .insert({
          source_name: "AANE",
          document_type: "life_skills_resource",
          title: target.title,
          source_url: target.url,
          focus_areas: ["autism", "transition-planning"],
          keywords: ["Asperger", "autism", "life skills", "adult transition"]
        })
        .select()
        .single();

      if (kbError) {
        console.error("Error inserting KB entry:", kbError);
        continue;
      }

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
            token_count: Math.ceil(chunks[i].length / 4)
          });
        } catch (error) {
          console.error(`❌ Failed to create embedding for chunk ${i + 1}:`, error);
          continue;
        }
      }

      processedCount++;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return new Response(
      JSON.stringify({
        message: "AANE scraping completed",
        processed: processedCount,
        skipped: skippedCount,
        total: TARGET_URLS.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in scrape-aane:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
