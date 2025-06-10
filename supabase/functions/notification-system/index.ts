
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
