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
    console.log('Starting WWC content scraping...');
    
    const wwcUrls = [
      'https://ies.ed.gov/ncee/wwc/PracticeGuide/2',  // Assisting Students Struggling with Reading
      'https://ies.ed.gov/ncee/wwc/PracticeGuide/20', // Teaching Math to Young Children
      'https://ies.ed.gov/ncee/wwc/Topic/3',          // Students with Disabilities
    ];

    const scrapedDocuments = [];

    for (const url of wwcUrls) {
      console.log(`Fetching WWC page: ${url}`);
      
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

        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch 
          ? `WWC: ${titleMatch[1].substring(0, 100)}` 
          : `WWC: Evidence-Based Intervention`;

        scrapedDocuments.push({
          title,
          source_name: 'WWC',
          source_url: url,
          document_type: 'research_synthesis',
          focus_areas: ['evidence-based-interventions', 'special-education'],
          summary: textContent.substring(0, 500) + '...',
          content: textContent.substring(0, 10000),
        });

      } catch (error) {
        console.error(`Error processing ${url}:`, error);
        continue;
      }
    }

    console.log(`Scraped ${scrapedDocuments.length} WWC documents`);

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

      console.log(`✅ Extracted ${doc.content.length} characters from ${doc.source_url}`);

      if (!validateContent(doc.content, doc.source_url)) {
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
      console.log(`📦 Split into ${chunks.length} chunks`);
      
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
        message: 'WWC content scraping completed',
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in scrape-wwc-content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
