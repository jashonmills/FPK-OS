import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, Loader2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

const PLANS = {
  basic: {
    name: 'Basic',
    monthly: 14.99,
    annual: 14.99 * 12 * 0.9,
    features: [
      'Access to basic AI coaching',
      'Study progress tracking',
      'Basic analytics',
      'Email support'
    ]
  },
  pro: {
    name: 'Pro',
    monthly: 39.99,
    annual: 39.99 * 12 * 0.85,
    features: [
      'Everything in Basic',
      'Advanced AI coaching',
      'Detailed analytics',
      'Priority support',
      'Custom study plans',
      'Advanced flashcards'
    ]
  },
  premium: {
    name: 'Premium',
    monthly: 59.99,
    annual: 59.99 * 12 * 0.8,
    features: [
      'Everything in Pro',
      'Unlimited AI interactions',
      'Advanced course creation',
      'White-label options',
      'API access',
      'Dedicated support'
    ]
  }
};

export function SubscriptionPlans() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const { subscription, createCheckout } = useSubscription();
  const { toast } = useToast();

  const handleSubscribe = async (tier: 'basic' | 'pro' | 'premium') => {
    try {
      setLoading(tier);
      const interval = isAnnual ? 'annual' : 'monthly';
      await createCheckout(tier, interval, couponCode || undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create checkout session",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const getDiscountPercentage = (tier: 'basic' | 'pro' | 'premium') => {
    if (tier === 'basic') return 10;
    if (tier === 'pro') return 15;
    return 20;
  };

  const getCurrentPlanBadge = (tier: 'basic' | 'pro' | 'premium') => {
    if (subscription.subscribed && subscription.subscription_tier === tier) {
      return <Badge variant="default" className="ml-2">Current Plan</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Annual/Monthly Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <Label htmlFor="billing-toggle">Monthly</Label>
        <Switch
          id="billing-toggle"
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <Label htmlFor="billing-toggle">
          Annual 
          <Badge variant="secondary" className="ml-2">Save up to 20%</Badge>
        </Label>
      </div>

      {/* Coupon Code Input */}
      <div className="max-w-md mx-auto">
        <Label htmlFor="coupon">Coupon Code</Label>
        <Input
          id="coupon"
          placeholder="Enter coupon code for discounts or free access"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        />
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(PLANS).map(([key, plan]) => {
          const tier = key as 'basic' | 'pro' | 'premium';
          const price = isAnnual ? plan.annual : plan.monthly;
          const monthlyPrice = isAnnual ? price / 12 : price;
          const discount = isAnnual ? getDiscountPercentage(tier) : 0;
          
          return (
            <Card key={tier} className={`relative ${tier === 'pro' ? 'ring-2 ring-primary' : ''}`}>
              {tier === 'pro' && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center">
                  {plan.name}
                  {getCurrentPlanBadge(tier)}
                </CardTitle>
                <CardDescription>
                  <div className="text-3xl font-bold">
                    ${monthlyPrice.toFixed(2)}
                    <span className="text-base font-normal">/month</span>
                  </div>
                  {isAnnual && discount > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <span className="line-through">${plan.monthly.toFixed(2)}/month</span>
                      <Badge variant="secondary" className="ml-2">{discount}% off</Badge>
                    </div>
                  )}
                  {isAnnual && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Billed annually: ${price.toFixed(2)}
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSubscribe(tier)}
                  disabled={loading === tier || (subscription.subscribed && subscription.subscription_tier === tier)}
                  variant={tier === 'pro' ? 'default' : 'outline'}
                >
                  {loading === tier ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : subscription.subscribed && subscription.subscription_tier === tier ? (
                    'Current Plan'
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Free Trial Coupons Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Try these coupon codes for free access:</p>
        <div className="flex justify-center gap-4 mt-2">
          <Badge variant="outline">BETA2025</Badge>
          <Badge variant="outline">FREEMONTH</Badge>
          <Badge variant="outline">WELCOME</Badge>
        </div>
      </div>
    </div>
  );
}