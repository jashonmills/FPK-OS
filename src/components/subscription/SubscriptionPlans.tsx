import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, Loader2, DollarSign, Euro, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useToast } from '@/hooks/use-toast';

// Beta mode flag - set to false to re-enable subscription buttons post-beta
const IS_BETA_MODE = true;

interface PlanType {
  name: string;
  badge: string;
  monthly: number;
  annual: number;
  popular?: boolean;
  isBeta?: boolean;
  features: string[];
}

// Organization subscription plans
const ORG_PLANS: Record<'basic' | 'standard' | 'premium' | 'beta', PlanType> = {
  basic: {
    name: 'FPK Instructor Basic',
    badge: 'Up to 3 Students',
    monthly: 29,
    annual: 290,
    features: [
      'Up to 3 students',
      'Basic analytics',
      'Goal tracking',
      'Note management',
      'Student progress reports',
      'Course assignments',
      'Email support'
    ]
  },
  standard: {
    name: 'FPK Instructor Standard', 
    badge: 'Up to 10 Students',
    monthly: 79,
    annual: 790,
    popular: true,
    features: [
      'Up to 10 students',
      'Advanced analytics',
      'Bulk operations',
      'Custom reporting',
      'Student portfolios',
      'Assignment grading',
      'Video conferencing',
      'Priority support'
    ]
  },
  premium: {
    name: 'FPK Instructor Premium',
    badge: 'Up to 25+ Students',
    monthly: 149,
    annual: 1490,
    features: [
      'Up to 25+ students',
      'Full analytics suite',
      'White-label options',
      'API access',
      'Custom integrations',
      'Advanced reporting',
      'Dedicated support',
      'Early access features'
    ]
  },
  beta: {
    name: 'FPK Beta Access',
    badge: 'Up to 50+ Students (FREE)',
    monthly: 0,
    annual: 0,
    isBeta: true,
    features: [
      'Up to 50+ students (Beta)',
      'Full analytics suite',
      'White-label options',
      'API access',
      'Custom integrations',
      'Advanced reporting',
      'Dedicated support',
      'Early access features',
      '🆓 Free during beta period',
      '⏰ Limited time offer'
    ]
  }
};

const PLANS: Record<'basic' | 'pro' | 'pro_plus', PlanType> = {
  basic: {
    name: 'AI Coach Basic',
    badge: '500 Credits/Month',
    monthly: 4.99,
    annual: 49,
    features: [
      '500 AI Credits per month',
      '1 credit per Free Chat turn',
      '2 credits per Socratic turn',
      'Chat history (last 24 hours)',
      'Basic "Learning Snapshot"',
      'Email support',
      '7-day free trial'
    ]
  },
  pro: {
    name: 'AI Coach Pro',
    badge: '2,500 Credits/Month',
    monthly: 19,
    annual: 199,
    popular: true,
    features: [
      '2,500 AI Credits per month',
      '1 credit per Free Chat turn',
      '2 credits per Socratic turn',
      'Full searchable chat history',
      'Advanced Analytics Dashboard',
      'Priority support',
      '7-day free trial'
    ]
  },
  pro_plus: {
    name: 'AI Coach Pro+',
    badge: '5,000 Credits/Month',
    monthly: 29,
    annual: 299,
    features: [
      '5,000 AI Credits per month',
      '1 credit per Free Chat turn',
      '2 credits per Socratic turn',
      'Full searchable chat history',
      'Advanced Analytics Dashboard',
      'Dedicated support',
      '7-day free trial'
    ]
  }
};

