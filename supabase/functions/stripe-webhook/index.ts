import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

Deno.serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    console.log('Received event:', event.type);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle payment intent succeeded (for à la carte purchases)
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      console.log('Payment intent succeeded:', paymentIntent.id);

      // Find the purchase record
      const { data: purchase } = await supabaseAdmin
        .from('alacarte_purchases')
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .single();

      if (purchase) {
        // Update status to completed
        await supabaseAdmin
          .from('alacarte_purchases')
          .update({ status: 'completed' })
          .eq('id', purchase.id);

        // Execute the purchased service
        try {
          if (purchase.purchase_type === 'deep_dive' && purchase.metadata.document_id) {
            await supabaseAdmin.functions.invoke('analyze-document', {
              body: {
                document_id: purchase.metadata.document_id,
                bypass_limit: true,
              },
            });
          } else if (purchase.purchase_type === 'resource_pack') {
            await supabaseAdmin.functions.invoke('generate-resource-pack', {
              body: {
                student_id: purchase.metadata.student_id,
                family_id: purchase.family_id,
              },
            });
          }
        } catch (execError) {
          console.error('Error executing purchased service:', execError);
        }
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const familyId = session.metadata?.family_id;
        const tier = session.metadata?.tier;

        if (!familyId || !tier) {
          console.error('Missing metadata in checkout session');
          break;
        }

        // Update family subscription
        const tierLimits = {
          team: { max_students: 5, storage_limit_mb: 5120 },
          pro: { max_students: -1, storage_limit_mb: 20480 },
        };

        const limits = tierLimits[tier as keyof typeof tierLimits];

        await supabaseAdmin
          .from('families')
          .update({
            subscription_tier: tier,
            subscription_status: 'active',
            stripe_customer_id: session.customer as string,
            ...limits,
          })
          .eq('id', familyId);

        console.log(`Subscription activated for family ${familyId}, tier: ${tier}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get family by customer ID
        const { data: family } = await supabaseAdmin
          .from('families')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!family) {
          console.error('Family not found for customer:', customerId);
          break;
        }

        // Determine tier from subscription
        const priceId = subscription.items.data[0]?.price.id;
        let tier = 'free';
        
        if (priceId?.includes('team')) tier = 'team';
        if (priceId?.includes('pro')) tier = 'pro';

        const status = subscription.status === 'active' ? 'active' : 
                       subscription.status === 'past_due' ? 'past_due' : 
                       subscription.status === 'canceled' ? 'canceled' : 'active';

        const tierLimits = {
          team: { max_students: 5, storage_limit_mb: 5120 },
          pro: { max_students: -1, storage_limit_mb: 20480 },
          free: { max_students: 1, storage_limit_mb: 500 },
        };

        const limits = tierLimits[tier as keyof typeof tierLimits];

        await supabaseAdmin
          .from('families')
          .update({
            subscription_tier: tier,
            subscription_status: status,
            ...limits,
          })
          .eq('id', family.id);

        console.log(`Subscription updated for family ${family.id}, tier: ${tier}, status: ${status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: family } = await supabaseAdmin
          .from('families')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!family) {
          console.error('Family not found for customer:', customerId);
          break;
        }

        // Downgrade to free tier
        await supabaseAdmin
          .from('families')
          .update({
            subscription_tier: 'free',
            subscription_status: 'canceled',
            max_students: 1,
            storage_limit_mb: 500,
          })
          .eq('id', family.id);

        console.log(`Subscription canceled for family ${family.id}, downgraded to free`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data: family } = await supabaseAdmin
          .from('families')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (family) {
          await supabaseAdmin
            .from('families')
            .update({ subscription_status: 'past_due' })
            .eq('id', family.id);

          console.log(`Payment failed for family ${family.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
