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
    // User client for auth and validation
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Service role client for privileged operations (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      console.error('Unauthorized: No user found');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { participant_ids, is_group, group_name } = await req.json();
    console.log('Starting conversation:', { participant_ids, is_group, group_name, user_id: user.id });

    // Validation
    if (!participant_ids || !Array.isArray(participant_ids) || participant_ids.length === 0) {
      console.error('Invalid participant_ids');
      return new Response(JSON.stringify({ error: 'Invalid participant_ids' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (is_group && !group_name) {
      console.error('Group name required for group chats');
      return new Response(JSON.stringify({ error: 'Group name required for group chats' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For DMs, check if conversation already exists
    if (!is_group && participant_ids.length === 1) {
      console.log('Checking for existing DM between', user.id, 'and', participant_ids[0]);
      const { data: existingDM, error: dmError } = await supabaseClient
        .rpc('find_existing_dm', {
          user1_id: user.id,
          user2_id: participant_ids[0]
        });

      if (dmError) {
        console.error('Error checking for existing DM:', dmError);
      }

      if (existingDM) {
        console.log('Found existing DM:', existingDM);
        return new Response(JSON.stringify({ conversation_id: existingDM }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Create new conversation
    console.log('Creating new conversation');
    const { data: conversation, error: convError } = await supabaseClient
      .from('conversations')
      .insert({
        conversation_type: is_group ? 'GROUP' : 'DM',
        group_name: is_group ? group_name : null,
        created_by: user.id,
      })
      .select()
      .single();

    if (convError) {
      console.error('Error creating conversation:', convError);
      throw convError;
    }

    console.log('Created conversation:', conversation.id);

    // Add creator as participant (admin for groups)
    const participants = [
      {
        conversation_id: conversation.id,
        user_id: user.id,
        role: is_group ? 'ADMIN' : 'MEMBER',
      },
      ...participant_ids.map((id: string) => ({
        conversation_id: conversation.id,
        user_id: id,
        role: 'MEMBER',
      })),
    ];

    console.log('Adding participants:', participants);
    // Use service role to bypass RLS for adding participants
    // We've already validated the user's permission above
    const { error: participantsError } = await supabaseAdmin
      .from('conversation_participants')
      .insert(participants);

    if (participantsError) {
      console.error('Error adding participants:', participantsError);
      throw participantsError;
    }

    console.log('Conversation created successfully:', conversation.id);
    return new Response(JSON.stringify({ conversation_id: conversation.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in start-conversation:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
