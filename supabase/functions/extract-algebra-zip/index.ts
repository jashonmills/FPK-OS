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
    
    // Extract lesson files
    const lessons = []
    const lessonContents = {}
    
    for (const [filename, file] of Object.entries(zipContent.files)) {
      if (!file.dir && (filename.includes('lesson') || filename.includes('Lesson'))) {
        console.log(`Processing file: ${filename}`)
        const content = await file.async('text')
        
        // Extract lesson number from filename
        const lessonMatch = filename.match(/lesson[_\s]*(\d+)/i)
        if (lessonMatch) {
          const lessonNum = parseInt(lessonMatch[1])
          lessonContents[lessonNum] = {
            filename,
            content,
            title: `Lesson ${lessonNum}` // Will be refined from content
          }
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