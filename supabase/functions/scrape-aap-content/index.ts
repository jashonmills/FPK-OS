import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { corsHeaders } from "../_shared/cors.ts";
import { createEmbedding, chunkText } from "../_shared/embedding-helper.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 AAP SCRAPER: Starting content scraping...');
    console.log('🎯 AAP SCRAPER: Targeting American Academy of Pediatrics clinical guidelines');
    
    const aapUrls = [
      {
        url: 'https://publications.aap.org/pediatrics/article/145/1/e20193447/36917/Identification-Evaluation-and-Management-of',
        title: 'AAP: Identification, Evaluation, and Management of Children with Autism',
        focusArea: 'autism'
      },
      {
        url: 'https://publications.aap.org/pediatrics/article/144/4/e20192528/76895/Clinical-Practice-Guideline-for-the-Diagnosis',
        title: 'AAP: Clinical Practice Guideline for Diagnosis, Evaluation, and Treatment of ADHD',
        focusArea: 'adhd'
      },
      {
        url: 'https://www.aap.org/en/patient-care/autism/',
        title: 'AAP: Autism Spectrum Disorder Resources',
        focusArea: 'autism'
      },
    ];

    const results = {
      documents_added: 0,
      chunks_created: 0,
      failed: 0,
      skipped: 0,
    };

    const supabase = createClient(supabaseUrl, supabaseKey);

    for (const target of aapUrls) {
      console.log(`\n📄 AAP SCRAPER: Processing ${target.title}`);
      console.log(`🔗 AAP SCRAPER: URL = ${target.url}`);
      
      try {
        const { data: existing } = await supabase
          .from('knowledge_base')
          .select('id')
          .eq('source_url', target.url)
          .maybeSingle();

        if (existing) {
          console.log(`⏭️  AAP SCRAPER: Document already exists, skipping`);
          results.skipped++;
          continue;
        }

        const response = await fetch(target.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (!response.ok) {
          console.error(`❌ AAP SCRAPER: HTTP ${response.status} for ${target.url}`);
          results.failed++;
          continue;
        }

        const html = await response.text();
        console.log(`✅ AAP SCRAPER: Fetched ${html.length} bytes of HTML`);
        
        const textContent = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
          .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
          .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        console.log(`📊 AAP SCRAPER: Extracted ${textContent.length} characters`);

        if (textContent.length < 500) {
          console.error(`❌ AAP SCRAPER: Insufficient content (${textContent.length} chars)`);
          results.failed++;
          continue;
        }

        console.log(`✅ AAP SCRAPER: Content validation passed`);

        const { data: kbDoc, error: kbError } = await supabase
          .from('knowledge_base')
          .insert({
            title: target.title,
            source_name: 'AAP',
            source_url: target.url,
            document_type: 'clinical_guideline',
            focus_areas: [target.focusArea],
            summary: textContent.substring(0, 500) + '...',
          })
          .select()
          .single();

        if (kbError || !kbDoc) {
          console.error('❌ AAP SCRAPER: DB insert error:', kbError);
          results.failed++;
          continue;
        }

        results.documents_added++;
        console.log(`✅ AAP SCRAPER: Created KB entry`);

        const chunks = chunkText(textContent, 8000);
        console.log(`📦 AAP SCRAPER: Split into ${chunks.length} chunks`);
        
        for (let i = 0; i < chunks.length; i++) {
          try {
            console.log(`🧠 AAP SCRAPER: Creating embedding ${i + 1}/${chunks.length}...`);
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

            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            console.error(`❌ AAP SCRAPER: Embedding failed for chunk ${i + 1}:`, error);
          }
        }

        console.log(`✅ AAP SCRAPER: Successfully processed ${target.title}`);

      } catch (error) {
        console.error(`❌ AAP SCRAPER: Exception processing ${target.title}:`, error);
        results.failed++;
      }
    }

    console.log(`\n📊 AAP SCRAPER COMPLETE:`, results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'AAP content scraping completed',
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('💥 AAP SCRAPER: Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
