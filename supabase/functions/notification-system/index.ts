
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type, userId, data } = await req.json();

    let notification = {
      user_id: userId,
      type: '',
      title: '',
      message: '',
      action_url: '',
      metadata: data || {}
    };

    switch (type) {
      case 'achievement_unlocked':
        notification = {
          ...notification,
          type: 'achievement_unlocked',
          title: '🏆 Achievement Unlocked!',
          message: `Congratulations! You've earned the "${data.achievementName}" achievement.`,
          action_url: '/dashboard/goals'
        };
        break;

      case 'study_streak':
        notification = {
          ...notification,
          type: 'study_streak',
          title: '🔥 Study Streak!',
          message: `Amazing! You're on a ${data.streakDays}-day study streak. Keep it up!`,
          action_url: '/dashboard/analytics'
        };
        break;

      case 'goal_milestone':
        notification = {
          ...notification,
          type: 'goal_milestone',
          title: '🎯 Goal Milestone',
          message: `You've reached ${data.progress}% completion on "${data.goalTitle}". Great progress!`,
          action_url: '/dashboard/goals'
        };
        break;

      case 'course_reminder':
        notification = {
          ...notification,
          type: 'course_reminder',
          title: '📚 Time to Study',
          message: `Don't forget to continue your progress in "${data.courseTitle}".`,
          action_url: `/dashboard/courses/${data.courseId}`
        };
        break;

      case 'ai_insight':
        notification = {
          ...notification,
          type: 'ai_insight',
          title: '🧠 AI Learning Insight',
          message: data.insight || 'Your AI coach has new personalized insights for you.',
          action_url: '/dashboard/ai-study-coach'
        };
        break;

      case 'course_assigned':
        notification = {
          ...notification,
          type: 'course_assigned',
          title: '📚 New Course Assigned',
          message: `You've been assigned to "${data.courseTitle}". Start learning now!`,
          action_url: `/courses/player/${data.courseId}`,
          metadata: data
        };
        break;

      case 'group_assigned':
        notification = {
          ...notification,
          type: 'group_assigned',
          title: '👥 Added to Group',
          message: `You've been added to the group "${data.groupName}".`,
          action_url: `/org/groups/${data.groupId}`,
          metadata: data
        };
        break;

      case 'student_course_started':
        notification = {
          ...notification,
          type: 'student_course_started',
          title: '🎓 Student Started Course',
          message: `${data.studentName} has started "${data.courseTitle}".`,
          action_url: `/org/students/${data.studentId}`,
          metadata: data
        };
        break;

      case 'student_course_completed':
        notification = {
          ...notification,
          type: 'student_course_completed',
          title: '🏆 Student Completed Course',
          message: `${data.studentName} has completed "${data.courseTitle}"! 🎉`,
          action_url: `/org/students/${data.studentId}`,
          metadata: data
        };
        break;

      case 'student_lesson_completed':
        notification = {
          ...notification,
          type: 'student_lesson_completed',
          title: '✅ Lesson Completed',
          message: `${data.studentName} completed "${data.lessonTitle}" in ${data.courseTitle}.`,
          action_url: `/org/students/${data.studentId}`,
          metadata: data
        };
        break;

      case 'student_goal_created':
        notification = {
          ...notification,
          type: 'student_goal_created',
          title: '🎯 New Goal Created',
          message: `${data.studentName} created a new goal: "${data.goalTitle}".`,
          action_url: `/org/students/${data.studentId}`,
          metadata: data
        };
        break;

      case 'student_goal_completed':
        notification = {
          ...notification,
          type: 'student_goal_completed',
          title: '🎉 Goal Completed',
          message: `${data.studentName} completed their goal: "${data.goalTitle}"!`,
          action_url: `/org/students/${data.studentId}`,
          metadata: data
        };
        break;

      case 'note_shared':
        notification = {
          ...notification,
          type: 'note_shared',
          title: '📝 Note Shared With You',
          message: `${data.sharedBy} shared a note: "${data.noteTitle}".`,
          action_url: `/org/notes/${data.noteId}`,
          metadata: data
        };
        break;

      case 'ai_request_submitted':
        notification = {
          ...notification,
          type: 'ai_request_submitted',
          title: '🤖 New AI Request',
          message: `${data.studentName} submitted an AI request: "${data.task}" (${data.priority} priority).`,
          action_url: `/org/${data.orgId}/ai-governance`,
          metadata: data
        };
        break;

      case 'ai_request_approved':
        notification = {
          ...notification,
          type: 'ai_request_approved',
          title: '✅ AI Request Approved',
          message: `Your AI request "${data.task}" has been approved${data.approverName ? ` by ${data.approverName}` : ''}.`,
          // Send students to AI Coach with requests tab, not AI Governance
          action_url: data.orgId ? `/org/${data.orgId}/ai-coach?tab=requests` : '/dashboard/learner/ai-command-center',
          metadata: data
        };
        break;

      case 'ai_request_rejected':
        notification = {
          ...notification,
          type: 'ai_request_rejected',
          title: '❌ AI Request Declined',
          message: `Your AI request "${data.task}" was declined${data.approverName ? ` by ${data.approverName}` : ''}.`,
          // Send students to AI Coach with requests tab, not AI Governance
          action_url: data.orgId ? `/org/${data.orgId}/ai-coach?tab=requests` : '/dashboard/learner/ai-command-center',
          metadata: data
        };
        break;

      case 'new_message':
        notification = {
          ...notification,
          type: 'new_message',
          title: '💬 New Message',
          message: `${data.senderName}: "${data.preview?.substring(0, 50)}${data.preview?.length > 50 ? '...' : ''}"`,
          action_url: `/org/${data.orgId}/messages/${data.conversationId}`,
          metadata: data
        };
        break;

      case 'message_mention':
        notification = {
          ...notification,
          type: 'message_mention',
          title: '🔔 You were mentioned',
          message: `${data.senderName} mentioned you${data.conversationName ? ` in ${data.conversationName}` : ''}`,
          action_url: `/org/${data.orgId}/messages/${data.conversationId}`,
          metadata: data
        };
        break;

      default:
        throw new Error('Unknown notification type');
    }

    // Insert notification into database
    const { data: insertedNotification, error } = await supabaseClient
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('Notification created:', insertedNotification);

    return new Response(
      JSON.stringify({ success: true, notification: insertedNotification }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error creating notification:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
