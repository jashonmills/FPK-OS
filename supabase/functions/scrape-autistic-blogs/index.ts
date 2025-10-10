import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TARGET_BLOGS = [
  {
    url: "https://neuroclastic.com/",
    title: "NeuroClastic - Autistic Perspectives",
    articleSelector: "article"
  },
  {
    url: "https://theautisticadvocate.com/",
    title: "The Autistic Advocate",
    articleSelector: "article"
  }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let processedCount = 0;
    let skippedCount = 0;

    for (const blog of TARGET_BLOGS) {
      console.log(`Processing: ${blog.url}`);

      const { data: existing } = await supabase
        .from("knowledge_base")
        .select("id")
        .eq("source_url", blog.url)
        .maybeSingle();

      if (existing) {
        console.log(`Skipping ${blog.url} - already exists`);
        skippedCount++;
        continue;
      }

      const response = await fetch(blog.url);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      if (!doc) {
        console.error(`Failed to parse ${blog.url}`);
        continue;
      }

      const mainContent = doc.querySelector("main") || doc.querySelector("article") || doc.body;
      let textContent = mainContent?.textContent || "";
      
      textContent = textContent
        .replace(/\s+/g, " ")
        .replace(/\n+/g, "\n")
        .trim();

      if (textContent.length < 100) {
        console.log(`Skipping ${blog.url} - insufficient content`);
        continue;
      }

      const { data: kbEntry, error: kbError } = await supabase
        .from("knowledge_base")
        .insert({
          source_name: blog.title,
          document_type: "community_perspective",
          title: blog.title,
          source_url: blog.url,
          focus_areas: ["autism", "lived-experience", "advocacy"],
          keywords: ["autistic voices", "lived experience", "neurodiversity", "advocacy"]
        })
        .select()
        .single();

      if (kbError) {
        console.error("Error inserting KB entry:", kbError);
        continue;
      }

      const chunks = chunkText(textContent, 500);
      console.log(`Created ${chunks.length} chunks for ${blog.title}`);

      for (const chunk of chunks) {
        const embeddingResponse = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            input: chunk,
            model: "text-embedding-3-small"
          })
        });

        if (!embeddingResponse.ok) {
          console.error("Embedding API error:", await embeddingResponse.text());
          continue;
        }

        const embeddingData = await embeddingResponse.json();
        const embedding = embeddingData.data[0].embedding;

        await supabase.from("kb_chunks").insert({
          kb_id: kbEntry.id,
          chunk_text: chunk,
          embedding,
          token_count: Math.ceil(chunk.length / 4)
        });

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      processedCount++;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return new Response(
      JSON.stringify({
        message: "Autistic Blogs scraping completed",
        processed: processedCount,
        skipped: skippedCount,
        total: TARGET_BLOGS.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in scrape-autistic-blogs:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function chunkText(text: string, maxTokens: number): string[] {
  const sentences = text.split(/[.!?]+\s+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    const proposedChunk = currentChunk + (currentChunk ? ". " : "") + sentence;
    const approximateTokens = Math.ceil(proposedChunk.length / 4);

    if (approximateTokens > maxTokens && currentChunk) {
      chunks.push(currentChunk + ".");
      currentChunk = sentence;
    } else {
      currentChunk = proposedChunk;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk + ".");
  }

  return chunks.filter(c => c.trim().length > 0);
}
