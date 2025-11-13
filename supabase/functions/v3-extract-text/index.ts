import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract text from PDF using Lovable AI vision model
async function extractTextWithVision(fileUrl: string): Promise<string> {
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!lovableApiKey) {
    throw new Error('LOVABLE_API_KEY not configured');
  }

  console.log('[v3-extract-text] Calling Lovable AI vision API for OCR');

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
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
              text: 'Extract all text content from this document. Return only the extracted text, preserving structure and formatting where possible. Include all visible text, tables, and important information.'
            },
            {
              type: 'image_url',
              image_url: {
                url: fileUrl
              }
            }
          ]
        }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[v3-extract-text] Vision API error:', response.status, errorText);
    throw new Error(`Vision API failed: ${errorText}`);
  }

  const data = await response.json();
  const extractedText = data.choices?.[0]?.message?.content;

  if (!extractedText) {
    throw new Error('No text extracted from document');
  }

  return extractedText;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { document_id } = await req.json();

    if (!document_id) {
      throw new Error('Missing document_id');
    }

    console.log(`[v3-extract-text] Starting extraction for document: ${document_id}`);

    // Get document
    const { data: document, error: docError } = await supabase
      .from('v3_documents')
      .select('*')
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      console.error('[v3-extract-text] Document fetch error:', docError);
      throw new Error('Document not found');
    }

    // Verify user has access (is a family member)
    const { data: familyMembers, error: memberError } = await supabase
      .from('family_members')
      .select('id')
      .eq('family_id', document.family_id)
      .eq('user_id', user.id)
      .single();

    if (memberError || !familyMembers) {
      throw new Error('Access denied: Not a family member');
    }

    // Check if already extracted
    if (document.extracted_content && document.extracted_content.trim().length > 50) {
      console.log('[v3-extract-text] Document already has extracted content');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Document already has extracted content',
          length: document.extracted_content.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update status to extracting
    await supabase
      .from('v3_documents')
      .update({ 
        status: 'extracting',
        error_message: null
      })
      .eq('id', document_id);

    console.log('[v3-extract-text] Status updated to extracting');

    // Get the file URL from storage
    const { data: fileData } = supabase.storage
      .from('documents')
      .getPublicUrl(document.file_path);

    const fileUrl = fileData.publicUrl;
    console.log('[v3-extract-text] File URL:', fileUrl);

    // Extract text using vision AI
    const extractedText = await extractTextWithVision(fileUrl);
    
    console.log('[v3-extract-text] Extracted text length:', extractedText.length);

    // Update document with extracted content
    const { error: updateError } = await supabase
      .from('v3_documents')
      .update({ 
        extracted_content: extractedText,
        status: 'uploaded', // Ready for classification
        error_message: null
      })
      .eq('id', document_id);

    if (updateError) {
      throw new Error(`Failed to update document: ${updateError.message}`);
    }

    console.log('[v3-extract-text] Text extraction completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Text extraction completed',
        extracted_length: extractedText.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[v3-extract-text] Error:', error);
    
    // Try to update document status to failed
    try {
      const { document_id } = await req.json().catch(() => ({}));
      if (document_id) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from('v3_documents')
          .update({ 
            status: 'failed',
            error_message: error.message || 'Text extraction failed'
          })
          .eq('id', document_id);
      }
    } catch (e) {
      console.error('[v3-extract-text] Failed to update error status:', e);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
