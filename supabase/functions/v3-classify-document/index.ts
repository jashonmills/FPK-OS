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

    const { document_id, category } = await req.json();

    if (!document_id || !category) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: document_id, category' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Classifying document ${document_id} as ${category} by user ${user.id}`);

    // Get the document to verify family access
    const { data: document, error: docError } = await supabase
      .from('v3_documents')
      .select('family_id')
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

    // Update the document with classification
    const { data: updated, error: updateError } = await supabase
      .from('v3_documents')
      .update({
        category,
        is_classified: true,
        classified_at: new Date().toISOString(),
        classified_by: user.id
      })
      .eq('id', document_id)
      .eq('family_id', document.family_id)
      .select()
      .single();

    if (updateError) {
      console.error('Classification error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to classify document', details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully classified document ${document_id} as ${category}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        document: updated,
        message: `Document classified as ${category}` 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in v3-classify-document:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});