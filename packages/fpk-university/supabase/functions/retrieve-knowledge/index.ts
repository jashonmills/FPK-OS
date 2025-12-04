
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Generate hash for caching
function generateQueryHash(topic: string): string {
  return btoa(topic.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, '');
}

// Check if cached data is still fresh (7 days TTL)
function isCacheFresh(lastFetched: string): boolean {
  const cacheAge = Date.now() - new Date(lastFetched).getTime();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return cacheAge < sevenDays;
}

// Wikipedia REST API
async function fetchWikipedia(topic: string) {
  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.extract) {
      return {
        content: data.extract,
        source_name: 'Wikipedia',
        source_url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`
      };
    }
    return null;
  } catch (error) {
    console.error('Wikipedia fetch error:', error);
    return null;
  }
}

// DBpedia SPARQL endpoint
async function fetchDBpedia(topic: string) {
  try {
    const sparql = `
      SELECT ?abstract WHERE {
        ?resource rdfs:label "${topic}"@en ;
                 dbo:abstract ?abstract .
        FILTER (lang(?abstract) = "en")
      }
      LIMIT 1
    `;
    
    const response = await fetch('https://dbpedia.org/sparql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sparql-query',
        'Accept': 'application/json'
      },
      body: sparql
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results?.bindings?.length > 0) {
      return {
        content: data.results.bindings[0].abstract.value,
        source_name: 'DBpedia',
        source_url: `https://dbpedia.org/resource/${encodeURIComponent(topic.replace(/\s+/g, '_'))}`
      };
    }
    return null;
  } catch (error) {
    console.error('DBpedia fetch error:', error);
    return null;
  }
}

// Wikidata Query Service
async function fetchWikidata(topic: string) {
  try {
    const sparql = `
      SELECT ?item ?itemLabel ?itemDescription WHERE {
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        ?item rdfs:label "${topic}"@en .
        OPTIONAL { ?item schema:description ?itemDescription . }
      }
      LIMIT 1
    `;
    
    const response = await fetch('https://query.wikidata.org/sparql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sparql-query',
        'Accept': 'application/json'
      },
      body: sparql
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results?.bindings?.length > 0) {
      const result = data.results.bindings[0];
      return {
        content: result.itemDescription?.value || result.itemLabel?.value || topic,
        source_name: 'Wikidata',
        source_url: result.item?.value || `https://www.wikidata.org/wiki/Special:Search/${encodeURIComponent(topic)}`
      };
    }
    return null;
  } catch (error) {
    console.error('Wikidata fetch error:', error);
    return null;
  }
}

// MIT OpenCourseWare (simplified search)
async function fetchMITOCW(topic: string) {
  try {
    // Note: MIT OCW doesn't have a direct API, this is a simplified approach
    const searchUrl = `https://ocw.mit.edu/search/?q=${encodeURIComponent(topic)}`;
    return {
      content: `MIT OpenCourseWare has courses and materials related to "${topic}". Visit the link to explore available resources.`,
      source_name: 'MIT OpenCourseWare',
      source_url: searchUrl
    };
  } catch (error) {
    console.error('MIT OCW fetch error:', error);
    return null;
  }
}

// OpenLibrary Search API
async function fetchOpenLibrary(topic: string) {
  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(topic)}&limit=3`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.docs?.length > 0) {
      const books = data.docs.slice(0, 3).map(book => 
        `"${book.title}" by ${book.author_name?.join(', ') || 'Unknown'}`
      );
      
      return {
        content: `Related books: ${books.join('; ')}`,
        source_name: 'OpenLibrary',
        source_url: `https://openlibrary.org/search?q=${encodeURIComponent(topic)}`
      };
    }
    return null;
  } catch (error) {
    console.error('OpenLibrary fetch error:', error);
    return null;
  }
}

// Crossref REST API
async function fetchCrossref(topic: string) {
  try {
    const response = await fetch(`https://api.crossref.org/works?query=${encodeURIComponent(topic)}&rows=3`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.message?.items?.length > 0) {
      const papers = data.message.items.slice(0, 3).map(item => 
        `"${item.title?.[0] || 'Untitled'}" by ${item.author?.map(a => `${a.given} ${a.family}`).join(', ') || 'Unknown'}`
      );
      
      return {
        content: `Recent research papers: ${papers.join('; ')}`,
        source_name: 'Crossref',
        source_url: `https://search.crossref.org/?q=${encodeURIComponent(topic)}`
      };
    }
    return null;
  } catch (error) {
    console.error('Crossref fetch error:', error);
    return null;
  }
}

