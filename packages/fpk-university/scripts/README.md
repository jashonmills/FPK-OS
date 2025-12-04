# Stripe Setup Script

This script automates the creation of Stripe products, prices, and promotion codes for the AI Study Coach credit-based subscription system.

## What It Creates

### Products & Prices
- **AI Coach Basic**: $4.99/mo or $49/yr (500 credits/month)
- **AI Coach Pro**: $19/mo or $199/yr (2500 credits/month)
- **AI Coach Pro+**: $29/mo or $299/yr (5000 credits/month)
- **AI Credit Pack**: $5 one-time (500 credits)

### Promotion Code
- **COACHVIP2025**: 100% off forever (250 max redemptions)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd scripts
   npm install
   ```

2. **Set Environment Variable**
   ```bash
   export STRIPE_SECRET_KEY="sk_test_xxxxx"
   ```
   
   Or create a `.env` file:
   ```
   STRIPE_SECRET_KEY=sk_test_xxxxx
   ```

3. **Run the Script**
   ```bash
   npm run setup
   ```

4. **Copy the Output**
   The script will output Price IDs. Copy these into:
   `supabase/functions/_shared/stripe-config.ts`

## Important Notes

- All subscription prices include a **7-day free trial**
- All prices are in **USD**
- Metadata is attached to products and prices for easy reference
- The script is **idempotent** - safe to run multiple times (creates new products each time)

## Troubleshooting

**Error: "No such api_key"**
- Make sure STRIPE_SECRET_KEY is set correctly
- Verify the key starts with `sk_test_` or `sk_live_`

**Error: "Product already exists"**
- This is normal - Stripe allows multiple products with the same name
- Each run creates new products with unique IDs

## After Running

1. Update `stripe-config.ts` with the generated Price IDs
2. Deploy your edge functions
3. Configure webhook endpoint in Stripe Dashboard:
   - URL: `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`, `customer.subscription.updated`
4. Add webhook signing secret to Supabase secrets as `STRIPE_WEBHOOK_SECRET`
