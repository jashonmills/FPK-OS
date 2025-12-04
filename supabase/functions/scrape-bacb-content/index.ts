import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createEmbedding, chunkText } from "../_shared/embedding-helper.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 BACB SCRAPER: Starting content scraping...');
    console.log('🎯 BACB SCRAPER: Targeting behavior analyst certification board resources');

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const targetUrls = [
      {
        url: "https://www.bacb.com/ethics-code/",
        title: "BACB: Ethics Code for Behavior Analysts",
      },
      {
        url: "https://www.bacb.com/wp-content/bcba-handbook",
        title: "BACB: BCBA Certificant Handbook",
      },
      {
        url: "https://www.bacb.com/supervision-training/",
        title: "BACB: Supervision and Training Standards",
      },
    ];

    let processedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    let totalChunksCreated = 0;

    for (const target of targetUrls) {
      try {
        console.log(`\n📄 BACB SCRAPER: Processing ${target.title}`);
        console.log(`🔗 BACB SCRAPER: URL = ${target.url}`);

        const { data: existing } = await supabase
          .from("knowledge_base")
          .select("id")
          .eq("source_url", target.url)
          .maybeSingle();

        if (existing) {
          console.log(`⏭️  BACB SCRAPER: Document already exists, skipping`);
          skippedCount++;
          continue;
        }

        const response = await fetch(target.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (!response.ok) {
          console.error(`❌ BACB SCRAPER: HTTP ${response.status} for ${target.url}`);
          failedCount++;
          continue;
        }

        const html = await response.text();
        console.log(`✅ BACB SCRAPER: Fetched ${html.length} bytes of HTML`);

        let textContent = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
          .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
          .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, " ")
          .replace(/\n+/g, "\n")
          .trim();

        console.log(`📊 BACB SCRAPER: Extracted ${textContent.length} characters`);

        if (textContent.length < 500) {
          console.error(`❌ BACB SCRAPER: Insufficient content (${textContent.length} chars)`);
          failedCount++;
          continue;
        }

        console.log(`✅ BACB SCRAPER: Content validation passed`);

        const { data: kbEntry, error: kbError } = await supabase
          .from("knowledge_base")
          .insert({
            source_name: "BACB",
            document_type: "professional_standards",
            title: target.title,
            source_url: target.url,
            focus_areas: ["evidence-based-interventions", "ethics", "aba"],
            summary: textContent.substring(0, 500) + "...",
          })
          .select()
          .single();

        if (kbError) {
          console.error(`❌ BACB SCRAPER: DB insert error:`, kbError);
          failedCount++;
          continue;
        }

        console.log(`✅ BACB SCRAPER: Created KB entry`);

        const chunks = chunkText(textContent, 8000);
        console.log(`📦 BACB SCRAPER: Split into ${chunks.length} chunks`);

        for (let i = 0; i < chunks.length; i++) {
          try {
            console.log(`🧠 BACB SCRAPER: Creating embedding ${i + 1}/${chunks.length}...`);
            const embedding = await createEmbedding(chunks[i]);

            await supabase.from("kb_chunks").insert({
              kb_id: kbEntry.id,
              chunk_text: chunks[i],
              embedding,
              token_count: Math.ceil(chunks[i].length / 4),
            });

            totalChunksCreated++;
            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (error) {
            console.error(`❌ BACB SCRAPER: Embedding failed for chunk ${i + 1}:`, error);
          }
        }

        processedCount++;
        console.log(`✅ BACB SCRAPER: Successfully processed ${target.title}`);

      } catch (error) {
        console.error(`❌ BACB SCRAPER: Exception processing ${target.title}:`, error);
        failedCount++;
      }
    }

    const summary = {
      processed: processedCount,
      skipped: skippedCount,
      failed: failedCount,
      total: targetUrls.length,
      chunks_created: totalChunksCreated
    };

    console.log(`\n📊 BACB SCRAPER COMPLETE:`, summary);

    return new Response(
      JSON.stringify({
        success: true,
        message: "BACB content scraping completed",
        ...summary
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("💥 BACB SCRAPER: Fatal error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
