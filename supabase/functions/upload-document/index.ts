import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
// Import PDF.js for proper PDF text extraction via esm.sh
import * as pdfjsLib from "https://esm.sh/pdfjs-dist@4.0.379/build/pdf.min.mjs";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const familyId = formData.get('family_id') as string;
    const studentId = formData.get('student_id') as string;
    const category = formData.get('category') as string;
    const documentDate = formData.get('document_date') as string;
    const uploadedBy = formData.get('uploaded_by') as string;

    if (!file || !familyId || !studentId || !category) {
      throw new Error('Missing required fields');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);
    
    // Extract text from PDF using pdfjs-dist
    let extractedContent = '';
    
    try {
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdf = await loadingTask.promise;
      
      // Extract text from all pages
      const textParts: string[] = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        textParts.push(pageText);
      }
      
      extractedContent = textParts.join('\n\n').trim();
      
      // Sanitize extracted content to remove null bytes and problematic characters
      extractedContent = extractedContent
        .replace(/\u0000/g, '') // Remove null bytes
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
        
    } catch (pdfError) {
      console.error('PDF extraction error:', pdfError);
      throw new Error('Failed to extract text from PDF. The file may be corrupted or password-protected.');
    }

    // Quality validation
    if (!extractedContent || extractedContent.length === 0) {
      console.error('PDF text extraction failed: empty content');
      return new Response(
        JSON.stringify({ 
          error: 'Failed to extract text from PDF. The file may be corrupted or contains only images.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (extractedContent.length < 50) {
      console.error('PDF text extraction failed: insufficient content', extractedContent.length);
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient text extracted from PDF. Please ensure the document contains readable text.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully extracted ${extractedContent.length} characters from PDF`);

    // Upload file to storage
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${familyId}/${studentId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('family-documents')
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('family-documents')
      .getPublicUrl(filePath);

    // Insert document record with extracted content
    const { data: documentData, error: dbError } = await supabase
      .from('documents')
      .insert({
        family_id: familyId,
        student_id: studentId,
        uploaded_by: uploadedBy,
        file_name: file.name,
        file_path: publicUrl,
        file_type: file.type,
        file_size_kb: Math.round(file.size / 1024),
        category,
        document_date: documentDate || null,
        extracted_content: extractedContent,
        metadata: {
          extraction_quality: 'success',
          character_count: extractedContent.length,
          word_count: extractedContent.split(/\s+/).length
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Clean up uploaded file
      await supabase.storage.from('family-documents').remove([filePath]);
      throw dbError;
    }

    // Trigger background analysis using waitUntil
    const analyzePromise = (async () => {
      try {
        console.log(`Triggering analysis for document ${documentData.id}`);
        const { error: analyzeError } = await supabase.functions.invoke('analyze-document', {
          body: { document_id: documentData.id }
        });
        if (analyzeError) {
          console.error('Background analysis trigger error:', analyzeError);
        } else {
          console.log(`Analysis triggered successfully for document ${documentData.id}`);
        }
      } catch (error) {
        console.error('Background analysis error:', error);
      }
    })();

    // Note: Analysis will run in background via the Promise
    // EdgeRuntime.waitUntil is not available in this Deno environment

    return new Response(
      JSON.stringify({
        success: true,
        document: documentData,
        extraction_stats: {
          characters: extractedContent.length,
          words: extractedContent.split(/\s+/).length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Upload document error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});