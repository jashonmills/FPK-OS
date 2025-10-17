import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation function for extraction quality
interface ValidationResult {
  valid: boolean;
  quality: 'excellent' | 'good' | 'poor' | 'failed' | 'uncertain';
  reason?: string;
}

function validateExtraction(text: string): ValidationResult {
  // Check minimum length
  if (text.length < 100) {
    return { valid: false, quality: 'poor', reason: 'Text too short (< 100 chars)' };
  }
  
  // Check for error messages
  if (text.startsWith('Unable to extract') || text.startsWith('Error extracting')) {
    return { valid: false, quality: 'failed', reason: 'Extraction error message detected' };
  }
  
  // Check for meaningful content (not just whitespace/gibberish)
  const wordCount = text.split(/\s+/).filter(w => w.length > 2).length;
  if (wordCount < 20) {
    return { valid: false, quality: 'poor', reason: `Too few meaningful words (${wordCount})` };
  }
  
  // Check for special education keywords
  const eduKeywords = ['goal', 'iep', 'behavior', 'assessment', 'progress', 'skill', 'student', 'evaluation', 'intervention', 'therapy'];
  const hasEduContent = eduKeywords.some(kw => text.toLowerCase().includes(kw));
  
  if (!hasEduContent && text.length < 500) {
    return { valid: false, quality: 'uncertain', reason: 'No education keywords found in short document' };
  }
  
  // Determine quality based on length and content
  if (text.length > 2000 && hasEduContent) {
    return { valid: true, quality: 'excellent' };
  } else if (text.length > 500 || hasEduContent) {
    return { valid: true, quality: 'good' };
  } else {
    return { valid: true, quality: 'uncertain', reason: 'Content quality uncertain' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let diagnosticData: any = {
    errors: []
  };

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

    diagnosticData.document_id = document.id;
    diagnosticData.family_id = document.family_id;

    console.log(`📄 Extracting text from document: ${document.file_name}`);

    // Download the PDF from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('family-documents')
      .download(document.file_path);

    if (downloadError || !fileData) {
      console.error('File download error:', downloadError);
      diagnosticData.errors.push({ stage: 'download', error: downloadError?.message });
      throw new Error('Failed to download document');
    }

    console.log(`📥 Downloaded file, size: ${fileData.size} bytes`);

    // Convert blob to ArrayBuffer
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Try standard extraction first
    console.log('🔍 Attempting standard PDF text extraction...');
    let pdfText = await extractPdfText(uint8Array);
    let extractionMethod = 'pdf-parse';
    
    // Validate extraction quality
    let validation = validateExtraction(pdfText);
    
    // If validation failed and text is too short, try OCR fallback
    if (!validation.valid && pdfText.length < 100) {
      console.log('⚠️ Standard extraction produced minimal text, attempting OCR fallback...');
      diagnosticData.errors.push({ stage: 'extraction', error: 'Standard extraction failed, trying OCR' });
      
      try {
        pdfText = await performOCR(uint8Array);
        extractionMethod = 'ocr';
        validation = validateExtraction(pdfText);
        
        if (validation.valid) {
          console.log('✅ OCR extraction successful');
        }
      } catch (ocrError: any) {
        console.error('❌ OCR fallback failed:', ocrError);
        diagnosticData.errors.push({ stage: 'ocr', error: ocrError.message });
        // Continue with original extraction even if OCR failed
      }
    }

    const wordCount = pdfText.split(/\s+/).filter(w => w.length > 2).length;
    
    console.log(`📊 Extraction complete:
    - Method: ${extractionMethod}
    - Length: ${pdfText.length} chars
    - Words: ${wordCount}
    - Quality: ${validation.quality}
    - Valid: ${validation.valid}
    ${validation.reason ? `- Reason: ${validation.reason}` : ''}`);

    // Update diagnostics
    diagnosticData.extraction_method = extractionMethod;
    diagnosticData.text_length = pdfText.length;
    diagnosticData.word_count = wordCount;
    diagnosticData.quality_score = validation.quality;
    diagnosticData.validation_passed = validation.valid;
    diagnosticData.validation_reason = validation.reason || null;

    // Update the document with extracted content
    const { error: updateError } = await supabase
      .from('documents')
      .update({ extracted_content: pdfText })
      .eq('id', document_id);

    if (updateError) {
      console.error('Update error:', updateError);
      diagnosticData.errors.push({ stage: 'update', error: updateError.message });
      throw new Error('Failed to update document');
    }

    // Log diagnostics
    diagnosticData.processing_time_ms = Date.now() - startTime;
    
    await supabase
      .from('document_extraction_diagnostics')
      .insert(diagnosticData);

    console.log(`✅ Successfully extracted text for document ${document_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        extracted_length: pdfText.length,
        quality: validation.quality,
        validation_passed: validation.valid,
        extraction_method: extractionMethod
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('❌ Error in extract-document-text:', error);
    
    // Try to log error diagnostics if we have minimal data
    if (diagnosticData.document_id) {
      diagnosticData.processing_time_ms = Date.now() - startTime;
      diagnosticData.errors.push({ stage: 'fatal', error: error.message });
      
      // Set defaults for required fields
      if (!diagnosticData.extraction_method) diagnosticData.extraction_method = 'failed';
      if (!diagnosticData.text_length) diagnosticData.text_length = 0;
      if (!diagnosticData.word_count) diagnosticData.word_count = 0;
      if (!diagnosticData.quality_score) diagnosticData.quality_score = 'failed';
      if (diagnosticData.validation_passed === undefined) diagnosticData.validation_passed = false;
      
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { error: logError } = await supabase
        .from('document_extraction_diagnostics')
        .insert(diagnosticData);
      
      if (logError) {
        console.error('Failed to log error diagnostics:', logError);
      }
    }
    
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
    // Import pdf-parse from esm.sh (Deno-compatible CDN)
    const pdfParse = (await import("https://esm.sh/pdf-parse@1.1.1")).default;
    
    // Convert Uint8Array to Buffer for pdf-parse
    const buffer = new Uint8Array(pdfData);
    
    // Extract text using pdf-parse
    const pdfData_parsed = await pdfParse(buffer);
    
    const extractedText = pdfData_parsed.text;
    const pageCount = pdfData_parsed.numpages;
    
    console.log(`📄 Extracted ${extractedText.length} characters from ${pageCount} pages`);
    
    // Don't fail immediately for short text - let validation handle it
    if (extractedText.length < 100) {
      console.warn('⚠️ Extracted text is suspiciously short. PDF might be scanned/image-based.');
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

// OCR fallback for scanned/image-based PDFs
async function performOCR(pdfData: Uint8Array): Promise<string> {
  console.log('🔍 Starting OCR extraction...');
  
  try {
    // Note: This is a placeholder for OCR functionality
    // In production, you would:
    // 1. Convert PDF pages to images using pdf.js
    // 2. Use Tesseract.js for client-side OCR, OR
    // 3. Call a cloud OCR service (Google Vision API, AWS Textract, etc.)
    
    // For now, return a message indicating OCR is needed
    // This will trigger the validation to fail, but we'll log it properly
    console.warn('⚠️ OCR not yet implemented. Would use Tesseract.js or cloud OCR service.');
    
    // Placeholder: In real implementation, this would return OCR'd text
    return 'OCR extraction not yet implemented. Please use text-based PDFs or implement OCR service.';
    
  } catch (error: any) {
    console.error('❌ OCR error:', error);
    throw new Error(`OCR failed: ${error.message}`);
  }
}
