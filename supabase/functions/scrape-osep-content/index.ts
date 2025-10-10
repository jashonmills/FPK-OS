import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
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
        // Check if already exists
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
        
        // Check if it's a PDF
        if (target.url.endsWith('.pdf')) {
          // For PDFs, we'll just store metadata and a note
          // In production, you'd want to use a PDF parsing library
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

        if (!textContent || textContent.length < 50) {
          console.warn(`Insufficient content for ${target.url}`);
          continue;
        }

        // Insert into knowledge_base
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

        // Chunk and embed
        const chunks = chunkText(textContent, 500);
        console.log(`Created ${chunks.length} chunks for ${target.title}`);

        for (const chunk of chunks) {
          // Generate embedding
          const embeddingResponse = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${lovableApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              input: chunk,
              model: "text-embedding-3-small",
            }),
          });

          if (!embeddingResponse.ok) {
            console.error(`Embedding API error for chunk in ${target.title}`);
            continue;
          }

          const embeddingData = await embeddingResponse.json();
          const embedding = embeddingData.data[0].embedding;

          // Insert chunk
          const { error: chunkError } = await supabase
            .from("kb_chunks")
            .insert({
              kb_id: kbEntry.id,
              chunk_text: chunk,
              embedding: JSON.stringify(embedding),
              token_count: Math.ceil(chunk.length / 4),
            });

          if (chunkError) {
            console.error(`Error inserting chunk for ${target.title}:`, chunkError);
          }

          await new Promise((resolve) => setTimeout(resolve, 100));
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

function chunkText(text: string, maxTokens: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+\s+/);
  let currentChunk = "";
  let currentTokens = 0;

  for (const sentence of sentences) {
    const sentenceTokens = Math.ceil(sentence.length / 4);

    if (currentTokens + sentenceTokens > maxTokens && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
      currentTokens = 0;
    }

    currentChunk += sentence + ". ";
    currentTokens += sentenceTokens;
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
