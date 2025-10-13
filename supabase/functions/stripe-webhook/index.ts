import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");
    if (!endpointSecret) throw new Error("STRIPE_WEBHOOK_SECRET not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    
    logStep("Event verified", { type: event.type, id: event.id });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase, stripe);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase, stripe);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase, stripe);
        break;

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: any,
  stripe: Stripe
) {
  logStep("Processing checkout.session.completed", { sessionId: session.id });

  const userId = session.metadata?.user_id;
  const tier = session.metadata?.tier;
  const interval = session.metadata?.interval;

  if (!userId) {
    logStep("No user_id in metadata, skipping");
    return;
  }

  // Check if this is a one-time credit pack purchase
  if (tier === 'credit_pack') {
    logStep("Processing credit pack purchase");
    
    // Get the line item to extract credit amount from metadata
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;
    
    if (priceId) {
      const price = await stripe.prices.retrieve(priceId);
      const creditsGranted = parseInt(price.metadata?.credits_granted || '500');
      
      // Grant credits
      const { data, error } = await supabase.rpc('add_ai_credits', {
        p_user_id: userId,
        p_amount: creditsGranted,
        p_transaction_type: 'credit_pack_purchase',
        p_metadata: { 
          stripe_session_id: session.id,
          price_id: priceId,
          amount_paid: session.amount_total
        }
      });

      if (error) {
        logStep("Error granting credits", { error });
      } else {
        logStep("Credits granted successfully", { credits: creditsGranted, userId });
      }
    }
    return;
  }

  // Handle subscription checkout
  if (!tier || !interval) {
    logStep("Missing tier or interval in metadata");
    return;
  }

  // Get subscription details
  const subscriptionId = session.subscription;
  if (!subscriptionId) {
    logStep("No subscription ID found");
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
  const priceId = subscription.items.data[0]?.price?.id;
  
  if (!priceId) {
    logStep("No price ID found");
    return;
  }

  // Get credit amount from price metadata
  const price = await stripe.prices.retrieve(priceId);
  const monthlyCredits = parseInt(price.metadata?.monthly_credits || '0');

  if (monthlyCredits > 0) {
    // Grant initial credits
    const { data, error } = await supabase.rpc('add_ai_credits', {
      p_user_id: userId,
      p_amount: monthlyCredits,
      p_transaction_type: 'subscription_start',
      p_metadata: {
        tier,
        interval,
        stripe_session_id: session.id,
        stripe_subscription_id: subscriptionId,
        price_id: priceId
      }
    });

    if (error) {
      logStep("Error granting initial credits", { error });
    } else {
      logStep("Initial credits granted", { credits: monthlyCredits, userId });
    }

    // Grant ai_coach_user role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'ai_coach_user' })
      .select();

    if (roleError && !roleError.message.includes('duplicate')) {
      logStep("Error granting role", { error: roleError });
    } else {
      logStep("ai_coach_user role granted", { userId });
    }

    // Update or create subscriber record
    const { error: subError } = await supabase
      .from('subscribers')
      .upsert({
        user_id: userId,
        email: session.customer_email,
        stripe_customer_id: session.customer,
        stripe_subscription_id: subscriptionId,
        subscribed: true,
        subscription_tier: tier,
        subscription_status: 'active',
        subscription_end: null
      });

    if (subError) {
      logStep("Error updating subscriber", { error: subError });
    } else {
      logStep("Subscriber record updated", { userId });
    }
  }
}

async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: any,
  stripe: Stripe
) {
  logStep("Processing invoice.payment_succeeded", { invoiceId: invoice.id });

  // Only process subscription invoices (not one-time payments)
  if (!invoice.subscription) {
    logStep("Not a subscription invoice, skipping");
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const priceId = subscription.items.data[0]?.price?.id;
  
  if (!priceId) {
    logStep("No price ID found");
    return;
  }

  // Get user_id from subscription metadata or customer
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    logStep("No user_id found in subscription metadata");
    return;
  }

  // Get credit amount from price metadata
  const price = await stripe.prices.retrieve(priceId);
  const monthlyCredits = parseInt(price.metadata?.monthly_credits || '0');

  if (monthlyCredits > 0) {
    // Refresh monthly credits
    const { data, error } = await supabase.rpc('add_ai_credits', {
      p_user_id: userId,
      p_amount: monthlyCredits,
      p_transaction_type: 'monthly_refresh',
      p_metadata: {
        stripe_invoice_id: invoice.id,
        stripe_subscription_id: subscription.id,
        price_id: priceId,
        billing_reason: invoice.billing_reason
      }
    });

    if (error) {
      logStep("Error refreshing credits", { error });
    } else {
      logStep("Monthly credits refreshed", { credits: monthlyCredits, userId });
    }
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: any
) {
  logStep("Processing customer.subscription.deleted", { subscriptionId: subscription.id });

  const userId = subscription.metadata?.user_id;
  if (!userId) {
    logStep("No user_id in metadata");
    return;
  }

  // Remove ai_coach_user role
  const { error: roleError } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role', 'ai_coach_user');

  if (roleError) {
    logStep("Error removing role", { error: roleError });
  } else {
    logStep("ai_coach_user role removed", { userId });
  }

  // Update subscriber status
  const { error: subError } = await supabase
    .from('subscribers')
    .update({
      subscribed: false,
      subscription_status: 'canceled',
      subscription_end: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (subError) {
    logStep("Error updating subscriber", { error: subError });
  } else {
    logStep("Subscriber marked as canceled", { userId });
  }

  // Note: We don't revoke credits - they keep what they have until they run out
  logStep("Subscription access revoked", { userId });
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: any,
  stripe: Stripe
) {
  logStep("Processing customer.subscription.updated", { subscriptionId: subscription.id });

  const userId = subscription.metadata?.user_id;
  if (!userId) {
    logStep("No user_id in metadata");
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id;
  if (!priceId) {
    logStep("No price ID found");
    return;
  }

  // Get new tier from price metadata
  const price = await stripe.prices.retrieve(priceId);
  const newTier = price.metadata?.tier;

  if (newTier) {
    // Update subscriber record with new tier
    const { error } = await supabase
      .from('subscribers')
      .update({
        subscription_tier: newTier,
        subscription_status: subscription.status
      })
      .eq('user_id', userId);

    if (error) {
      logStep("Error updating subscription tier", { error });
    } else {
      logStep("Subscription tier updated", { userId, newTier });
    }
  }
}
