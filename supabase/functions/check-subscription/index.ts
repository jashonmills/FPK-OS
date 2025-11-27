import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // CRITICAL: Check if user is admin (bypass all checks)
    const { data: isAdmin, error: adminCheckError } = await supabaseClient
      .rpc('is_admin_or_coach_user', { check_user_id: user.id });

    if (adminCheckError) {
      console.error('Admin check error:', adminCheckError);
    }

    if (isAdmin) {
      logStep("Admin access granted - bypassing all checks", { userId: user.id });
      
      await supabaseClient.from("subscribers").upsert({
        user_id: user.id,
        email: user.email,
        subscribed: true,
        subscription_tier: 'universal',
        subscription_status: 'active',
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      return new Response(JSON.stringify({
        subscribed: true,
        subscription_tier: 'universal',
        subscription_status: 'active',
        source: 'admin_override',
        ai_credits: 999999
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check for active coupon redemptions first
    const { data: activeRedemptions } = await supabaseClient
      .from('coupon_redemptions')
      .select(`
        *,
        coupon_codes (
          subscription_tier,
          description
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());

    if (activeRedemptions && activeRedemptions.length > 0) {
      // User has active free access
      const redemption = activeRedemptions[0];
      const tier = redemption.coupon_codes?.subscription_tier;
      
      await supabaseClient.from("subscribers").upsert({
        user_id: user.id,
        email: user.email,
        subscribed: true,
        subscription_tier: tier,
        subscription_status: 'active',
        subscription_end: redemption.expires_at,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      logStep("Found active coupon redemption", { tier, expiresAt: redemption.expires_at });
      
      return new Response(JSON.stringify({
        subscribed: true,
        subscription_tier: tier,
        subscription_end: redemption.expires_at,
        subscription_status: 'active',
        source: 'coupon'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      await supabaseClient.from("subscribers").upsert({
        user_id: user.id,
        email: user.email,
        subscribed: false,
        subscription_tier: null,
        subscription_status: 'incomplete',
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = null;
    let subscriptionEnd = null;
    let subscriptionStatus = 'incomplete';
    let subscriptionId = null;
    let currentPeriodStart = null;
    let currentPeriodEnd = null;
    let cancelAtPeriodEnd = false;

    let monthlyCredits = 0;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionId = subscription.id;
      subscriptionStatus = subscription.status as any;
      currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
      currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
      subscriptionEnd = currentPeriodEnd;
      cancelAtPeriodEnd = subscription.cancel_at_period_end;
      
      logStep("Active subscription found", { 
        subscriptionId: subscription.id, 
        endDate: subscriptionEnd,
        status: subscriptionStatus 
      });
      
      // Retrieve price with product metadata to get credit allotment
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId, { expand: ['product'] });
      const amount = price.unit_amount || 0;
      const interval = price.recurring?.interval;
      
      // Extract monthly_credits from product metadata
      const product = price.product as Stripe.Product;
      monthlyCredits = parseInt(product.metadata?.monthly_credits || '0', 10);
      
      // Determine tier based on price and interval (or metadata)
      const tierFromMetadata = product.metadata?.tier;
      if (tierFromMetadata) {
        subscriptionTier = tierFromMetadata;
      } else {
        // Fallback to price-based tier determination
        if (interval === 'month') {
          if (amount <= 499) subscriptionTier = "basic";
          else if (amount <= 1900) subscriptionTier = "pro";
          else if (amount <= 2900) subscriptionTier = "pro_plus";
          else subscriptionTier = "universal";
        } else if (interval === 'year') {
          if (amount <= 4900) subscriptionTier = "basic";
          else if (amount <= 19900) subscriptionTier = "pro";
          else if (amount <= 29900) subscriptionTier = "pro_plus";
          else subscriptionTier = "universal";
        }
      }
      
      logStep("Determined subscription tier and credits", { 
        priceId, 
        amount, 
        interval, 
        subscriptionTier,
        monthlyCredits 
      });
    } else {
      logStep("No active subscription found");
    }

    await supabaseClient.from("subscribers").upsert({
      user_id: user.id,
      email: user.email,
      stripe_customer_id: customerId,
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_status: subscriptionStatus,
      subscription_id: subscriptionId,
      subscription_end: subscriptionEnd,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: cancelAtPeriodEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    logStep("Updated database with subscription info", { 
      subscribed: hasActiveSub, 
      subscriptionTier,
      subscriptionStatus 
    });
    
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_status: subscriptionStatus,
      subscription_end: subscriptionEnd,
      cancel_at_period_end: cancelAtPeriodEnd,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      monthly_credits: monthlyCredits
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});