import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

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

    if (!file || !familyId || !studentId || !category || !documentDate) {
      throw new Error('Missing required fields');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);
    
    // Extract text from PDF using pdf-parse equivalent
    let extractedContent = '';
    
    // Simple PDF text extraction (note: this is simplified, production would use pdf-parse)
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(uint8Array);
    
    // Basic text extraction from PDF structure
    const matches = text.match(/\(([^)]+)\)/g);
    if (matches) {
      extractedContent = matches
        .map(match => match.slice(1, -1))
        .join(' ')
        .replace(/\\[rn]/g, ' ')
        .trim();
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
        document_date: documentDate,
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

    // Use waitUntil to run analysis in background
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      EdgeRuntime.waitUntil(analyzePromise);
    }

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