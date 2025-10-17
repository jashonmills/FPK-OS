import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { document_id } = await req.json();
    
    if (!document_id) {
      throw new Error('document_id is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      console.error('Document fetch error:', docError);
      throw new Error('Document not found');
    }

    console.log(`Extracting text from document: ${document.file_name}`);

    // Download the PDF from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('family-documents')
      .download(document.file_path);

    if (downloadError || !fileData) {
      console.error('File download error:', downloadError);
      throw new Error('Failed to download document');
    }

    console.log(`Downloaded file, size: ${fileData.size} bytes`);

    // Convert blob to ArrayBuffer
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Use pdf-parse (Deno-compatible PDF text extraction)
    // We'll use a simple approach: convert to base64 and use an external API or library
    // For now, let's use a simpler text extraction approach
    
    // Import pdf-parse alternative for Deno
    const pdfText = await extractPdfText(uint8Array);

    console.log(`Extracted ${pdfText.length} characters of text`);

    // Update the document with extracted content
    const { error: updateError } = await supabase
      .from('documents')
      .update({ extracted_content: pdfText })
      .eq('id', document_id);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error('Failed to update document');
    }

    console.log(`Successfully extracted text for document ${document_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        extracted_length: pdfText.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error in extract-document-text:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Production-grade PDF text extraction using pdf-parse
async function extractPdfText(pdfData: Uint8Array): Promise<string> {
  try {
    // Import pdf-parse from npm (Deno-compatible)
    const pdfParse = (await import("npm:pdf-parse@1.1.1")).default;
    
    // Convert Uint8Array to Buffer for pdf-parse
    const buffer = Buffer.from(pdfData);
    
    // Extract text using pdf-parse
    const pdfData_parsed = await pdfParse(buffer);
    
    const extractedText = pdfData_parsed.text;
    const pageCount = pdfData_parsed.numpages;
    
    console.log(`✅ Successfully extracted ${extractedText.length} characters from ${pageCount} pages`);
    
    // Warn if extracted text is suspiciously short (might be scanned/image-based PDF)
    if (extractedText.length < 100) {
      console.warn('⚠️ Extracted text is suspiciously short. PDF might be scanned/image-based.');
      return 'Unable to extract text - document may be scanned. OCR required.';
    }
    
    // Clean up the extracted text
    const cleanedText = extractedText
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim();
    
    return cleanedText;
  } catch (error: any) {
    console.error('❌ PDF extraction error:', error);
    return `Error extracting text: ${error.message}`;
  }
}
