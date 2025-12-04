import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import JSZip from "npm:jszip@3.10.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { zipUrl, courseId } = await req.json()
    
    if (!zipUrl || !courseId) {
      throw new Error('Missing zipUrl or courseId')
    }

    console.log(`Processing algebra course zip extraction for: ${courseId}`)
    console.log(`Zip URL: ${zipUrl}`)

    // Download the zip file
    console.log('Downloading zip file...')
    const response = await fetch(zipUrl)
    
    if (!response.ok) {
      throw new Error(`Failed to download zip: ${response.statusText}`)
    }

    const zipBuffer = await response.arrayBuffer()
    console.log(`Downloaded zip file: ${zipBuffer.byteLength} bytes`)

    // Extract the zip file contents
    const zip = new JSZip()
    const zipContent = await zip.loadAsync(zipBuffer)
    
    console.log('Zip contents:', Object.keys(zipContent.files))
    
    // Extract lesson files with improved pattern matching
    const lessons = []
    const lessonContents = {}
    
    console.log('Analyzing zip contents for lesson files...')
    
    for (const [filename, file] of Object.entries(zipContent.files)) {
      console.log(`Checking file: ${filename}, isDir: ${file.dir}`)
      
      if (!file.dir) {
        // Enhanced pattern matching for various lesson file formats
        const lessonPatterns = [
          /lesson[_\s-]*(\d+)/i,           // lesson1, lesson_1, lesson-1, lesson 1
          /(\d+)[_\s-]*lesson/i,           // 1_lesson, 1-lesson, 1 lesson
          /part[_\s-]*(\d+)/i,             // part1, part_1, part-1
          /chapter[_\s-]*(\d+)/i,          // chapter1, chapter_1
          /unit[_\s-]*(\d+)/i,             // unit1, unit_1
          /section[_\s-]*(\d+)/i,          // section1, section_1
          /^(\d+)/,                        // Files starting with numbers
        ]
        
        let lessonNum = null
        let matchedPattern = null
        
        for (const pattern of lessonPatterns) {
          const match = filename.match(pattern)
          if (match) {
            lessonNum = parseInt(match[1])
            matchedPattern = pattern.toString()
            break
          }
        }
        
        if (lessonNum && lessonNum >= 1 && lessonNum <= 10) { // Reasonable lesson range
          console.log(`✅ Found lesson ${lessonNum} in file: ${filename} (pattern: ${matchedPattern})`)
          
          try {
            const content = await file.async('text')
            
            lessonContents[lessonNum] = {
              filename,
              content,
              title: `Lesson ${lessonNum}` // Will be refined from content
            }
          } catch (error) {
            console.error(`❌ Failed to read content from ${filename}:`, error)
          }
        } else {
          console.log(`⚠️ File ${filename} doesn't match lesson patterns`)
        }
      }
    }
    
    // Sort and format lessons
    const sortedLessons = Object.keys(lessonContents)
      .map(key => parseInt(key))
      .sort((a, b) => a - b)
      .map(num => ({
        id: num,
        ...lessonContents[num]
      }))
    
    console.log(`Extracted ${sortedLessons.length} lessons:`, sortedLessons.map(l => l.filename))
    
    const extractedData = {
      courseId,
      status: 'extracted',
      message: 'Algebra course content extracted successfully',
      lessons: sortedLessons,
      extractedAt: new Date().toISOString()
    }

    console.log('Algebra course extraction completed:', extractedData)

    return new Response(
      JSON.stringify(extractedData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Algebra zip extraction error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'failed'
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    )
  }
})