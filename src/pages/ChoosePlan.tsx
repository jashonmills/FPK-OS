import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { Check, Star, Loader2, Gift } from 'lucide-react';

interface PlanType {
  name: string;
  price: number;
  originalPrice: number;
  billing: string;
  popular?: boolean;
  features: string[];
}

const PLANS: Record<string, PlanType> = {
  monthly: {
    name: 'Monthly',
    price: 29,
    originalPrice: 29,
    billing: 'month',
    features: [
      'Access to all premium courses',
      'Unlimited study sessions',
      'AI-powered study coach',
      'Progress tracking & analytics',
      'Mobile app access',
      'Community support'
    ]
  },
  annual: {
    name: 'Annual',
    price: 199,
    originalPrice: 348,
    billing: 'year',
    popular: true,
    features: [
      'Everything in Monthly plan',
      '43% savings vs monthly',
      'Priority customer support',
      'Advanced analytics',
      'Early access to new features',
      'Exclusive webinars & content'
    ]
  }
};

export default function ChoosePlan() {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const { createCheckout, redeemCoupon } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (tier: 'basic' | 'pro' | 'premium', interval: 'monthly' | 'annual') => {
    try {
      setLoading(`${tier}-${interval}`);
      await createCheckout(tier, interval);
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

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }

    try {
      setRedeeming(true);
      await redeemCoupon(couponCode.trim());
      toast({
        title: "Success!",
        description: "Coupon redeemed successfully! Redirecting to dashboard...",
      });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to redeem coupon",
        variant: "destructive"
      });
    } finally {
      setRedeeming(false);
    }
  };

  const getDiscountPercentage = (plan: PlanType) => {
    return Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-variant to-accent flex items-center justify-center p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Choose Your Learning Plan</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Select the perfect plan to unlock your learning potential and access our premium features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {Object.entries(PLANS).map(([key, plan]) => (
            <Card key={key} className={`relative ${plan.popular ? 'ring-2 ring-accent shadow-glow' : ''} bg-white/10 backdrop-blur border-white/20`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-white font-semibold px-4 py-1 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center text-white">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-white/60">/{plan.billing}</span>
                  </div>
                  {plan.originalPrice > plan.price && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-white/60 line-through text-sm">${plan.originalPrice}</span>
                      <Badge variant="secondary" className="bg-accent/20 text-accent">
                        Save {getDiscountPercentage(plan)}%
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/90">
                      <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleSubscribe(key === 'monthly' ? 'pro' : 'premium', key === 'monthly' ? 'monthly' : 'annual')}
                  disabled={loading === `${key === 'monthly' ? 'pro' : 'premium'}-${key === 'monthly' ? 'monthly' : 'annual'}`}
                  className={`w-full ${plan.popular ? 'bg-accent hover:bg-accent/90' : 'bg-white/20 hover:bg-white/30'} border-0`}
                  size="lg"
                >
                  {loading === `${key === 'monthly' ? 'pro' : 'premium'}-${key === 'monthly' ? 'monthly' : 'annual'}` ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Subscribe ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Free Access with Coupon */}
        <div className="max-w-md mx-auto">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader className="text-center text-white">
              <CardTitle className="flex items-center justify-center gap-2">
                <Gift className="h-5 w-5" />
                Have a Coupon Code?
              </CardTitle>
              <CardDescription className="text-white/70">
                Enter your coupon code to unlock free access or special discounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coupon-input" className="text-white">Coupon Code</Label>
                <Input
                  id="coupon-input"
                  placeholder="Enter your coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !redeeming) {
                      handleRedeemCoupon();
                    }
                  }}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <Button 
                onClick={handleRedeemCoupon} 
                disabled={redeeming || !couponCode.trim()}
                className="w-full bg-white/20 hover:bg-white/30 border-0"
              >
                {redeeming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redeeming...
                  </>
                ) : (
                  'Redeem Coupon'
                )}
              </Button>

              <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <h4 className="font-semibold mb-2 text-white text-sm">Try these demo codes:</h4>
                <div className="space-y-1 text-xs text-white/70">
                  <p><strong className="text-white">BETA2025</strong> - 3 months free Premium access</p>
                  <p><strong className="text-white">FREEMONTH</strong> - 1 month free Basic access</p>
                  <p><strong className="text-white">WELCOME</strong> - 1 month free Pro access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}