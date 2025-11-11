import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  created_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const payload = await req.json();
    const message = payload.record as Message;

    console.log('Processing message notification:', message.id);

    // Get all participants in the conversation except the sender
    const { data: participants, error: participantsError } = await supabaseClient
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', message.conversation_id)
      .neq('user_id', message.sender_id);

    if (participantsError) {
      throw participantsError;
    }

    if (!participants || participants.length === 0) {
      console.log('No other participants to notify');
      return new Response(JSON.stringify({ success: true, notified: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get sender's persona info
    const { data: senderPersona } = await supabaseClient
      .from('personas')
      .select('display_name')
      .eq('id', message.sender_id)
      .single();

    const senderName = senderPersona?.display_name || 'Someone';
    
    // Get conversation info
    const { data: conversation } = await supabaseClient
      .from('conversations')
      .select('conversation_type, group_name')
      .eq('id', message.conversation_id)
      .single();

    const conversationTitle = conversation?.conversation_type === 'GROUP' 
      ? conversation.group_name || 'Group chat'
      : senderName;

    // Create a preview of the message content
    const messagePreview = message.content 
      ? message.content.length > 50 
        ? message.content.substring(0, 50) + '...'
        : message.content
      : '📎 Sent an attachment';

    // Create notifications for all other participants
    const notifications = participants.map(participant => ({
      user_id: participant.user_id,
      type: 'MESSAGE',
      title: `New message from ${conversationTitle}`,
      message: `${senderName}: ${messagePreview}`,
      metadata: {
        conversation_id: message.conversation_id,
        message_id: message.id,
      },
    }));

    const { error: notificationError } = await supabaseClient
      .from('notifications')
      .insert(notifications);

    if (notificationError) {
      throw notificationError;
    }

    console.log(`Created ${notifications.length} notifications for message ${message.id}`);

    return new Response(
      JSON.stringify({ success: true, notified: notifications.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating message notifications:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
