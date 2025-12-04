import Stripe from 'stripe';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const PRODUCTS_CONFIG = {
  basic: {
    name: 'AI Coach Basic',
    description: '500 AI credits per month - Perfect for casual learners',
    monthly_price: 499,  // $4.99 in cents
    annual_price: 4900,  // $49.00 in cents
    credits: 500,
    tier: 'basic'
  },
  pro: {
    name: 'AI Coach Pro',
    description: '2500 AI credits per month - For dedicated students',
    monthly_price: 1900,  // $19.00 in cents
    annual_price: 19900,  // $199.00 in cents
    credits: 2500,
    tier: 'pro'
  },
  pro_plus: {
    name: 'AI Coach Pro+',
    description: '5000 AI credits per month - Maximum learning power',
    monthly_price: 2900,  // $29.00 in cents
    annual_price: 29900,  // $299.00 in cents
    credits: 5000,
    tier: 'pro_plus'
  },
  credit_pack: {
    name: 'AI Credit Pack',
    description: '500 credits top-up - Instant credit boost',
    price: 500,  // $5.00 in cents
    credits_granted: 500
  }
};

async function setupStripeProducts() {
  console.log('🚀 Starting Stripe product setup...\n');
  
  const priceIds: Record<string, string> = {};
  
  try {
    // Create subscription products
    for (const [key, config] of Object.entries(PRODUCTS_CONFIG)) {
      if (key === 'credit_pack') continue; // Handle separately
      
      console.log(`📦 Creating product: ${config.name}...`);
      
      // Create product
      const product = await stripe.products.create({
        name: config.name,
        description: config.description,
        metadata: {
          tier: config.tier,
          monthly_credits: config.credits.toString()
        }
      });
      
      console.log(`   ✅ Product created: ${product.id}`);
      
      // Create monthly price
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: config.monthly_price,
        currency: 'usd',
        recurring: { 
          interval: 'month',
          trial_period_days: 7 
        },
        metadata: {
          tier: config.tier,
          monthly_credits: config.credits.toString(),
          billing_period: 'monthly'
        }
      });
      
      // Create annual price
      const annualPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: config.annual_price,
        currency: 'usd',
        recurring: { 
          interval: 'year',
          trial_period_days: 7 
        },
        metadata: {
          tier: config.tier,
          monthly_credits: config.credits.toString(),
          billing_period: 'annual'
        }
      });
      
      priceIds[`${key}_monthly`] = monthlyPrice.id;
      priceIds[`${key}_annual`] = annualPrice.id;
      
      console.log(`   💰 Monthly Price: ${monthlyPrice.id}`);
      console.log(`   💰 Annual Price: ${annualPrice.id}\n`);
    }
    
    // Create one-time credit pack
    console.log(`📦 Creating one-time product: ${PRODUCTS_CONFIG.credit_pack.name}...`);
    
    const creditPackProduct = await stripe.products.create({
      name: PRODUCTS_CONFIG.credit_pack.name,
      description: PRODUCTS_CONFIG.credit_pack.description,
      metadata: {
        credits_granted: PRODUCTS_CONFIG.credit_pack.credits_granted.toString(),
        product_type: 'credit_pack'
      }
    });
    
    console.log(`   ✅ Product created: ${creditPackProduct.id}`);
    
    const creditPackPrice = await stripe.prices.create({
      product: creditPackProduct.id,
      unit_amount: PRODUCTS_CONFIG.credit_pack.price,
      currency: 'usd',
      metadata: {
        credits_granted: PRODUCTS_CONFIG.credit_pack.credits_granted.toString(),
        product_type: 'credit_pack'
      }
    });
    
    priceIds['credit_pack'] = creditPackPrice.id;
    console.log(`   💰 Price: ${creditPackPrice.id}\n`);
    
    // Create promotion code
    console.log(`🎟️  Creating promotion code: COACHVIP2025...`);
    
    const coupon = await stripe.coupons.create({
      percent_off: 100,
      duration: 'forever',
      name: 'COACHVIP2025 - Lifetime Free Access',
      metadata: {
        description: 'VIP lifetime access for early adopters',
        campaign: 'launch_2025'
      }
    });
    
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: 'COACHVIP2025',
      max_redemptions: 250,
      metadata: {
        description: 'VIP lifetime access for early adopters',
        target_audience: 'beta_users'
      }
    });
    
    console.log(`   ✅ Promotion code created: ${promoCode.code}\n`);
    
    // Output summary
    console.log('\n' + '='.repeat(80));
    console.log('🎉 STRIPE SETUP COMPLETE!');
    console.log('='.repeat(80) + '\n');
    
    console.log('📋 Copy these Price IDs to your stripe-config.ts file:\n');
    console.log('─'.repeat(80));
    
    console.log(`AI_COACH_BASIC_MONTHLY="${priceIds.basic_monthly}"`);
    console.log(`AI_COACH_BASIC_ANNUAL="${priceIds.basic_annual}"`);
    console.log(`AI_COACH_PRO_MONTHLY="${priceIds.pro_monthly}"`);
    console.log(`AI_COACH_PRO_ANNUAL="${priceIds.pro_annual}"`);
    console.log(`AI_COACH_PRO_PLUS_MONTHLY="${priceIds.pro_plus_monthly}"`);
    console.log(`AI_COACH_PRO_PLUS_ANNUAL="${priceIds.pro_plus_annual}"`);
    console.log(`AI_CREDIT_PACK="${priceIds.credit_pack}"`);
    
    console.log('\n' + '─'.repeat(80));
    console.log(`🎟️  Promotion Code: ${promoCode.code} (100% off forever)`);
    console.log(`   Max Redemptions: ${promoCode.max_redemptions}`);
    console.log('─'.repeat(80) + '\n');
    
    console.log('📝 Next Steps:');
    console.log('   1. Copy the Price IDs above into supabase/functions/_shared/stripe-config.ts');
    console.log('   2. Deploy your edge functions');
    console.log('   3. Configure Stripe webhook in Dashboard');
    console.log('   4. Test the checkout flow\n');
    
    return priceIds;
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
    }
    throw error;
  }
}

// Run the setup
setupStripeProducts()
  .then(() => {
    console.log('✅ Setup completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed with error:', error);
    process.exit(1);
  });
