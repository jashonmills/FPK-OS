import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting CDC content scraping...');
    
    // Target CDC pages about Autism and ADHD
    const cdcUrls = [
      'https://www.cdc.gov/ncbddd/autism/facts.html',
      'https://www.cdc.gov/ncbddd/autism/signs.html',
      'https://www.cdc.gov/ncbddd/autism/screening.html',
      'https://www.cdc.gov/ncbddd/adhd/facts.html',
      'https://www.cdc.gov/ncbddd/adhd/diagnosis.html',
      'https://www.cdc.gov/ncbddd/adhd/treatment.html',
    ];

    const scrapedDocuments = [];

    for (const url of cdcUrls) {
      console.log(`Fetching CDC page: ${url}`);
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Failed to fetch ${url}: ${response.status}`);
          continue;
        }

        const html = await response.text();
        
        // Basic HTML parsing - extract text content
        const textContent = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Determine focus area from URL
        const focusArea = url.includes('autism') ? 'autism' : 'adhd';
        
        // Extract title from URL path
        const pathParts = url.split('/');
        const fileName = pathParts[pathParts.length - 1].replace('.html', '');
        const title = `CDC: ${focusArea.toUpperCase()} - ${fileName}`;

        scrapedDocuments.push({
          title,
          source_name: 'CDC',
          source_url: url,
          document_type: 'clinical_guideline',
          focus_areas: [focusArea],
          summary: textContent.substring(0, 500) + '...',
          content: textContent,
        });

      } catch (error) {
        console.error(`Error processing ${url}:`, error);
        continue;
      }
    }

    console.log(`Scraped ${scrapedDocuments.length} CDC documents`);

    // Store documents in knowledge base and generate embeddings
    const results = {
      documents_added: 0,
      chunks_created: 0,
    };

    for (const doc of scrapedDocuments) {
      // Insert into knowledge_base table
      const { data: kbDoc, error: kbError } = await Deno.env.get('SUPABASE_URL') 
        ? await fetch(Deno.env.get('SUPABASE_URL')! + '/rest/v1/knowledge_base', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
              'Prefer': 'return=representation',
            },
            body: JSON.stringify({
              title: doc.title,
              source_name: doc.source_name,
              source_url: doc.source_url,
              document_type: doc.document_type,
              focus_areas: doc.focus_areas,
              summary: doc.summary,
            }),
          }).then(r => r.json())
        : { data: null, error: new Error('No Supabase URL') };

      if (kbError || !kbDoc) {
        console.error('Error inserting KB document:', kbError);
        continue;
      }

      results.documents_added++;

      // Chunk the content and generate embeddings
      const chunks = chunkText(doc.content, 500);
      
      for (const chunk of chunks) {
        // Generate embedding using Lovable AI
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

        if (!embeddingResponse.ok) {
          console.error('Failed to generate embedding');
          continue;
        }

        const embeddingData = await embeddingResponse.json();
        const embedding = embeddingData.data[0].embedding;

        // Insert chunk with embedding
        await fetch(Deno.env.get('SUPABASE_URL')! + '/rest/v1/kb_chunks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({
            kb_id: Array.isArray(kbDoc) ? kbDoc[0].id : kbDoc.id,
            chunk_text: chunk,
            embedding,
            token_count: Math.ceil(chunk.length / 4),
          }),
        });

        results.chunks_created++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'CDC content scraping completed',
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-cdc-content:', error);
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