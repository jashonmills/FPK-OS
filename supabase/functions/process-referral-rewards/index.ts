import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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

    // Fetch pending referrals
    const { data: pendingReferrals, error: fetchError } = await supabaseClient
      .from('referrals')
      .select(`
        id,
        inviting_user_id,
        new_user_id,
        created_at,
        personas!new_user_id (
          id,
          display_name
        )
      `)
      .eq('status', 'PENDING_REWARD');

    if (fetchError) {
      console.error('Error fetching pending referrals:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${pendingReferrals?.length || 0} pending referrals to process`);

    let processed = 0;
    let skipped = 0;
    let failed = 0;

    for (const referral of pendingReferrals || []) {
      // Check if new user has completed onboarding (created persona)
      const hasPersona = referral.personas && referral.personas.length > 0;
      
      if (!hasPersona) {
        console.log(`Skipping referral ${referral.id}: User hasn't created persona yet`);
        skipped++;
        continue;
      }

      try {
        // Grant badge (ON CONFLICT DO NOTHING handles duplicates)
        const { error: badgeError } = await supabaseClient
          .from('user_badges')
          .insert({
            user_id: referral.inviting_user_id,
            badge_type: 'COMMUNITY_AMBASSADOR',
            metadata: { referral_id: referral.id }
          });

        if (badgeError && !badgeError.message.includes('duplicate')) {
          console.error(`Error granting badge for referral ${referral.id}:`, badgeError);
        }

        // Add credits
        const { error: creditsError } = await supabaseClient
          .rpc('add_user_credits', {
            p_user_id: referral.inviting_user_id,
            p_amount: 5000,
            p_reason: 'referral_reward'
          });

        if (creditsError) {
          console.error(`Error adding credits for referral ${referral.id}:`, creditsError);
          throw creditsError;
        }

        // Create notification
        const { error: notifError } = await supabaseClient
          .from('notifications')
          .insert({
            user_id: referral.inviting_user_id,
            type: 'REFERRAL_REWARD',
            title: '🎉 Referral Reward Earned!',
            message: `${referral.personas[0].display_name} has joined FPK Nexus! You've earned 5,000 credits and the Community Ambassador badge.`,
            metadata: {
              referral_id: referral.id,
              new_user_name: referral.personas[0].display_name,
              credits_earned: 5000
            }
          });

        if (notifError) {
          console.error(`Error creating notification for referral ${referral.id}:`, notifError);
        }

        // Mark as rewarded
        const { error: updateError } = await supabaseClient
          .from('referrals')
          .update({
            status: 'REWARDED',
            rewarded_at: new Date().toISOString()
          })
          .eq('id', referral.id);

        if (updateError) {
          console.error(`Error updating referral ${referral.id}:`, updateError);
          throw updateError;
        }

        console.log(`✓ Processed referral ${referral.id} - Rewarded user ${referral.inviting_user_id}`);
        processed++;
      } catch (error) {
        console.error(`✗ Failed to process referral ${referral.id}:`, error);
        failed++;
      }
    }

    const summary = {
      total: pendingReferrals?.length || 0,
      processed,
      skipped,
      failed
    };

    console.log('Processing complete:', summary);

    return new Response(
      JSON.stringify({ success: true, summary }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in process-referral-rewards:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
