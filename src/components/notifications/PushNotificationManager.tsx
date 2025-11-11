import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, BellOff, AlertCircle, CheckCircle2, Smartphone } from "lucide-react";
import { toast } from "sonner";

// Helper function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const PushNotificationManager = () => {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Check browser support and current status
  useEffect(() => {
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 
                       'PushManager' in window && 
                       'Notification' in window;
      
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
        
        // Register service worker
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          setRegistration(reg);
          
          // Check if already subscribed
          const subscription = await reg.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        } catch (error) {
          console.error('Service worker registration failed:', error);
        }
      }
    };

    checkSupport();
  }, []);

  const subscribeToPush = async () => {
    if (!isSupported || !registration || !user) {
      toast.error('Push notifications are not supported');
      return;
    }

    setLoading(true);
    try {
      // Request notification permission
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== 'granted') {
        toast.error('Notification permission denied');
        setLoading(false);
        return;
      }

      // Get VAPID public key from backend
      const { data: keyData, error: keyError } = await supabase.functions.invoke('get-vapid-public-key');
      
      if (keyError || !keyData?.publicKey) {
        toast.error('Push notification configuration error');
        console.error('Failed to get VAPID public key:', keyError);
        setLoading(false);
        return;
      }

      const vapidPublicKey = keyData.publicKey;

      // Subscribe to push notifications
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey.trim());
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as BufferSource
      });

      // Send subscription to backend
      const subscriptionJson = subscription.toJSON();
      
      const { error } = await supabase
        .from('push_subscriptions')
        .insert({
          user_id: user.id,
          endpoint: subscriptionJson.endpoint!,
          p256dh_key: subscriptionJson.keys!.p256dh,
          auth_key: subscriptionJson.keys!.auth,
          user_agent: navigator.userAgent
        });

      if (error) {
        // If subscription already exists, that's fine
        if (!error.message.includes('duplicate')) {
          throw error;
        }
      }

      setIsSubscribed(true);
      toast.success('Push notifications enabled!');
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast.error('Failed to enable push notifications');
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    if (!registration || !user) return;

    setLoading(true);
    try {
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove from database
        const subscriptionJson = subscription.toJSON();
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', subscriptionJson.endpoint!);
      }

      setIsSubscribed(false);
      toast.success('Push notifications disabled');
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast.error('Failed to disable push notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      await subscribeToPush();
    } else {
      await unsubscribeFromPush();
    }
  };

  if (!user) return null;

  if (!isSupported) {
    return (
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <Smartphone className="w-5 h-5" />
            Push Notifications
          </CardTitle>
          <CardDescription className="text-yellow-700 dark:text-yellow-300">
            Browser not supported
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your browser doesn't support push notifications. Try using Chrome, Firefox, or Edge for the best experience.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {isSubscribed ? (
                <Bell className="w-5 h-5 text-primary" />
              ) : (
                <BellOff className="w-5 h-5 text-muted-foreground" />
              )}
              Push Notifications
            </CardTitle>
            <CardDescription>
              Receive notifications even when the app is closed
            </CardDescription>
          </div>
          <Switch
            checked={isSubscribed}
            onCheckedChange={handleToggle}
            disabled={loading || permission === 'denied'}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {permission === 'denied' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You've blocked notifications. Please enable them in your browser settings to receive push notifications.
            </AlertDescription>
          </Alert>
        )}

        {permission === 'granted' && isSubscribed && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Push notifications are enabled! You'll receive notifications even when the app is closed.
            </AlertDescription>
          </Alert>
        )}

        {permission === 'default' && !isSubscribed && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Enable push notifications to stay updated about new messages and activity, even when you're not using the app.
            </p>
            <Button 
              onClick={subscribeToPush} 
              disabled={loading}
              className="w-full"
            >
              <Bell className="w-4 h-4 mr-2" />
              Enable Push Notifications
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
          <p className="font-medium">About Push Notifications:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Works even when the app is closed</li>
            <li>Requires HTTPS (already enabled)</li>
            <li>You can disable anytime from this page</li>
            <li>Respects your notification preferences</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