// Semantic Scholar API
async function fetchSemanticScholar(topic: string) {
  try {
    const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(topic)}&fields=title,abstract,authors&limit=3`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.data?.length > 0) {
      const paper = data.data[0];
      const content = paper.abstract || `Research paper: "${paper.title}" by ${paper.authors?.map(a => a.name).join(', ') || 'Unknown'}`;
      
      return {
        content: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
        source_name: 'Semantic Scholar',
        source_url: `https://www.semanticscholar.org/search?q=${encodeURIComponent(topic)}`
      };
    }
    return null;
  } catch (error) {
    console.error('Semantic Scholar fetch error:', error);
    return null;
  }
}

// arXiv API
async function fetchArXiv(topic: string) {
  try {
    const response = await fetch(`http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(topic)}&start=0&max_results=3`);
    if (!response.ok) return null;
    
    const xmlText = await response.text();
    // Simple XML parsing for title and summary
    const titleMatch = xmlText.match(/<title[^>]*>([^<]+)<\/title>/);
    const summaryMatch = xmlText.match(/<summary[^>]*>([^<]+)<\/summary>/);
    
    if (titleMatch && summaryMatch) {
      return {
        content: `ArXiv paper: "${titleMatch[1]}" - ${summaryMatch[1].substring(0, 300)}...`,
        source_name: 'arXiv',
        source_url: `https://arxiv.org/search/?query=${encodeURIComponent(topic)}`
      };
    }
    return null;
  } catch (error) {
    console.error('arXiv fetch error:', error);
    return null;
  }
}

// Cache and return knowledge
async function cacheKnowledge(topic: string, queryHash: string, knowledge: any) {
  try {
    await supabase
      .from('knowledge_cache')
      .insert({
        topic,
        query_hash: queryHash,
        source_name: knowledge.source_name,
        source_url: knowledge.source_url,
        content: knowledge.content
      });
    
    return knowledge;
  } catch (error) {
    console.error('Cache insertion error:', error);
    return knowledge; // Return knowledge even if caching fails
  }
}

// Main tiered retrieval function
async function retrieveKnowledge(topic: string) {
  console.log('Starting knowledge retrieval for topic:', topic);
  
  const queryHash = generateQueryHash(topic);
  
  // Check cache first
  try {
    const { data: cached, error } = await supabase
      .from('knowledge_cache')
      .select('*')
      .eq('query_hash', queryHash)
      .order('last_fetched', { ascending: false })
      .limit(1)
      .single();
    
    if (!error && cached && isCacheFresh(cached.last_fetched)) {
      console.log('Returning cached knowledge for:', topic);
      return {
        content: cached.content,
        source_name: cached.source_name,
        source_url: cached.source_url,
        cached: true
      };
    }
  } catch (error) {
    console.log('No cache found, fetching fresh knowledge');
  }
  
  // Tiered external API fetching
  const sources = [
    { name: 'Wikipedia', fetch: fetchWikipedia },
    { name: 'DBpedia', fetch: fetchDBpedia },
    { name: 'Wikidata', fetch: fetchWikidata },
    { name: 'MIT OCW', fetch: fetchMITOCW },
    { name: 'OpenLibrary', fetch: fetchOpenLibrary },
    { name: 'Crossref', fetch: fetchCrossref },
    { name: 'Semantic Scholar', fetch: fetchSemanticScholar },
    { name: 'arXiv', fetch: fetchArXiv }
  ];
  
  for (const source of sources) {
    try {
      console.log(`Trying ${source.name} for topic:`, topic);
      const knowledge = await source.fetch(topic);
      
      if (knowledge) {
        console.log(`Success with ${source.name}`);
        return await cacheKnowledge(topic, queryHash, knowledge);
      }
    } catch (error) {
      console.error(`Error with ${source.name}:`, error);
      continue;
    }
  }
  
  // Fallback if no sources return data
  return {
    content: `I couldn't find specific external information about "${topic}" in my knowledge sources. I can still help based on my training data and your study materials.`,
    source_name: 'Fallback',
    source_url: '',
    cached: false
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    
    if (!topic || typeof topic !== 'string') {
      throw new Error('Topic is required and must be a string');
    }

    console.log('Knowledge retrieval request for:', topic);
    
    const result = await retrieveKnowledge(topic.trim());
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in knowledge retrieval function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to retrieve knowledge',
        content: 'I encountered an error while searching for external information. I can still help based on my training data.',
        source_name: 'Error',
        source_url: '',
        cached: false
      }),
      {
        status: 200, // Return 200 to handle gracefully in UI
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
