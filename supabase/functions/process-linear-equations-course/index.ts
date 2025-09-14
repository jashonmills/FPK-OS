import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface LessonContent {
  title: string;
  content: string;
  lesson_number: number;
  estimated_minutes: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Linear Equations course processing...')
    
    const { organizationId } = await req.json()
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }

    // Step 1: Read and parse all lesson files
    const lessonFiles = [
      'COURSE_SUMMARY.md',
      'lesson_3_1.md',
      'lesson_3_2.md', 
      'lesson_3_3.md',
      'lesson_3_4.md',
      'lesson_3_5.md',
      'lesson_3_6.md',
      'lesson_3_7.md'
    ]

    const lessonsContent: LessonContent[] = []
    let courseSummary = ''

    for (const fileName of lessonFiles) {
      try {
        const { data: fileData, error: fileError } = await supabase
          .storage
          .from('course-files')
          .download(fileName)

        if (fileError) {
          console.error(`Error downloading ${fileName}:`, fileError)
          continue
        }

        const content = await fileData.text()
        
        if (fileName === 'COURSE_SUMMARY.md') {
          courseSummary = content
        } else {
          // Parse lesson content
          const title = extractTitle(content) || `Linear Equations Lesson ${fileName.replace('lesson_3_', '').replace('.md', '')}`
          const lessonNumber = parseInt(fileName.replace('lesson_3_', '').replace('.md', ''))
          
          lessonsContent.push({
            title,
            content,
            lesson_number: lessonNumber,
            estimated_minutes: estimateReadingTime(content)
          })
        }
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error)
      }
    }

    console.log(`Processed ${lessonsContent.length} lessons`)

    // Step 2: Create native course
    const { data: courseData, error: courseError } = await supabase
      .from('native_courses')
      .insert({
        title: 'Interactive Linear Equations',
        slug: 'interactive-linear-equations',
        summary: extractCourseSummary(courseSummary),
        description: 'A comprehensive interactive course covering linear equations, graphing, and real-world applications.',
        visibility: 'published',
        organization_id: organizationId,
        estimated_duration_hours: Math.ceil(lessonsContent.reduce((sum, l) => sum + l.estimated_minutes, 0) / 60),
        difficulty_level: 'intermediate',
        created_by: null, // System generated
        tags: ['mathematics', 'algebra', 'linear-equations', 'interactive']
      })
      .select()
      .single()

    if (courseError) {
      throw new Error(`Failed to create course: ${courseError.message}`)
    }

    console.log('Created course:', courseData.id)

    // Step 3: Create course module
    const { data: moduleData, error: moduleError } = await supabase
      .from('course_modules')
      .insert({
        course_id: courseData.id,
        title: 'Linear Equations Fundamentals',
        order_index: 1
      })
      .select()
      .single()

    if (moduleError) {
      throw new Error(`Failed to create module: ${moduleError.message}`)
    }

    console.log('Created module:', moduleData.id)

    // Step 4: Create lessons and lesson blocks
    for (const lessonContent of lessonsContent) {
      // Create lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('course_lessons')
        .insert({
          module_id: moduleData.id,
          title: lessonContent.title,
          order_index: lessonContent.lesson_number,
          est_minutes: lessonContent.estimated_minutes
        })
        .select()
        .single()

      if (lessonError) {
        console.error(`Failed to create lesson ${lessonContent.lesson_number}:`, lessonError)
        continue
      }

      console.log(`Created lesson ${lessonContent.lesson_number}:`, lessonData.id)

      // Parse content and create lesson blocks
      const blocks = parseMarkdownToBlocks(lessonContent.content)
      
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        const { error: blockError } = await supabase
          .from('lesson_blocks')
          .insert({
            lesson_id: lessonData.id,
            type: block.type,
            data_json: block.data,
            order_index: i + 1
          })

        if (blockError) {
          console.error(`Failed to create block ${i + 1} for lesson ${lessonContent.lesson_number}:`, blockError)
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        courseId: courseData.id,
        moduleId: moduleData.id,
        lessonsProcessed: lessonsContent.length,
        message: 'Interactive Linear Equations course created successfully!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing course:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function extractTitle(content: string): string {
  const titleMatch = content.match(/^#\s+(.+)$/m)
  return titleMatch ? titleMatch[1].trim() : ''
}

function extractCourseSummary(content: string): string {
  // Extract first paragraph after title as summary
  const lines = content.split('\n').filter(line => line.trim())
  const titleIndex = lines.findIndex(line => line.startsWith('#'))
  
  if (titleIndex >= 0 && titleIndex < lines.length - 1) {
    return lines[titleIndex + 1].trim()
  }
  
  return 'A comprehensive course on linear equations covering fundamental concepts and practical applications.'
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.max(5, Math.ceil(wordCount / wordsPerMinute))
}

function parseMarkdownToBlocks(content: string): Array<{type: string, data: any}> {
  const blocks: Array<{type: string, data: any}> = []
  const lines = content.split('\n')
  let currentBlock: {type: string, content: string[]} | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Headers
    if (line.match(/^#+\s/)) {
      if (currentBlock) {
        blocks.push(finalizeBlock(currentBlock))
        currentBlock = null
      }
      
      const level = line.match(/^(#+)/)?.[1].length || 1
      const text = line.replace(/^#+\s/, '').trim()
      
      blocks.push({
        type: 'rich-text',
        data: {
          html: `<h${Math.min(level, 6)}>${text}</h${Math.min(level, 6)}>`,
          text: text
        }
      })
      continue
    }

    // Math expressions (for interactive elements)
    if (line.includes('$') || line.includes('\\(') || line.includes('equation')) {
      if (currentBlock && currentBlock.type !== 'rich-text') {
        blocks.push(finalizeBlock(currentBlock))
        currentBlock = null
      }
      
      if (!currentBlock || currentBlock.type !== 'rich-text') {
        currentBlock = { type: 'rich-text', content: [] }
      }
      
      // Enhanced math formatting
      const mathLine = line.replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>')
      currentBlock.content.push(mathLine)
      continue
    }

    // Problem/Exercise sections (convert to quiz)
    if (line.toLowerCase().includes('problem') || line.toLowerCase().includes('exercise') || line.toLowerCase().includes('practice')) {
      if (currentBlock) {
        blocks.push(finalizeBlock(currentBlock))
        currentBlock = null
      }

      // Look ahead for the problem content
      const problemContent = []
      let j = i + 1
      while (j < lines.length && !lines[j].match(/^#+\s/) && lines[j].trim()) {
        problemContent.push(lines[j])
        j++
      }
      
      if (problemContent.length > 0) {
        blocks.push({
          type: 'quiz',
          data: {
            question: problemContent.join('\n'),
            type: 'text',
            explanation: 'Work through this step by step, showing your work.'
          }
        })
      }
      
      i = j - 1 // Skip processed lines
      continue
    }

    // Regular content
    if (line.trim()) {
      if (!currentBlock) {
        currentBlock = { type: 'rich-text', content: [] }
      }
      
      // Convert markdown formatting
      let formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
      
      currentBlock.content.push(formattedLine)
    } else if (currentBlock) {
      // Empty line - finalize current block
      blocks.push(finalizeBlock(currentBlock))
      currentBlock = null
    }
  }

  // Finalize last block
  if (currentBlock) {
    blocks.push(finalizeBlock(currentBlock))
  }

  return blocks
}

function finalizeBlock(block: {type: string, content: string[]}): {type: string, data: any} {
  const content = block.content.join('\n').trim()
  
  return {
    type: block.type,
    data: {
      html: `<div class="lesson-content">${content.replace(/\n/g, '<br>')}</div>`,
      text: content
    }
  }
}