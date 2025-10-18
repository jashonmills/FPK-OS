import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to extract main content from HTML
function extractMainContent(html: string, url: string): { title: string; content: string } {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  if (!doc) return { title: new URL(url).hostname, content: '' };

  // Remove unwanted elements
  const unwantedSelectors = ['script', 'style', 'nav', 'header', 'footer', 'iframe', 'noscript'];
  unwantedSelectors.forEach(selector => {
    doc.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Extract title
  const titleEl = doc.querySelector('title') || doc.querySelector('h1');
  const title = titleEl?.textContent?.trim() || new URL(url).hostname;

  // Extract main content (prefer main, article, or body)
  const mainEl = doc.querySelector('main') || doc.querySelector('article') || doc.querySelector('body');
  let content = mainEl?.textContent || '';
  
  // Clean up content
  content = content
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\n\s*\n/g, '\n') // Remove excessive newlines
    .trim();

  return { title, content: content.substring(0, 5000) }; // Limit to 5000 chars
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  let jobId: string | null = null;
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const { tier = 1 } = await req.json()
    
    console.log(`🚀 Starting clinical resource scraping for tier ${tier}`)

    // Create a job record
    const { data: job, error: jobError } = await supabase
      .from('kb_scraping_jobs')
      .insert({
        job_type: `clinical_tier_${tier}`,
        source_name: `Clinical Resources - Tier ${tier}`,
        status: 'in_progress',
        started_at: new Date().toISOString(),
        documents_found: 0,
        documents_added: 0,
      })
      .select()
      .single()

    if (jobError) {
      console.error('❌ Failed to create job:', jobError);
      throw jobError;
    }

    jobId = job.id;
    console.log(`✅ Created job: ${jobId}`);

    // Tier-based resource lists with better URLs
    const tierResources = {
      1: [
        { url: 'https://www.cdc.gov/ncbddd/adhd/facts.html', name: 'CDC ADHD Facts' },
        { url: 'https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders', name: 'NIMH Autism' },
        { url: 'https://www.understood.org/en/articles/what-is-neurodiversity', name: 'Understood Neurodiversity' }
      ],
      2: [
        { url: 'https://chadd.org/about-adhd/overview/', name: 'CHADD ADHD Overview' },
        { url: 'https://autismsociety.org/about-autism/', name: 'Autism Society' },
        { url: 'https://ldaamerica.org/types-of-learning-disabilities/', name: 'LDA Learning Disabilities' }
      ],
      3: [
        { url: 'https://www.additudemag.com/what-is-adhd-symptoms-causes-treatments/', name: 'ADDitude ADHD Guide' },
        { url: 'https://www.autismspeaks.org/what-autism', name: 'Autism Speaks' },
        { url: 'https://www.ncld.org/what-is-ld/', name: 'NCLD Learning Disabilities' }
      ]
    }

    const resources = tierResources[tier as keyof typeof tierResources] || tierResources[1];
    const totalResources = resources.length;
    let totalAdded = 0;
    const errors: string[] = [];

    console.log(`📚 Processing ${totalResources} resources`);

    // Update job with total count
    await supabase
      .from('kb_scraping_jobs')
      .update({ documents_found: totalResources })
      .eq('id', jobId);

    // Process resources in batches
    const batchSize = 2;
    for (let i = 0; i < resources.length; i += batchSize) {
      const batch = resources.slice(i, i + batchSize);
      console.log(`📄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(resources.length / batchSize)}`);

      await Promise.all(batch.map(async (resource) => {
        const maxRetries = 2;
        let retryCount = 0;

        while (retryCount < maxRetries) {
          try {
            console.log(`🔍 Scraping: ${resource.name}`);

            // Fetch with timeout
            const response = await fetch(resource.url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; FPK-Knowledge-Bot/1.0)',
              },
              signal: AbortSignal.timeout(20000) // 20 second timeout
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            const { title, content } = extractMainContent(html, resource.url);

            if (content.length < 100) {
              throw new Error('Content too short (likely failed to parse)');
            }

            // Check if already exists
            const { data: existing } = await supabase
              .from('ai_knowledge_sources')
              .select('id')
              .eq('url', resource.url)
              .maybeSingle();

            if (!existing) {
              const { error: insertError } = await supabase
                .from('ai_knowledge_sources')
                .insert({
                  source_name: title.substring(0, 255),
                  url: resource.url,
                  description: content.substring(0, 500),
                  is_active: true,
                });

              if (!insertError) {
                totalAdded++;
                console.log(`✅ Added: ${title.substring(0, 50)}...`);
              } else {
                throw insertError;
              }
            } else {
              console.log(`⏭️  Skipped duplicate: ${title.substring(0, 50)}...`);
              totalAdded++; // Count as success since content exists
            }

            break; // Success, exit retry loop

          } catch (err) {
            retryCount++;
            console.error(`❌ Attempt ${retryCount} failed for ${resource.name}:`, err);

            if (retryCount >= maxRetries) {
              errors.push(`${resource.name}: ${err.message}`);
            } else {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
      }));

      // Update progress after each batch
      await supabase
        .from('kb_scraping_jobs')
        .update({ documents_added: totalAdded })
        .eq('id', jobId);

      // Rate limiting between batches
      if (i + batchSize < resources.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Final update
    const finalStatus = errors.length > 0 && totalAdded === 0 ? 'failed' : 'completed';
    await supabase
      .from('kb_scraping_jobs')
      .update({
        status: finalStatus,
        documents_found: totalResources,
        documents_added: totalAdded,
        error_message: errors.length > 0 ? errors.slice(0, 3).join('; ') : null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId);

    console.log(`🏁 Job complete: ${totalAdded}/${totalResources} resources added`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        job_id: jobId,
        documents_found: totalResources,
        documents_added: totalAdded,
        errors: errors.length > 0 ? errors : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('💥 Fatal error in scrape-clinical-resources:', error);

    if (jobId) {
      try {
        await supabase
          .from('kb_scraping_jobs')
          .update({
            status: 'failed',
            error_message: error.message,
            completed_at: new Date().toISOString(),
          })
          .eq('id', jobId);
      } catch (updateErr) {
        console.error('Failed to update job status:', updateErr);
      }
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
