
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuizletSet {
  id: string;
  title: string;
  creator: string;
  termCount: number;
  description?: string;
  created_date?: string;
  modified_date?: string;
}

interface QuizletTerm {
  term: string;
  definition: string;
  id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, query, setId } = await req.json();
    
    // Get Quizlet API key from environment
    const quizletClientId = Deno.env.get('QUIZLET_CLIENT_ID');
    if (!quizletClientId) {
      console.error('❌ QUIZLET_CLIENT_ID not configured');
      return new Response(
        JSON.stringify({ error: 'Quizlet API not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`🔍 Quizlet API request: ${action}`, { query, setId });

    if (action === 'search') {
      if (!query) {
        return new Response(
          JSON.stringify({ error: 'Query parameter required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Search Quizlet sets
      const searchUrl = `https://api.quizlet.com/2.0/search/sets?client_id=${quizletClientId}&q=${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        console.error('❌ Quizlet search failed:', response.status, response.statusText);
        return new Response(
          JSON.stringify({ error: 'Quizlet search failed' }),
          { 
            status: response.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const data = await response.json();
      
      // Transform the response to match our expected format
      const sets: QuizletSet[] = data.sets?.map((set: any) => ({
        id: set.id?.toString() || '',
        title: set.title || '',
        creator: set.created_by || 'Unknown',
        termCount: set.term_count || 0,
        description: set.description || '',
        created_date: set.created_date,
        modified_date: set.modified_date
      })) || [];

      console.log(`✅ Found ${sets.length} Quizlet sets for query: ${query}`);
      
      return new Response(
        JSON.stringify({ sets }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else if (action === 'getSet') {
      if (!setId) {
        return new Response(
          JSON.stringify({ error: 'Set ID required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Get Quizlet set details
      const setUrl = `https://api.quizlet.com/2.0/sets/${setId}?client_id=${quizletClientId}`;
      
      const response = await fetch(setUrl);
      
      if (!response.ok) {
        console.error('❌ Quizlet set fetch failed:', response.status, response.statusText);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch Quizlet set' }),
          { 
            status: response.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const setData = await response.json();
      
      // Transform the response
      const set = {
        id: setData.id?.toString() || '',
        title: setData.title || '',
        creator: setData.created_by || 'Unknown',
        termCount: setData.term_count || 0,
        description: setData.description || '',
        terms: setData.terms?.map((term: any) => ({
          term: term.term || '',
          definition: term.definition || '',
          id: term.id?.toString()
        })) || [] as QuizletTerm[]
      };

      console.log(`✅ Fetched Quizlet set: ${set.title} with ${set.terms.length} terms`);
      
      return new Response(
        JSON.stringify(set),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('❌ Quizlet proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
