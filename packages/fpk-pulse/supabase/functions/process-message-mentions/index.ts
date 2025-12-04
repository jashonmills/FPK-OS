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
    const { messageId, conversationId, content, senderId } = await req.json();

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
      // Don't notify the sender if they mention themselves
      if (userId !== senderId) {
        mentions.push({ userName, userId });
      }
    }

    console.log(`Found ${mentions.length} mentions in message`);

    // Create notifications for each mentioned user
    const notifications = mentions.map(mention => ({
      recipient_id: mention.userId,
      sender_id: senderId,
      type: 'message_mention',
      content: `mentioned you in a message`,
      metadata: {
        message_id: messageId,
        conversation_id: conversationId,
      }
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
    console.error('Error processing message mentions:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
