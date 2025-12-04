import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { 
  getPriceId, 
  getCreditPackPriceId, 
  TIER_TO_PRICE_MAP,
  type SubscriptionTier,
  type BillingInterval
} from "../_shared/stripe-config.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
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
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { tier, interval, couponCode, isTopUp = false, addFpkUniversity = false } = await req.json();
    logStep("Request data", { tier, interval, couponCode, isTopUp, addFpkUniversity });

    // Determine if this is a credit pack purchase or subscription
    let priceId: string;
    let mode: 'subscription' | 'payment' = 'subscription';
    let productName: string;

    if (isTopUp || tier === 'credit_pack') {
      // One-time credit pack purchase
      priceId = getCreditPackPriceId();
      mode = 'payment';
      productName = TIER_TO_PRICE_MAP.credit_pack.name;
      logStep("Processing credit pack purchase", { priceId });
    } else {
      // Subscription purchase
      if (!tier || !interval) {
        throw new Error("Missing tier or interval for subscription");
      }

      if (!TIER_TO_PRICE_MAP[tier as SubscriptionTier]) {
        throw new Error(`Invalid subscription tier: ${tier}`);
      }

      priceId = getPriceId(tier as SubscriptionTier, interval as BillingInterval);
      productName = TIER_TO_PRICE_MAP[tier as SubscriptionTier].name;
      logStep("Processing subscription checkout", { tier, interval, priceId });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check for existing customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      logStep("Created new customer", { customerId });
    }

    // Pricing is now handled by Stripe Price IDs - no need to calculate here
    
    // Check for valid coupon code
    let couponId = null;
    if (couponCode) {
      const { data: couponData } = await supabaseClient
        .from('coupon_codes')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (couponData) {
        // Check if coupon is still valid
        if (couponData.expires_at && new Date(couponData.expires_at) < new Date()) {
          throw new Error("Coupon code has expired");
        }
        if (couponData.max_uses && couponData.current_uses >= couponData.max_uses) {
          throw new Error("Coupon code has reached maximum uses");
        }

        // For free access coupons, handle differently
        if (couponData.duration_months && !couponData.discount_percent) {
          // This is a free access coupon - create redemption directly
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + couponData.duration_months);

          await supabaseClient.from('coupon_redemptions').insert({
            user_id: user.id,
            coupon_id: couponData.id,
            expires_at: expiresAt.toISOString()
          });

          await supabaseClient.from('subscribers').upsert({
            user_id: user.id,
            email: user.email,
            stripe_customer_id: customerId,
            subscribed: true,
            subscription_tier: couponData.subscription_tier,
            subscription_status: 'active',
            subscription_end: expiresAt.toISOString()
          });

          // Update coupon usage
          await supabaseClient
            .from('coupon_codes')
            .update({ current_uses: couponData.current_uses + 1 })
            .eq('id', couponData.id);

          return new Response(JSON.stringify({ 
            success: true, 
            message: `Coupon applied! You now have ${couponData.duration_months} months of free ${couponData.subscription_tier} access.`,
            freeAccess: true
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }

        // For discount coupons, create Stripe coupon
        if (couponData.discount_percent) {
          try {
            const stripeCoupon = await stripe.coupons.create({
              percent_off: couponData.discount_percent,
              duration: 'once',
              name: couponData.description || `${couponData.discount_percent}% off`
            });
            couponId = stripeCoupon.id;
            logStep("Created Stripe coupon", { couponId, discount: couponData.discount_percent });
          } catch (stripeCouponError) {
            logStep("Failed to create Stripe coupon", { error: stripeCouponError });
          }
        }
      }
    }

    // Build line items array
    const lineItems: any[] = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    // Add FPK University add-on if requested (not for Pro+ or credit packs)
    if (addFpkUniversity && !isTopUp && tier !== 'pro_plus') {
      const addonPriceId = tier === 'basic' 
        ? 'price_1SHv3mAKVCfeyoX0f7qSunro'
        : 'price_1SHusOAKVCfeyoX0VMr56H0Y';
      
      lineItems.push({
        price: addonPriceId,
        quantity: 1,
      });
      
      logStep("Adding FPK University add-on", { tier, addonPriceId });
    }

    // Create checkout session with Stripe Price ID
    const sessionConfig: any = {
      customer: customerId,
      line_items: lineItems,
      mode: mode,
      success_url: isTopUp 
        ? `${req.headers.get("origin")}/coach/pro?credits_added=true`
        : `${req.headers.get("origin")}/coach/pro?subscription=success`,
      cancel_url: `${req.headers.get("origin")}/choose-plan`,
      metadata: {
        user_id: user.id,
        tier: tier || 'credit_pack',
        interval: interval || 'one_time',
        add_fpk_university: addFpkUniversity ? 'true' : 'false'
      },
      allow_promotion_codes: true, // Enable promo code entry
    };

    if (couponId) {
      sessionConfig.discounts = [{ coupon: couponId }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});