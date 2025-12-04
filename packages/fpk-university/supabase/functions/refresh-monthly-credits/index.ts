import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[REFRESH-CREDITS] ${step}${detailsStr}`);
};

/**
 * Refresh Monthly Credits Function
 * 
 * This function is called daily by pg_cron to check for users whose
 * billing anniversary is today and refresh their AI credit allotments.
 */
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
    logStep("Starting monthly credit refresh");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Get all active subscribers
    const { data: activeSubscribers, error: subsError } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('subscribed', true)
      .eq('subscription_status', 'active')
      .not('subscription_id', 'is', null);

    if (subsError) throw subsError;

    logStep(`Found ${activeSubscribers?.length || 0} active subscribers`);

    let refreshedCount = 0;
    const today = new Date();
    const todayDayOfMonth = today.getDate();

    for (const subscriber of activeSubscribers || []) {
      try {
        // Check if today is their billing anniversary
        if (subscriber.current_period_start) {
          const periodStart = new Date(subscriber.current_period_start);
          const billingDay = periodStart.getDate();

          // Only refresh if today matches their billing day
          if (billingDay !== todayDayOfMonth) {
            continue;
          }

          logStep(`Processing credit refresh for user`, { 
            userId: subscriber.user_id, 
            billingDay 
          });

          // Get subscription from Stripe to fetch credit metadata
          if (subscriber.subscription_id) {
            const subscription = await stripe.subscriptions.retrieve(subscriber.subscription_id);
            const priceId = subscription.items.data[0].price.id;
            const price = await stripe.prices.retrieve(priceId, { expand: ['product'] });
            const product = price.product as Stripe.Product;
            const monthlyCredits = parseInt(product.metadata?.monthly_credits || '0', 10);

            if (monthlyCredits > 0) {
              // Add credits using the database function
              const { data: addResult, error: addError } = await supabaseClient
                .rpc('add_ai_credits', {
                  p_user_id: subscriber.user_id,
                  p_amount: monthlyCredits,
                  p_transaction_type: 'monthly_refresh',
                  p_metadata: {
                    subscription_id: subscriber.subscription_id,
                    refresh_date: today.toISOString()
                  }
                });

              if (addError) {
                logStep(`Error adding credits for user ${subscriber.user_id}`, addError);
                continue;
              }

              logStep(`Refreshed ${monthlyCredits} credits for user`, {
                userId: subscriber.user_id,
                newBalance: addResult.balance_after
              });

              refreshedCount++;
            }
          }
        }
      } catch (userError) {
        logStep(`Error processing user ${subscriber.user_id}`, userError);
        // Continue with next user
      }
    }

    logStep(`Credit refresh complete`, { refreshedCount });

    return new Response(JSON.stringify({
      success: true,
      refreshed_count: refreshedCount,
      total_active_subscribers: activeSubscribers?.length || 0
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in refresh-monthly-credits", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});