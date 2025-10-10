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
    console.log('Starting AAP content scraping...');
    
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
        
        const textContent = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        console.log(`✅ Extracted ${textContent.length} characters from ${url}`);

        const focusArea = url.includes('Autism') || url.includes('e20193447') ? 'autism' : 'adhd';
        
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
          content: textContent.substring(0, 10000),
        });

      } catch (error) {
        console.error(`Error processing ${url}:`, error);
        continue;
      }
    }

    console.log(`Scraped ${scrapedDocuments.length} AAP documents`);

    const results = {
      documents_added: 0,
      chunks_created: 0,
    };

    const supabase = createClient(supabaseUrl, supabaseKey);

    for (const doc of scrapedDocuments) {
      const { data: existing } = await supabase
        .from('knowledge_base')
        .select('id')
        .eq('source_url', doc.source_url)
        .single();

      if (existing) {
        console.log(`Document already exists for ${doc.source_url}, skipping...`);
        continue;
      }

      if (!validateContent(doc.content, doc.source_url, 100)) {
        continue;
      }

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

      const chunks = chunkText(doc.content);
      console.log(`📦 Split into ${chunks.length} chunks for ${doc.title}`);
      
      for (let i = 0; i < chunks.length; i++) {
        try {
          console.log(`🔄 Creating embedding for chunk ${i + 1}/${chunks.length}...`);
          const embedding = await createEmbedding(chunks[i]);

          const { error: chunkError } = await supabase
            .from('kb_chunks')
            .insert({
              kb_id: kbDoc.id,
              chunk_text: chunks[i],
              embedding,
              token_count: Math.ceil(chunks[i].length / 4),
            });

          if (!chunkError) {
            results.chunks_created++;
          }
        } catch (error) {
          console.error(`❌ Failed to create embedding for chunk ${i + 1}:`, error);
          continue;
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
