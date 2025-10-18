import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapeRequest {
  sources: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { sources }: ScrapeRequest = await req.json();

    console.log('Starting clinical resource scraping:', sources);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Source URL mapping
    const sourceUrls: Record<string, string[]> = {
      'CDC': [
        'https://www.cdc.gov/autism/',
        'https://www.cdc.gov/ncbddd/developmentaldisabilities/'
      ],
      'IDEA': [
        'https://sites.ed.gov/idea/'
      ],
      'OSEP': [
        'https://sites.ed.gov/osers/osep/'
      ],
      // Add more mappings as needed
    };

    let totalDocumentsAdded = 0;

    for (const source of sources) {
      const urls = sourceUrls[source] || [];
      
      // Create scraping job
      const { data: job, error: jobError } = await supabase
        .from('kb_scraping_jobs')
        .insert({
          job_type: 'web_scrape',
          source_name: source,
          status: 'in_progress',
          created_by: user.id,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (jobError) {
        console.error('Failed to create job:', jobError);
        continue;
      }

      try {
        for (const url of urls) {
          console.log(`Scraping ${source} from ${url}`);

          // Call the existing scrape-and-cache-source function
          const { data: scrapedData, error: scrapeError } = await supabase.functions.invoke(
            'scrape-and-cache-source',
            {
              body: { source_url: url }
            }
          );

          if (scrapeError || !scrapedData) {
            console.error(`Failed to scrape ${url}:`, scrapeError);
            continue;
          }

          // Generate content hash
          const contentHash = await generateHash(scrapedData.cleaned_text_content);

          // Check if document already exists
          const { data: existing } = await supabase
            .from('kb_documents')
            .select('id')
            .eq('content_hash', contentHash)
            .single();

          if (existing) {
            console.log(`Skipping duplicate from ${url}`);
            continue;
          }

          // Extract title from URL or content
          const title = extractTitle(url, scrapedData.cleaned_text_content);

          // Insert document
          const { data: document, error: docError } = await supabase
            .from('kb_documents')
            .insert({
              title,
              content: scrapedData.cleaned_text_content,
              source_name: source,
              source_type: 'clinical_resource',
              document_type: 'guideline',
              source_url: url,
              focus_areas: getFocusAreasForSource(source),
              metadata: {
                scraped_at: new Date().toISOString(),
                url
              },
              content_hash: contentHash,
              created_by: user.id
            })
            .select()
            .single();

          if (docError) {
            console.error('Failed to insert document:', docError);
            continue;
          }

          totalDocumentsAdded++;
          
          // Embeddings will be generated separately via the Generate Embeddings button
        }

        // Update job status
        await supabase
          .from('kb_scraping_jobs')
          .update({
            status: 'completed',
            documents_found: urls.length,
            documents_added: totalDocumentsAdded,
            completed_at: new Date().toISOString()
          })
          .eq('id', job.id);

      } catch (error) {
        console.error(`Error processing ${source}:`, error);
        
        await supabase
          .from('kb_scraping_jobs')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            completed_at: new Date().toISOString()
          })
          .eq('id', job.id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        documentsAdded: totalDocumentsAdded,
        message: `Scraped ${totalDocumentsAdded} documents from ${sources.length} sources`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-clinical-resources:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function extractTitle(url: string, content: string): string {
  // Try to extract title from content (first 100 chars)
  const contentTitle = content.substring(0, 100).trim();
  if (contentTitle.length > 10) {
    return contentTitle.split('\n')[0];
  }
  
  // Fall back to URL-based title
  const urlParts = url.split('/').filter(p => p);
  return urlParts[urlParts.length - 1].replace(/-/g, ' ').replace(/\.[^.]*$/, '');
}

function getFocusAreasForSource(source: string): string[] {
  const mapping: Record<string, string[]> = {
    'CDC': ['autism', 'developmental-disabilities', 'health'],
    'IDEA': ['iep', 'special-education', 'policy'],
    'OSEP': ['special-education', 'policy'],
    'WWC': ['evidence-based', 'education'],
    'BACB': ['aba', 'autism', 'behavioral'],
    'NAS': ['autism', 'support'],
    'AAP': ['medical', 'pediatric'],
    'CEC': ['special-education', 'teaching']
  };

  return mapping[source] || ['general'];
}

function splitIntoChunks(text: string, maxLength: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
