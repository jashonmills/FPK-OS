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
    console.log('🚀 IDEA SCRAPER: Starting content scraping...');
    console.log('🎯 IDEA SCRAPER: Targeting IDEA special education law pages');

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const targetUrls = [
      {
        url: "https://sites.ed.gov/idea/about-idea/",
        title: "IDEA: About the Individuals with Disabilities Education Act",
      },
      {
        url: "https://sites.ed.gov/idea/statute-chapter-33",
        title: "IDEA: Full Law Text (Chapter 33)",
      },
      {
        url: "https://sites.ed.gov/idea/topic-areas/",
        title: "IDEA: Topic Areas and Resources",
      },
    ];

    let processedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    let totalChunksCreated = 0;

    for (const target of targetUrls) {
      try {
        console.log(`\n📄 IDEA SCRAPER: Processing ${target.title}`);
        console.log(`🔗 IDEA SCRAPER: URL = ${target.url}`);

        // Check if already exists
        const { data: existing } = await supabase
          .from("knowledge_base")
          .select("id")
          .eq("source_url", target.url)
          .maybeSingle();

        if (existing) {
          console.log(`⏭️  IDEA SCRAPER: Document already exists, skipping`);
          skippedCount++;
          continue;
        }

        const response = await fetch(target.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (!response.ok) {
          console.error(`❌ IDEA SCRAPER: HTTP ${response.status} for ${target.url}`);
          failedCount++;
          continue;
        }

        const html = await response.text();
        console.log(`✅ IDEA SCRAPER: Fetched ${html.length} bytes of HTML`);

        // Enhanced text extraction
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

        console.log(`📊 IDEA SCRAPER: Extracted ${textContent.length} characters`);

        if (textContent.length < 500) {
          console.error(`❌ IDEA SCRAPER: Insufficient content (${textContent.length} chars)`);
          failedCount++;
          continue;
        }

        console.log(`✅ IDEA SCRAPER: Content validation passed`);

        const { data: kbEntry, error: kbError } = await supabase
          .from("knowledge_base")
          .insert({
            source_name: "IDEA",
            document_type: "legal_statute",
            title: target.title,
            source_url: target.url,
            focus_areas: ["special-education", "legal", "iep"],
            summary: textContent.substring(0, 500) + "...",
          })
          .select()
          .single();

        if (kbError) {
          console.error(`❌ IDEA SCRAPER: DB insert error:`, kbError);
          failedCount++;
          continue;
        }

        console.log(`✅ IDEA SCRAPER: Created KB entry for ${target.title}`);

        const chunks = chunkText(textContent, 8000);
        console.log(`📦 IDEA SCRAPER: Split into ${chunks.length} chunks`);

        for (let i = 0; i < chunks.length; i++) {
          try {
            console.log(`🧠 IDEA SCRAPER: Creating embedding ${i + 1}/${chunks.length}...`);
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
            console.error(`❌ IDEA SCRAPER: Embedding failed for chunk ${i + 1}:`, error);
          }
        }

        processedCount++;
        console.log(`✅ IDEA SCRAPER: Successfully processed ${target.title}`);

      } catch (error) {
        console.error(`❌ IDEA SCRAPER: Exception processing ${target.title}:`, error);
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

    console.log(`\n📊 IDEA SCRAPER COMPLETE:`, summary);

    return new Response(
      JSON.stringify({
        success: true,
        message: "IDEA content scraping completed",
        ...summary
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("💥 IDEA SCRAPER: Fatal error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
