import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationData {
  userId: string;
  message: string;
  type: 'deadline_reminder' | 'progress_nudge' | 'achievement' | 'weekly_review';
  linkedGoalId?: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔔 Goal Notification Service triggered');

    if (req.method === 'POST') {
      // Manual notification trigger (for achievements, etc.)
      const { userId, message, type, linkedGoalId, metadata }: NotificationData = await req.json();
      
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          message,
          notification_type: type,
          linked_goal_id: linkedGoalId,
          metadata: metadata || {}
        });

      if (error) {
        console.error('Error creating notification:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, notification: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Automated notification check (called by cron)
    await checkDeadlineReminders();
    await checkProgressNudges();
    await checkWeeklyReviews();

    return new Response(JSON.stringify({ success: true, message: 'Notification checks completed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in goal-notifications function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function checkDeadlineReminders() {
  console.log('📅 Checking deadline reminders...');
  
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  
  const { data: goals, error } = await supabase
    .from('goals')
    .select('id, title, target_date, user_id')
    .eq('status', 'active')
    .not('target_date', 'is', null)
    .lte('target_date', threeDaysFromNow.toISOString())
    .gte('target_date', new Date().toISOString());

  if (error) {
    console.error('Error fetching goals for deadline reminders:', error);
    return;
  }

  for (const goal of goals || []) {
    const targetDate = new Date(goal.target_date);
    const daysUntil = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    // Check if we already sent a reminder recently
    const { data: existingNotification } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', goal.user_id)
      .eq('linked_goal_id', goal.id)
      .eq('notification_type', 'deadline_reminder')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (existingNotification && existingNotification.length > 0) {
      continue; // Skip if already notified in last 24 hours
    }

    const message = daysUntil === 0 
      ? `⏰ Your goal "${goal.title}" is due today!`
      : `⏰ Your goal "${goal.title}" is due in ${daysUntil} day${daysUntil > 1 ? 's' : ''}!`;

    await supabase
      .from('notifications')
      .insert({
        user_id: goal.user_id,
        message,
        notification_type: 'deadline_reminder',
        linked_goal_id: goal.id,
        metadata: { days_until_deadline: daysUntil }
      });

    console.log(`📨 Deadline reminder sent for goal: ${goal.title}`);
  }
}

async function checkProgressNudges() {
  console.log('📈 Checking progress nudges...');
  
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  
  // Find goals that haven't been updated in 5+ days
  const { data: staleGoals, error } = await supabase
    .from('goals')
    .select('id, title, user_id, updated_at')
    .eq('status', 'active')
    .lt('updated_at', fiveDaysAgo.toISOString());

  if (error) {
    console.error('Error fetching stale goals:', error);
    return;
  }

  for (const goal of staleGoals || []) {
    // Check if we already sent a nudge recently
    const { data: existingNotification } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', goal.user_id)
      .eq('linked_goal_id', goal.id)
      .eq('notification_type', 'progress_nudge')
      .gte('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (existingNotification && existingNotification.length > 0) {
      continue; // Skip if already notified in last 3 days
    }

    const daysSinceUpdate = Math.floor((Date.now() - new Date(goal.updated_at).getTime()) / (1000 * 60 * 60 * 24));
    const message = `📈 Need help getting back on track with "${goal.title}"? Try completing a milestone today!`;

    await supabase
      .from('notifications')
      .insert({
        user_id: goal.user_id,
        message,
        notification_type: 'progress_nudge',
        linked_goal_id: goal.id,
        metadata: { days_since_last_update: daysSinceUpdate }
      });

    console.log(`🔔 Progress nudge sent for goal: ${goal.title}`);
  }
}

async function checkWeeklyReviews() {
  console.log('📝 Checking weekly reviews...');
  
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  
  // Only run on Sundays
  if (dayOfWeek !== 0) {
    return;
  }
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  // Get users who have active goals
  const { data: usersWithGoals, error } = await supabase
    .from('goals')
    .select('user_id')
    .eq('status', 'active')
    .group('user_id');

  if (error) {
    console.error('Error fetching users with goals:', error);
    return;
  }

  const uniqueUserIds = [...new Set(usersWithGoals?.map(g => g.user_id) || [])];

  for (const userId of uniqueUserIds) {
    // Check if we already sent a weekly review recently
    const { data: existingNotification } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('notification_type', 'weekly_review')
      .gte('created_at', oneWeekAgo.toISOString())
      .limit(1);

    if (existingNotification && existingNotification.length > 0) {
      continue; // Skip if already notified this week
    }

    const message = `📝 Time for your weekly goal review! How did you progress this week?`;

    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        message,
        notification_type: 'weekly_review',
        metadata: { week_of: now.toISOString() }
      });

    console.log(`📅 Weekly review reminder sent to user: ${userId}`);
  }
}