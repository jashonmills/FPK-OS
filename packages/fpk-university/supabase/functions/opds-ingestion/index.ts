
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Keywords for filtering neurodiversity-relevant content
const NEURODIVERSITY_KEYWORDS = [
  'autism', 'adhd', 'neurodiversity', 'learning', 'education', 'teaching',
  'psychology', 'behavior', 'development', 'cognitive', 'mind', 'brain',
  'inclusive', 'special needs', 'disability', 'mental health', 'social skills',
  'communication', 'sensory', 'emotional', 'self-help', 'understanding',
  'children', 'youth', 'adolescent', 'teen', 'young adult', 'student'
];

interface OPDSEntry {
  id: string;
  title: string;
  author: string;
  summary?: string;
  subjects: string[];
  links: Array<{
    href: string;
    type: string;
    rel: string;
  }>;
  updated: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🔄 Starting OPDS feed processing...');
    
    // Fetch OPDS feed from Project Gutenberg
    const response = await fetch('https://gutenberg.org/ebooks.opds');
    if (!response.ok) {
      throw new Error(`Failed to fetch OPDS feed: ${response.status}`);
    }
    
    const xmlText = await response.text();
    console.log('📥 OPDS feed fetched successfully');
    
    // Parse OPDS XML
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    
    const entries: OPDSEntry[] = [];
    const entryElements = doc.querySelectorAll('entry');
    
    entryElements.forEach(entry => {
      const id = entry.querySelector('id')?.textContent || '';
      const title = entry.querySelector('title')?.textContent || '';
      const author = entry.querySelector('author name')?.textContent || 'Unknown Author';
      const summary = entry.querySelector('summary')?.textContent || '';
      const updated = entry.querySelector('updated')?.textContent || '';
      
      // Extract subjects/categories
      const subjects: string[] = [];
      const categoryElements = entry.querySelectorAll('category');
      categoryElements.forEach(cat => {
        const term = cat.getAttribute('term');
        if (term) subjects.push(term);
      });
      
      // Extract download links
      const links: Array<{ href: string; type: string; rel: string }> = [];
      const linkElements = entry.querySelectorAll('link');
      linkElements.forEach(link => {
        const href = link.getAttribute('href');
        const type = link.getAttribute('type');
        const rel = link.getAttribute('rel');
        if (href && type && rel) {
          links.push({ href, type, rel });
        }
      });
      
      if (id && title) {
        entries.push({
          id,
          title,
          author,
          summary,
          subjects,
          links,
          updated
        });
      }
    });
    
    console.log(`📚 Found ${entries.length} total books in feed`);
    
    // Filter for neurodiversity-relevant content
    const filteredEntries = entries.filter(entry => {
      const searchText = `${entry.title} ${entry.author} ${entry.summary} ${entry.subjects.join(' ')}`.toLowerCase();
      return NEURODIVERSITY_KEYWORDS.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
    });
    
    console.log(`🎯 Filtered to ${filteredEntries.length} relevant books`);
    
    // Convert and store books
    const books = [];
    for (const entry of filteredEntries) {
      // Find EPUB download link
      const epubLink = entry.links.find(link => 
        link.type === 'application/epub+zip' || 
        link.href.includes('.epub')
      );
      
      if (!epubLink) continue;
      
      // Extract Gutenberg ID from entry ID
      const gutenbergId = parseInt(entry.id.split('/').pop() || '0');
      if (!gutenbergId) continue;
      
      // Generate cover URL (Project Gutenberg pattern)
      const coverUrl = `https://gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.cover.medium.jpg`;
      
      const book = {
        id: entry.id,
        title: entry.title,
        author: entry.author,
        subjects: entry.subjects,
        cover_url: coverUrl,
        epub_url: epubLink.href,
        gutenberg_id: gutenbergId,
        description: entry.summary,
        language: 'en',
        last_updated: entry.updated,
        created_at: new Date().toISOString()
      };
      
      books.push(book);
    }
    
    console.log(`✅ Processed ${books.length} books for storage`);
    
    // Store books in database
    if (books.length > 0) {
      const { error } = await supabaseClient
        .from('public_domain_books')
        .upsert(books, { onConflict: 'gutenberg_id' });
      
      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      
      console.log(`💾 Successfully stored ${books.length} books in database`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${books.length} books`,
        books_processed: books.length
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
    
  } catch (error) {
    console.error('❌ Error in OPDS ingestion:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
