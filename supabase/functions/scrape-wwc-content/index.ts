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
    console.log('🚀 WWC SCRAPER: Starting content scraping...');
    console.log('🎯 WWC SCRAPER: Targeting What Works Clearinghouse practice guides');
    
    const wwcUrls = [
      {
        url: 'https://ies.ed.gov/ncee/wwc/PracticeGuide/2',
        title: 'WWC: Assisting Students Struggling with Reading',
      },
      {
        url: 'https://ies.ed.gov/ncee/wwc/PracticeGuide/20',
        title: 'WWC: Teaching Math to Young Children',
      },
      {
        url: 'https://ies.ed.gov/ncee/wwc/PracticeGuide/16',
        title: 'WWC: Teaching Elementary School Students to Be Effective Writers',
      },
      {
        url: 'https://ies.ed.gov/ncee/wwc/PracticeGuide/9',
        title: 'WWC: Assisting Students Struggling with Mathematics',
      },
    ];

    const results = {
      documents_added: 0,
      chunks_created: 0,
      failed: 0,
      skipped: 0,
    };

    const supabase = createClient(supabaseUrl, supabaseKey);

    for (const target of wwcUrls) {
      console.log(`\n📄 WWC SCRAPER: Processing ${target.title}`);
      console.log(`🔗 WWC SCRAPER: URL = ${target.url}`);
      
      try {
        const { data: existing } = await supabase
          .from('knowledge_base')
          .select('id')
          .eq('source_url', target.url)
          .maybeSingle();

        if (existing) {
          console.log(`⏭️  WWC SCRAPER: Document already exists, skipping`);
          results.skipped++;
          continue;
        }

        const response = await fetch(target.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (!response.ok) {
          console.error(`❌ WWC SCRAPER: HTTP ${response.status} for ${target.url}`);
          results.failed++;
          continue;
        }

        const html = await response.text();
        console.log(`✅ WWC SCRAPER: Fetched ${html.length} bytes of HTML`);
        
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

        console.log(`📊 WWC SCRAPER: Extracted ${textContent.length} characters`);

        if (textContent.length < 500) {
          console.error(`❌ WWC SCRAPER: Insufficient content (${textContent.length} chars)`);
          results.failed++;
          continue;
        }

        console.log(`✅ WWC SCRAPER: Content validation passed`);

        const { data: kbDoc, error: kbError } = await supabase
          .from('knowledge_base')
          .insert({
            title: target.title,
            source_name: 'WWC',
            source_url: target.url,
            document_type: 'research_synthesis',
            focus_areas: ['evidence-based-interventions', 'special-education'],
            summary: textContent.substring(0, 500) + '...',
          })
          .select()
          .single();

        if (kbError || !kbDoc) {
          console.error('❌ WWC SCRAPER: DB insert error:', kbError);
          results.failed++;
          continue;
        }

        results.documents_added++;
        console.log(`✅ WWC SCRAPER: Created KB entry`);

        const chunks = chunkText(textContent, 8000);
        console.log(`📦 WWC SCRAPER: Split into ${chunks.length} chunks`);
        
        for (let i = 0; i < chunks.length; i++) {
          try {
            console.log(`🧠 WWC SCRAPER: Creating embedding ${i + 1}/${chunks.length}...`);
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
            console.error(`❌ WWC SCRAPER: Embedding failed for chunk ${i + 1}:`, error);
          }
        }

        console.log(`✅ WWC SCRAPER: Successfully processed ${target.title}`);

      } catch (error) {
        console.error(`❌ WWC SCRAPER: Exception processing ${target.title}:`, error);
        results.failed++;
      }
    }

    console.log(`\n📊 WWC SCRAPER COMPLETE:`, results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'WWC content scraping completed',
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('💥 WWC SCRAPER: Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
