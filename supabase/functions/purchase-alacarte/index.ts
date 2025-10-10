import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALACARTE_PRICES = {
  deep_dive: 9.99,
  goal_generation: 4.99,
  resource_pack: 19.99,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { familyId, purchaseType, metadata } = await req.json();

    if (!familyId || !purchaseType || !ALACARTE_PRICES[purchaseType as keyof typeof ALACARTE_PRICES]) {
      return new Response(
        JSON.stringify({ error: "Invalid parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify family membership
    const { data: membership } = await supabase
      .from("family_members")
      .select("role")
      .eq("family_id", familyId)
      .eq("user_id", user.id)
      .single();

    if (!membership) {
      return new Response(JSON.stringify({ error: "Not a family member" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify family is on paid tier
    const { data: family } = await supabase
      .from("families")
      .select("subscription_tier, stripe_customer_id")
      .eq("id", familyId)
      .single();

    if (!family || family.subscription_tier === "free") {
      return new Response(
        JSON.stringify({ error: "À la carte features require a paid subscription" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const amount = ALACARTE_PRICES[purchaseType as keyof typeof ALACARTE_PRICES];

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      customer: family.stripe_customer_id || undefined,
      metadata: {
        family_id: familyId,
        user_id: user.id,
        purchase_type: purchaseType,
      },
    });

    // Store purchase record
    const { data: purchase, error: insertError } = await supabase
      .from("alacarte_purchases")
      .insert({
        family_id: familyId,
        user_id: user.id,
        purchase_type: purchaseType,
        stripe_payment_intent_id: paymentIntent.id,
        amount,
        status: "pending",
        metadata,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating purchase record:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create purchase record" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        purchaseId: purchase.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in purchase-alacarte:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
