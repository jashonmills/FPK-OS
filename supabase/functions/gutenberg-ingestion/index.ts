
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GutendxBook {
  id: number;
  title: string;
  authors: Array<{ name: string }>;
  subjects: string[];
  formats: Record<string, string>;
  download_count: number;
}

// Reduced set of highly reliable, popular books for initial testing
const RELIABLE_GUTENBERG_BOOKS = [
  { id: 1661, title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", subjects: ["Mystery", "Detective", "Classic"] },
  { id: 164, title: "Twenty Thousand Leagues Under the Sea", author: "Jules Verne", subjects: ["Science fiction", "Adventure", "Classic"] },
  { id: 2701, title: "Moby Dick", author: "Herman Melville", subjects: ["Adventure", "Classic", "Literature"] },
  { id: 1342, title: "Pride and Prejudice", author: "Jane Austen", subjects: ["Romance", "Classic", "Literature"] },
  { id: 84, title: "Frankenstein", author: "Mary Wollstonecraft Shelley", subjects: ["Horror", "Science fiction", "Classic"] },
  { id: 11, title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", subjects: ["Children's literature", "Fantasy", "Classic"] },
  { id: 25344, title: "The Scarlet Letter", author: "Nathaniel Hawthorne", subjects: ["Classic", "Literature", "Historical fiction"] },
  { id: 74, title: "The Adventures of Tom Sawyer", author: "Mark Twain", subjects: ["Adventure", "Children's literature", "Classic"] },
  { id: 76, title: "Adventures of Huckleberry Finn", author: "Mark Twain", subjects: ["Adventure", "Classic", "Literature"] },
  { id: 1232, title: "The Prince", author: "Niccolò Machiavelli", subjects: ["Philosophy", "Politics", "Classic"] }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🚀 Starting optimized ingestion of reliable Project Gutenberg titles...');

    const booksToInsert = [];
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const bookInfo of RELIABLE_GUTENBERG_BOOKS) {
      try {
        console.log(`📚 Processing: ${bookInfo.title} (ID: ${bookInfo.id})`);
        
        // Check if book already exists
        const { data: existingBook } = await supabaseClient
          .from('public_domain_books')
          .select('id')
          .eq('gutenberg_id', bookInfo.id)
          .maybeSingle();

        if (existingBook) {
          console.log(`⚠️ Book already exists, skipping: ${bookInfo.title}`);
          skippedCount++;
          continue;
        }

        // Use multiple reliable URL formats for each book
        const primaryEpubUrl = `https://www.gutenberg.org/ebooks/${bookInfo.id}.epub.noimages`;
        const backupEpubUrls = [
          `https://www.gutenberg.org/cache/epub/${bookInfo.id}/pg${bookInfo.id}.epub`,
          `https://www.gutenberg.org/files/${bookInfo.id}/${bookInfo.id}-0.epub`
        ];

        const coverUrl = `https://www.gutenberg.org/cache/epub/${bookInfo.id}/pg${bookInfo.id}.cover.medium.jpg`;

        // Try to fetch from Gutendx API for additional data, but don't fail if it's unavailable
        let apiData: GutendxBook | null = null;
        try {
          const response = await fetch(`https://gutendx.com/books/${bookInfo.id}/`, {
            headers: { 'User-Agent': 'Supabase-Function/1.0' },
            signal: AbortSignal.timeout(5000) // 5 second timeout
          });
          if (response.ok) {
            apiData = await response.json();
            console.log(`✅ Fetched API data for: ${bookInfo.title}`);
          }
        } catch (apiError) {
          console.log(`⚠️ API fetch failed for ${bookInfo.title}, using fallback data`);
        }

        // Use API data if available, otherwise use predefined data
        const author = apiData?.authors?.[0]?.name || bookInfo.author;
        const subjects = apiData?.subjects?.slice(0, 5) || bookInfo.subjects;
        const downloadCount = apiData?.download_count || 1000;

        // Prepare book data with improved reliability
        const bookData = {
          id: `gutenberg-${bookInfo.id}`,
          title: apiData?.title || bookInfo.title,
          author: author,
          subjects: subjects,
          cover_url: coverUrl,
          epub_url: primaryEpubUrl,
          gutenberg_id: bookInfo.id,
          description: `${downloadCount > 1000 ? 'Popular classic' : 'Classic work'} from Project Gutenberg. Downloaded ${downloadCount.toLocaleString()} times.`,
          language: 'en',
          is_user_added: false, // Mark as curated content
          openlibrary_key: null,
          // Store backup URLs for resilient loading
          backup_urls: backupEpubUrls
        };

        booksToInsert.push(bookData);
        successCount++;
        console.log(`✅ Prepared: ${bookData.title}`);

      } catch (error) {
        console.error(`❌ Error processing ${bookInfo.title}:`, error);
        errorCount++;
      }
    }

    // Bulk insert all books
    if (booksToInsert.length > 0) {
      console.log(`💾 Inserting ${booksToInsert.length} reliable books into database...`);
      
      const { data, error } = await supabaseClient
        .from('public_domain_books')
        .insert(booksToInsert)
        .select();

      if (error) {
        console.error('❌ Database insertion error:', error);
        throw error;
      }

      console.log(`🎉 Successfully inserted ${data?.length || 0} books`);
    }

    const summary = {
      total_processed: RELIABLE_GUTENBERG_BOOKS.length,
      successful_insertions: successCount,
      errors: errorCount,
      skipped: skippedCount,
      books_inserted: booksToInsert.length,
      message: `Successfully processed ${successCount}/${RELIABLE_GUTENBERG_BOOKS.length} reliable Project Gutenberg titles. Optimized for performance and reliability.`,
      optimization_notes: [
        "Reduced initial set to 10 highly reliable books",
        "Multiple backup URLs provided for each book",
        "Faster loading with proven sources",
        "Progressive loading implemented in frontend"
      ]
    };

    console.log('📊 Final Summary:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Optimized ingestion function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'Failed to ingest reliable Project Gutenberg titles'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
