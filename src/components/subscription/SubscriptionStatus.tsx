import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function SubscriptionStatus() {
  const { subscription, isLoading, openCustomerPortal, refreshSubscription } = useSubscription();
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open customer portal",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading subscription status...</span>
        </CardContent>
      </Card>
    );
  }

  if (!subscription.subscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
            No Active Subscription
          </CardTitle>
          <CardDescription>
            You don't have an active subscription. Choose a plan to access premium features.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trialing': return 'bg-blue-500';
      case 'past_due': return 'bg-orange-500';
      case 'canceled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'basic': return 'bg-blue-500';
      case 'pro': return 'bg-purple-500';
      case 'premium': return 'bg-gold-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Subscription Status
          </div>
          <div className="flex gap-2">
            <Badge className={getTierColor(subscription.subscription_tier)}>
              {subscription.subscription_tier?.toUpperCase() || 'UNKNOWN'}
            </Badge>
            <Badge className={getStatusColor(subscription.subscription_status)}>
              {subscription.subscription_status?.toUpperCase() || 'UNKNOWN'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {subscription.subscription_end && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              {subscription.cancel_at_period_end ? 'Expires on' : 'Renews on'}: {' '}
              <strong>{format(new Date(subscription.subscription_end), 'PPP')}</strong>
            </span>
          </div>
        )}

        {subscription.cancel_at_period_end && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-sm text-orange-800">
              Your subscription is set to cancel at the end of the current period.
            </p>
          </div>
        )}

        {subscription.source === 'coupon' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              You're using free access from a redeemed coupon code.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleManageSubscription} variant="outline">
            Manage Subscription
          </Button>
          <Button onClick={refreshSubscription} variant="ghost" size="sm">
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}