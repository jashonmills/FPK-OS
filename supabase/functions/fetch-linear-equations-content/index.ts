import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LessonContent {
  id: string;
  title: string;
  content: string;
  blocks: Array<{
    type: string;
    content: string;
    title?: string;
  }>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching lesson files from storage...');

    // Fetch all lesson files
    const lessonFiles = ['lesson_3_1.md', 'lesson_3_2.md', 'lesson_3_3.md', 'lesson_3_4.md', 'lesson_3_5.md', 'lesson_3_6.md', 'lesson_3_7.md'];
    const lessons: LessonContent[] = [];

    for (const filename of lessonFiles) {
      console.log(`Processing ${filename}...`);
      
      // Download file from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('course-files')
        .download(filename);

      if (downloadError) {
        console.error(`Error downloading ${filename}:`, downloadError);
        continue;
      }

      // Convert file to text
      const content = await fileData.text();
      
      // Parse lesson content
      const lessonId = filename.replace('.md', '').replace('lesson_', 'lesson-');
      const title = extractTitle(content);
      const blocks = parseMarkdownToBlocks(content);

      lessons.push({
        id: lessonId,
        title,
        content,
        blocks
      });
    }

    // Fetch course summary
    const { data: summaryData, error: summaryError } = await supabase.storage
      .from('course-files')
      .download('COURSE_SUMMARY.md');

    let courseSummary = '';
    if (!summaryError && summaryData) {
      courseSummary = await summaryData.text();
    }

    console.log(`Successfully processed ${lessons.length} lessons`);

    return new Response(
      JSON.stringify({
        success: true,
        lessons: lessons.sort((a, b) => a.id.localeCompare(b.id)),
        courseSummary: extractCourseSummary(courseSummary)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing lessons:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function extractTitle(content: string): string {
  const lines = content.split('\n');
  const titleLine = lines.find(line => line.startsWith('# '));
  return titleLine ? titleLine.replace('# ', '').trim() : 'Untitled Lesson';
}

function extractCourseSummary(content: string): string {
  if (!content) return 'Master solving linear equations through interactive lessons and practice problems';
  
  const lines = content.split('\n');
  const summaryStart = lines.findIndex(line => line.toLowerCase().includes('summary') || line.toLowerCase().includes('description'));
  
  if (summaryStart > -1) {
    const summaryLines = lines.slice(summaryStart + 1, summaryStart + 5);
    return summaryLines.join(' ').trim() || 'Master solving linear equations through interactive lessons and practice problems';
  }
  
  return 'Master solving linear equations through interactive lessons and practice problems';
}

function parseMarkdownToBlocks(content: string): Array<{type: string, content: string, title?: string}> {
  const lines = content.split('\n');
  const blocks: Array<{type: string, content: string, title?: string}> = [];
  let currentBlock: {type: string, content: string[], title?: string} | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines at start of processing
    if (!line && !currentBlock) continue;
    
    // Headers (## or ###)
    if (line.startsWith('## ') || line.startsWith('### ')) {
      // Finalize previous block
      if (currentBlock && currentBlock.content.length > 0) {
        blocks.push(finalizeBlock(currentBlock));
      }
      
      // Start new text block
      currentBlock = {
        type: 'text',
        title: line.replace(/^#+\s*/, ''),
        content: []
      };
    }
    // Main heading (single #)
    else if (line.startsWith('# ')) {
      // Skip main title, already extracted
      continue;
    }
    // Math expressions or equations
    else if (line.includes('=') && (line.includes('x') || line.includes('y') || line.includes('a') || line.includes('b'))) {
      if (currentBlock && currentBlock.type === 'text') {
        currentBlock.content.push(line);
      } else {
        if (currentBlock && currentBlock.content.length > 0) {
          blocks.push(finalizeBlock(currentBlock));
        }
        currentBlock = {
          type: 'example',
          title: 'Mathematical Expression',
          content: [line]
        };
      }
    }
    // Problems or exercises (lines starting with numbers or "Problem:")
    else if (/^\d+[\.\)]/.test(line) || line.toLowerCase().startsWith('problem')) {
      if (currentBlock && currentBlock.type !== 'practice') {
        if (currentBlock.content.length > 0) {
          blocks.push(finalizeBlock(currentBlock));
        }
        currentBlock = {
          type: 'practice',
          title: 'Practice Problems',
          content: [line]
        };
      } else if (currentBlock) {
        currentBlock.content.push(line);
      }
    }
    // Regular content
    else if (line) {
      if (!currentBlock) {
        currentBlock = {
          type: 'text',
          title: 'Introduction',
          content: [line]
        };
      } else {
        currentBlock.content.push(line);
      }
    }
    // Empty line - continue building current block
    else if (currentBlock) {
      currentBlock.content.push('');
    }
  }
  
  // Finalize the last block
  if (currentBlock && currentBlock.content.length > 0) {
    blocks.push(finalizeBlock(currentBlock));
  }
  
  return blocks;
}

function finalizeBlock(block: {type: string, content: string[], title?: string}): {type: string, content: string, title?: string} {
  const content = block.content.join('\n').trim();
  
  return {
    type: block.type,
    content: content,
    title: block.title
  };
}