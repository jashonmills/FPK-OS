import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting Stripe product and price creation...");

    const results: Record<string, any> = {};

    // 1. Create Collaborative Team Product
    const teamProduct = await stripe.products.create({
      name: "Collaborative Team",
      description: "Monthly or annual subscription for team collaboration features."
    });

    const teamMonthly = await stripe.prices.create({
      product: teamProduct.id,
      unit_amount: 2500, // $25.00
      currency: "usd",
      recurring: { interval: "month" }
    });

    const teamAnnual = await stripe.prices.create({
      product: teamProduct.id,
      unit_amount: 25500, // $255.00
      currency: "usd",
      recurring: { interval: "year" }
    });

    results.team = {
      product_id: teamProduct.id,
      monthly_price_id: teamMonthly.id,
      annual_price_id: teamAnnual.id
    };

    console.log("✓ Created Collaborative Team product");

    // 2. Create Insights Pro Product
    const proProduct = await stripe.products.create({
      name: "Insights Pro",
      description: "Monthly or annual subscription for advanced AI insights."
    });

    const proMonthly = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 6000, // $60.00
      currency: "usd",
      recurring: { interval: "month" }
    });

    const proAnnual = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 61200, // $612.00
      currency: "usd",
      recurring: { interval: "year" }
    });

    results.pro = {
      product_id: proProduct.id,
      monthly_price_id: proMonthly.id,
      annual_price_id: proAnnual.id
    };

    console.log("✓ Created Insights Pro product");

    // 3. Create On-Demand Document Deep-Dive
    const deepDiveProduct = await stripe.products.create({
      name: "On-Demand Document Deep-Dive",
      description: "Comprehensive AI analysis of a single complex document"
    });

    const deepDivePrice = await stripe.prices.create({
      product: deepDiveProduct.id,
      unit_amount: 999, // $9.99
      currency: "usd"
    });

    results.deep_dive = {
      product_id: deepDiveProduct.id,
      price_id: deepDivePrice.id
    };

    console.log("✓ Created Document Deep-Dive product");

    // 4. Create AI-Generated Goal
    const goalProduct = await stripe.products.create({
      name: "AI-Generated Goal",
      description: "Data-driven, measurable goal generation for IEPs"
    });

    const goalPrice = await stripe.prices.create({
      product: goalProduct.id,
      unit_amount: 499, // $4.99
      currency: "usd"
    });

    results.goal_generation = {
      product_id: goalProduct.id,
      price_id: goalPrice.id
    };

    console.log("✓ Created AI-Generated Goal product");

    // 5. Create Personalized Resource Pack
    const resourcePackProduct = await stripe.products.create({
      name: "Personalized Resource Pack",
      description: "Custom curated learning plan from knowledge base"
    });

    const resourcePackPrice = await stripe.prices.create({
      product: resourcePackProduct.id,
      unit_amount: 1999, // $19.99
      currency: "usd"
    });

    results.resource_pack = {
      product_id: resourcePackProduct.id,
      price_id: resourcePackPrice.id
    };

    console.log("✓ Created Personalized Resource Pack product");

    // Format output for easy copy-paste into code
    const codeTemplate = `
// ========================================
// COPY THESE VALUES TO YOUR EDGE FUNCTIONS
// ========================================

// For manage-subscription/index.ts:
const STRIPE_PRICES = {
  team_monthly: '${teamMonthly.id}',
  team_annual: '${teamAnnual.id}',
  pro_monthly: '${proMonthly.id}',
  pro_annual: '${proAnnual.id}',
};

// For purchase-alacarte/index.ts:
const ALACARTE_PRICES = {
  deep_dive: 9.99,
  goal_generation: 4.99,
  resource_pack: 19.99,
};

// Note: The prices above are already correct in purchase-alacarte.
// Only update the STRIPE_PRICES in manage-subscription.
`;

    return new Response(
      JSON.stringify({
        success: true,
        message: "All Stripe products and prices created successfully!",
        results,
        code_template: codeTemplate
      }, null, 2),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error creating Stripe products:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
