// Packaged copy for review/apply: supabase/functions/fetch-linear-equations-content/index.ts

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

  console.log(`Parsing content with ${lines.length} lines`);

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
      console.log(`Created text block: ${currentBlock.title}`);
    }
    // Main heading (single #)
    else if (line.startsWith('# ')) {
      // Skip main title, already extracted
      continue;
    }
    // Interactive elements (look for keywords)
    else if (line.toLowerCase().includes('interactive') || line.toLowerCase().includes('practice') || line.toLowerCase().includes('exercise')) {
      if (currentBlock && currentBlock.content.length > 0) {
        blocks.push(finalizeBlock(currentBlock));
      }
      currentBlock = {
        type: 'practice',
        title: 'Interactive Practice',
        content: [line]
      };
      console.log(`Created practice block: Interactive Practice`);
    }
    // Math expressions or equations
    else if (line.includes('=') && (line.includes('x') || line.includes('y') || line.includes('a') || line.includes('b') || /\d+/.test(line))) {
      if (currentBlock && currentBlock.type === 'example') {
        // Continue building example block
        currentBlock.content.push(line);
      } else {
        // Start new example block
        if (currentBlock && currentBlock.content.length > 0) {
          blocks.push(finalizeBlock(currentBlock));
        }
        currentBlock = {
          type: 'example',
          title: 'Mathematical Example',
          content: [line]
        };
        console.log(`Created example block: Mathematical Example`);
      }
    }
    // Problems or exercises (lines starting with numbers or "Problem:")
  else if (/^\d+[.)]/.test(line) || line.toLowerCase().startsWith('problem') || line.toLowerCase().startsWith('solve')) {
      if (currentBlock && currentBlock.type === 'practice') {
        // Continue building practice block
        currentBlock.content.push(line);
      } else {
        // Start new practice block
        if (currentBlock && currentBlock.content.length > 0) {
          blocks.push(finalizeBlock(currentBlock));
        }
        currentBlock = {
          type: 'practice',
          title: 'Practice Problems',
          content: [line]
        };
        console.log(`Created practice block: Practice Problems`);
      }
    }
    // Step-by-step solutions (look for "Step" keywords)
    else if (line.toLowerCase().includes('step') && (line.includes('1') || line.includes('2') || line.includes(':'))) {
      if (currentBlock && currentBlock.type === 'example') {
        currentBlock.content.push(line);
      } else {
        if (currentBlock && currentBlock.content.length > 0) {
          blocks.push(finalizeBlock(currentBlock));
        }
        currentBlock = {
          type: 'example',
          title: 'Step-by-Step Solution',
          content: [line]
        };
        console.log(`Created example block: Step-by-Step Solution`);
      }
    }
    // Quiz indicators
    else if (line.toLowerCase().includes('quiz') || line.toLowerCase().includes('test') || line.toLowerCase().includes('check your understanding')) {
      if (currentBlock && currentBlock.content.length > 0) {
        blocks.push(finalizeBlock(currentBlock));
      }
      currentBlock = {
        type: 'quiz',
        title: 'Knowledge Check',
        content: [line]
      };
      console.log(`Created quiz block: Knowledge Check`);
    }
    // Regular content
    else if (line) {
      if (!currentBlock) {
        currentBlock = {
          type: 'text',
          title: 'Lesson Content',
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
  
  console.log(`Generated ${blocks.length} content blocks`);
  return blocks;
}

function finalizeBlock(block: {type: string, content: string[], title?: string}): {type: string, content: string, title?: string} {
  const content = block.content.join('\n').trim();
  
  const finalizedBlock = {
    type: block.type,
    content: content,
    title: block.title
  };
  
  console.log(`Finalized ${block.type} block: "${block.title}" (${content.length} chars)`);
  return finalizedBlock;
}
