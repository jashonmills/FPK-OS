import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IngestRequest {
  sources: string[];
  queries: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { sources, queries }: IngestRequest = await req.json();

    console.log('Starting academic ingestion:', { sources, queries });

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

    let totalDocumentsAdded = 0;

    // Process each source and query combination
    for (const source of sources) {
      for (const query of queries) {
        console.log(`Searching ${source} for: ${query}`);

        // Create scraping job
        const { data: job, error: jobError } = await supabase
          .from('kb_scraping_jobs')
          .insert({
            job_type: 'academic_search',
            source_name: source,
            search_queries: [query],
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
          let papers: any[] = [];

          if (source === 'PubMed') {
            papers = await searchPubMed(query);
          } else if (source === 'Semantic Scholar') {
            papers = await searchSemanticScholar(query);
          }

          console.log(`Found ${papers.length} papers from ${source}`);

          // Store documents
          for (const paper of papers) {
            // Generate content hash to prevent duplicates
            const contentHash = await generateHash(paper.abstract || paper.title);

            // Check if document already exists
            const { data: existing } = await supabase
              .from('kb_documents')
              .select('id')
              .eq('content_hash', contentHash)
              .single();

            if (existing) {
              console.log(`Skipping duplicate: ${paper.title}`);
              continue;
            }

            // Insert document
            const { data: document, error: docError } = await supabase
              .from('kb_documents')
              .insert({
                title: paper.title,
                content: paper.abstract || paper.title,
                source_name: source,
                source_type: 'academic_database',
                document_type: 'research_paper',
                source_url: paper.url,
                publication_date: paper.publicationDate,
                focus_areas: extractFocusAreas(query),
                metadata: {
                  authors: paper.authors || [],
                  citationCount: paper.citationCount || 0,
                  year: paper.year
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

            // Generate embeddings using Lovable AI
            if (lovableApiKey && document) {
              await generateEmbeddings(supabase, document.id, paper.abstract || paper.title, lovableApiKey);
            }
          }

          // Update job status
          await supabase
            .from('kb_scraping_jobs')
            .update({
              status: 'completed',
              documents_found: papers.length,
              documents_added: totalDocumentsAdded,
              completed_at: new Date().toISOString()
            })
            .eq('id', job.id);

        } catch (error) {
          console.error(`Error processing ${source}:`, error);
          
          // Update job with error
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
    }

    return new Response(
      JSON.stringify({
        success: true,
        documentsAdded: totalDocumentsAdded,
        message: `Ingested ${totalDocumentsAdded} documents from ${sources.length} sources`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ingest-academic-papers:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function searchPubMed(query: string): Promise<any[]> {
  // Search PubMed
  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=20&retmode=json`;
  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();
  
  const ids = searchData.esearchresult?.idlist || [];
  if (ids.length === 0) return [];

  // Fetch paper details
  const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
  const fetchResponse = await fetch(fetchUrl);
  const fetchData = await fetchResponse.json();

  const papers = [];
  for (const id of ids) {
    const paper = fetchData.result?.[id];
    if (paper) {
      papers.push({
        title: paper.title,
        abstract: paper.abstract || '',
        authors: paper.authors?.map((a: any) => a.name) || [],
        publicationDate: paper.pubdate,
        year: parseInt(paper.pubdate?.split(' ')[0] || '0'),
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
      });
    }
  }

  return papers;
}

async function searchSemanticScholar(query: string): Promise<any[]> {
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=20&fields=title,abstract,authors,citationCount,year,url,publicationDate`;
  
  const response = await fetch(url);
  const data = await response.json();

  return (data.data || []).map((paper: any) => ({
    title: paper.title,
    abstract: paper.abstract || '',
    authors: paper.authors?.map((a: any) => a.name) || [],
    citationCount: paper.citationCount || 0,
    year: paper.year,
    publicationDate: paper.publicationDate,
    url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`
  }));
}

async function generateHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function extractFocusAreas(query: string): string[] {
  const areas = ['research', 'academic'];
  const keywords = query.toLowerCase().split(/\s+/);
  
  if (keywords.some(k => ['autism', 'asd'].includes(k))) areas.push('autism');
  if (keywords.some(k => ['adhd', 'attention'].includes(k))) areas.push('adhd');
  if (keywords.some(k => ['iep', 'education', 'special'].includes(k))) areas.push('special-education');
  
  return [...new Set(areas)];
}

async function generateEmbeddings(supabase: any, documentId: string, content: string, lovableApiKey: string) {
  try {
    // Split content into chunks (simple approach - split by sentences, ~1000 chars each)
    const chunks = splitIntoChunks(content, 1000);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Generate embedding using Lovable AI
      const embeddingResponse = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: chunk
        })
      });

      if (!embeddingResponse.ok) {
        throw new Error(`Embedding API error: ${embeddingResponse.statusText}`);
      }

      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.data[0].embedding;

      // Store embedding
      await supabase
        .from('kb_embeddings')
        .insert({
          document_id: documentId,
          chunk_index: i,
          chunk_text: chunk,
          embedding: JSON.stringify(embedding)
        });
    }

    console.log(`Generated ${chunks.length} embeddings for document ${documentId}`);
  } catch (error) {
    console.error('Error generating embeddings:', error);
  }
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
