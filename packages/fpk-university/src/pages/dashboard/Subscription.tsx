import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { Gift, Loader2, ArrowLeft } from 'lucide-react';

export default function Subscription() {
  const [couponCode, setCouponCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const { redeemCoupon } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/login')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Button>
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Subscription Plans</h1>
        <p className="text-xl text-muted-foreground">
          Choose the perfect plan for your learning journey
        </p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="status">Current Status</TabsTrigger>
          <TabsTrigger value="coupons">Redeem Coupon</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <SubscriptionPlans />
        </TabsContent>

        <TabsContent value="status">
          <SubscriptionStatus />
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