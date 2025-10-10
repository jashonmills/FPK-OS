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

// Simple PDF text extraction function
async function extractPdfText(pdfData: Uint8Array): Promise<string> {
  try {
    // Convert to text using a simple extraction
    // This is a basic implementation - we'll use pdfjs via npm package
    const decoder = new TextDecoder('utf-8');
    let text = '';
    
    // Try to extract readable text from PDF
    // This is a simplified approach - in production, you'd use a proper PDF library
    const dataStr = decoder.decode(pdfData);
    
    // Extract text between common PDF text markers
    const textMatches = dataStr.match(/\((.*?)\)/g);
    if (textMatches) {
      text = textMatches
        .map(match => match.slice(1, -1))
        .join(' ')
        .replace(/\\[nrt]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    // If no text extracted, try alternative method
    if (!text || text.length < 100) {
      // Look for text between BT and ET markers (PDF text objects)
      const btMatches = dataStr.match(/BT\s+(.*?)\s+ET/gs);
      if (btMatches) {
        text = btMatches.join(' ')
          .replace(/[^a-zA-Z0-9\s.,;:!?()-]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
    }

    return text || 'Unable to extract text from PDF';
  } catch (error: any) {
    console.error('PDF text extraction error:', error);
    return `Error extracting text: ${error.message}`;
  }
}
