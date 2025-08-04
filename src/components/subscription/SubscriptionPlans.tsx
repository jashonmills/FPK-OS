import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, Loader2, DollarSign, Euro } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

interface PlanType {
  name: string;
  badge: string;
  monthly: number;
  annual: number;
  popular?: boolean;
  features: string[];
}

const PLANS: Record<'calm' | 'me' | 'us' | 'universal', PlanType> = {
  calm: {
    name: 'FPK Calm',
    badge: 'Free',
    monthly: 0,
    annual: 0,
    features: [
      '5 AI chat messages/month',
      '2 minutes voice processing/month',
      '3 knowledge queries/month',
      '1 document processing/month',
      '25 flashcard generations/month',
      '5 AI insights/month',
      '10MB storage',
      'Community support'
    ]
  },
  me: {
    name: 'FPK Me',
    badge: 'Individual',
    monthly: 21.99, // 10% increase from 19.99
    annual: 21.99 * 12 * 0.9,
    features: [
      '150 AI chat messages/month',
      '90 minutes voice processing/month',
      '75 knowledge queries/month',
      '15 document processing/month',
      '300 flashcard generations/month',
      '75 AI insights/month',
      '200MB knowledge storage',
      'Personal progress tracking',
      'Email support'
    ]
  },
  us: {
    name: 'FPK Us',
    badge: 'Family',
    monthly: 54.99, // 10% increase from 49.99
    annual: 54.99 * 12 * 0.85,
    popular: true,
    features: [
      '🏠 3 family member seats',
      '500 AI chat messages/month (shared)',
      '300 minutes voice processing/month (shared)',
      '250 knowledge queries/month (shared)',
      '50 document processing/month (shared)',
      '1,000 flashcard generations/month (shared)',
      '200 AI insights/month (shared)',
      '1GB knowledge storage (shared)',
      'Family progress dashboard',
      'Individual member tracking',
      'Priority support'
    ]
  },
  universal: {
    name: 'FPK Universal',
    badge: 'Premium',
    monthly: 87.99, // 10% increase from 79.99
    annual: 87.99 * 12 * 0.8,
    features: [
      '🚀 Unlimited AI interactions',
      '🚀 Unlimited voice processing',
      '🚀 Unlimited knowledge queries',
      '🚀 Unlimited document processing',
      '🚀 Unlimited flashcard generation',
      '🚀 Unlimited AI insights',
      '5GB knowledge storage',
      'Advanced analytics dashboard',
      'Advanced course creation tools',
      'White-label options',
      'API access (coming soon)',
      'Dedicated support',
      'Early access to new features'
    ]
  }
};

export function SubscriptionPlans() {
  const [isAnnual, setIsAnnual] = useState(true); // Changed to true to make annual default
  const [isEuro, setIsEuro] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const { subscription, createCheckout } = useSubscription();
  const { toast } = useToast();

  const EUR_RATE = 0.92; // Approximate USD to EUR conversion rate

  const handleSubscribe = async (tier: 'me' | 'us' | 'universal') => {
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

  const getDiscountPercentage = (tier: 'calm' | 'me' | 'us' | 'universal') => {
    if (tier === 'calm') return 0;
    if (tier === 'me') return 10;
    if (tier === 'us') return 15;
    return 20;
  };

  const getCurrentPlanBadge = (tier: 'calm' | 'me' | 'us' | 'universal') => {
    if (subscription.subscribed && subscription.subscription_tier === tier) {
      return <Badge variant="default" className="ml-2">Current Plan</Badge>;
    }
    return null;
  };

  const formatPrice = (price: number) => {
    const convertedPrice = isEuro ? price * EUR_RATE : price;
    const symbol = isEuro ? '€' : '$';
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  return (
    <div className="space-y-8">
      {/* Currency and Billing Toggle */}
      <div className="flex flex-col items-center space-y-4">
        {/* Currency Toggle */}
        <div className="flex items-center space-x-4">
          <Label className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            USD
          </Label>
          <Switch
            checked={isEuro}
            onCheckedChange={setIsEuro}
          />
          <Label className="flex items-center">
            <Euro className="h-4 w-4 mr-1" />
            EUR
          </Label>
        </div>
        
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(PLANS).map(([key, plan]) => {
          const tier = key as 'calm' | 'me' | 'us' | 'universal';
          const price = isAnnual ? plan.annual : plan.monthly;
          const monthlyPrice = isAnnual ? price / 12 : price;
          const discount = isAnnual ? getDiscountPercentage(tier) : 0;
          
          return (
            <Card key={tier} className={`relative ${plan.popular ? 'ring-2 ring-primary border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 text-sm shadow-md">
                    ⭐ Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className={plan.popular ? 'pt-6' : ''}>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold">{plan.name}</div>
                    <Badge variant="outline" className="text-xs">{plan.badge}</Badge>
                  </div>
                  {getCurrentPlanBadge(tier)}
                </CardTitle>
                <CardDescription>
                  <div className="text-3xl font-bold">
                    {formatPrice(monthlyPrice)}
                    <span className="text-base font-normal">/month</span>
                  </div>
                  {isAnnual && discount > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <span className="line-through">{formatPrice(plan.monthly)}/month</span>
                      <Badge variant="secondary" className="ml-2">{discount}% off</Badge>
                    </div>
                  )}
                  {isAnnual && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Billed annually: {formatPrice(price)}
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
                  onClick={() => tier === 'calm' ? null : handleSubscribe(tier as 'me' | 'us' | 'universal')}
                  disabled={tier === 'calm' || loading === tier || (subscription.subscribed && subscription.subscription_tier === tier)}
                  variant={plan.popular ? 'default' : tier === 'calm' ? 'outline' : 'outline'}
                >
                  {tier === 'calm' ? (
                    'Current Plan'
                  ) : loading === tier ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : subscription.subscribed && subscription.subscription_tier === tier ? (
                    'Current Plan'
                  ) : (
                    `Subscribe to ${plan.badge}`
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