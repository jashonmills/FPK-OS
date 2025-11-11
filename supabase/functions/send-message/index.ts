import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to create message notifications for other participants
async function createMessageNotifications(supabaseAdmin: any, conversationId: string, senderId: string, messageContent: string) {
  // Get all participants except the sender
  const { data: participants } = await supabaseAdmin
    .from('conversation_participants')
    .select('user_id, personas(display_name)')
    .eq('conversation_id', conversationId)
    .neq('user_id', senderId);

  if (!participants || participants.length === 0) return;

  // Get sender's display name
  const { data: senderPersona } = await supabaseAdmin
    .from('personas')
    .select('display_name')
    .eq('user_id', senderId)
    .single();

  const senderName = senderPersona?.display_name || 'Someone';
  const preview = messageContent.length > 50 ? messageContent.substring(0, 50) + '...' : messageContent;

  // Create notification for each participant
  const notifications = participants.map((p: any) => ({
    user_id: p.user_id,
    type: 'MESSAGE',
    title: `New message from ${senderName}`,
    message: preview,
    metadata: { 
      conversation_id: conversationId,
      sender_id: senderId 
    }
  }));

  await supabaseAdmin.from('notifications').insert(notifications);
}

const GUARDIAN_SYSTEM_PROMPT = `You are the 'Guardian,' an AI moderator for a private messaging system supporting neurodiverse individuals. Your primary purpose is to enforce a zero-tolerance policy against hate speech, bigotry, direct insults, and shaming, while also gently de-escalating arguments.

You will be given recent conversation history. Analyze the **newest message** (marked as NEW_MESSAGE) in context and respond in JSON format:

{
  "severity": <integer 0-10>,
  "violation_category": <string or null>,
  "de_escalation_message": <string or null>,
  "reasoning": <string>
}

SEVERITY SCALE:
- 0-3: Safe, normal conversation. Includes disagreement, strong opinions, venting frustration.
- 4-6: Potential conflict or heated argument. Tension is rising but no clear violation yet.
  → Provide a gentle, empathetic de_escalation_message like:
    "I notice the conversation is getting heated. Let's take a breath - everyone here deserves respect."
    "Hey folks, it seems like there might be some misunderstanding. Can we pause and clarify?"
- 7-10: Clear and unambiguous hate speech, bigotry, targeted harassment, or severe shaming.
  → Examples: slurs, threats, telling someone to harm themselves, mocking disabilities, coordinated harassment.
  → Set violation_category to: 'HATE_SPEECH', 'BIGOTRY', 'HARASSMENT', 'SHAMING', or 'THREATS'

CRITICAL RULES:
1. Only assign severity 7+ for undeniable, severe violations
2. Neurodivergent communication styles can be direct - don't penalize authenticity
3. Venting frustration or strong disagreement ≠ hate speech
4. Context matters: "That's insane" (casual expression) vs "You're insane" (attack)
5. If uncertain whether something crosses the line → severity 5-6, not 7+

Respond ONLY with valid JSON. No markdown, no explanations outside JSON.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

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

    // Get user's persona ID
    const { data: persona, error: personaError } = await supabaseAdmin
      .from('personas')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (personaError || !persona) {
      console.error('No persona found for user:', user.id);
      return new Response(JSON.stringify({ error: 'No persona found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const personaId = persona.id;

    const { conversation_id, content, reply_to_message_id, file_url, file_name, file_type, file_size } = await req.json();
    console.log('Sending message:', { conversation_id, content_length: content?.length, user_id: user.id, has_reply: !!reply_to_message_id, has_file: !!file_url });

    if (!conversation_id || (!content && !file_url)) {
      console.error('Invalid input');
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if Operation Spearhead is enabled
    const { data: flagData } = await supabaseAdmin
      .from('feature_flags')
      .select('is_enabled')
      .eq('flag_name', 'operation_spearhead_enabled')
      .single();

    const isOperationSpearheadEnabled = flagData?.is_enabled || false;

    // Verify user is participant
    const { data: participant, error: participantError } = await supabaseAdmin
      .from('conversation_participants')
      .select('id')
      .eq('conversation_id', conversation_id)
      .eq('user_id', user.id)
      .single();

    if (participantError || !participant) {
      console.error('Not a participant:', participantError);
      return new Response(JSON.stringify({ error: 'Not a participant' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If Operation Spearhead is disabled, use simple message insertion
    if (!isOperationSpearheadEnabled) {
      const { data: message, error } = await supabaseClient
        .from('messages')
        .insert({
          conversation_id,
          sender_id: personaId,
          content: content?.trim() || null,
          reply_to_message_id: reply_to_message_id || null,
          file_url: file_url || null,
          file_name: file_name || null,
          file_type: file_type || null,
          file_size: file_size || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting message:', error);
        throw error;
      }

      // Create notifications for other participants
      await createMessageNotifications(supabaseAdmin, conversation_id, user.id, content?.trim() || 'Sent a file');

      console.log('Message sent successfully (moderation disabled):', message.id);
      return new Response(JSON.stringify({ message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === OPERATION SPEARHEAD ENABLED ===
    
    // Check if user is currently banned
    const { data: activeBan } = await supabaseAdmin
      .from('user_bans')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (activeBan) {
      console.log('User is banned:', user.id);
      return new Response(JSON.stringify({
        error: 'MESSAGE_BLOCKED',
        code: 'USER_BANNED',
        ban_details: {
          reason: activeBan.reason,
          expires_at: activeBan.expires_at,
          ban_id: activeBan.id
        }
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // INSERT MESSAGE IMMEDIATELY (before AI moderation)
    const { data: message, error: insertError } = await supabaseClient
      .from('messages')
      .insert({ 
        conversation_id, 
        sender_id: personaId, 
        content: content?.trim() || null,
        reply_to_message_id: reply_to_message_id || null,
        file_url: file_url || null,
        file_name: file_name || null,
        file_type: file_type || null,
        file_size: file_size || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting message:', insertError);
      throw insertError;
    }

    // Create notifications for other participants
    await createMessageNotifications(supabaseAdmin, conversation_id, user.id, content?.trim() || 'Sent a file');

    console.log('Message sent immediately:', message.id);

    // Return success response immediately
    const responsePromise = new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

    // Skip AI moderation for file-only messages
    if (!content || content.trim() === '') {
      console.log('Skipping AI moderation for file-only message');
      return responsePromise;
    }

    // Run AI moderation asynchronously (doesn't block response)
    const moderateAsync = async () => {
      try {
        const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
        if (!LOVABLE_API_KEY) {
          console.log('LOVABLE_API_KEY not configured, skipping background moderation');
          return;
        }

        // Fetch conversation context (last 10 messages)
        const { data: recentMessages } = await supabaseAdmin
          .from('messages')
          .select('content, sender_id, created_at')
          .eq('conversation_id', conversation_id)
          .order('created_at', { ascending: false })
          .limit(10);

        // Build context for AI
        const contextMessages = (recentMessages || []).reverse();
        const contextPrompt = `CONVERSATION HISTORY:\n${contextMessages.map(m => 
          `[${m.sender_id === personaId ? 'CURRENT_USER' : 'OTHER'}]: ${m.content}`
        ).join('\n')}\n\nNEW_MESSAGE: ${content.trim()}`;

        const aiStartTime = Date.now();
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: GUARDIAN_SYSTEM_PROMPT },
              { role: 'user', content: contextPrompt }
            ],
            temperature: 0.3,
          }),
        });

        const processingTime = Date.now() - aiStartTime;

        if (!aiResponse.ok) {
          console.error('Background AI moderation failed:', aiResponse.status);
          return;
        }

        const aiResult = await aiResponse.json();
        let aiContent = aiResult.choices?.[0]?.message?.content;
        
        let analysis;
        try {
          if (aiContent.includes('```')) {
            aiContent = aiContent.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
          }
          analysis = JSON.parse(aiContent);
        } catch (e) {
          console.error('Failed to parse background AI response:', e);
          return;
        }

        console.log('Background AI Analysis:', { severity: analysis.severity, category: analysis.violation_category });

        // Log to ai_moderation_log
        const actionTaken = analysis.severity <= 3 ? 'ALLOWED' : 
                            analysis.severity <= 6 ? 'DE_ESCALATED' : 
                            'BLOCKED_AND_BANNED';

        await supabaseAdmin.from('ai_moderation_log').insert({
          conversation_id,
          sender_id: personaId,
          message_content: content.trim(),
          severity_score: analysis.severity,
          violation_category: analysis.violation_category,
          action_taken: actionTaken,
          de_escalation_message: analysis.de_escalation_message,
          raw_ai_response: aiResult,
          processing_time_ms: processingTime
        });

        // RETROACTIVE ENFORCEMENT
        if (analysis.severity >= 7) {
          console.log(`🚨 RETROACTIVE: Deleting message ${message.id} and banning user ${user.id}`);
          console.log(`📊 Severity: ${analysis.severity}, Category: ${analysis.violation_category}`);

          // Delete the message
          await supabaseAdmin
            .from('messages')
            .delete()
            .eq('id', message.id);

          // Ban the user
          const banExpiresAt = new Date();
          banExpiresAt.setHours(banExpiresAt.getHours() + 24);

          await supabaseAdmin.from('user_bans').insert({
            user_id: user.id,
            reason: `Automatic ban: ${analysis.violation_category || 'Policy violation'}`,
            banned_by: null,
            expires_at: banExpiresAt.toISOString(),
            status: 'active',
          });

          console.log(`✅ User ${user.id} banned for 24 hours, message deleted`);
        } else if (analysis.severity >= 4 && analysis.severity <= 6) {
          console.log(`🔍 De-escalation recommended (severity ${analysis.severity}): "${analysis.de_escalation_message}"`);
        }
      } catch (error) {
        console.error('Background moderation error:', error);
      }
    };

    // Start background moderation (non-blocking)
    moderateAsync().catch(err => console.error('Background moderation error:', err));

    return responsePromise;

  } catch (error) {
    console.error('Error in send-message:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});