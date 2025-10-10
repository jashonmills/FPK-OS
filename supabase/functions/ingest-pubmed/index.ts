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
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { focus_areas = ["autism", "adhd"] } = await req.json();

    console.log("Starting PubMed ingestion for focus areas:", focus_areas);

    // Query PubMed E-utilities API
    const searchTerms = focus_areas.join(" OR ");
    const pubmedSearchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchTerms)}&retmax=10&retmode=json`;

    const searchResponse = await fetch(pubmedSearchUrl);
    const searchData = await searchResponse.json();
    const pmids = searchData.esearchresult?.idlist || [];

    console.log(`Found ${pmids.length} articles`);

    if (pmids.length === 0) {
      return new Response(
        JSON.stringify({ message: "No articles found", count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let processedCount = 0;

    // Fetch article details
    for (const pmid of pmids) {
      try {
        const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`;
        const summaryResponse = await fetch(summaryUrl);
        const summaryData = await summaryResponse.json();
        const article = summaryData.result?.[pmid];

        if (!article) continue;

        const title = article.title || "";
        const abstractText = article.abstracttext || title;
        const pubDate = article.pubdate || "";

        // Check if already exists
        const { data: existing } = await supabase
          .from("knowledge_base")
          .select("id")
          .eq("source_url", `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`)
          .single();

        if (existing) {
          console.log(`Article ${pmid} already exists, skipping`);
          continue;
        }

        // Insert into knowledge_base
        const { data: kbDoc, error: kbError } = await supabase
          .from("knowledge_base")
          .insert({
            source_name: "PubMed",
            source_url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
            title,
            publication_date: pubDate ? new Date(pubDate).toISOString().split("T")[0] : null,
            document_type: "research_article",
            keywords: [],
            focus_areas,
            summary: abstractText.substring(0, 500),
          })
          .select()
          .single();

        if (kbError) {
          console.error("Error inserting KB document:", kbError);
          continue;
        }

        // Chunk the text and create embeddings
        const chunks = chunkText(abstractText, 500);
        
        for (const chunk of chunks) {
          // Call OpenAI Embeddings API
          const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${openaiApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "text-embedding-3-small",
              input: chunk,
            }),
          });

          if (!embeddingResponse.ok) {
            console.error("OpenAI API error:", await embeddingResponse.text());
            continue;
          }

          const embeddingData = await embeddingResponse.json();
          const embedding = embeddingData.data[0].embedding;

          // Insert chunk with embedding
          const { error: chunkError } = await supabase.from("kb_chunks").insert({
            kb_id: kbDoc.id,
            chunk_text: chunk,
            embedding,
            token_count: chunk.split(/\s+/).length,
          });

          if (chunkError) {
            console.error("Error inserting chunk:", chunkError);
          }

          // Rate limiting: 3 requests per second
          await new Promise((resolve) => setTimeout(resolve, 350));
        }

        processedCount++;
        console.log(`Processed article ${pmid} (${processedCount}/${pmids.length})`);
        
        // Small delay between articles
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing article ${pmid}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Ingestion completed",
        total: pmids.length,
        processed: processedCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ingest-pubmed:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function chunkText(text: string, maxTokens: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let currentChunk: string[] = [];

  for (const word of words) {
    currentChunk.push(word);
    if (currentChunk.length >= maxTokens) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
}
