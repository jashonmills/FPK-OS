import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationResult {
  quality: 'excellent' | 'good' | 'poor' | 'failed';
  reason: string;
  passedValidation: boolean;
}

function extractRelativePath(fullPath: string): string {
  // Handle both formats:
  // 1. Full URL: "https://.../storage/v1/object/public/family-documents/path/to/file.pdf"
  // 2. Relative: "path/to/file.pdf"
  
  const bucketPrefix = '/public/family-documents/';
  const bucketIndex = fullPath.indexOf(bucketPrefix);
  
  if (bucketIndex !== -1) {
    return fullPath.substring(bucketIndex + bucketPrefix.length);
  }
  
  // Already relative
  return fullPath;
}

function validateExtraction(text: string): ValidationResult {
  const length = text.length;
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  
  if (length < 50) {
    return { quality: 'failed', reason: 'Too short (< 50 chars)', passedValidation: false };
  }
  
  if (wordCount < 10) {
    return { quality: 'poor', reason: 'Too few words (< 10)', passedValidation: false };
  }
  
  if (text.startsWith('Document uploaded:')) {
    return { quality: 'failed', reason: 'Placeholder content detected', passedValidation: false };
  }
  
  const keywords = [
    'iep', 'individualized', 'education', 'goal', 'objective', 
    'behavioral', 'incident', 'log', 'session', 'student',
    'date', 'time', 'observation', 'progress', 'skill'
  ];
  
  const lowerText = text.toLowerCase();
  const keywordCount = keywords.filter(kw => lowerText.includes(kw)).length;
  
  if (keywordCount >= 5) {
    return { quality: 'excellent', reason: `${keywordCount} keywords found, ${wordCount} words`, passedValidation: true };
  } else if (keywordCount >= 2) {
    return { quality: 'good', reason: `${keywordCount} keywords found, ${wordCount} words`, passedValidation: true };
  } else {
    return { quality: 'poor', reason: `Only ${keywordCount} keywords found`, passedValidation: true };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { document_id } = await req.json();
    console.log('📄 Extracting text for document:', document_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      console.error('Document not found:', docError);
      throw new Error('Document not found');
    }

    // Extract relative path from full URL
    const relativePath = extractRelativePath(document.file_path);
    console.log('📥 Downloading PDF from storage:', {
      original: document.file_path,
      relative: relativePath
    });
    const startTime = Date.now();

    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('family-documents')
      .download(relativePath);

    if (downloadError || !fileData) {
      console.error('Failed to download PDF:', {
        error: downloadError,
        originalPath: document.file_path,
        relativePath: relativePath,
        bucket: 'family-documents'
      });
      throw new Error(`Failed to download PDF from storage: ${downloadError?.message || 'Unknown error'}`);
    }

    const pdfBuffer = await fileData.arrayBuffer();
    const pdfData = new Uint8Array(pdfBuffer);

    console.log('🔍 Extracting text from PDF...');
    let extractedText = '';
    let extractionMethod = 'pdf-parse';
    const errors: string[] = [];

    try {
      extractedText = await extractPdfText(pdfData);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Standard PDF extraction failed:', error);
      errors.push(`Standard extraction failed: ${errMsg}`);
      
      console.log('📸 Attempting OCR fallback...');
      try {
        extractedText = await performOCR(pdfData);
        extractionMethod = 'ocr-fallback';
      } catch (ocrError) {
        const ocrErrMsg = ocrError instanceof Error ? ocrError.message : 'Unknown error';
        console.error('OCR fallback failed:', ocrError);
        errors.push(`OCR fallback failed: ${ocrErrMsg}`);
        throw new Error('Both standard and OCR extraction failed');
      }
    }

    const processingTime = Date.now() - startTime;
    console.log(`✅ Extracted ${extractedText.length} characters in ${processingTime}ms`);

    const validation = validateExtraction(extractedText);
    console.log(`📊 Quality: ${validation.quality} - ${validation.reason}`);

    if (!validation.passedValidation) {
      errors.push(validation.reason);
      throw new Error(`Extraction validation failed: ${validation.reason}`);
    }

    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const { error: updateError } = await supabase
      .from('documents')
      .update({ 
        extracted_content: cleanedText,
        updated_at: new Date().toISOString()
      })
      .eq('id', document_id);

    if (updateError) {
      console.error('Failed to update document:', updateError);
      throw new Error('Failed to save extracted content');
    }

    const { error: diagError } = await supabase
      .from('document_extraction_diagnostics')
      .insert({
        document_id,
        family_id: document.family_id,
        extraction_method: extractionMethod,
        text_length: cleanedText.length,
        word_count: cleanedText.split(/\s+/).length,
        quality_score: validation.quality,
        validation_passed: validation.passedValidation,
        validation_reason: validation.reason,
        processing_time_ms: processingTime,
        errors: errors.length > 0 ? errors : null
      });

    if (diagError) {
      console.warn('Failed to log diagnostics:', diagError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        document_id,
        text_length: cleanedText.length,
        word_count: cleanedText.split(/\s+/).length,
        quality: validation.quality,
        extraction_method: extractionMethod,
        processing_time_ms: processingTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in extract-document-text:', error);
    return new Response(
      JSON.stringify({ error: errMsg }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function extractPdfText(pdfData: Uint8Array): Promise<string> {
  // Using pdfjs-dist for PDF text extraction
  const pdfjsLib = await import('https://esm.sh/pdfjs-dist@4.0.379/legacy/build/pdf.mjs');
  
  // Load the PDF document
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  
  // Extract text from each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  // Clean up text
  const cleanedText = fullText
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim();
  
  return cleanedText;
}

async function performOCR(pdfData: Uint8Array): Promise<string> {
  console.warn('OCR not yet implemented');
  throw new Error('OCR fallback not yet implemented. Consider using Tesseract.js or cloud OCR service.');
}
