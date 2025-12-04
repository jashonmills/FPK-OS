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
        for (const query of queries) {
          console.log(`Ingesting Semantic Scholar for query: ${query}`);
          
          try {
            const searchUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&fields=title,abstract,authors,year,citationCount,url&limit=100`;
            
            const response = await fetch(searchUrl, {
              headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
              throw new Error(`Semantic Scholar API error: ${response.status}`);
            }

            const searchData = await response.json();
            const papers = searchData.data || [];
            const qualityPapers = papers.filter((paper: any) => 
              paper.citationCount > 10 && paper.year >= 2015
            );

            console.log(`Found ${qualityPapers.length} quality papers for query: ${query}`);

            let addedCount = 0;
            let skippedCount = 0;

            for (const paper of qualityPapers) {
              const title = paper.title || "Untitled";
              const authors = paper.authors?.map((a: any) => a.name).join(", ") || "Unknown";
              const abstract = paper.abstract || "";
              
              const { data: existing } = await supabase
                .from("knowledge_base")
                .select("id")
                .eq("source_url", paper.url)
                .maybeSingle();

              if (existing) {
                skippedCount++;
                continue;
              }

              const { data: kbEntry, error: kbError } = await supabase
                .from("knowledge_base")
                .insert({
                  source_name: "Semantic Scholar",
                  document_type: "research_paper",
                  title,
                  summary: abstract,
                  source_url: paper.url,
                  publication_date: paper.year ? `${paper.year}-01-01` : null,
                  keywords: [query],
                  focus_areas: ["research", "academic"]
                })
                .select()
                .single();

              if (kbError) {
                console.error("Error inserting KB entry:", kbError);
                continue;
              }

              const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
              const content = `${title}\n\nAuthors: ${authors}\n\n${abstract}`;
              const chunks = chunkText(content, 500);

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

                if (!embeddingResponse.ok) continue;

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

              addedCount++;
            }

            results.push({
              source: "semantic-scholar",
              query,
              status: "success",
              data: { total: qualityPapers.length, added: addedCount, skipped: skippedCount }
            });

          } catch (error) {
            console.error(`Error ingesting Semantic Scholar for query "${query}":`, error);
            results.push({
              source: "semantic-scholar",
              query,
              status: "error",
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }

          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
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