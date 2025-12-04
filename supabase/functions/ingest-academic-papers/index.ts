import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let jobId: string | null = null;
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const { tier = 1, keywords = [] } = await req.json();
    
    console.log(`🚀 Starting academic paper ingestion for tier ${tier}`);

    // Create a job record
    const { data: job, error: jobError } = await supabase
      .from('kb_scraping_jobs')
      .insert({
        job_type: `academic_tier_${tier}`,
        source_name: `Academic Papers - Tier ${tier}`,
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

    let totalFound = 0;
    let totalAdded = 0;
    const errors: string[] = [];

    // Tier-based search parameters
    const tierConfig = {
      1: { maxResults: 10, keywords: keywords.length > 0 ? keywords : ['neurodiversity', 'ADHD', 'autism'] },
      2: { maxResults: 25, keywords: keywords.length > 0 ? keywords : ['executive function', 'learning strategies', 'neurodivergent'] },
      3: { maxResults: 50, keywords: keywords.length > 0 ? keywords : ['educational psychology', 'cognitive development', 'learning disabilities'] },
    };

    const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig[1];
    console.log(`📊 Config: ${config.maxResults} results for keywords:`, config.keywords);

    // Helper function to update job progress
    const updateProgress = async (found: number, added: number) => {
      await supabase
        .from('kb_scraping_jobs')
        .update({
          documents_found: found,
          documents_added: added,
        })
        .eq('id', jobId);
    };

    // PubMed search with retry logic
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`🔍 Searching PubMed (attempt ${retryCount + 1}/${maxRetries})`);
        
        const pubmedQuery = config.keywords.join(' OR ');
        const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(pubmedQuery)}&retmax=${config.maxResults}&retmode=json`;
        
        const searchResponse = await fetch(searchUrl, {
          signal: AbortSignal.timeout(30000) // 30 second timeout
        });
        
        if (!searchResponse.ok) {
          throw new Error(`PubMed search failed: ${searchResponse.status}`);
        }
        
        const searchData = await searchResponse.json();
        
        if (searchData.esearchresult?.idlist) {
          const pmids = searchData.esearchresult.idlist;
          totalFound = pmids.length;
          console.log(`📚 Found ${totalFound} papers`);
          
          await updateProgress(totalFound, totalAdded);

          // Process papers in batches of 5
          const batchSize = 5;
          for (let i = 0; i < pmids.length; i += batchSize) {
            const batch = pmids.slice(i, i + batchSize);
            console.log(`📄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(pmids.length / batchSize)}`);
            
            await Promise.all(batch.map(async (pmid: string) => {
              try {
                const detailUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&retmode=xml`;
                const detailResponse = await fetch(detailUrl, {
                  signal: AbortSignal.timeout(15000)
                });
                
                if (!detailResponse.ok) {
                  throw new Error(`Failed to fetch details: ${detailResponse.status}`);
                }
                
                const xmlText = await detailResponse.text();
                
                // Enhanced XML parsing
                const titleMatch = xmlText.match(/<ArticleTitle>(.+?)<\/ArticleTitle>/s);
                const abstractMatch = xmlText.match(/<AbstractText[^>]*>(.+?)<\/AbstractText>/s);
                const authorMatch = xmlText.match(/<Author[^>]*>[\s\S]*?<LastName>([^<]+)<\/LastName>[\s\S]*?<\/Author>/);
                
                if (titleMatch) {
                  const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
                  const abstract = abstractMatch ? abstractMatch[1].replace(/<[^>]*>/g, '').trim() : '';
                  const author = authorMatch ? authorMatch[1] : 'Unknown';
                  const url = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
                  
                  // Check if already exists in kb_documents
                  const { data: existing } = await supabase
                    .from('kb_documents')
                    .select('id')
                    .eq('source_url', url)
                    .maybeSingle();
                  
                  if (!existing) {
                    const { error: insertError } = await supabase
                      .from('kb_documents')
                      .insert({
                        title: title.substring(0, 500),
                        source_name: 'PubMed',
                        source_url: url,
                        source_type: 'academic_database',
                        document_type: 'research_paper',
                        content: abstract || title,
                        publication_date: new Date().toISOString().split('T')[0],
                        focus_areas: config.keywords,
                      });

                    if (!insertError) {
                      totalAdded++;
                      console.log(`✅ Added: ${title.substring(0, 50)}...`);
                    } else {
                      console.error(`❌ Insert error for ${pmid}:`, insertError);
                      errors.push(`Insert ${pmid}: ${insertError.message}`);
                    }
                  } else {
                    console.log(`⏭️  Skipped duplicate: ${title.substring(0, 50)}...`);
                  }
                } else {
                  console.warn(`⚠️  No title found for ${pmid}`);
                }
              } catch (err) {
                console.error(`❌ Error processing ${pmid}:`, err);
                errors.push(`PubMed ${pmid}: ${err.message}`);
              }
            }));
            
            // Update progress after each batch
            await updateProgress(totalFound, totalAdded);
            
            // Rate limiting: wait 500ms between batches
            if (i + batchSize < pmids.length) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
        } else {
          console.warn('⚠️  No results from PubMed');
        }
        
        break; // Success, exit retry loop
        
      } catch (err) {
        retryCount++;
        console.error(`❌ PubMed attempt ${retryCount} failed:`, err);
        
        if (retryCount >= maxRetries) {
          errors.push(`PubMed search failed after ${maxRetries} attempts: ${err.message}`);
        } else {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        }
      }
    }

    // Final job update
    const finalStatus = errors.length > 0 && totalAdded === 0 ? 'failed' : 'completed';
    await supabase
      .from('kb_scraping_jobs')
      .update({
        status: finalStatus,
        documents_found: totalFound,
        documents_added: totalAdded,
        error_message: errors.length > 0 ? errors.slice(0, 3).join('; ') : null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId);

    console.log(`🏁 Job complete: ${totalAdded}/${totalFound} papers added`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        job_id: jobId,
        documents_found: totalFound,
        documents_added: totalAdded,
        errors: errors.length > 0 ? errors.slice(0, 5) : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Fatal error in ingest-academic-papers:', error);
    
    // Update job as failed if we have a job ID
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
    );
  }
});
