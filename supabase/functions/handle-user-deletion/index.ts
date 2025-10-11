import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user is authenticated and is an admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: userRole } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!userRole) {
      throw new Error('Admin access required');
    }

    // Get the userId to delete from request body
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error('userId is required');
    }

    console.log(`[handle-user-deletion] Admin ${user.email} requesting deletion of user: ${userId}`);

    // Delete user data in correct order (respecting foreign key constraints)
    // Order matters! Delete child records before parent records

    // 1. Delete user-specific data tables (in correct order)
    const tablesToDelete = [
      // XP and Badges (delete user_badges first)
      'user_badges',
      'achievements',
      'user_xp',
      'xp_events',
      'xp_transactions',
      
      // Quiz and Gamification
      'book_quiz_sessions',
      'user_streaks',
      
      // Learning data (child tables first)
      'attempt_answers',
      'learning_attempts',
      'interactive_lesson_analytics',
      'interactive_course_enrollments',
      'enrollments',
      'course_progress',
      'student_course_assignments',
      
      // Study and reading sessions
      'daily_activities', // Must delete before auth.users
      'study_sessions',
      'reading_sessions',
      'slide_analytics',
      'behavioral_analytics',
      
      // Goals and plans
      'daily_goals',
      'goal_progress',
      'study_plans',
      
      // Chat and AI
      'chat_messages', // Must delete before chat_sessions
      'chat_sessions',
      'conversation_memory',
      'ai_outputs',
      'ai_recommendations',
      'ai_inbox',
      
      // Analytics
      'activity_log',
      'analytics_metrics',
      'anomaly_alerts',
      'adaptive_learning_paths',
      
      // SCORM
      'scorm_runtime',
      'scorm_enrollments',
      
      // IEP and parent data
      'iep_goals',
      'iep_services',
      'iep_accommodations',
      'ieps',
      'parent_iep_sessions',
      
      // Organization memberships
      'org_group_members',
      'org_members',
      
      // Student-specific
      'org_students', // Uses linked_user_id
      'student_profiles',
      
      // Course-related
      'course_collections',
      'course_collection_items',
      'course_duplicates',
      
      // Feedback and support
      'beta_feedback',
      'contact_submissions',
      
      // User consent and audit
      'user_consent',
      'data_subject_requests',
      'audit_log',
      'audit_logs',
      
      // Subscriptions and payments
      'coupon_redemptions',
      'subscribers',
      'payments',
      
      // User roles (delete before profile)
      'user_roles',
      
      // Profile (delete last)
      'profiles'
    ];

    let deletedCounts: Record<string, number> = {};

    for (const table of tablesToDelete) {
      try {
        // Determine the column to use for deletion
        let deleteColumn = 'user_id';
        
        // Special cases for tables with different column names
        if (table === 'chat_messages') {
          // Delete messages from user's chat sessions
          const { data: sessions } = await supabaseClient
            .from('chat_sessions')
            .select('id')
            .eq('user_id', userId);
          
          if (sessions && sessions.length > 0) {
            const sessionIds = sessions.map(s => s.id);
            const { error } = await supabaseClient
              .from('chat_messages')
              .delete()
              .in('session_id', sessionIds);
            
            if (!error) {
              deletedCounts[table] = sessions.length;
            }
          }
          continue;
        } else if (table === 'org_students') {
          deleteColumn = 'linked_user_id';
        } else if (table === 'profiles') {
          deleteColumn = 'id';
        } else if (table === 'contact_submissions' || table === 'beta_feedback') {
          // These tables have nullable user_id
          deleteColumn = 'user_id';
        } else if (table === 'audit_log' || table === 'audit_logs') {
          // Delete both user_id and target_user_id records
          const { count: count1 } = await supabaseClient
            .from(table)
            .delete()
            .eq('user_id', userId)
            .select('*', { count: 'exact', head: true });
          
          const { count: count2 } = await supabaseClient
            .from(table)
            .delete()
            .eq('target_user_id', userId)
            .select('*', { count: 'exact', head: true });
          
          deletedCounts[table] = (count1 || 0) + (count2 || 0);
          continue;
        }

        const { count, error } = await supabaseClient
          .from(table)
          .delete()
          .eq(deleteColumn, userId)
          .select('*', { count: 'exact', head: true });

        if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist or no rows
          console.warn(`Warning deleting from ${table}:`, error);
        } else if (count && count > 0) {
          deletedCounts[table] = count;
          console.log(`Deleted ${count} records from ${table}`);
        }
      } catch (err) {
        console.warn(`Error deleting from ${table}:`, err);
        // Continue with other tables even if one fails
      }
    }

    // Finally, delete the auth user (hard delete by default)
    console.log(`Deleting auth user: ${userId}`);
    const { error: deleteAuthError } = await supabaseClient.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      console.error('Error deleting auth user:', deleteAuthError);
      console.error('Error details:', JSON.stringify(deleteAuthError, null, 2));
      throw new Error(`Failed to delete auth user: ${deleteAuthError.message}`);
    }

    console.log(`Successfully deleted user ${userId}. Records deleted:`, deletedCounts);

    // Log the deletion for audit purposes
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action_type: 'user_deletion',
        resource_type: 'user',
        resource_id: userId,
        details: {
          deleted_by: user.email,
          deleted_records: deletedCounts,
          timestamp: new Date().toISOString()
        },
        status: 'success'
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User and all associated data deleted successfully',
        deletedRecords: deletedCounts
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('[handle-user-deletion] Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to delete user'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
