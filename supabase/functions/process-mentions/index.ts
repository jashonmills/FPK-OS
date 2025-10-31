import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { commentId, taskId, content, senderId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract @mentions from content using regex
    // Matches @[User Name](user-id-uuid)
    const mentionRegex = /@\[([^\]]+)\]\(([a-f0-9-]{36})\)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      const userName = match[1];
      const userId = match[2];
      mentions.push({ userName, userId });
    }

    console.log(`Found ${mentions.length} mentions in comment/description`);

    // Create notifications for each mentioned user
    const notifications = mentions.map(mention => ({
      recipient_id: mention.userId,
      sender_id: senderId,
      task_id: taskId,
      type: 'mention',
      content: `mentioned you in a ${commentId ? 'comment' : 'task description'}`,
      comment_id: commentId || null,
    }));

    if (notifications.length > 0) {
      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) {
        console.error('Error creating notifications:', error);
        throw error;
      }

      console.log(`Created ${notifications.length} notifications`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        mentionsProcessed: mentions.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing mentions:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
