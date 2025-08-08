import { useState } from 'react';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { Check, Star, Loader2, Gift, ArrowLeft, DollarSign, Euro } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

// Beta mode flag - set to false to re-enable subscription buttons post-beta
const IS_BETA_MODE = true;
interface PlanType {
  name: string;
  monthly: number;
  annual: number;
  features: string[];
}
const PLANS: Record<string, PlanType> = {
  calm: {
    name: 'FPK Calm',
    monthly: 0,
    annual: 0,
    features: ['1 seat included', 'Basic AI chat (10 messages/month)', 'Essential learning tools', 'Basic progress tracking', 'Community support']
  },
  me: {
    name: 'FPK Me',
    monthly: 16.49,
    annual: 179.88,
    // Updated to annual total
    features: ['1 seat included', '150 AI chat messages/month', '90 minutes voice processing/month', '75 knowledge queries/month', '15 document processing/month', '300 flashcard generations/month', '75 AI insights/month', '200MB knowledge storage', 'Personal progress tracking', 'Email support']
  },
  us: {
    name: 'FPK Us',
    monthly: 26.39,
    annual: 287.88,
    // Updated to annual total
    features: ['🏠 3 family member seats', '500 AI chat messages/month (shared)', '300 minutes voice processing/month (shared)', '250 knowledge queries/month (shared)', '50 document processing/month (shared)', '1,000 flashcard generations/month (shared)', '200 AI insights/month (shared)', '1GB knowledge storage (shared)', 'Family progress dashboard', 'Individual member tracking', 'Priority support']
  },
  universal: {
    name: 'FPK Universal',
    monthly: 54.99,
    annual: 599.88,
    // Updated to annual total
    features: ['1 seat included', '🚀 Unlimited AI interactions', '🚀 Unlimited voice processing', '🚀 Unlimited knowledge queries', '🚀 Unlimited document processing', '🚀 Unlimited flashcard generation', '🚀 Unlimited AI insights', '5GB knowledge storage', 'Advanced analytics dashboard', 'Advanced course creation tools', 'White-label options', 'API access (coming soon)', 'Dedicated support', 'Early access to new features']
  }
};
export default function ChoosePlan() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isEuro, setIsEuro] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const {
    createCheckout,
    redeemCoupon
  } = useSubscription();
  const {
    toast
  } = useToast();
  const {
    navigateBack,
    safeNavigate
  } = useSafeNavigation();
  const handleSubscribe = async (tier: 'calm' | 'me' | 'us' | 'universal') => {
    try {
      setLoading(tier);
      const interval = isAnnual ? 'annual' : 'monthly';
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
        description: "Coupon redeemed successfully! Redirecting to dashboard..."
      });
      setTimeout(() => safeNavigate('/dashboard'), 2000);
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
  const getSavingsPercentage = () => {
    return 10; // Monthly is 10% higher than annual
  };
  const formatPrice = (price: number) => {
    const convertedPrice = isEuro ? price : price * 1.1; // Convert EUR to USD with ~10% markup
    const symbol = isEuro ? '€' : '$';
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };
  return <div className="min-h-screen bg-gradient-to-br from-fpk-purple to-fpk-amber flex items-center justify-center p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={navigateBack} className="text-white hover:bg-white/10 border-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center mb-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Choose Your Learning Plan</h1>
          {IS_BETA_MODE ? (
            <div className="space-y-2">
              <Badge className="bg-accent text-white font-semibold px-4 py-2 mb-2">
                BETA ACCESS ONLY
              </Badge>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                During our beta phase, access is available through coupon codes only. Use the coupon section below to unlock your plan.
              </p>
            </div>
          ) : (
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Select the perfect plan to unlock your learning potential and access our premium features.
            </p>
          )}
        </div>

        {/* Currency and Billing Toggles */}
        <div className="flex flex-col items-center space-y-6 mb-8">
          {/* Currency Toggle */}
          <div className="flex items-center space-x-4">
            <Label className="flex items-center text-white">
              <DollarSign className="h-4 w-4 mr-1" />
              USD
            </Label>
            <Switch checked={isEuro} onCheckedChange={setIsEuro} />
            <Label className="flex items-center text-white">
              <Euro className="h-4 w-4 mr-1" />
              EUR
            </Label>
          </div>

          {/* Annual/Monthly Toggle */}
          <div className="flex items-center space-x-4">
            <Label className="text-white">Monthly</Label>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <Label className="text-white">
              Annual
              <Badge variant="secondary" className="ml-2 bg-accent/20 text-accent">Save 10%</Badge>
            </Label>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {Object.entries(PLANS).map(([key, plan]) => {
          const tier = key as 'calm' | 'me' | 'us' | 'universal';
          const price = isAnnual ? plan.annual : plan.monthly;
          const monthlyEquivalent = isAnnual ? plan.annual / 12 : plan.monthly;
          const savings = getSavingsPercentage();
          const isPopular = tier === 'us';
          return <Card key={tier} className={`relative ${isPopular ? 'ring-2 ring-accent shadow-glow' : ''} bg-white/10 backdrop-blur border-white/20`}>
                {isPopular && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-white font-semibold px-4 py-1 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>}
                
                <CardHeader className="text-center text-white">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                   <div className="space-y-2">
                     {tier === 'calm' ? <div className="flex items-center justify-center gap-2">
                         <span className="text-4xl font-bold">Free</span>
                       </div> : <>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-4xl font-bold">{formatPrice(monthlyEquivalent)}</span>
                            <span className="text-white/60">/month</span>
                          </div>
                          {isAnnual && <>
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-white/60 line-through text-sm">{formatPrice(plan.monthly)}/month</span>
                                <Badge variant="secondary" className="bg-accent/20 text-accent">
                                  Save 10%
                                </Badge>
                              </div>
                              <div className="text-sm text-white/60">
                                Billed annually: {formatPrice(price)}
                              </div>
                            </>}
                       </>}
                   </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => <li key={index} className="flex items-start gap-3 text-white/90">
                        <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>)}
                  </ul>
                  
                  <Button 
                    onClick={() => IS_BETA_MODE ? null : handleSubscribe(tier)} 
                    disabled={IS_BETA_MODE || loading === tier} 
                    className={`w-full ${IS_BETA_MODE ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : tier === 'calm' ? 'bg-green-600 hover:bg-green-600' : isPopular ? 'bg-accent hover:bg-accent/90' : 'bg-white/20 hover:bg-white/30'} text-white border-0`} 
                    size="lg"
                  >
                    {IS_BETA_MODE ? (
                      tier === 'calm' ? 'Beta Access Only' : 'Beta Access Only'
                    ) : loading === tier ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : tier === 'calm' ? (
                      'Free Forever'
                    ) : (
                      `Subscribe to ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>;
        })}
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
                <Input id="coupon-input" placeholder="Enter your coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} onKeyDown={e => {
                if (e.key === 'Enter' && !redeeming) {
                  handleRedeemCoupon();
                }
              }} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
              </div>
              <Button onClick={handleRedeemCoupon} disabled={redeeming || !couponCode.trim()} className="w-full bg-white/20 hover:bg-white/30 border-0">
                {redeeming ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redeeming...
                  </> : 'Redeem Coupon'}
              </Button>

              <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <h4 className="font-semibold mb-2 text-white text-sm">Try these demo codes:</h4>
                <div className="space-y-1 text-xs text-white/70">
                  <p><strong className="text-white">BETA2025</strong> - 3 months free Premium access</p>
                  
                  
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}