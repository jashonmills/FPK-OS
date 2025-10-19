import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Expanded Resource URL mappings - Multiple URLs per source for better coverage
const RESOURCE_URLS: Record<string, string[]> = {
  // Tier 2: Clinical & Educational Resources - US
  'NIMH': [
    'https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders',
    'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd',
    'https://www.nimh.nih.gov/health/topics/child-and-adolescent-mental-health'
  ],
  'CHADD': [
    'https://chadd.org/about-adhd/overview/',
    'https://chadd.org/for-parents/overview/',
    'https://chadd.org/for-educators/adhd-in-the-classroom/'
  ],
  'ASHA': [
    'https://www.asha.org/practice-portal/',
    'https://www.asha.org/public/',
    'https://www.asha.org/practice-portal/clinical-topics/autism/'
  ],
  
  // Tier 2: Clinical & Educational Resources - UK
  'National Autistic Society UK': [
    'https://www.autism.org.uk/advice-and-guidance',
    'https://www.autism.org.uk/advice-and-guidance/topics/education',
    'https://www.autism.org.uk/advice-and-guidance/professional-practice'
  ],
  'British Dyslexia Association': [
    'https://www.bdadyslexia.org.uk/dyslexia',
    'https://www.bdadyslexia.org.uk/advice/children',
    'https://www.bdadyslexia.org.uk/advice/adults'
  ],
  'ADHD Foundation UK': [
    'https://www.adhdfoundation.org.uk/information/',
    'https://www.adhdfoundation.org.uk/what-is-adhd/',
    'https://www.adhdfoundation.org.uk/neurodiversity/'
  ],
  
  // Tier 2: Clinical & Educational Resources - Ireland
  'NCSE Ireland': [
    'https://ncse.ie/policy-advice',
    'https://ncse.ie/supporting-students',
    'https://ncse.ie/information-resources'
  ],
  'AsIAm Ireland': [
    'https://asiam.ie/education/',
    'https://asiam.ie/employment/',
    'https://asiam.ie/community-support/'
  ],
  'Dyslexia Association Ireland': [
    'https://www.dyslexia.ie/information/',
    'https://www.dyslexia.ie/dyslexia-in-adults/',
    'https://www.dyslexia.ie/support-services/'
  ],
  'HSE Ireland': [
    'https://www.hse.ie/eng/services/list/4/disability/',
    'https://www.hse.ie/eng/services/list/4/disability/earlyintervention/',
    'https://www.hse.ie/eng/services/list/4/disability/progressing-disability/'
  ],
  
  // Tier 2: Global Professional Organizations
  'WFOT': [
    'https://wfot.org/resources',
    'https://wfot.org/practice',
    'https://wfot.org/about/about-occupational-therapy'
  ],
  
  // Tier 3: Institutional Resources
  'MIT OpenCourseWare': [
    'https://ocw.mit.edu/courses/res-9-003-brains-minds-and-machines-summer-course-summer-2015/',
    'https://ocw.mit.edu/courses/brain-and-cognitive-sciences/'
  ],
  'Hanen Centre': [
    'http://www.hanen.org/Programs.aspx',
    'http://www.hanen.org/Helpful-Info.aspx'
  ],
  'LD OnLine': [
    'https://www.ldonline.org/ld-topics/adhd',
    'https://www.ldonline.org/ld-topics/dyslexia',
    'https://www.ldonline.org/ld-topics/autism-spectrum-disorders'
  ],
  'CPIR': [
    'https://www.parentcenterhub.org/find-your-center/',
    'https://www.parentcenterhub.org/priority-iep/',
    'https://www.parentcenterhub.org/repository/disability-info/'
  ],
  'The Arc': [
    'https://thearc.org/our-initiatives/',
    'https://thearc.org/policy-advocacy/'
  ],
  'Council for Exceptional Children': [
    'https://exceptionalchildren.org/standards',
    'https://exceptionalchildren.org/research-and-policy',
    'https://exceptionalchildren.org/professional-development'
  ],
  
  // Tier 4: Specialized Resources
  'ADDitude Magazine': [
    'https://www.additudemag.com/category/adhd-add/',
    'https://www.additudemag.com/category/parenting-adhd-children/',
    'https://www.additudemag.com/category/school-learning/'
  ],
  'Autism Society': [
    'https://autismsociety.org/about-autism/',
    'https://autismsociety.org/living-with-autism/'
  ],
  'Learning Disabilities Association': [
    'https://ldaamerica.org/types-of-learning-disabilities/',
    'https://ldaamerica.org/support/adults-with-ld/'
  ],
  'National Center for LD': [
    'https://www.ncld.org/what-is-ld/',
    'https://www.ncld.org/understanding-ld/'
  ],
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

    // Map source names to their URL arrays
    const allResources: { url: string; name: string }[] = [];
    sources.forEach((sourceName: string) => {
      const urls = RESOURCE_URLS[sourceName];
      if (!urls || urls.length === 0) {
        console.warn(`⚠️  No URLs found for source: ${sourceName}`);
        return;
      }
      // Add all URLs for this source
      urls.forEach(url => {
        allResources.push({ url, name: sourceName });
      });
    });

    const totalResources = allResources.length;
    let totalAdded = 0;
    const errors: string[] = [];

    console.log(`📚 Processing ${totalResources} resource URLs from ${sources.length} sources`);

    // Update job with total count
    await supabase
      .from('kb_scraping_jobs')
      .update({ documents_found: totalResources })
      .eq('id', jobId);

    // Process resources in batches
    const batchSize = 2;
    for (let i = 0; i < allResources.length; i += batchSize) {
      const batch = allResources.slice(i, i + batchSize);
      console.log(`📄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allResources.length / batchSize)}`);

      await Promise.all(batch.map(async (resource: any) => {
        const maxRetries = 2;
        let retryCount = 0;

        while (retryCount < maxRetries) {
          try {
            console.log(`🔍 Scraping: ${resource.name} - ${resource.url}`);

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
            }

            break; // Success

          } catch (err) {
            retryCount++;
            console.error(`❌ Attempt ${retryCount} failed for ${resource.name} (${resource.url}):`, err);

            if (retryCount >= maxRetries) {
              errors.push(`${resource.name} (${resource.url}): ${err.message}`);
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
      if (i + batchSize < allResources.length) {
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
        error_message: errors.length > 0 ? errors.slice(0, 5).join('; ') : null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId);

    console.log(`🏁 Job complete: ${totalAdded}/${totalResources} resources added`);

    // Auto-trigger embedding generation for newly added documents if any were added
    if (totalAdded > 0) {
      console.log('🤖 Auto-triggering embedding generation for new documents...');
      try {
        const embedResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/regenerate-kb-embeddings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
        });

        if (embedResponse.ok) {
          console.log('✅ Embedding generation triggered successfully');
        } else {
          console.warn('⚠️ Failed to trigger embedding generation:', await embedResponse.text());
        }
      } catch (embedErr) {
        console.warn('⚠️ Could not trigger embedding generation:', embedErr);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        job_id: jobId,
        documents_found: totalResources,
        documents_added: totalAdded,
        errors: errors.length > 0 ? errors : null,
        embeddings_triggered: totalAdded > 0
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