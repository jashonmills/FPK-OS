import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { corsHeaders } from "../_shared/cors.ts";
import { createEmbedding, chunkText, validateContent } from "../_shared/embedding-helper.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting CDC content scraping...');
    
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
      console.log(`📄 Fetching CDC page: ${url}`);
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`❌ Failed to fetch ${url}: ${response.status}`);
          continue;
        }

        const html = await response.text();
        console.log(`✅ Successfully fetched HTML from ${url}`);
        
        // Basic HTML parsing - extract text content
        const textContent = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        console.log(`📊 Extracted ${textContent.length} characters of clean text from ${url}`);

        // Validate content before proceeding
        if (!validateContent(textContent, url, 200)) {
          continue; // Skip if content is insufficient
        }

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
        console.error(`❌ Error processing ${url}:`, error);
        continue;
      }
    }

    console.log(`📚 Scraped ${scrapedDocuments.length} CDC documents`);

    // Store documents in knowledge base and generate embeddings
    const results = {
      documents_added: 0,
      chunks_created: 0,
      chunks_failed: 0,
    };

    const supabase = createClient(supabaseUrl, supabaseKey);

    for (const doc of scrapedDocuments) {
      try {
        // Check if document already exists
        const { data: existing } = await supabase
          .from('knowledge_base')
          .select('id')
          .eq('source_url', doc.source_url)
          .maybeSingle();

        if (existing) {
          console.log(`⏭️  Document already exists for ${doc.source_url}, skipping...`);
          continue;
        }

        // Insert into knowledge_base table
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
          console.error('❌ Error inserting KB document:', kbError);
          continue;
        }

        results.documents_added++;
        console.log(`✅ Added document: ${doc.title}`);

        // Chunk the content
        const chunks = chunkText(doc.content, 8000);
        console.log(`🔪 Split text into ${chunks.length} chunks`);
        
        let chunkIndex = 0;
        for (const chunk of chunks) {
          chunkIndex++;
          try {
            console.log(`🧠 Creating embedding for chunk ${chunkIndex}/${chunks.length}...`);
            
            // Generate embedding using shared helper with retry logic
            const embedding = await createEmbedding(chunk);

            // Insert chunk with embedding
            const { error: chunkError } = await supabase
              .from('kb_chunks')
              .insert({
                kb_id: kbDoc.id,
                chunk_text: chunk,
                embedding,
                token_count: Math.ceil(chunk.length / 4),
              });

            if (chunkError) {
              console.error(`❌ Failed to insert chunk ${chunkIndex}:`, chunkError);
              results.chunks_failed++;
            } else {
              results.chunks_created++;
            }

            // Rate limiting: small delay between chunks
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error) {
            console.error(`❌ Failed to create embedding for chunk ${chunkIndex}:`, error);
            results.chunks_failed++;
            // Continue to next chunk instead of failing entire document
          }
        }
      } catch (error) {
        console.error(`❌ Error processing document ${doc.title}:`, error);
      }
    }

    console.log(`✅ CDC scraping complete:`, results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'CDC content scraping completed',
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('💥 Error in scrape-cdc-content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
