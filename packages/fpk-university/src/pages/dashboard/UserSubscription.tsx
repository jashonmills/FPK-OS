import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';
import { UsageDashboard } from '@/components/usage/UsageDashboard';
import { useSubscription } from '@/hooks/useSubscription';
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';
import { useToast } from '@/hooks/use-toast';
import { Gift, Loader2 } from 'lucide-react';

export default function UserSubscription() {
  const [couponCode, setCouponCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const { redeemCoupon } = useSubscription();
  const { toast } = useToast();
  
  // Video storage hook
  const { shouldShowAuto, markVideoAsSeen } = useFirstVisitVideo('subscription_intro_seen');

  // Show video modal on first visit
  useEffect(() => {
    if (shouldShowAuto()) {
      setShowVideoModal(true);
    }
  }, [shouldShowAuto]);

  const handleCloseVideo = () => {
    setShowVideoModal(false);
    markVideoAsSeen();
  };

  const handleShowVideoManually = () => {
    setShowVideoModal(true);
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
      setCouponCode('');
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

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col items-center gap-2 mb-4">
        <h1 className="text-4xl font-bold text-foreground">Manage Subscription</h1>
        <PageHelpTrigger onOpen={handleShowVideoManually} />
      </div>
      <p className="text-xl text-muted-foreground text-center mb-8">
        Manage your subscription, billing, and account preferences
      </p>

      <FirstVisitVideoModal
        isOpen={showVideoModal}
        onClose={handleCloseVideo}
        title="How to Use Subscription"
        videoUrl="https://www.youtube.com/embed/eGO0oX5VFcQ?si=xc8X0nCJakLVsw2l"
      />

      <Tabs defaultValue="usage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usage">Usage & Billing</TabsTrigger>
          <TabsTrigger value="status">Current Status</TabsTrigger>
          <TabsTrigger value="plans">Upgrade/Change Plan</TabsTrigger>
          <TabsTrigger value="coupons">Redeem Coupon</TabsTrigger>
        </TabsList>

        <TabsContent value="usage">
          <UsageDashboard />
        </TabsContent>
          
        <TabsContent value="status">
          <SubscriptionStatus />
        </TabsContent>

        <TabsContent value="plans">
          <SubscriptionPlans />
        </TabsContent>

        <TabsContent value="coupons">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  Redeem Coupon Code
                </CardTitle>
                <CardDescription>
                  Have a coupon code? Enter it below to unlock free access or discounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coupon-input">Coupon Code</Label>
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
                  />
                </div>
                <Button 
                  onClick={handleRedeemCoupon} 
                  disabled={redeeming || !couponCode.trim()}
                  className="w-full"
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

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Available Trial Codes:</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>BETA2025</strong> - 3 months free Premium access</p>
                    <p><strong>FREEMONTH</strong> - 1 month free Basic access</p>
                    <p><strong>WELCOME</strong> - 1 month free Pro access</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}