export function SubscriptionPlans() {
  const [isAnnual, setIsAnnual] = useState(true); // Changed to true to make annual default
  const [isEuro, setIsEuro] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [planType, setPlanType] = useState<'individual' | 'organization'>('individual');
  const { subscription, createCheckout } = useSubscription();
  const { toast } = useToast();

  const EUR_RATE = 1; // Prices are already in EUR

  const handleSubscribe = async (tier: 'basic' | 'pro' | 'pro_plus') => {
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

  const handleOrgSubscribe = async (tier: 'basic' | 'standard' | 'premium' | 'beta') => {
    try {
      setLoading(tier);
      
      if (tier === 'beta') {
        // For beta tier, show success message and redirect to organization creation
        toast({
          title: "Beta Access Granted!",
          description: "You now have access to all Premium features for free during the beta period.",
        });
        // Here you would typically redirect to organization creation
        // For now, we'll just show the success message
        return;
      }

      // For paid tiers, handle normal checkout process
      // This would need to be implemented with organization-specific checkout
      toast({
        title: "Coming Soon",
        description: "Organization subscriptions will be available soon!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process subscription",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const getDiscountPercentage = (tier: 'basic' | 'pro' | 'pro_plus') => {
    if (tier === 'basic') return 10;
    if (tier === 'pro') return 15;
    return 20;
  };

  const getCurrentPlanBadge = (tier: 'basic' | 'pro' | 'pro_plus') => {
    if (subscription.subscribed && subscription.subscription_tier === tier) {
      return <Badge variant="default" className="ml-2">Current Plan</Badge>;
    }
    return null;
  };

  const formatPrice = (price: number) => {
    const convertedPrice = isEuro ? price : price * 1.1; // Convert EUR to USD with ~10% markup
    const symbol = isEuro ? '€' : '$';
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  return (
    <div className="space-y-8">
      {/* Beta Mode Notice */}
      {IS_BETA_MODE && (
        <div className="text-center">
          <Badge className="bg-accent text-white font-semibold px-4 py-2 mb-2">
            BETA ACCESS ONLY
          </Badge>
          <p className="text-sm text-muted-foreground">
            Subscription buttons are disabled during beta. Use coupon codes below for access.
          </p>
        </div>
      )}

      {/* Plan Type Toggle */}
      <div className="flex flex-col items-center space-y-4">
        {/* Individual vs Organization Toggle */}
        <div className="flex items-center space-x-4">
          <Label className="flex items-center">
            Individual Plans
          </Label>
          <Switch
            checked={planType === 'organization'}
            onCheckedChange={(checked) => setPlanType(checked ? 'organization' : 'individual')}
          />
          <Label className="flex items-center">
            Organization Plans
          </Label>
        </div>

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
            <Badge variant="secondary" className="ml-2">Save up to 10%</Badge>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(planType === 'organization' ? ORG_PLANS : PLANS).map(([key, plan]) => {
          const tier = key as any;
          const price = isAnnual ? plan.annual : plan.monthly;
          const monthlyPrice = isAnnual ? price / 12 : price;
          const discount = isAnnual ? getDiscountPercentage(tier) : 0;
          
          return (
            <Card key={tier} className={`relative ${
              plan.popular ? 'ring-2 ring-primary border-primary shadow-lg' : ''
            } ${
              plan.isBeta ? 'ring-2 ring-gradient-to-r from-purple-500 to-pink-500 border-purple-500 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50' : ''
            }`}>
              {plan.popular && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-primary text-primary-foreground font-medium px-2 py-1 text-xs shadow-md rounded-full">
                    ⭐ Popular
                  </Badge>
                </div>
              )}
              {plan.isBeta && (
                <div className="absolute -top-2 -left-2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-3 py-1 text-xs shadow-lg rounded-full animate-pulse">
                    🚀 BETA
                  </Badge>
                </div>
              )}
              
              <CardHeader>
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
                   {isAnnual && tier !== 'calm' && (
                     <div className="text-sm text-muted-foreground">
                       <span className="line-through">{formatPrice(plan.monthly)}/month</span>
                       <Badge variant="secondary" className="ml-2">Save 10%</Badge>
                     </div>
                   )}
                   {isAnnual && tier !== 'calm' && (
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
                  onClick={() => {
                    if (planType === 'organization') {
                      if (plan.isBeta || !IS_BETA_MODE) {
                        handleOrgSubscribe(tier as 'basic' | 'standard' | 'premium' | 'beta');
                      }
                    } else {
                      if (!IS_BETA_MODE && tier !== 'calm') {
                        handleSubscribe(tier as 'basic' | 'pro' | 'pro_plus');
                      }
                    }
                  }}
                  disabled={
                    planType === 'organization' 
                      ? (!plan.isBeta && IS_BETA_MODE) || loading === tier
                      : IS_BETA_MODE || tier === 'calm' || loading === tier || (subscription.subscribed && subscription.subscription_tier === tier)
                  }
                  variant={
                    plan.popular ? 'default' : 
                    plan.isBeta ? 'default' : 
                    tier === 'calm' ? 'outline' : 
                    'outline'
                  }
                >
                  {planType === 'organization' ? (
                    plan.isBeta ? (
                      loading === tier ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Start Beta Access'
                      )
                    ) : IS_BETA_MODE ? (
                      'Coming Soon'
                    ) : loading === tier ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Subscribe to ${plan.badge}`
                    )
                  ) : (
                    IS_BETA_MODE ? (
                      'Beta Access Only'
                    ) : tier === 'calm' ? (
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
                    )
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Credit Pack Top-up Option */}
      {planType === 'individual' && (
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Need More Credits?
              </CardTitle>
              <CardDescription>
                Top up your account anytime with an extra credit pack
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-900">500 AI Credits</p>
                  <p className="text-sm text-muted-foreground">One-time purchase</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{formatPrice(5)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={() => !IS_BETA_MODE && handleSubscribe('credit_pack' as any)}
                disabled={IS_BETA_MODE || loading === 'credit_pack'}
              >
                {IS_BETA_MODE ? (
                  'Beta Access Only'
                ) : loading === 'credit_pack' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Buy Credits'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Free Trial Coupons Info */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>Try these coupon codes for free access:</p>
        <div className="flex justify-center gap-4 mt-2">
          <Badge variant="outline">COACHVIP2025</Badge>
          <Badge variant="outline">BETA2025</Badge>
          <Badge variant="outline">FREEMONTH</Badge>
        </div>
      </div>
    </div>
  );
}