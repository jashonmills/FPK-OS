import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client for authentication check
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify caller is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if caller is admin
    const { data: roles, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roles) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }), 
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get userId from request body
    const { userId } = await req.json();
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client with service role key for deletion operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Starting deletion process for user: ${userId}`);

    // Step 1: Delete from dependent tables in correct order
    // Start with the most dependent tables first
    
    // User activity and progress
    await adminClient.from('lesson_progress').delete().eq('user_id', userId);
    await adminClient.from('goal_progress').delete().eq('user_id', userId);
    await adminClient.from('user_xp').delete().eq('user_id', userId);
    await adminClient.from('achievements').delete().eq('user_id', userId);
    await adminClient.from('learning_attempts').delete().eq('user_id', userId);
    
    // Chat and AI related
    await adminClient.from('chat_messages').delete().in('session_id', 
      (await adminClient.from('chat_sessions').select('id').eq('user_id', userId)).data?.map(s => s.id) || []
    );
    await adminClient.from('chat_sessions').delete().eq('user_id', userId);
    await adminClient.from('conversation_memory').delete().eq('user_id', userId);
    await adminClient.from('ai_recommendations').delete().eq('user_id', userId);
    await adminClient.from('ai_inbox').delete().eq('user_id', userId);
    
    // Reading and study sessions
    await adminClient.from('reading_sessions').delete().eq('user_id', userId);
    await adminClient.from('study_sessions').delete().eq('user_id', userId);
    
    // Course related
    await adminClient.from('enrollments').delete().eq('user_id', userId);
    await adminClient.from('interactive_course_enrollments').delete().eq('user_id', userId);
    await adminClient.from('interactive_lesson_analytics').delete().eq('user_id', userId);
    await adminClient.from('course_progress').delete().eq('user_id', userId);
    
    // Goals and notes
    await adminClient.from('goals').delete().eq('user_id', userId);
    await adminClient.from('notes').delete().eq('user_id', userId);
    
    // Organization memberships
    await adminClient.from('org_members').delete().eq('user_id', userId);
    
    // Student-specific data
    await adminClient.from('org_students').delete().eq('linked_user_id', userId);
    await adminClient.from('student_profiles').delete().eq('user_id', userId);
    await adminClient.from('student_course_assignments').delete().eq('student_id', userId);
    
    // Analytics and behavioral data
    await adminClient.from('analytics_metrics').delete().eq('user_id', userId);
    await adminClient.from('behavioral_analytics').delete().eq('user_id', userId);
    await adminClient.from('slide_analytics').delete().eq('user_id', userId);
    await adminClient.from('anomaly_alerts').delete().eq('user_id', userId);
    
    // Learning paths
    await adminClient.from('adaptive_learning_paths').delete().eq('user_id', userId);
    
    // Book and quiz data
    await adminClient.from('book_quiz_sessions').delete().eq('user_id', userId);
    
    // Feedback and activity logs
    await adminClient.from('beta_feedback').delete().eq('user_id', userId);
    await adminClient.from('activity_log').delete().eq('user_id', userId);
    
    // Subscription data
    await adminClient.from('subscribers').delete().eq('user_id', userId);
    
    // User roles
    await adminClient.from('user_roles').delete().eq('user_id', userId);
    
    // Step 2: Delete profile
    const { error: profileError } = await adminClient
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) {
      console.error('Error deleting profile:', profileError);
      throw new Error(`Failed to delete profile: ${profileError.message}`);
    }

    // Step 3: Delete from auth.users (final step)
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(userId);
    
    if (deleteUserError) {
      console.error('Error deleting user from auth:', deleteUserError);
      throw new Error(`Failed to delete user from auth: ${deleteUserError.message}`);
    }

    console.log(`Successfully deleted user: ${userId}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'User successfully deleted'
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in handle-user-deletion:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred during user deletion',
        details: error.toString()
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
