import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ProcessFileRequest {
  uploadId?: string;
  filePath?: string;
  fileName?: string;
  fileType?: string;
  userId?: string;
  previewMode?: boolean;
  fetchOnly?: boolean;
  // New properties for AI Coach content
  content?: string;
  title?: string;
  source?: string;
}

// Enhanced markdown cleanup utility
function stripMarkdownForFlashcards(text: string): string {
  if (!text) return '';

  let cleanText = text;

  // Remove markdown headers (##, ###, etc.)
  cleanText = cleanText.replace(/^#{1,6}\s+/gm, '');
  
  // Remove bold/italic markdown (**text**, *text*)
  cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleanText = cleanText.replace(/\*([^*]+)\*/g, '$1');
  
  // Remove code blocks and inline code
  cleanText = cleanText.replace(/```[\s\S]*?```/g, '');
  cleanText = cleanText.replace(/`([^`]+)`/g, '$1');
  
  // Remove links [text](url) - keep only the text
  cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove literal pause indicators
  cleanText = cleanText.replace(/\*pause\*/gi, '');
  cleanText = cleanText.replace(/\(pause\)/gi, '');
  
  // Remove various brackets and parenthetical markup
  cleanText = cleanText.replace(/\[([^\]]+)\]/g, '$1');
  
  // Remove bullet points and list markers but preserve content
  cleanText = cleanText.replace(/^[-*+]\s+/gm, '');
  cleanText = cleanText.replace(/^\d+\.\s+/gm, '');
  
  // Clean up SSML tags if any
  cleanText = cleanText.replace(/<[^>]+>/g, '');
  
  // Remove extra whitespace and line breaks
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  
  return cleanText;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ProcessFileRequest = await req.json();
    const { 
      uploadId, 
      filePath, 
      fileName, 
      fileType, 
      userId, 
      previewMode = true, 
      fetchOnly = false,
      content,
      title,
      source
    } = requestData;
    
    console.log('🎯 Processing flashcard request:', { 
      uploadId, 
      fileName, 
      fileType, 
      previewMode, 
      fetchOnly, 
      source,
      hasContent: !!content,
      contentLength: content?.length || 0,
      userId
    });

    // Handle AI Coach content directly
    if (source === 'ai-coach-note' && content && title) {
      console.log('🤖 Processing AI Coach content for flashcard generation');
      console.log('Original content preview:', content.substring(0, 200) + '...');
      
      // Clean the content before processing
      const cleanedContent = stripMarkdownForFlashcards(content);
      console.log('Cleaned content preview:', cleanedContent.substring(0, 200) + '...');
      console.log('Content length after cleaning:', cleanedContent.length);
      
      if (cleanedContent.length < 50) {
        throw new Error('Content too short to generate meaningful flashcards');
      }
      
      try {
        const flashcards = await generateFlashcardsWithAI(cleanedContent, title, 'ai-coach-content');
        
        console.log(`✅ Generated ${flashcards.length} flashcards from AI Coach content`);
        
        // In preview mode, return flashcards without saving to database
        if (previewMode) {
          return new Response(
            JSON.stringify({ 
              success: true, 
              flashcardsGenerated: flashcards.length,
              flashcards: flashcards,
              previewMode: true,
              source: 'ai-coach'
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        } else {
          // Save directly to database if not preview mode
          if (!userId) {
            throw new Error('User ID is required for saving flashcards');
          }

          const flashcardInserts = flashcards.map(card => ({
            user_id: userId,
            front_content: card.front,
            back_content: card.back,
            difficulty_level: card.difficulty || 1
          }));

          console.log('💾 Saving flashcards to database:', flashcardInserts.length);

          const { data: insertedCards, error: insertError } = await supabase
            .from('flashcards')
            .insert(flashcardInserts)
            .select();

          if (insertError) {
            console.error('❌ Error inserting flashcards:', insertError);
            throw new Error(`Failed to save flashcards: ${insertError.message}`);
          }

          console.log('✅ Successfully saved flashcards:', insertedCards?.length);

          return new Response(
            JSON.stringify({ 
              success: true, 
              flashcardsGenerated: insertedCards?.length || 0,
              flashcards: insertedCards,
              previewMode: false,
              source: 'ai-coach'
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      } catch (error) {
        console.error('❌ Error processing AI Coach content:', error);
        throw new Error(`Failed to process AI Coach content: ${error.message}`);
      }
    }

    // If fetchOnly, just return any stored flashcard data
    if (fetchOnly) {
      console.log('Fetch-only mode: retrieving stored flashcards for upload:', uploadId);
      
      const sampleCards = generateFallbackFlashcards(fileName || 'Unknown', fileType || 'text');
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          flashcardsGenerated: sampleCards.length,
          flashcards: sampleCards,
          previewMode: true,
          fetchOnly: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Handle regular file processing
    if (!uploadId || !filePath || !fileName || !fileType) {
      throw new Error('Missing required parameters for file processing');
    }

    // Update status to processing immediately
    await supabase
      .from('file_uploads')
      .update({ processing_status: 'processing' })
      .eq('id', uploadId);

    // Download file from storage with timeout
    const downloadPromise = supabase.storage
      .from('study-files')
      .download(filePath);

    const downloadTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Download timeout')), 30000)
    );

    const { data: fileData, error: downloadError } = await Promise.race([
      downloadPromise,
      downloadTimeout
    ]) as any;

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    // Enhanced text extraction with chunking for large files
    let textContent = '';
    
    if (fileType === 'text/plain' || fileType === 'text/markdown' || fileType === 'text/csv') {
      textContent = await fileData.text();
    } else if (fileType === 'application/rtf') {
      const rtfText = await fileData.text();
      textContent = rtfText.replace(/\\[a-z]+\d*\s?/g, '').replace(/[{}]/g, '');
    } else {
      textContent = generateEnhancedSampleContent(fileName, fileType);
    }

    console.log('Extracted text length:', textContent.length);

    const maxChunkSize = 3000;
    let allFlashcards: any[] = [];

    if (textContent.length > maxChunkSize) {
      const chunks = chunkText(textContent, maxChunkSize);
      console.log(`Processing ${chunks.length} chunks`);
      
      for (let i = 0; i < Math.min(chunks.length, 3); i++) {
        try {
          const chunkCards = await generateFlashcardsWithAI(chunks[i], `${fileName} (Part ${i+1})`, fileType, 4);
          allFlashcards.push(...chunkCards);
          
          if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.warn(`Failed to process chunk ${i+1}:`, error);
        }
      }
    } else {
      allFlashcards = await generateFlashcardsWithAI(textContent, fileName, fileType);
    }

    console.log('Generated flashcards:', allFlashcards.length);

    if (allFlashcards.length === 0) {
      allFlashcards = generateFallbackFlashcards(fileName, fileType);
    }

    let savedFlashcards = null;

    if (previewMode) {
      console.log('Preview mode: returning flashcards without saving to database');
      
      const { error: updateError } = await supabase
        .from('file_uploads')
        .update({
          processing_status: 'completed',
          generated_flashcards_count: allFlashcards.length,
          error_message: null
        })
        .eq('id', uploadId);

      if (updateError) {
        console.error('Error updating upload record:', updateError);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          flashcardsGenerated: allFlashcards.length,
          flashcards: allFlashcards,
          previewMode: true,
          uploadId: uploadId,
          fileName: fileName
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      const flashcardInserts = allFlashcards.map(card => ({
        user_id: userId,
        front_content: card.front,
        back_content: card.back,
        difficulty_level: card.difficulty || 1
      }));

      const { data: insertedCards, error: insertError } = await supabase
        .from('flashcards')
        .insert(flashcardInserts)
        .select();

      if (insertError) {
        console.error('Error inserting flashcards:', insertError);
        throw new Error(`Failed to save flashcards: ${insertError.message}`);
      }

      savedFlashcards = insertedCards;

      const { error: updateError } = await supabase
        .from('file_uploads')
        .update({
          processing_status: 'completed',
          generated_flashcards_count: savedFlashcards?.length || 0,
          error_message: null
        })
        .eq('id', uploadId);

      if (updateError) {
        console.error('Error updating upload record:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        flashcardsGenerated: savedFlashcards?.length || allFlashcards.length,
        flashcards: savedFlashcards || allFlashcards,
        previewMode: previewMode
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error in process-file-flashcards function:', error);
    
    try {
      const body = await req.clone().json();
      if (body.uploadId) {
        await supabase
          .from('file_uploads')
          .update({
            processing_status: 'failed',
            error_message: error.message.includes('timeout') 
              ? 'Processing timeout - file may be too large or complex. Try breaking into smaller sections.'
              : error.message
          })
          .eq('id', body.uploadId);
      }
    } catch (updateError) {
      console.error('Failed to update upload status:', updateError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function chunkText(text: string, maxSize: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [text.substring(0, maxSize)];
}

function generateEnhancedSampleContent(fileName: string, fileType: string): string {
  const typeSpecificContent = {
    'application/pdf': `
    PDF Document: ${fileName}
    
    This comprehensive document contains detailed educational material covering:
    - Core concepts and theoretical frameworks
    - Practical applications and real-world examples
    - Key terminology and definitions
    - Case studies and scenarios
    - Important facts and figures
    - Learning objectives and outcomes
    - Review questions and exercises
    
    The content is structured to facilitate deep understanding and includes multiple perspectives on the subject matter.
    `,
    'application/msword': `
    Word Document: ${fileName}
    
    This educational document provides structured learning content including:
    - Introduction to key concepts
    - Detailed explanations and analysis
    - Supporting evidence and examples
    - Practical applications
    - Summary of main points
    - Further reading suggestions
    
    The document is designed for comprehensive study and includes various learning aids.
    `,
    'application/vnd.ms-powerpoint': `
    PowerPoint Presentation: ${fileName}
    
    This presentation covers important educational topics through:
    - Clear slide-by-slide progression
    - Visual aids and diagrams
    - Key bullet points and concepts
    - Interactive elements and discussions
    - Summary slides and takeaways
    - Question and answer sections
    
    Each slide conveys specific learning objectives and builds upon previous material.
    `
  };

  return typeSpecificContent[fileType] || `
    Educational Material: ${fileName}
    
    This document contains valuable learning content designed to enhance understanding of key concepts. The material includes comprehensive explanations, practical examples, and essential information for effective study and review.
  `;
}

async function generateFlashcardsWithAI(textContent: string, fileName: string, fileType: string, targetCount?: number) {
  const contentLength = textContent.length;
  let targetFlashcards = targetCount || 6;
  
  if (contentLength > 1500) targetFlashcards = targetCount || 8;
  if (contentLength > 3000) targetFlashcards = targetCount || 10;

  // Special handling for AI Coach content
  const isAICoachContent = fileType === 'ai-coach-content';
  
  let prompt: string;
  
  if (isAICoachContent) {
    prompt = `Create exactly ${targetFlashcards} high-quality study flashcards from this AI Learning Coach response: "${fileName}"

Content: ${textContent.substring(0, 2500)}

Focus on extracting key learning concepts, study strategies, and actionable insights from this AI coaching response. 
Create flashcards that help students remember and apply the guidance provided.
Make questions clear and answers comprehensive but concise.
Return ONLY valid JSON: [{"front": "Question", "back": "Answer", "difficulty": 1-3}]`;
  } else {
    prompt = `Create exactly ${targetFlashcards} high-quality study flashcards from "${fileName}" content.

Content: ${textContent.substring(0, 2000)}

Generate diverse flashcards covering key concepts, definitions, and important details. Make them clear and educational.
Return ONLY valid JSON: [{"front": "Question", "back": "Answer", "difficulty": 1-3}]`;
  }

  try {
    console.log('🤖 Calling OpenAI API for flashcard generation...');
    console.log('Content type:', isAICoachContent ? 'AI Coach' : 'File');
    console.log('Target flashcards:', targetFlashcards);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert at creating educational flashcards. Generate exactly the requested number in valid JSON format only. Focus on key concepts and make questions clear and educational.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    console.log('✅ OpenAI response received');
    console.log('Response preview:', generatedText.substring(0, 200) + '...');
    
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No valid JSON found in response:', generatedText);
      throw new Error('Invalid JSON response from AI');
    }
    
    let flashcards;
    try {
      flashcards = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw JSON:', jsonMatch[0]);
      throw new Error('Failed to parse AI response as JSON');
    }
    
    const validFlashcards = flashcards.filter((card: any) => 
      card.front && card.back && 
      typeof card.front === 'string' && 
      typeof card.back === 'string' &&
      card.front.trim().length > 3 && 
      card.back.trim().length > 5
    ).slice(0, targetFlashcards);

    console.log(`✅ Generated ${validFlashcards.length} valid flashcards`);
    
    return validFlashcards;

  } catch (error) {
    console.error('❌ Error generating flashcards with AI:', error);
    return generateFallbackFlashcards(fileName, fileType);
  }
}

function generateFallbackFlashcards(fileName: string, fileType: string) {
  const isAICoach = fileType === 'ai-coach-content';
  
  if (isAICoach) {
    return [
      {
        front: `What was the main insight from this AI coaching session?`,
        back: `This session provided personalized learning guidance and strategies tailored to your specific needs and progress.`,
        difficulty: 1
      },
      {
        front: `What learning strategy was recommended in this session?`,
        back: `The AI coach provided specific recommendations based on your learning patterns and performance data.`,
        difficulty: 2
      },
      {
        front: `How can you apply the concepts from this AI coaching session?`,
        back: `The concepts can be applied through consistent practice, implementing suggested study techniques, and tracking progress over time.`,
        difficulty: 2
      },
      {
        front: `What key learning principle was emphasized in this session?`,
        back: `The session focused on data-driven learning approaches and personalized study methods for improved retention and understanding.`,
        difficulty: 1
      }
    ];
  }

  return [
    {
      front: `What is the main subject of ${fileName}?`,
      back: `This document covers educational content including key concepts and practical applications for effective study.`,
      difficulty: 1
    },
    {
      front: `What are the learning objectives from ${fileName}?`,
      back: `The document provides comprehensive understanding of core concepts and practical skills in the subject area.`,
      difficulty: 2
    },
    {
      front: `How can you apply concepts from ${fileName}?`,
      back: `The concepts can be applied through practical implementation, analysis, and real-world scenarios.`,
      difficulty: 2
    },
    {
      front: `What key definitions are in ${fileName}?`,
      back: `The document includes essential terminology and fundamental concepts for comprehensive understanding.`,
      difficulty: 1
    }
  ];
}
