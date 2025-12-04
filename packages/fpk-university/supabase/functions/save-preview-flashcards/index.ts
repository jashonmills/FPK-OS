import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { uploadId } = await req.json();
    
    if (!uploadId) {
      throw new Error('Upload ID is required');
    }

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from the auth token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    console.log('🔄 Re-processing file upload to save flashcards:', uploadId);

    // Get the file upload record
    const { data: upload, error: uploadError } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('id', uploadId)
      .eq('user_id', user.id)
      .single();

    if (uploadError || !upload) {
      throw new Error('File upload not found');
    }

    // Call the process-file-flashcards function with previewMode = false
    const processResponse = await fetch(`${supabaseUrl}/functions/v1/process-file-flashcards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uploadId: upload.id,
        filePath: upload.storage_path,
        fileName: upload.file_name,
        fileType: upload.file_type,
        userId: user.id,
        previewMode: false // This will save the flashcards to database
      })
    });

    if (!processResponse.ok) {
      throw new Error('Failed to process file for flashcard saving');
    }

    const result = await processResponse.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to save flashcards');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        flashcardsGenerated: result.flashcardsGenerated,
        message: 'Flashcards saved successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error saving preview flashcards:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});