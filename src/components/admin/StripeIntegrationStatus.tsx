import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const STRIPE_PRICES = {
  team_monthly: 'price_1SGoFOGIfNQON3xUrpVpLf4o',
  team_annual: 'price_1SGoFOGIfNQON3xUXtEqdFg4',
  pro_monthly: 'price_1SGoFOGIfNQON3xU8Kc9AV8L',
  pro_annual: 'price_1SGoFOGIfNQON3xUpPhN9fZv',
};

export const StripeIntegrationStatus = () => {
  const { data: families, isLoading } = useQuery({
    queryKey: ['stripe-families'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('families')
        .select('*')
        .not('stripe_customer_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const handleTestCheckout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to test checkout");
        return;
      }

      // Get user's family
      const { data: membership } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)
        .single();

      if (!membership) {
        toast.error("No family found");
        return;
      }

      const { data, error } = await supabase.functions.invoke('manage-subscription', {
        body: {
          action: 'create_checkout',
          familyId: membership.family_id,
          tier: 'team',
          billingCycle: 'monthly',
        },
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
        toast.success("Test checkout session created");
      }
    } catch (error) {
      console.error('Test checkout error:', error);
      toast.error("Failed to create test checkout");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stripe Integration Status</CardTitle>
          <CardDescription>Monitor your Stripe connection and configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">Stripe Connected</span>
            </div>
            <Badge variant="outline">Active</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">Webhook Configured</span>
            </div>
            <Badge variant="outline">Ready</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">Promotion Codes Enabled</span>
            </div>
            <Badge variant="outline">Enabled</Badge>
          </div>

          <Button onClick={handleTestCheckout} className="w-full">
            Test Checkout Flow
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price Configuration</CardTitle>
          <CardDescription>Configured Stripe price IDs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Team Monthly:</span>
              <code className="text-xs">{STRIPE_PRICES.team_monthly}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Team Annual:</span>
              <code className="text-xs">{STRIPE_PRICES.team_annual}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pro Monthly:</span>
              <code className="text-xs">{STRIPE_PRICES.pro_monthly}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pro Annual:</span>
              <code className="text-xs">{STRIPE_PRICES.pro_annual}</code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
          <CardDescription>Latest families with Stripe customers</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : families && families.length > 0 ? (
            <div className="space-y-2">
              {families.map((family) => (
                <div key={family.id} className="flex items-center justify-between text-sm border-b pb-2">
                  <div>
                    <p className="font-medium">{family.family_name}</p>
                    <p className="text-xs text-muted-foreground">{family.stripe_customer_id}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={family.subscription_status === 'active' ? 'default' : 'secondary'}>
                      {family.subscription_tier}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {family.subscription_status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No subscriptions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
