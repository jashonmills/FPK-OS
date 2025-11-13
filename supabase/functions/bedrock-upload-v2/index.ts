/**
 * VERSION: 3.0.0-ASYNC-BATCH-PROCESSOR
 * 
 * Async batch processing for Google Document AI - handles up to 500-page documents
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAccessToken } from "../_shared/google-document-ai-auth.ts";

const VERSION = "3.0.0-ASYNC-BATCH-PROCESSOR";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Intelligent Router: Maps document types to specialized processors
const PROCESSOR_MAP: Record<string, string> = {
  'other': 'projects/fpkuniversity/locations/us/processors/9a2c8ed98e2c75bc',
  'form': 'projects/fpkuniversity/locations/us/processors/67a01c2d52e6af65',
  'layout': 'projects/fpkuniversity/locations/us/processors/cb205a77bf9a675e',
  'iep': 'projects/fpkuniversity/locations/us/processors/e0dcf69b05bd5c40'
};

serve(async (req) => {
  console.log(`🚀 [${VERSION}] bedrock-upload-v2 invoked`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    if (authError || !user) throw new Error('Unauthorized');

    console.log(`✓ User authenticated: ${user.id}`);

    // Parse request body
    const { fileData, fileName, fileType, category, familyId, studentId, documentDate } = await req.json();
    
    if (!fileData || !fileName || !familyId) {
      throw new Error('Missing required fields: fileData, fileName, or familyId');
    }

    console.log(`📄 Processing: ${fileName}`);
    console.log(`👥 Family: ${familyId}, Student: ${studentId || 'none'}`);

    // Decode file
    const fileBytes = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
    const fileSizeKb = Math.round(fileBytes.length / 1024);
    
    console.log(`📊 File size: ${fileSizeKb} KB (${(fileSizeKb / 1024).toFixed(2)} MB)`);

    // Upload to storage
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${familyId}/${timestamp}_${sanitizedFileName}`;

    console.log(`💾 Uploading to storage: ${storagePath}`);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('bedrock-storage')
      .upload(storagePath, fileBytes, {
        contentType: 'application/pdf',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Storage upload failed:', uploadError);
      throw new Error('File upload failed');
    }

    timings.upload = Date.now() - uploadStart;
    console.log(`✅ File uploaded to: ${filePath} (${timings.upload}ms)`);

    // 4. Extract text using Google Document AI
    console.log(`🔍 VERSION ${VERSION}: Calling Google Document AI with IMAGELESS MODE (imagelessMode: true)...`);

    const credsJson = Deno.env.get('GOOGLE_DOC_AI_CREDS');
    const processorId = Deno.env.get('GOOGLE_DOCUMENT_AI_PROCESSOR_ID');

    if (!credsJson || !processorId) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      throw new Error('Google Document AI credentials not configured');
    }

    // Validate credentials format BEFORE parsing
    if (!credsJson.trim().startsWith('{')) {
      console.error('❌ GOOGLE_DOCUMENT_AI_CREDENTIALS is not JSON format');
      console.error('Received value starts with:', credsJson.substring(0, 20));
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      throw new Error('Invalid credentials format: Expected Google Service Account JSON, got raw string. Please update the GOOGLE_DOCUMENT_AI_CREDENTIALS secret with the full service account JSON file contents.');
    }

    let credentials;
    try {
      credentials = JSON.parse(credsJson);
      
      // Validate required fields
      if (!credentials.private_key || !credentials.client_email || !credentials.project_id) {
        throw new Error('Service account JSON missing required fields (private_key, client_email, project_id)');
      }
    } catch (e) {
      console.error('❌ Failed to parse Google credentials:', e.message);
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      throw new Error(`Invalid Google credentials: ${e.message}`);
    }

    console.log('🔐 Authenticating with Google Document AI...');
    console.log('📧 Using service account:', credentials.client_email);
    const authStart = Date.now();
    const accessToken = await getAccessToken(credentials);
    timings.auth = Date.now() - authStart;
    console.log(`✅ Authentication successful (${timings.auth}ms)`);

    // Smart chunking: Check if we need to split the PDF
    console.log('📄 Loading PDF to check page count...');
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const totalPages = pdfDoc.getPageCount();
    
    console.log(`📊 Document has ${totalPages} pages`);
    
    let extractedContent = '';
    let totalPageCount = 0;
    const ocrStart = Date.now();
    
    if (totalPages <= 25) {
      // Small document: process normally
      console.log('✅ Document is within single-chunk limit (≤25 pages). Processing as single chunk...');
      const result = await processDocumentChunk(fileBuffer, 0, 1, credentials, processorId, accessToken);
      extractedContent = result.text;
      totalPageCount = result.pageCount;
    } else {
      // Large document: split into chunks
      const CHUNK_SIZE = 25;
      const totalChunks = Math.ceil(totalPages / CHUNK_SIZE);
      
      console.log(`📚 Large document detected (${totalPages} pages). Splitting into ${totalChunks} chunks of ~${CHUNK_SIZE} pages each...`);
      
      const chunkResults: { text: string; index: number }[] = [];
      
      for (let i = 0; i < totalChunks; i++) {
        const startPage = i * CHUNK_SIZE;
        const endPage = Math.min((i + 1) * CHUNK_SIZE, totalPages);
        
        console.log(`🔪 Creating chunk ${i + 1}/${totalChunks}: pages ${startPage + 1}-${endPage}...`);
        
        // Create a new PDF with just these pages
        const chunkDoc = await PDFDocument.create();
        const copiedPages = await chunkDoc.copyPages(pdfDoc, Array.from({ length: endPage - startPage }, (_, idx) => startPage + idx));
        copiedPages.forEach(page => chunkDoc.addPage(page));
        
        const chunkBytes = await chunkDoc.save();
        const chunkBuffer = new Uint8Array(chunkBytes);
        
        console.log(`📦 Chunk ${i + 1}/${totalChunks} created: ${chunkBuffer.length} bytes, ${endPage - startPage} pages`);
        
        // Process this chunk
        const result = await processDocumentChunk(chunkBuffer, i, totalChunks, credentials, processorId, accessToken);
        chunkResults.push({ text: result.text, index: i });
        totalPageCount += result.pageCount;
      }
      
      // Combine all chunks in order
      console.log('🔗 Combining all chunks...');
      chunkResults.sort((a, b) => a.index - b.index);
      extractedContent = chunkResults.map(r => r.text).join('\n\n--- PAGE BREAK ---\n\n');
      console.log(`✅ Combined ${chunkResults.length} chunks into ${extractedContent.length} total characters`);
    }
    
    timings.ocr = Date.now() - ocrStart;
    
    console.log(`📊 Total pages processed: ${totalPageCount}`);
    console.log(`✅ Extracted ${extractedContent.length} characters of text (${timings.ocr}ms, ${Math.round(extractedContent.length / (timings.ocr / 1000))} chars/sec)`);
    
    if (extractedContent.length < 50) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      throw new Error('Extracted text is too short. File may be corrupted or empty.');
    }

    console.log(`✅ Extracted ${extractedContent.length} characters of text (${timings.ocr}ms, ${Math.round(extractedContent.length / (timings.ocr / 1000))} chars/sec)`);

    // 6. Create database record WITH extracted content
    const dbStart = Date.now();
    const { data: document, error: dbError } = await supabase
      .from('bedrock_documents')
      .insert({
        family_id,
        student_id,
        file_name,
        file_path: filePath,
        file_size_kb: Math.round(fileBuffer.length / 1024),
        extracted_content: extractedContent,
        status: 'uploaded'  // Ready for user to classify
      })
      .select()
      .single();

    if (dbError) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      console.error('Database insert failed:', dbError);
      throw new Error('Failed to create document record');
    }

    timings.database = Date.now() - dbStart;
    console.log(`✅ Document record created: ${document.id} (${timings.database}ms)`);

    // Processing summary
    const totalTime = Date.now() - startTime;
    console.log('✅ Processing complete:', {
      documentId: document.id,
      fileName: file_name,
      pageCount: pageCount,
      fileSizeKB: Math.round(fileBuffer.length / 1024),
      extractedChars: extractedContent.length,
      timings: {
        total: totalTime,
        upload: timings.upload,
        auth: timings.auth,
        ocr: timings.ocr,
        database: timings.database
      },
      ocrSpeed: `${Math.round(extractedContent.length / (timings.ocr / 1000))} chars/sec`
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        document,
        extracted_length: extractedContent.length,
        page_count: pageCount,
        processing_time_ms: totalTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    const totalTime = Date.now() - startTime;
    
    // Determine which phase failed
    let failedPhase = 'initialization';
    if (timings.upload > 0 && timings.auth === 0) failedPhase = 'authentication';
    else if (timings.auth > 0 && timings.ocr === 0) failedPhase = 'document_ai_processing';
    else if (timings.ocr > 0 && timings.database === 0) failedPhase = 'database_insert';
    else if (timings.upload > 0) failedPhase = 'storage_upload';
    
    console.error('❌ Upload failed:', {
      error: error.message,
      failedPhase: failedPhase,
      failedAfter: totalTime,
      completedTimings: timings
    });
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Upload failed'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
