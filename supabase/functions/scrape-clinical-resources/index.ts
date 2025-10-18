import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Resource URL mappings by source name
const RESOURCE_URLS: Record<string, string> = {
  // Clinical Resources (Tier 2)
  'CDC': 'https://www.cdc.gov/ncbddd/adhd/facts.html',
  'NIMH': 'https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders',
  'CHADD': 'https://chadd.org/about-adhd/overview/',
  'Autism Society': 'https://autismsociety.org/about-autism/',
  'Learning Disabilities Association': 'https://ldaamerica.org/types-of-learning-disabilities/',
  'ADDitude Magazine': 'https://www.additudemag.com/what-is-adhd-symptoms-causes-treatments/',
  'Autism Speaks': 'https://www.autismspeaks.org/what-autism',
  'National Center for LD': 'https://www.ncld.org/what-is-ld/',
  
  // Institutional Resources (Tier 3)
  'Harvard Graduate School of Education': 'https://www.gse.harvard.edu/ideas/usable-knowledge/21/07/teaching-students-adhd',
  'Stanford School of Education': 'https://ed.stanford.edu/news/stanford-researchers-examine-how-technology-can-help-students-learning-differences',
  'Johns Hopkins School of Education': 'https://education.jhu.edu/research/centers-labs/center-for-talented-youth/',
  'Yale Poorvu Center': 'https://poorvucenter.yale.edu/LearningDifferences',
  
  // Specialized Resources (Tier 4)
  'Social Thinking': 'https://www.socialthinking.com/Articles',
  'MIT OpenCourseWare': 'https://ocw.mit.edu/courses/res-9-003-brains-minds-and-machines-summer-course-summer-2015/',
  'Khan Academy Special Education': 'https://www.khanacademy.org/about/blog',
};

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

  // Extract main content
  const mainEl = doc.querySelector('main') || doc.querySelector('article') || doc.querySelector('body');
  let content = mainEl?.textContent || '';
  
  // Clean up content
  content = content
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  return { title, content };
}

// Determine tier and job type from source type
function getTierInfo(sourceType: string): { tier: number; jobType: string } {
  if (sourceType === 'institutional') return { tier: 3, jobType: 'clinical_tier_3' };
  if (sourceType === 'specialized') return { tier: 4, jobType: 'specialized_tier_4' };
  return { tier: 2, jobType: 'clinical_tier_2' }; // default clinical
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
    const { sources, source_type = 'clinical' } = await req.json();
    
    if (!sources || sources.length === 0) {
      throw new Error('No sources provided');
    }

    const { tier, jobType } = getTierInfo(source_type);
    
    console.log(`🚀 Starting ${source_type} scraping (Tier ${tier}) for ${sources.length} sources`);

    // Create a job record
    const { data: job, error: jobError } = await supabase
      .from('kb_scraping_jobs')
      .insert({
        job_type: jobType,
        source_name: sources.join(', '),
        status: 'in_progress',
        started_at: new Date().toISOString(),
        documents_found: 0,
        documents_added: 0,
      })
      .select()
      .single();

    if (jobError) {
      console.error('❌ Failed to create job:', jobError);
      throw jobError;
    }

    jobId = job.id;
    console.log(`✅ Created job: ${jobId}`);

    // Map source names to URLs
    const resources = sources
      .map((sourceName: string) => {
        const url = RESOURCE_URLS[sourceName];
        if (!url) {
          console.warn(`⚠️  No URL found for source: ${sourceName}`);
          return null;
        }
        return { url, name: sourceName };
      })
      .filter((r: any) => r !== null);

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

      await Promise.all(batch.map(async (resource: any) => {
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
              signal: AbortSignal.timeout(20000)
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            const { title, content } = extractMainContent(html, resource.url);

            if (content.length < 100) {
              throw new Error('Content too short (likely failed to parse)');
            }

            // Generate content hash for duplicate detection
            const encoder = new TextEncoder();
            const data = encoder.encode(content);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // Check if already exists in kb_documents
            const { data: existing } = await supabase
              .from('kb_documents')
              .select('id')
              .eq('content_hash', contentHash)
              .maybeSingle();

            if (!existing) {
              const { error: insertError } = await supabase
                .from('kb_documents')
                .insert({
                  title: title.substring(0, 500),
                  content,
                  source_name: resource.name,
                  source_type: source_type === 'clinical' ? 'clinical_database' : source_type,
                  document_type: 'guideline',
                  source_url: resource.url,
                  focus_areas: ['clinical', 'special-education', 'neurodiversity'],
                  content_hash: contentHash,
                });

              if (!insertError) {
                totalAdded++;
                console.log(`✅ Added: ${title.substring(0, 50)}...`);
              } else {
                throw insertError;
              }
            } else {
              console.log(`⏭️  Skipped duplicate: ${title.substring(0, 50)}...`);
              totalAdded++;
            }

            break; // Success

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