import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { corsHeaders } from '../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { familyId } = await req.json();

    if (!familyId) {
      return new Response(
        JSON.stringify({ error: 'Family ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get family data
    const { data: family, error: familyError } = await supabaseClient
      .from('families')
      .select('stripe_customer_id')
      .eq('id', familyId)
      .single();

    if (familyError || !family) {
      return new Response(
        JSON.stringify({ error: 'Family not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!family.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: 'No Stripe customer ID found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: family.stripe_customer_id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No active subscriptions found in Stripe' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0]?.price.id;

    console.log('Found active subscription with price ID:', priceId);

    // Determine tier from price ID
    let tier = 'free';
    const tierLimits = {
      team: { max_students: 5, storage_limit_mb: 5120 },
      pro: { max_students: -1, storage_limit_mb: 20480 },
    };

    if (priceId?.includes('team') || priceId?.includes('Team')) {
      tier = 'team';
    } else if (priceId?.includes('pro') || priceId?.includes('Pro')) {
      tier = 'pro';
    }

    const limits = tierLimits[tier as keyof typeof tierLimits];

    if (!limits) {
      return new Response(
        JSON.stringify({ error: 'Could not determine tier from subscription' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update family record
    const { error: updateError } = await supabaseClient
      .from('families')
      .update({
        subscription_tier: tier,
        subscription_status: 'active',
        ...limits,
      })
      .eq('id', familyId);

    if (updateError) {
      console.error('Error updating family:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update subscription' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully synced subscription for family ${familyId} to tier: ${tier}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        tier,
        max_students: limits.max_students,
        storage_limit_mb: limits.storage_limit_mb,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-subscription-tier:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
