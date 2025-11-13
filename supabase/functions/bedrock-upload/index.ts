import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Authenticate
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error('Unauthorized');

    // 2. Parse request
    const { family_id, student_id, file_name, file_data_base64 } = await req.json();
    
    if (!family_id || !file_name || !file_data_base64) {
      throw new Error('Missing required fields');
    }

    // 3. Upload file to storage
    const timestamp = Date.now();
    const filePath = `${family_id}/${timestamp}_${file_name}`;
    const fileBuffer = Uint8Array.from(atob(file_data_base64), c => c.charCodeAt(0));
    
    const { error: uploadError } = await supabase.storage
      .from('bedrock-storage')
      .upload(filePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Storage upload failed:', uploadError);
      throw new Error('File upload failed');
    }

    console.log(`✅ File uploaded to: ${filePath}`);

    // 4. Generate signed URL (1 hour expiration)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('bedrock-storage')
      .createSignedUrl(filePath, 3600);
    
    if (signedUrlError || !signedUrlData) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      console.error('Signed URL creation failed:', signedUrlError);
      throw new Error('Failed to create file access URL');
    }

    // 5. Extract text using Lovable AI (vision model with signed URL)
    console.log('🔍 Calling Lovable AI for text extraction...');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract ALL text from this document. Return ONLY the extracted text with no additional commentary or formatting.'
              },
              {
                type: 'image_url',
                image_url: { url: signedUrlData.signedUrl }
              }
            ]
          }
        ]
      })
    });

    if (!aiResponse.ok) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      
      const errorText = await aiResponse.text();
      console.error('AI extraction failed:', aiResponse.status, errorText);
      throw new Error(`Text extraction failed: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    const extractedContent = aiData.choices?.[0]?.message?.content || '';
    
    if (extractedContent.length < 50) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      throw new Error('Extracted text is too short. File may be corrupted or empty.');
    }

    console.log(`✅ Extracted ${extractedContent.length} characters of text`);

    // 6. Create database record WITH extracted content
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

    console.log(`✅ Document record created: ${document.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        document,
        extracted_length: extractedContent.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Upload failed:', error);
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
