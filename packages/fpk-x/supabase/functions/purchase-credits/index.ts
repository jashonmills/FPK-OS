import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Credit pack definitions
const CREDIT_PACKS = {
  'starter': { credits: 500, price: 500 }, // $5.00 in cents
  'value': { credits: 1200, price: 1000 }, // $10.00 in cents (20% bonus)
  'pro': { credits: 3000, price: 2000 }, // $20.00 in cents (50% bonus)
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { pack_type, family_id } = await req.json();

    if (!pack_type || !CREDIT_PACKS[pack_type as keyof typeof CREDIT_PACKS]) {
      throw new Error('Invalid pack type');
    }

    if (!family_id) {
      throw new Error('Family ID is required');
    }

    // Verify user is a member of the family
    const { data: membership, error: membershipError } = await supabaseClient
      .from('family_members')
      .select('role')
      .eq('family_id', family_id)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      throw new Error('Not authorized for this family');
    }

    const pack = CREDIT_PACKS[pack_type as keyof typeof CREDIT_PACKS];

    // Get or create Stripe customer ID
    const { data: family } = await supabaseClient
      .from('families')
      .select('stripe_customer_id')
      .eq('id', family_id)
      .single();

    let customerId = family?.stripe_customer_id;

    if (!customerId) {
      // Create Stripe customer
      const stripe = (await import('https://esm.sh/stripe@13.0.0')).default(
        Deno.env.get('STRIPE_SECRET_KEY')!
      );

      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          family_id: family_id,
          user_id: user.id,
        },
      });

      customerId = customer.id;

      // Update family with stripe_customer_id
      await supabaseClient
        .from('families')
        .update({ stripe_customer_id: customerId })
        .eq('id', family_id);
    }

    // Create Stripe payment intent
    const stripe = (await import('https://esm.sh/stripe@13.0.0')).default(
      Deno.env.get('STRIPE_SECRET_KEY')!
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: pack.price,
      currency: 'usd',
      customer: customerId,
      metadata: {
        family_id: family_id,
        pack_type: pack_type,
        credits: pack.credits.toString(),
        user_id: user.id,
      },
      description: `${pack.credits} AI Credits - ${pack_type.charAt(0).toUpperCase() + pack_type.slice(1)} Pack`,
    });

    // Create a record in alacarte_purchases
    await supabaseClient
      .from('alacarte_purchases')
      .insert({
        family_id: family_id,
        user_id: user.id,
        purchase_type: 'ai_credits',
        amount: pack.price / 100, // Convert to dollars
        stripe_payment_intent_id: paymentIntent.id,
        status: 'pending',
        metadata: {
          pack_type: pack_type,
          credits: pack.credits,
        },
      });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        amount: pack.price,
        credits: pack.credits,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
