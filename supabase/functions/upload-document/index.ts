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
    
    // Note: Text extraction temporarily disabled - will be added via separate analysis function
    const extractedContent = `Document uploaded: ${file.name} (${Math.round(file.size / 1024)} KB)`;

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
          extraction_quality: 'pending',
          note: 'Text extraction will be performed during analysis'
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

    // Check if AI analysis pipeline is enabled
    const { data: aiPipelineFlag } = await supabase
      .from('feature_flags')
      .select('is_enabled')
      .eq('flag_key', 'enable-ai-analysis-pipeline')
      .single();

    if (aiPipelineFlag?.is_enabled) {
      console.log('🔄 AI analysis pipeline enabled - triggering extraction and analysis...');
      
      const processPipeline = (async () => {
        const maxRetries = 3;
        let retryCount = 0;
        
        // Check which extraction engine to use
        const { data: extractionFlag } = await supabase
          .from('feature_flags')
          .select('is_enabled')
          .eq('flag_key', 'use-document-ai-extraction')
          .single();
        
        const extractionFunction = extractionFlag?.is_enabled
          ? 'extract-text-with-document-ai'
          : 'extract-document-text';
        
        // Step 1: Extract text from PDF
        console.log(`📄 Step 1: Extracting text using ${extractionFunction}...`);
        while (retryCount < maxRetries) {
          try {
            const { data: extractData, error: extractError } = await supabase.functions.invoke(
              extractionFunction,
              { body: { document_id: documentData.id } }
            );
            
            if (extractError) {
              throw extractError;
            }
            
            console.log('✅ Text extraction completed:', extractData);
            break;
          } catch (error) {
            retryCount++;
            console.error(`Extraction attempt ${retryCount} failed:`, error);
            
            if (retryCount >= maxRetries) {
              console.error('❌ Text extraction failed after max retries');
              return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
          }
        }
        
        // Step 2: Analyze document with real content
        console.log('🧠 Step 2: Analyzing document...');
        retryCount = 0;
        
        while (retryCount < maxRetries) {
          try {
            const { error: analyzeError } = await supabase.functions.invoke(
              'analyze-document',
              { body: { document_id: documentData.id } }
            );
            
            if (analyzeError) {
              throw analyzeError;
            }
            
            console.log('✅ Analysis completed successfully');
            break;
          } catch (error) {
            retryCount++;
            console.error(`Analysis attempt ${retryCount} failed:`, error);
            
            if (retryCount >= maxRetries) {
              console.error('❌ Analysis failed after max retries');
              return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
          }
        }
      })();

      // Pipeline runs in background
    } else {
      console.log('✅ Document uploaded successfully (AI analysis pipeline disabled)');
    }

    return new Response(
      JSON.stringify({
        success: true,
        document: documentData
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