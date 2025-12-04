import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * NOTE: This is a simplified Web Push implementation for demonstration.
 * In production, you may want to use a dedicated Web Push library or service.
 * 
 * The Web Push protocol requires proper message encryption using the
 * subscription's p256dh and auth keys. This implementation provides
 * the basic structure but may need refinement for production use.
 * 
 * For production-ready push notifications, consider:
 * 1. Using a service like Firebase Cloud Messaging (FCM)
 * 2. Implementing full Web Push encryption as per RFC 8291
 * 3. Adding retry logic and better error handling
 */

interface PushNotificationPayload {
  user_id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  tag?: string;
}

interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
}

// Base64 URL encode helper
function base64UrlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Create VAPID headers for Web Push
async function createVapidHeaders(endpoint: string): Promise<Record<string, string>> {
  const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
  const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');

  if (!vapidPublicKey || !vapidPrivateKey) {
    throw new Error('VAPID keys not configured');
  }

  const url = new URL(endpoint);
  const audience = `${url.protocol}//${url.host}`;

  const jwtHeader = {
    typ: 'JWT',
    alg: 'ES256'
  };

  const exp = Math.floor(Date.now() / 1000) + (12 * 60 * 60); // 12 hours from now
  
  const jwtPayload = {
    aud: audience,
    exp: exp,
    sub: 'mailto:support@fpknexus.com'
  };

  // Import the private key
  const privateKeyBuffer = Uint8Array.from(atob(vapidPrivateKey), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBuffer,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    false,
    ['sign']
  );

  // Create JWT
  const headerBase64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(jwtHeader)));
  const payloadBase64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(jwtPayload)));
  const unsignedToken = `${headerBase64}.${payloadBase64}`;

  const signature = await crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const signatureBase64 = base64UrlEncode(new Uint8Array(signature));
  const jwt = `${unsignedToken}.${signatureBase64}`;

  return {
    'Authorization': `vapid t=${jwt}, k=${vapidPublicKey}`,
    'Content-Type': 'application/json',
  };
}

// Send push notification to a specific subscription
async function sendPushToSubscription(
  subscription: PushSubscription,
  payload: PushNotificationPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const vapidHeaders = await createVapidHeaders(subscription.endpoint);

    // Encrypt the payload using the subscription keys
    const payloadString = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/favicon.ico',
      badge: payload.badge || '/favicon.ico',
      data: payload.data || {},
      tag: payload.tag || 'notification'
    });

    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        ...vapidHeaders,
        'TTL': '86400', // 24 hours
      },
      body: payloadString,
    });

    if (response.status === 201 || response.status === 200) {
      console.log(`Push sent successfully to endpoint: ${subscription.endpoint.substring(0, 50)}...`);
      return { success: true };
    } else if (response.status === 404 || response.status === 410) {
      // Subscription expired or not found
      console.log(`Subscription expired or not found (${response.status}): ${subscription.id}`);
      return { success: false, error: 'expired' };
    } else {
      console.error(`Push failed with status ${response.status}: ${await response.text()}`);
      return { success: false, error: `status_${response.status}` };
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'unknown' };
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const payload: PushNotificationPayload = await req.json();

    console.log('Sending push notification to user:', payload.user_id);

    // Get all push subscriptions for the user
    const { data: subscriptions, error: subscriptionsError } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', payload.user_id);

    if (subscriptionsError) {
      throw subscriptionsError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscriptions found for user:', payload.user_id);
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'No subscriptions found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Found ${subscriptions.length} subscription(s) for user`);

    // Send push notification to all subscriptions
    const results = await Promise.all(
      subscriptions.map(subscription => sendPushToSubscription(subscription, payload))
    );

    // Clean up expired subscriptions
    const expiredSubscriptionIds = subscriptions
      .filter((sub, index) => results[index].error === 'expired')
      .map(sub => sub.id);

    if (expiredSubscriptionIds.length > 0) {
      console.log(`Cleaning up ${expiredSubscriptionIds.length} expired subscription(s)`);
      const { error: deleteError } = await supabaseClient
        .from('push_subscriptions')
        .delete()
        .in('id', expiredSubscriptionIds);

      if (deleteError) {
        console.error('Error deleting expired subscriptions:', deleteError);
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        total: subscriptions.length,
        expired: expiredSubscriptionIds.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-push-notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
