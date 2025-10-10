import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { corsHeaders } from "../_shared/cors.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting AAP content scraping...');
    
    // AAP Clinical Reports and Policy Statements
    const aapUrls = [
      'https://publications.aap.org/pediatrics/article/145/1/e20193447/36917/Identification-Evaluation-and-Management-of',
      'https://publications.aap.org/pediatrics/article/144/4/e20192528/76895/Clinical-Practice-Guideline-for-the-Diagnosis',
    ];

    const scrapedDocuments = [];

    for (const url of aapUrls) {
      console.log(`Fetching AAP page: ${url}`);
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Failed to fetch ${url}: ${response.status}`);
          continue;
        }

        const html = await response.text();
        
        // Extract text content from HTML
        const textContent = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Determine focus area from URL
        const focusArea = url.includes('Autism') || url.includes('e20193447') ? 'autism' : 'adhd';
        
        // Extract title (simplified)
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch 
          ? `AAP: ${titleMatch[1].substring(0, 100)}` 
          : `AAP: ${focusArea.toUpperCase()} Clinical Guideline`;

        scrapedDocuments.push({
          title,
          source_name: 'AAP',
          source_url: url,
          document_type: 'clinical_guideline',
          focus_areas: [focusArea],
          summary: textContent.substring(0, 500) + '...',
          content: textContent.substring(0, 10000), // Limit content size
        });

      } catch (error) {
        console.error(`Error processing ${url}:`, error);
        continue;
      }
    }

    console.log(`Scraped ${scrapedDocuments.length} AAP documents`);

    // Store documents in knowledge base
    const results = {
      documents_added: 0,
      chunks_created: 0,
    };

    const supabase = createClient(supabaseUrl, supabaseKey);

    for (const doc of scrapedDocuments) {
      // Check if document already exists
      const { data: existing } = await supabase
        .from('knowledge_base')
        .select('id')
        .eq('source_url', doc.source_url)
        .single();

      if (existing) {
        console.log(`Document already exists for ${doc.source_url}, skipping...`);
        continue;
      }

      // Insert document
      const { data: kbDoc, error: kbError } = await supabase
        .from('knowledge_base')
        .insert({
          title: doc.title,
          source_name: doc.source_name,
          source_url: doc.source_url,
          document_type: doc.document_type,
          focus_areas: doc.focus_areas,
          summary: doc.summary,
        })
        .select()
        .single();

      if (kbError || !kbDoc) {
        console.error('Error inserting KB document:', kbError);
        continue;
      }

      results.documents_added++;

      // Chunk and embed
      const chunks = chunkText(doc.content, 500);
      
      for (const chunk of chunks) {
        const embeddingResponse = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: chunk,
            model: 'text-embedding-3-small',
          }),
        });

        if (!embeddingResponse.ok) continue;

        const embeddingData = await embeddingResponse.json();
        const embedding = embeddingData.data[0].embedding;

        const { error: chunkError } = await supabase
          .from('kb_chunks')
          .insert({
            kb_id: kbDoc.id,
            chunk_text: chunk,
            embedding,
            token_count: Math.ceil(chunk.length / 4),
          });

        if (!chunkError) {
          results.chunks_created++;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'AAP content scraping completed',
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in scrape-aap-content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function chunkText(text: string, maxTokens: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    const wordLength = Math.ceil(word.length / 4);
    
    if (currentLength + wordLength > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
      currentChunk = [word];
      currentLength = wordLength;
    } else {
      currentChunk.push(word);
      currentLength += wordLength;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
}