import { useState, useEffect } from 'react';
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
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';

const IS_BETA_MODE = true;
interface PlanType {
  name: string;
  monthly: number;
  annual: number;
  features: string[];
}
const PLANS: Record<string, PlanType> = {
  calm: {
    name: 'AI Coach Basic',
    monthly: 4.99,
    annual: 49.00,
    features: [
      '500 AI Credits/month',
      '1 credit per free chat message',
      '2 credits per Socratic session message', 
      'Access to AI Study Coach portal',
      'Session history',
      'Basic analytics',
      'Email support',
      '7-day free trial'
    ]
  },
  me: {
    name: 'AI Coach Pro',
    monthly: 19.00,
    annual: 199.00,
    features: [
      '2,500 AI Credits/month',
      '1 credit per free chat message',
      '2 credits per Socratic session message',
      'Credit rollover (up to 1,000)',
      'Full AI Study Coach portal',
      'Advanced session analytics',
      'Flashcard generation',
      'Study insights',
      'Priority support',
      '7-day free trial'
    ]
  },
  us: {
    name: 'AI Coach Pro+',
    monthly: 29.00,
    annual: 299.00,
    features: [
      '5,000 AI Credits/month',
      '1 credit per free chat message',
      '2 credits per Socratic session message',
      'Credit rollover (up to 2,500)',
      'Everything in Pro',
      'Extended session analytics',
      'Custom study plans',
      'Advanced insights',
      'Premium support',
      '7-day free trial'
    ]
  },
  universal: {
    name: 'AI Coach Enterprise',
    monthly: 54.99,
    annual: 599.88,
    features: [
      '🚀 Unlimited AI Credits',
      'All message types included',
      'No credit deductions',
      'Everything in Pro+',
      'Advanced analytics dashboard',
      'API access (coming soon)',
      'White-label options',
      'Dedicated support',
      'Early access to features',
      '7-day free trial'
    ]
  }
};
export default function ChoosePlan() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isEuro, setIsEuro] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
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
  const { shouldShowAuto, markVideoAsSeen } = useFirstVisitVideo('chooseplan_intro_seen');

  // Auto-show video modal on first visit
  useEffect(() => {
    if (shouldShowAuto()) {
      setShowVideoModal(true);
    }
  }, [shouldShowAuto]);

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    markVideoAsSeen();
  };

  const handleManualVideoOpen = () => {
    setShowVideoModal(true);
  };
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
          <div className="flex flex-col items-center gap-2 mb-4">
            <h1 className="text-4xl font-bold">Choose Your Learning Plan</h1>
            <PageHelpTrigger onOpen={handleManualVideoOpen} label="How this page works" />
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            AI Study Coach uses a credit-based system. Free chat messages cost 1 credit, Socratic sessions cost 2 credits per message.
          </p>
          
          {IS_BETA_MODE && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20 max-w-2xl mx-auto">
              <p className="text-lg font-semibold text-white mb-2">🚀 Beta Access Only</p>
              <p className="text-white/70 text-sm">
                During our beta phase, all plans can only be activated using coupon codes. 
                Please use the coupon section below to get started.
              </p>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-2">💡 How Credits Work</h3>
            <div className="text-sm text-white/70 space-y-1">
              <p><strong className="text-white">Free Chat:</strong> 1 credit per message</p>
              <p><strong className="text-white">Socratic Mode:</strong> 2 credits per message (guided learning)</p>
              <p><strong className="text-white">Pro+ & Enterprise:</strong> Unused credits rollover to next month</p>
            </div>
          </div>
        </div>

        {/* Free Access with Coupon */}
        <div className="max-w-md mx-auto mb-8">
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
                  onChange={e => setCouponCode(e.target.value.toUpperCase())} 
                  onKeyDown={e => {
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
                  <p><strong className="text-white">BETA2025</strong> - 2 weeks free Premium access</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  
                  {IS_BETA_MODE ? (
                    <Button disabled className="w-full bg-gray-600 hover:bg-gray-600 text-white border-0" size="lg">
                      Beta Access Only
                    </Button>
                  ) : tier === 'calm' ? (
                    <Button disabled className="w-full bg-green-600 hover:bg-green-600 text-white border-0" size="lg">
                      Free Forever
                    </Button>
                  ) : (
                    <Button onClick={() => handleSubscribe(tier)} disabled={loading === tier} className={`w-full ${isPopular ? 'bg-accent hover:bg-accent/90' : 'bg-white/20 hover:bg-white/30'} border-0`} size="lg">
                      {loading === tier ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Subscribe to ${plan.name}`
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>;
        })}
        </div>

        {/* Video Modal */}
        <FirstVisitVideoModal
          isOpen={showVideoModal} 
          onClose={handleCloseVideoModal}
          title="How to Choose Your Learning Plan"
          contentHtml="<video controls autoplay muted style='width:100%;height:auto;border-radius:8px;'><source src='https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/video%20guide/Coupon%20Code%20Walk%20Through%20Video.mp4' type='video/mp4'>Your browser does not support the video tag.</video>"
        />
      </div>
    </div>;
}