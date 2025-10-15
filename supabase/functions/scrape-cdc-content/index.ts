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
    console.log('🚀 CDC SCRAPER: Starting content scraping...');
    console.log('🎯 CDC SCRAPER: Targeting 6 CDC pages on Autism and ADHD');
    
    // Updated CDC URLs with correct current paths
    const cdcUrls = [
      {
        url: 'https://www.cdc.gov/autism/about/index.html',
        title: 'CDC: About Autism Spectrum Disorder',
        focusArea: 'autism'
      },
      {
        url: 'https://www.cdc.gov/autism/signs-symptoms/index.html',
        title: 'CDC: Signs and Symptoms of Autism',
        focusArea: 'autism'
      },
      {
        url: 'https://www.cdc.gov/autism/screening-diagnosis/index.html',
        title: 'CDC: Autism Screening and Diagnosis',
        focusArea: 'autism'
      },
      {
        url: 'https://www.cdc.gov/adhd/about/index.html',
        title: 'CDC: About ADHD',
        focusArea: 'adhd'
      },
      {
        url: 'https://www.cdc.gov/adhd/diagnosis-treatment/index.html',
        title: 'CDC: ADHD Diagnosis and Treatment',
        focusArea: 'adhd'
      },
      {
        url: 'https://www.cdc.gov/adhd/features/key-findings-adhd.html',
        title: 'CDC: Key Findings on ADHD',
        focusArea: 'adhd'
      },
    ];

    const scrapedDocuments = [];
    let fetchSuccessCount = 0;
    let fetchFailCount = 0;

    for (const target of cdcUrls) {
      console.log(`\n📄 CDC SCRAPER: Processing ${target.title}`);
      console.log(`🔗 CDC SCRAPER: URL = ${target.url}`);
      
      try {
        const response = await fetch(target.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (!response.ok) {
          console.error(`❌ CDC SCRAPER: HTTP ${response.status} for ${target.url}`);
          fetchFailCount++;
          continue;
        }

        const html = await response.text();
        console.log(`✅ CDC SCRAPER: Fetched ${html.length} bytes of HTML`);
        
        // Enhanced text extraction with better cleanup
        let textContent = html
          // Remove scripts and styles
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          // Remove HTML comments
          .replace(/<!--[\s\S]*?-->/g, '')
          // Remove navigation and footer noise
          .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
          .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
          .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
          // Remove all remaining HTML tags
          .replace(/<[^>]+>/g, ' ')
          // Clean up whitespace
          .replace(/\s+/g, ' ')
          .replace(/\n+/g, '\n')
          .trim();

        console.log(`📊 CDC SCRAPER: Extracted ${textContent.length} characters of text`);

        // More lenient validation for CDC pages
        if (textContent.length < 500) {
          console.error(`❌ CDC SCRAPER: Insufficient content (${textContent.length} chars) from ${target.url}`);
          console.error(`   First 200 chars: ${textContent.substring(0, 200)}`);
          fetchFailCount++;
          continue;
        }

        fetchSuccessCount++;
        console.log(`✅ CDC SCRAPER: Content validation passed for ${target.title}`);

        scrapedDocuments.push({
          title: target.title,
          source_name: 'CDC',
          source_url: target.url,
          document_type: 'clinical_guideline',
          focus_areas: [target.focusArea],
          summary: textContent.substring(0, 500) + '...',
          content: textContent,
        });

      } catch (error) {
        console.error(`❌ CDC SCRAPER: Exception while processing ${target.url}:`, error);
        fetchFailCount++;
        continue;
      }
    }

    console.log(`\n📊 CDC SCRAPER: Fetch Summary - Success: ${fetchSuccessCount}, Failed: ${fetchFailCount}, Total: ${cdcUrls.length}`);

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
