import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[REDEEM-COUPON] ${step}${detailsStr}`);
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { couponCode } = await req.json();
    if (!couponCode) throw new Error("Coupon code is required");

    logStep("Processing coupon", { couponCode });

    // Check if coupon exists and is valid
    const { data: couponData, error: couponError } = await supabaseClient
      .from('coupon_codes')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (couponError || !couponData) {
      throw new Error("Invalid or expired coupon code");
    }

    logStep("Found coupon", { coupon: couponData });

    // Check if coupon is expired
    if (couponData.expires_at && new Date(couponData.expires_at) < new Date()) {
      throw new Error("Coupon code has expired");
    }

    // Check if coupon has reached max uses
    if (couponData.max_uses && couponData.current_uses >= couponData.max_uses) {
      throw new Error("Coupon code has reached maximum uses");
    }

    // Check if user has already redeemed this coupon
    const { data: existingRedemption } = await supabaseClient
      .from('coupon_redemptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('coupon_id', couponData.id)
      .single();

    if (existingRedemption) {
      throw new Error("You have already redeemed this coupon code");
    }

    // For free access coupons
    if (couponData.duration_months && !couponData.discount_percent) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + couponData.duration_months);

      // Grant ai_coach_user role for portal access
      const { error: roleError } = await supabaseClient
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'ai_coach_user'
        })
        .select()
        .single();

      // Ignore duplicate key errors (user already has role)
      if (roleError && !roleError.message.includes('duplicate')) {
        logStep("Error granting ai_coach_user role", roleError);
      } else {
        logStep("Granted ai_coach_user role", { userId: user.id });
      }

      // Create redemption record
      const { error: redemptionError } = await supabaseClient
        .from('coupon_redemptions')
        .insert({
          user_id: user.id,
          coupon_id: couponData.id,
          expires_at: expiresAt.toISOString()
        });

      if (redemptionError) throw redemptionError;

      // Update or create subscriber record
      const { error: subscriberError } = await supabaseClient
        .from('subscribers')
        .upsert({
          user_id: user.id,
          email: user.email,
          subscribed: true,
          subscription_tier: couponData.subscription_tier,
          subscription_status: 'active',
          subscription_end: expiresAt.toISOString()
        }, { onConflict: 'user_id' });

      if (subscriberError) throw subscriberError;

      // Grant initial credits (from coupon metadata or default)
      const initialCredits = parseInt(couponData.metadata?.initial_credits || '500', 10);
      const { data: creditResult, error: creditError } = await supabaseClient
        .rpc('add_ai_credits', {
          p_user_id: user.id,
          p_amount: initialCredits,
          p_transaction_type: 'coupon_redemption',
          p_metadata: {
            coupon_code: couponData.code,
            coupon_id: couponData.id
          }
        });

      if (creditError) {
        logStep("Error granting initial credits", creditError);
      } else {
        logStep("Granted initial credits", { 
          userId: user.id, 
          credits: initialCredits,
          newBalance: creditResult?.balance_after 
        });
      }

      // Update coupon usage count
      const { error: updateError } = await supabaseClient
        .from('coupon_codes')
        .update({ current_uses: couponData.current_uses + 1 })
        .eq('id', couponData.id);

      if (updateError) throw updateError;

      logStep("Coupon redeemed successfully", { 
        tier: couponData.subscription_tier, 
        duration: couponData.duration_months,
        expiresAt: expiresAt.toISOString(),
        creditsGranted: initialCredits
      });

      return new Response(JSON.stringify({
        success: true,
        message: `Coupon redeemed! You now have ${couponData.duration_months} months of free ${couponData.subscription_tier} access.`,
        subscription_tier: couponData.subscription_tier,
        expires_at: expiresAt.toISOString(),
        duration_months: couponData.duration_months,
        credits_granted: initialCredits,
        redirect_to: '/coach/pro'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // For discount coupons, return the discount info for use in checkout
    return new Response(JSON.stringify({
      success: true,
      coupon: {
        id: couponData.id,
        code: couponData.code,
        discount_percent: couponData.discount_percent,
        description: couponData.description
      },
      message: `Coupon validated! You'll receive ${couponData.discount_percent}% off your subscription.`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in redeem-coupon", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});