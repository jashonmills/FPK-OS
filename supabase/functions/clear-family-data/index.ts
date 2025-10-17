import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

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

    // Get the authenticated user
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

    // Verify user is a member of this family
    const { data: membership, error: memberError } = await supabase
      .from('family_members')
      .select('role')
      .eq('family_id', family_id)
      .eq('user_id', user.id)
      .single();

    if (memberError || !membership || membership.role !== 'owner') {
      throw new Error('Only family owners can clear family data');
    }

    console.log(`🧹 Clearing all data for family: ${family_id}`);

    const results = {
      documents_deleted: 0,
      document_metrics_deleted: 0,
      ai_insights_deleted: 0,
      progress_tracking_deleted: 0,
      document_chart_mapping_deleted: 0,
      document_analysis_status_deleted: 0,
      analysis_jobs_deleted: 0,
      educator_logs_deleted: 0,
      parent_logs_deleted: 0,
      incident_logs_deleted: 0,
      sleep_records_deleted: 0,
      goals_deleted: 0,
      chat_conversations_deleted: 0,
      family_data_embeddings_deleted: 0,
      errors: [] as string[],
    };

    // Delete in correct order (children before parents)
    
    // 1. Get conversation IDs first
    const { data: convos } = await supabase
      .from('chat_conversations')
      .select('id')
      .eq('family_id', family_id);
    
    const convoIds = convos?.map(c => c.id) || [];
    
    // Delete chat messages
    if (convoIds.length > 0) {
      const { error: chatMsgError } = await supabase
        .from('chat_messages')
        .delete()
        .in('conversation_id', convoIds);
      if (chatMsgError) results.errors.push(`chat_messages: ${chatMsgError.message}`);
    }

    // 2. Delete chat conversations
    const { data: deletedChats, error: chatError } = await supabase
      .from('chat_conversations')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!chatError) results.chat_conversations_deleted = deletedChats?.length || 0;
    else results.errors.push(`chat_conversations: ${chatError.message}`);

    // 3. Delete family data embeddings
    const { data: deletedEmbeddings, error: embeddingError } = await supabase
      .from('family_data_embeddings')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!embeddingError) results.family_data_embeddings_deleted = deletedEmbeddings?.length || 0;
    else results.errors.push(`family_data_embeddings: ${embeddingError.message}`);

    // 4. Delete document-related data
    const { data: deletedChartMapping, error: chartMappingError } = await supabase
      .from('document_chart_mapping')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!chartMappingError) results.document_chart_mapping_deleted = deletedChartMapping?.length || 0;
    else results.errors.push(`document_chart_mapping: ${chartMappingError.message}`);

    const { data: deletedAnalysisStatus, error: analysisStatusError } = await supabase
      .from('document_analysis_status')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!analysisStatusError) results.document_analysis_status_deleted = deletedAnalysisStatus?.length || 0;
    else results.errors.push(`document_analysis_status: ${analysisStatusError.message}`);

    const { data: deletedAnalysisJobs, error: analysisJobsError } = await supabase
      .from('analysis_jobs')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!analysisJobsError) results.analysis_jobs_deleted = deletedAnalysisJobs?.length || 0;
    else results.errors.push(`analysis_jobs: ${analysisJobsError.message}`);

    const { data: deletedMetrics, error: metricsError } = await supabase
      .from('document_metrics')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!metricsError) results.document_metrics_deleted = deletedMetrics?.length || 0;
    else results.errors.push(`document_metrics: ${metricsError.message}`);

    const { data: deletedInsights, error: insightsError } = await supabase
      .from('ai_insights')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!insightsError) results.ai_insights_deleted = deletedInsights?.length || 0;
    else results.errors.push(`ai_insights: ${insightsError.message}`);

    const { data: deletedProgress, error: progressError } = await supabase
      .from('progress_tracking')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!progressError) results.progress_tracking_deleted = deletedProgress?.length || 0;
    else results.errors.push(`progress_tracking: ${progressError.message}`);

    // 5. Delete storage files and documents
    const { data: docs, error: docsQueryError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('family_id', family_id);

    if (!docsQueryError && docs && docs.length > 0) {
      // Delete files from storage
      const filePaths = docs.map(doc => doc.file_path);
      const { error: storageError } = await supabase.storage
        .from('family-documents')
        .remove(filePaths);
      if (storageError) results.errors.push(`storage: ${storageError.message}`);
    }

    const { data: deletedDocs, error: docsError } = await supabase
      .from('documents')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!docsError) results.documents_deleted = deletedDocs?.length || 0;
    else results.errors.push(`documents: ${docsError.message}`);

    // 6. Delete logs
    const { data: deletedEducator, error: educatorError } = await supabase
      .from('educator_logs')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!educatorError) results.educator_logs_deleted = deletedEducator?.length || 0;
    else results.errors.push(`educator_logs: ${educatorError.message}`);

    const { data: deletedParent, error: parentError } = await supabase
      .from('parent_logs')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!parentError) results.parent_logs_deleted = deletedParent?.length || 0;
    else results.errors.push(`parent_logs: ${parentError.message}`);

    const { data: deletedIncident, error: incidentError } = await supabase
      .from('incident_logs')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!incidentError) results.incident_logs_deleted = deletedIncident?.length || 0;
    else results.errors.push(`incident_logs: ${incidentError.message}`);

    const { data: deletedSleep, error: sleepError } = await supabase
      .from('sleep_records')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!sleepError) results.sleep_records_deleted = deletedSleep?.length || 0;
    else results.errors.push(`sleep_records: ${sleepError.message}`);

    // 7. Delete goals
    const { data: deletedGoals, error: goalsError } = await supabase
      .from('goals')
      .delete()
      .eq('family_id', family_id)
      .select('id');
    if (!goalsError) results.goals_deleted = deletedGoals?.length || 0;
    else results.errors.push(`goals: ${goalsError.message}`);

    console.log('✅ Family data cleared:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'All family data has been cleared successfully',
        results,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Error clearing family data:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
