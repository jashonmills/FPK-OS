import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { corsHeaders } from '../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const STRIPE_PRICES = {
  team_monthly: 'price_1SGoFOGIfNQON3xUrpVpLf4o',
  team_annual: 'price_1SGoFOGIfNQON3xUXtEqdFg4',
  pro_monthly: 'price_1SGoFOGIfNQON3xU8Kc9AV8L',
  pro_annual: 'price_1SGoFOGIfNQON3xUpPhN9fZv',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, familyId, tier, billingCycle } = await req.json();

    // Get family data
    const { data: family, error: familyError } = await supabaseClient
      .from('families')
      .select('*')
      .eq('id', familyId)
      .single();

    if (familyError || !family) {
      return new Response(
        JSON.stringify({ error: 'Family not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is family owner
    const { data: membership } = await supabaseClient
      .from('family_members')
      .select('role')
      .eq('family_id', familyId)
      .eq('user_id', user.id)
      .single();

    if (membership?.role !== 'owner') {
      return new Response(
        JSON.stringify({ error: 'Only family owners can manage subscriptions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'create_checkout') {
      // Create or get Stripe customer
      let customerId = family.stripe_customer_id;
      
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            family_id: familyId,
            user_id: user.id,
          },
        });
        customerId = customer.id;

        // Save customer ID
        await supabaseClient
          .from('families')
          .update({ stripe_customer_id: customerId })
          .eq('id', familyId);
      }

      // Determine price ID
      const priceKey = `${tier}_${billingCycle}` as keyof typeof STRIPE_PRICES;
      const priceId = STRIPE_PRICES[priceKey];

      if (!priceId) {
        return new Response(
          JSON.stringify({ error: 'Invalid pricing option' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        allow_promotion_codes: true,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app')}/settings?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app')}/pricing`,
        metadata: {
          family_id: familyId,
          tier,
          billing_cycle: billingCycle,
        },
      });

      return new Response(
        JSON.stringify({ sessionId: session.id, url: session.url }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'create_portal') {
      if (!family.stripe_customer_id) {
        return new Response(
          JSON.stringify({ error: 'No active subscription' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: family.stripe_customer_id,
        return_url: `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app')}/settings`,
      });

      return new Response(
        JSON.stringify({ url: portalSession.url }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in manage-subscription:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
