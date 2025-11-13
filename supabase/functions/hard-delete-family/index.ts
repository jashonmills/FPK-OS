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
    console.log('🗑️ Starting hard delete family request');

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with user's auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Get request body
    const { family_id } = await req.json();

    if (!family_id) {
      throw new Error('family_id is required');
    }

    console.log(`🔍 Verifying ownership for family ${family_id}`);

    // Verify user is owner of the family
    const { data: membership, error: memberError } = await supabaseClient
      .from('family_members')
      .select('role')
      .eq('family_id', family_id)
      .eq('user_id', user.id)
      .single();

    if (memberError || !membership || membership.role !== 'owner') {
      throw new Error('Only family owners can delete the family');
    }

    console.log('✅ Ownership verified, starting deletion process');

    // Create admin client for deletions
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let deletionSummary = {
      discussions: 0,
      queue_items: 0,
      jobs: 0,
      analysis_status: 0,
      metrics: 0,
      insights: 0,
      progress_tracking: 0,
      goals: 0,
      charts: 0,
      embeddings: 0,
      documents: 0,
      students: 0,
      members: 0,
      credits: 0,
      files_deleted: 0,
    };

    // Step 1: Collect file paths for storage deletion
    console.log('📁 Collecting file paths...');
    const { data: documents } = await supabaseAdmin
      .from('documents')
      .select('file_path')
      .eq('family_id', family_id);

    const filePaths = documents?.map(doc => doc.file_path).filter(Boolean) || [];

    // Step 2: Delete from child tables (respecting foreign keys)
    console.log('🗑️ Deleting child table data...');

    // Team discussions
    const { error: e1 } = await supabaseAdmin
      .from('team_discussions')
      .delete()
      .eq('family_id', family_id);
    if (e1) console.error('Error deleting discussions:', e1);

    // Analysis queue
    const { error: e2 } = await supabaseAdmin
      .from('analysis_queue')
      .delete()
      .eq('family_id', family_id);
    if (e2) console.error('Error deleting queue:', e2);

    // Analysis jobs
    const { error: e3 } = await supabaseAdmin
      .from('analysis_jobs')
      .delete()
      .eq('family_id', family_id);
    if (e3) console.error('Error deleting jobs:', e3);

    // Document analysis status
    const { error: e4 } = await supabaseAdmin
      .from('document_analysis_status')
      .delete()
      .eq('family_id', family_id);
    if (e4) console.error('Error deleting analysis status:', e4);

    // Document metrics
    const { error: e5 } = await supabaseAdmin
      .from('document_metrics')
      .delete()
      .eq('family_id', family_id);
    if (e5) console.error('Error deleting metrics:', e5);

    // AI insights
    const { error: e6 } = await supabaseAdmin
      .from('ai_insights')
      .delete()
      .eq('family_id', family_id);
    if (e6) console.error('Error deleting insights:', e6);

    // Progress tracking
    const { error: e7 } = await supabaseAdmin
      .from('progress_tracking')
      .delete()
      .eq('family_id', family_id);
    if (e7) console.error('Error deleting progress:', e7);

    // Goals
    const { error: e8 } = await supabaseAdmin
      .from('goals')
      .delete()
      .eq('family_id', family_id);
    if (e8) console.error('Error deleting goals:', e8);

    // Document chart mapping
    const { error: e9 } = await supabaseAdmin
      .from('document_chart_mapping')
      .delete()
      .eq('family_id', family_id);
    if (e9) console.error('Error deleting charts:', e9);

    // Family data embeddings
    const { error: e10 } = await supabaseAdmin
      .from('family_data_embeddings')
      .delete()
      .eq('family_id', family_id);
    if (e10) console.error('Error deleting embeddings:', e10);

    // Documents
    const { error: e11 } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('family_id', family_id);
    if (e11) console.error('Error deleting documents:', e11);

    // Students
    const { error: e12 } = await supabaseAdmin
      .from('students')
      .delete()
      .eq('family_id', family_id);
    if (e12) console.error('Error deleting students:', e12);

    // Family members
    const { error: e13 } = await supabaseAdmin
      .from('family_members')
      .delete()
      .eq('family_id', family_id);
    if (e13) console.error('Error deleting members:', e13);

    // AI credit balances
    const { error: e14 } = await supabaseAdmin
      .from('ai_credit_balances')
      .delete()
      .eq('family_id', family_id);
    if (e14) console.error('Error deleting credits:', e14);

    // Step 3: Delete files from storage
    console.log(`🗑️ Deleting ${filePaths.length} files from storage...`);
    if (filePaths.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('family-documents')
        .remove(filePaths);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      } else {
        deletionSummary.files_deleted = filePaths.length;
      }
    }

    // Step 4: Delete the family itself
    console.log('🗑️ Deleting family record...');
    const { error: familyError } = await supabaseAdmin
      .from('families')
      .delete()
      .eq('id', family_id);

    if (familyError) {
      throw new Error(`Failed to delete family: ${familyError.message}`);
    }

    console.log('✅ Family deletion complete');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Family and all associated data permanently deleted',
        summary: deletionSummary,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Hard delete error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
