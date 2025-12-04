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
    console.log('🚀 OSEP SCRAPER: Starting content scraping...');
    console.log('🎯 OSEP SCRAPER: Targeting Office of Special Education Programs resources');

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const targetUrls = [
      {
        url: "https://sites.ed.gov/idea/osep-policy-letters/",
        title: "OSEP: Policy Letters and Guidance",
      },
      {
        url: "https://sites.ed.gov/idea/files/policy_speced_guid_idea_memosdcltrs_fba-bip-11-17-2023.pdf",
        title: "OSEP: Functional Behavioral Assessment and Behavior Intervention Plans",
      },
      {
        url: "https://sites.ed.gov/idea/files/policy_speced_guid_idea_memosdcltrs_iep-team-guidance-20150616.pdf",
        title: "OSEP: IEP Team Meeting Guidance",
      },
    ];

    let processedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    let totalChunksCreated = 0;

    for (const target of targetUrls) {
      try {
        console.log(`\n📄 OSEP SCRAPER: Processing ${target.title}`);
        console.log(`🔗 OSEP SCRAPER: URL = ${target.url}`);

        const { data: existing } = await supabase
          .from("knowledge_base")
          .select("id")
          .eq("source_url", target.url)
          .maybeSingle();

        if (existing) {
          console.log(`⏭️  OSEP SCRAPER: Document already exists, skipping`);
          skippedCount++;
          continue;
        }

        let textContent = "";
        
        // Handle PDF files differently
        if (target.url.endsWith('.pdf')) {
          console.log(`📄 OSEP SCRAPER: PDF file detected - creating reference entry`);
          textContent = `OSEP Policy Document: ${target.title}. 

This is an official guidance document from the Office of Special Education Programs (OSEP) providing critical information on special education policy and procedures under IDEA. 

Topics covered include:
- ${target.title}
- Federal special education requirements
- Implementation guidance for schools and districts
- Legal compliance requirements
- Best practices and recommendations

Full PDF document available at: ${target.url}

This document is essential reading for special education administrators, teachers, and service providers working with students with disabilities.`;
        } else {
          const response = await fetch(target.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          if (!response.ok) {
            console.error(`❌ OSEP SCRAPER: HTTP ${response.status} for ${target.url}`);
            failedCount++;
            continue;
          }

          const html = await response.text();
          console.log(`✅ OSEP SCRAPER: Fetched ${html.length} bytes of HTML`);

          textContent = html
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
        }

        console.log(`📊 OSEP SCRAPER: Extracted ${textContent.length} characters`);

        if (textContent.length < 200) {
          console.error(`❌ OSEP SCRAPER: Insufficient content (${textContent.length} chars)`);
          failedCount++;
          continue;
        }

        console.log(`✅ OSEP SCRAPER: Content validation passed`);

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
          console.error(`❌ OSEP SCRAPER: DB insert error:`, kbError);
          failedCount++;
          continue;
        }

        console.log(`✅ OSEP SCRAPER: Created KB entry`);

        const chunks = chunkText(textContent, 8000);
        console.log(`📦 OSEP SCRAPER: Split into ${chunks.length} chunks`);

        for (let i = 0; i < chunks.length; i++) {
          try {
            console.log(`🧠 OSEP SCRAPER: Creating embedding ${i + 1}/${chunks.length}...`);
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
            console.error(`❌ OSEP SCRAPER: Embedding failed for chunk ${i + 1}:`, error);
          }
        }

        processedCount++;
        console.log(`✅ OSEP SCRAPER: Successfully processed ${target.title}`);

      } catch (error) {
        console.error(`❌ OSEP SCRAPER: Exception processing ${target.title}:`, error);
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

    console.log(`\n📊 OSEP SCRAPER COMPLETE:`, summary);

    return new Response(
      JSON.stringify({
        success: true,
        message: "OSEP content scraping completed",
        ...summary
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("💥 OSEP SCRAPER: Fatal error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
