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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { family_id } = await req.json();

    if (!family_id) {
      throw new Error('family_id is required');
    }

    // Verify user is owner
    const { data: membership } = await supabase
      .from('family_members')
      .select('role')
      .eq('family_id', family_id)
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.role !== 'owner') {
      throw new Error('Only family owners can cleanup data');
    }

    console.log(`🧹 Cleaning up orphaned documents for family: ${family_id}`);

    // Get all active students for this family
    const { data: activeStudents } = await supabase
      .from('students')
      .select('id')
      .eq('family_id', family_id)
      .eq('is_active', true);

    const activeStudentIds = activeStudents?.map(s => s.id) || [];
    console.log(`✅ Found ${activeStudentIds.length} active students`);

    // Find orphaned documents (documents whose student_id is not in active students)
    const { data: orphanedDocs } = await supabase
      .from('documents')
      .select('id, file_name, file_path, student_id')
      .eq('family_id', family_id)
      .not('student_id', 'in', `(${activeStudentIds.map(id => `'${id}'`).join(',')})`);

    if (!orphanedDocs || orphanedDocs.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No orphaned documents found', deleted: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🗑️ Found ${orphanedDocs.length} orphaned documents to delete`);

    const orphanedDocIds = orphanedDocs.map(d => d.id);

    // Delete related records first
    await supabase
      .from('document_analysis_status')
      .delete()
      .in('document_id', orphanedDocIds);

    await supabase
      .from('document_metrics')
      .delete()
      .in('document_id', orphanedDocIds);

    await supabase
      .from('ai_insights')
      .delete()
      .in('document_id', orphanedDocIds);

    await supabase
      .from('document_chart_mapping')
      .delete()
      .in('document_id', orphanedDocIds);

    // Delete storage files
    const filePaths = orphanedDocs.map(doc => doc.file_path);
    await supabase.storage
      .from('family-documents')
      .remove(filePaths);

    // Delete documents
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .in('id', orphanedDocIds);

    if (deleteError) throw deleteError;

    console.log(`✅ Deleted ${orphanedDocs.length} orphaned documents`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Deleted ${orphanedDocs.length} orphaned documents`,
        deleted: orphanedDocs.length,
        file_names: orphanedDocs.map(d => d.file_name)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Cleanup error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});