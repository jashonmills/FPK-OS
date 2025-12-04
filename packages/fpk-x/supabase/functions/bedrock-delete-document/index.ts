/**
 * bedrock-delete-document
 * 
 * Permanently deletes a document from both the database and storage
 */
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

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    if (authError || !user) throw new Error('Unauthorized');

    // Parse request
    const { document_id } = await req.json();
    if (!document_id) throw new Error('Missing document_id');

    console.log(`🗑️ Deleting document: ${document_id}`);

    // Fetch document to get file path and verify ownership
    const { data: document, error: fetchError } = await supabase
      .from('bedrock_documents')
      .select('file_path, family_id')
      .eq('id', document_id)
      .single();

    if (fetchError || !document) {
      throw new Error('Document not found');
    }

    console.log(`📁 File path: ${document.file_path}`);

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('bedrock-storage')
      .remove([document.file_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      throw new Error('Failed to delete file from storage');
    }

    console.log('✅ File deleted from storage');

    // Delete from database
    const { error: dbError } = await supabase
      .from('bedrock_documents')
      .delete()
      .eq('id', document_id);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      throw new Error('Failed to delete document record');
    }

    console.log('✅ Document record deleted from database');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Document permanently deleted'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('❌ Delete failed:', error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Delete failed'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
