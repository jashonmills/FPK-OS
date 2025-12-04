# Stripe Production Setup Instructions

## Step 1: Create Products and Prices

Run the setup function **once** to create all products in your Stripe account:

```bash
curl -X POST https://pnxwemmpxldriwaomiey.supabase.co/functions/v1/setup-stripe-products
```

Or visit in your browser:
```
https://pnxwemmpxldriwaomiey.supabase.co/functions/v1/setup-stripe-products
```

This will return a JSON response with all the Price IDs you need.

## Step 2: Copy the Price IDs

From the response, copy the `code_template` section which will look like:

```typescript
const STRIPE_PRICES = {
  team_monthly: 'price_xxxxxxxxxxxxx',
  team_annual: 'price_xxxxxxxxxxxxx',
  pro_monthly: 'price_xxxxxxxxxxxxx',
  pro_annual: 'price_xxxxxxxxxxxxx',
};
```

## Step 3: Update manage-subscription Function

Open `supabase/functions/manage-subscription/index.ts` and replace lines 10-15 with the real Price IDs from Step 2.

## Step 4: Configure Stripe Webhook

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add an endpoint"
3. Set Endpoint URL to:
   ```
   https://pnxwemmpxldriwaomiey.supabase.co/functions/v1/stripe-webhook
   ```
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
5. Click "Add endpoint"
6. Click "Reveal" under "Signing secret"
7. Copy the secret (starts with `whsec_`)

## Step 5: Add Webhook Secret

1. Open your Lovable project
2. Go to Project Settings → Secrets
3. Add a new secret:
   - Name: `STRIPE_WEBHOOK_SECRET`
   - Value: (paste the webhook secret from Step 4)

## Step 6: Test the Integration

Use Stripe test mode with test card `4242 4242 4242 4242`:
1. Go to `/pricing` page
2. Click "Start 14-Day Free Trial" for Collaborative Team
3. Complete checkout
4. Verify subscription appears in Stripe Dashboard
5. Verify family tier updates in database

## Step 7: Configure Promotion Codes (Optional)

Promotion codes are already enabled in the checkout! To use them:

1. Go to Stripe Dashboard → Products → Coupons
2. Click "Create coupon"
3. Configure discount:
   - Percentage off (e.g., 100% for free trial)
   - Fixed amount off
   - Duration: once, forever, or repeating (e.g., 12 months)
4. Save the coupon
5. The coupon field will automatically appear in checkout
6. Share the coupon code with users (e.g., "Just4You")

**Note:** The checkout session includes `allow_promotion_codes: true`, so users will see a "Add promotion code" link during checkout.

## Step 8: Monitor Integration (Optional)

Access the Stripe integration dashboard at `/admin-stripe` to:
- View Stripe connection status
- Check configured price IDs
- See recent subscriptions
- Test the checkout flow

## Verification Checklist

- [ ] Products created in Stripe (visible in Dashboard → Products)
- [ ] Price IDs updated in `manage-subscription/index.ts`
- [ ] Webhook configured with correct URL and events
- [ ] `STRIPE_WEBHOOK_SECRET` added to project secrets
- [ ] Test purchase completes successfully
- [ ] Database updates with correct subscription tier
- [ ] À la carte purchases work for Deep-Dive, Goal Generation, Resource Pack
- [ ] **Coupon field appears in checkout**
- [ ] **Test coupon applies correctly (e.g., 100% off)**
- [ ] **Discounted subscription activates properly**
- [ ] **Webhook logs discount information**

## Troubleshooting

**Error: "Invalid pricing option"**
→ Price IDs not updated correctly in manage-subscription function

**Error: "No signature"**
→ Webhook secret not configured or incorrect

**Checkout fails silently**
→ Check Stripe Dashboard → Events for webhook delivery errors

**Family tier doesn't update**
→ Check webhook events are being received and processed
