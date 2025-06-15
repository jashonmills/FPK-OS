
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GutendexBook {
  id: number;
  title: string;
  authors: Array<{ name: string }>;
  subjects: string[];
  formats: Record<string, string>;
  download_count: number;
}

// Pre-defined book data as fallback since Gutendx API is unreliable
const GUTENBERG_BOOKS_DATA = [
  { id: 2899, title: "The Wind in the Willows", author: "Kenneth Grahame", subjects: ["Children's literature", "Fantasy", "Classic"] },
  { id: 271, title: "Black Beauty", author: "Anna Sewell", subjects: ["Children's literature", "Animal stories", "Classic"] },
  { id: 103, title: "The Swiss Family Robinson", author: "Johann David Wyss", subjects: ["Adventure", "Children's literature", "Classic"] },
  { id: 13358, title: "Tom Swift and His Motor-cycle", author: "Victor Appleton", subjects: ["Adventure", "Young adult", "Science fiction"] },
  { id: 25373, title: "The Story of My Life", author: "Helen Keller", subjects: ["Biography", "Memoir", "Education"] },
  { id: 164, title: "Twenty Thousand Leagues Under the Sea", author: "Jules Verne", subjects: ["Science fiction", "Adventure", "Classic"] },
  { id: 18857, title: "Journey to the Center of the Earth", author: "Jules Verne", subjects: ["Science fiction", "Adventure", "Classic"] },
  { id: 50012, title: "A Journey to the Center of the Earth", author: "Jules Verne", subjects: ["Science fiction", "Adventure", "Classic"] },
  { id: 44212, title: "The Boy Scouts Book of Camping", author: "William Hillcourt", subjects: ["Outdoor life", "Scouting", "Recreation"] },
  { id: 17384, title: "The Boy Mechanic: 200 Things for Boys to Do", author: "Popular Mechanics", subjects: ["Crafts", "Science", "Recreation"] },
  { id: 45345, title: "Boys' Book of Inventions", author: "Milton Bradley", subjects: ["Inventions", "Science", "Education"] },
  { id: 3876, title: "The Little Lame Prince", author: "Dinah Maria Mulock Craik", subjects: ["Children's literature", "Fantasy", "Classic"] },
  { id: 55, title: "Dorothy and the Wizard in Oz", author: "L. Frank Baum", subjects: ["Children's literature", "Fantasy", "Classic"] },
  { id: 81, title: "The Lost World", author: "Arthur Conan Doyle", subjects: ["Science fiction", "Adventure", "Classic"] },
  { id: 19994, title: "The Merry Adventures of Robin Hood", author: "Howard Pyle", subjects: ["Adventure", "Children's literature", "Classic"] },
  { id: 1661, title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", subjects: ["Mystery", "Detective", "Classic"] },
  { id: 1686, title: "The Story of the Volsungs", author: "William Morris", subjects: ["Mythology", "Literature", "Classic"] },
  { id: 1246, title: "Stories of Beowulf", author: "E. Wright", subjects: ["Mythology", "Literature", "Classic"] },
  { id: 46663, title: "The Children of Odin", author: "Padraic Colum", subjects: ["Mythology", "Children's literature", "Classic"] },
  { id: 3096, title: "Greek Heroes", author: "Charles Kingsley", subjects: ["Mythology", "Children's literature", "Classic"] },
  { id: 201, title: "Stories of the Ancient Greeks", author: "Charles Morris", subjects: ["History", "Mythology", "Classic"] },
  { id: 21690, title: "The Boys' Book of Experiments", author: "L. S. Marks", subjects: ["Science", "Experiments", "Education"] },
  { id: 34076, title: "Elements of Physics", author: "Erasmus Wilson", subjects: ["Physics", "Science", "Education"] },
  { id: 4331, title: "The Story of the Telescope", author: "Henry C. King", subjects: ["Science", "Astronomy", "Education"] },
  { id: 7909, title: "The Educational Value of a Flower Garden", author: "Lou Henry Hoover", subjects: ["Gardening", "Education", "Nature"] },
  { id: 20314, title: "The Sea and Its Wonders", author: "Frank Bullen", subjects: ["Marine life", "Nature", "Education"] },
  { id: 30214, title: "The Young Student's Guide", author: "M. Sprinkle", subjects: ["Education", "Study skills", "Learning"] },
  { id: 35914, title: "Manual of Drawing", author: "John Ruskin", subjects: ["Art", "Drawing", "Education"] },
  { id: 7275, title: "Audio-Visual Education", author: "Paul La Farge", subjects: ["Education", "Technology", "Learning"] },
  { id: 21856, title: "Famous Men of Science", author: "John Keltie", subjects: ["Biography", "Science", "Education"] }
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

    console.log('🚀 Starting ingestion of 30 Project Gutenberg titles...');

    const booksToInsert = [];
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const bookInfo of GUTENBERG_BOOKS_DATA) {
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

        // Try to fetch from Gutendx API first, but fall back to predefined data
        let apiData: GutendxBook | null = null;
        try {
          const response = await fetch(`https://gutendx.com/books/${bookInfo.id}/`, {
            headers: { 'User-Agent': 'Supabase-Function/1.0' }
          });
          if (response.ok) {
            apiData = await response.json();
            console.log(`✅ Fetched API data for: ${bookInfo.title}`);
          }
        } catch (apiError) {
          console.log(`⚠️ API fetch failed for ${bookInfo.title}, using fallback data`);
        }

        // Use API data if available, otherwise use predefined data
        const coverUrl = apiData?.formats?.['image/jpeg'] || 
                        `https://www.gutenberg.org/cache/epub/${bookInfo.id}/pg${bookInfo.id}.cover.medium.jpg`;

        const epubUrl = apiData?.formats?.['application/epub+zip'] || 
                       `https://www.gutenberg.org/ebooks/${bookInfo.id}.epub.noimages`;

        const author = apiData?.authors?.[0]?.name || bookInfo.author;
        const subjects = apiData?.subjects?.slice(0, 5) || bookInfo.subjects;
        const downloadCount = apiData?.download_count || 1000;

        // Prepare book data
        const bookData = {
          id: `gutenberg-${bookInfo.id}`,
          title: apiData?.title || bookInfo.title,
          author: author,
          subjects: subjects,
          cover_url: coverUrl,
          epub_url: epubUrl,
          gutenberg_id: bookInfo.id,
          description: `A classic work from Project Gutenberg. Downloaded ${downloadCount} times.`,
          language: 'en',
          is_user_added: false, // Mark as curated content
          openlibrary_key: null
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
      console.log(`💾 Inserting ${booksToInsert.length} books into database...`);
      
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
      total_processed: GUTENBERG_BOOKS_DATA.length,
      successful_insertions: successCount,
      errors: errorCount,
      skipped: skippedCount,
      books_inserted: booksToInsert.length,
      message: `Successfully processed ${successCount}/${GUTENBERG_BOOKS_DATA.length} Project Gutenberg titles`
    };

    console.log('📊 Final Summary:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Ingestion function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'Failed to ingest Project Gutenberg titles'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
