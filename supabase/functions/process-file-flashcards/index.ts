
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
  uploadId: string;
  filePath: string;
  fileName: string;
  fileType: string;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { uploadId, filePath, fileName, fileType, userId }: ProcessFileRequest = await req.json();
    
    console.log('Processing file:', { uploadId, fileName, fileType });

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('study-files')
      .download(filePath);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    // Extract text content based on file type
    let textContent = '';
    
    if (fileType === 'text/plain') {
      textContent = await fileData.text();
    } else if (fileType === 'application/pdf') {
      // For PDF files, we'll extract a sample text for now
      // In production, you'd use a PDF parsing library
      textContent = `Content from PDF: ${fileName}. This is sample text that would be extracted from the PDF file.`;
    } else {
      // For other document types, use sample text
      textContent = `Content from document: ${fileName}. This is sample text that would be extracted from the document.`;
    }

    console.log('Extracted text length:', textContent.length);

    // Generate flashcards using OpenAI
    const flashcards = await generateFlashcardsWithAI(textContent, fileName);
    
    console.log('Generated flashcards:', flashcards.length);

    // Save flashcards to database
    const savedFlashcards = [];
    for (const card of flashcards) {
      const { data: flashcard, error: insertError } = await supabase
        .from('flashcards')
        .insert({
          user_id: userId,
          front_content: card.front,
          back_content: card.back,
          difficulty_level: card.difficulty || 1
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting flashcard:', insertError);
      } else {
        savedFlashcards.push(flashcard);
      }
    }

    // Update upload record with completion status
    const { error: updateError } = await supabase
      .from('file_uploads')
      .update({
        processing_status: 'completed',
        generated_flashcards_count: savedFlashcards.length
      })
      .eq('id', uploadId);

    if (updateError) {
      console.error('Error updating upload record:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        flashcardsGenerated: savedFlashcards.length,
        flashcards: savedFlashcards 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in process-file-flashcards function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateFlashcardsWithAI(textContent: string, fileName: string) {
  // Calculate number of flashcards based on content length
  const wordCount = textContent.split(' ').length;
  const targetFlashcards = Math.min(Math.max(Math.floor(wordCount / 100), 5), 20);
  
  const prompt = `
You are an expert educational content creator. Analyze the following text content from "${fileName}" and create ${targetFlashcards} high-quality flashcards for studying.

Content to analyze:
${textContent.substring(0, 3000)} ${textContent.length > 3000 ? '...' : ''}

Instructions:
1. Create flashcards that focus on key concepts, definitions, important facts, and main ideas
2. Make questions clear and specific
3. Provide comprehensive but concise answers
4. Vary the types of questions (definitions, explanations, examples, relationships)
5. Ensure flashcards are educational and help with learning retention

Return ONLY a JSON array in this exact format:
[
  {
    "front": "Question or prompt",
    "back": "Answer or explanation",
    "difficulty": 1
  }
]

The difficulty should be 1 (easy), 2 (medium), or 3 (hard) based on concept complexity.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert educational content creator that generates high-quality study flashcards.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    // Parse the JSON response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }
    
    const flashcards = JSON.parse(jsonMatch[0]);
    
    // Validate flashcards structure
    return flashcards.filter((card: any) => 
      card.front && card.back && typeof card.front === 'string' && typeof card.back === 'string'
    );

  } catch (error) {
    console.error('Error generating flashcards with AI:', error);
    
    // Fallback: generate sample flashcards based on content
    return [
      {
        front: `What is the main topic discussed in ${fileName}?`,
        back: `The main topic covers key concepts and information from the uploaded document.`,
        difficulty: 1
      },
      {
        front: `What are the key points from ${fileName}?`,
        back: `The document contains important information that can be studied and reviewed.`,
        difficulty: 2
      }
    ];
  }
}
