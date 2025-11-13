import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { document_id } = await req.json();

    if (!document_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: document_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Deleting document ${document_id} by user ${user.id}`);

    // Get the document to verify family access and get file path
    const { data: document, error: docError } = await supabase
      .from('v3_documents')
      .select('family_id, file_path')
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      return new Response(
        JSON.stringify({ error: 'Document not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is a family member
    const { data: membership } = await supabase
      .from('family_members')
      .select('id')
      .eq('family_id', document.family_id)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return new Response(
        JSON.stringify({ error: 'Access denied: Not a family member' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract storage path from file_path
    let storagePath = document.file_path;
    if (storagePath.includes('/storage/v1/object/public/family-documents/')) {
      storagePath = storagePath.split('/storage/v1/object/public/family-documents/')[1];
    } else if (storagePath.includes('/storage/v1/object/family-documents/')) {
      storagePath = storagePath.split('/storage/v1/object/family-documents/')[1];
    }

    console.log('Deleting file from storage:', storagePath);

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('family-documents')
      .remove([storagePath]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      // Continue with database deletion even if storage fails
    }

    // Delete associated data in order (respecting foreign key constraints)
    // 1. Delete progress tracking
    await supabase
      .from('progress_tracking')
      .delete()
      .eq('document_id', document_id)
      .eq('family_id', document.family_id);

    // 2. Delete AI insights
    await supabase
      .from('ai_insights')
      .delete()
      .eq('document_id', document_id)
      .eq('family_id', document.family_id);

    // 3. Delete document metrics
    await supabase
      .from('document_metrics')
      .delete()
      .eq('document_id', document_id)
      .eq('family_id', document.family_id);

    // 4. Delete the document record
    const { error: deleteError } = await supabase
      .from('v3_documents')
      .delete()
      .eq('id', document_id)
      .eq('family_id', document.family_id);

    if (deleteError) {
      console.error('Document deletion error:', deleteError);
      return new Response(
        JSON.stringify({ error: 'Failed to delete document', details: deleteError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully deleted document ${document_id} and associated data`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Document and associated data deleted successfully' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in v3-delete-document:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
