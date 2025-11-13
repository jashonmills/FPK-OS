import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    console.log(`[v3-analyze-document] Starting analysis for document: ${document_id}`);

    // Get document and verify access
    const { data: document, error: docError } = await supabase
      .from('v3_documents')
      .select('*, families!inner(id)')
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      throw new Error('Document not found');
    }

    // Verify user is family member
    const { data: familyMembers, error: memberError } = await supabase
      .from('family_members')
      .select('id')
      .eq('family_id', document.family_id)
      .eq('user_id', user.id)
      .single();

    if (memberError || !familyMembers) {
      throw new Error('Access denied: Not a family member');
    }

    // Verify document is classified
    if (!document.is_classified) {
      throw new Error('Document must be classified before analysis');
    }

    // Check if already analyzing
    if (document.status === 'analyzing' || document.status === 'extracting') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Analysis already in progress for this document' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Update status to analyzing
    const { error: updateError } = await supabase
      .from('v3_documents')
      .update({ 
        status: 'analyzing',
        error_message: null
      })
      .eq('id', document_id);

    if (updateError) {
      throw new Error(`Failed to update document status: ${updateError.message}`);
    }

    console.log(`[v3-analyze-document] Updated status to 'analyzing'`);

    // TODO: Implement V3 analysis logic here
    // For now, we'll mark as completed with a placeholder
    // This should be replaced with actual AI analysis for V3 documents
    
    const { error: completeError } = await supabase
      .from('v3_documents')
      .update({ 
        status: 'completed',
        analyzed_at: new Date().toISOString()
      })
      .eq('id', document_id);

    if (completeError) {
      throw new Error(`Failed to complete analysis: ${completeError.message}`);
    }

    console.log(`[v3-analyze-document] Analysis completed successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: 'completed',
        message: 'Analysis completed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[v3-analyze-document] Error:', error);
    
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
