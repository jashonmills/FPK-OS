
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

interface GutendexResponse {
  results: GutendexBook[];
}

const GUTENBERG_TITLES = [
  { id: 2899, title: "The Wind in the Willows", author: "Kenneth Grahame" },
  { id: 271, title: "Black Beauty", author: "Anna Sewell" },
  { id: 103, title: "The Swiss Family Robinson", author: "Johann Wyss" },
  { id: 13358, title: "Tom Swift and His Motorcycle Trip", author: "Victor Appleton" },
  { id: 25373, title: "The Story of My Life", author: "Helen Keller" },
  { id: 164, title: "Twenty Thousand Leagues Under the Sea", author: "Jules Verne" },
  { id: 18857, title: "Journey to the Center of the Earth", author: "Jules Verne" },
  { id: 50012, title: "A Journey to the Center of the Earth (abridged)", author: "Jules Verne (adapted)" },
  { id: 44212, title: "The Boy Scouts Book of Camping and Woodcraft", author: "William Hillcourt" },
  { id: 17384, title: "The Boy Mechanic: 200 Things for Boys to Do", author: "Popular Mechanics" },
  { id: 45345, title: "Boys' Book of Inventions", author: "Milton Bradley" },
  { id: 3876, title: "The Little Lame Prince", author: "Dinah M. Mulock Craik" },
  { id: 55, title: "Dorothy and the Wizard in Oz", author: "L. Frank Baum" },
  { id: 81, title: "The Lost World", author: "Arthur Conan Doyle" },
  { id: 19994, title: "The Merry Adventures of Robin Hood", author: "Howard Pyle" },
  { id: 1661, title: "Adventures of Sherlock Holmes", author: "Arthur Conan Doyle" },
  { id: 1686, title: "The Story of the Volsungs", author: "William Morris" },
  { id: 1246, title: "Stories of Beowulf and Other Old English Poems", author: "E. Wright & J. Weston" },
  { id: 46663, title: "The Children of Odin", author: "Padraic Colum" },
  { id: 3096, title: "Greek Heroes", author: "Charles Kingsley" },
  { id: 201, title: "Stories of the Ancient Greeks", author: "Charles Morris" },
  { id: 21690, title: "The Boys' Book of Experiments in Science", author: "L. S. Marks" },
  { id: 34076, title: "Elements of Physics", author: "Erasmus Wilson" },
  { id: 4331, title: "The Story of the Telescope", author: "Henry C. King" },
  { id: 7909, title: "The Educational Value of a Flower Garden", author: "Lou Hoover" },
  { id: 20314, title: "The Sea and Its Wonders", author: "Frank Bullen" },
  { id: 30214, title: "The Young Student's Guide to Writing", author: "M. Sprinkle" },
  { id: 35914, title: "Manual of Drawing", author: "John Ruskin" },
  { id: 7275, title: "Audio-Visual Education", author: "Paul La Farge" },
  { id: 21856, title: "Famous Men of Science", author: "John Keltie" }
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

    for (const bookInfo of GUTENBERG_TITLES) {
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
          continue;
        }

        // Fetch from Gutendx API
        const gutendxResponse = await fetch(`https://gutendx.com/books/${bookInfo.id}/`);
        
        if (!gutendxResponse.ok) {
          console.error(`❌ Failed to fetch from Gutendx: ${bookInfo.title}`);
          errorCount++;
          continue;
        }

        const gutendxData: GutendexBook = await gutendxResponse.json();

        // Extract cover URL (prefer JPEG format)
        const coverUrl = gutendxData.formats['image/jpeg'] || 
                        Object.values(gutendxData.formats).find(url => url.includes('.jpg')) ||
                        `https://www.gutenberg.org/cache/epub/${bookInfo.id}/pg${bookInfo.id}.cover.medium.jpg`;

        // Extract EPUB URL
        const epubUrl = gutendxData.formats['application/epub+zip'] || 
                       `https://www.gutenberg.org/ebooks/${bookInfo.id}.epub.noimages`;

        // Use fallback author if API doesn't return one
        const author = gutendxData.authors?.[0]?.name || bookInfo.author;

        // Prepare book data
        const bookData = {
          id: `gutenberg-${bookInfo.id}`,
          title: gutendxData.title || bookInfo.title,
          author: author,
          subjects: gutendxData.subjects?.slice(0, 5) || ['literature', 'classic'],
          cover_url: coverUrl,
          epub_url: epubUrl,
          gutenberg_id: bookInfo.id,
          description: `A classic work from Project Gutenberg. Downloaded ${gutendxData.download_count || 0} times.`,
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
      total_processed: GUTENBERG_TITLES.length,
      successful_insertions: successCount,
      errors: errorCount,
      books_inserted: booksToInsert.length,
      message: `Successfully processed ${successCount}/${GUTENBERG_TITLES.length} Project Gutenberg titles`
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
