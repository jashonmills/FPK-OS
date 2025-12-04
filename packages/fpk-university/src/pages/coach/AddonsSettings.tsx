import { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AddonsSettings() {
  const { subscription, createCheckout } = useSubscription();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasFpkAccess, setHasFpkAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  
  // Check if user already has FPK University access
  useEffect(() => {
    async function checkPermission() {
      if (!user) return;
      
      setCheckingAccess(true);
      const { data } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('permission', 'fpk_university_access')
        .maybeSingle();
      
      setHasFpkAccess(!!data);
      setCheckingAccess(false);
    }
    checkPermission();
  }, [user]);
  
  const handlePurchaseAddon = async () => {
    if (!subscription?.subscription_tier) {
      toast({
        title: 'Error',
        description: 'You need an active AI Coach subscription first.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await createCheckout(
        subscription.subscription_tier,
        'monthly',
        undefined,
        true // addFpkUniversity
      );
    } catch (error) {
      console.error('Error purchasing add-on:', error);
      toast({
        title: 'Error',
        description: 'Failed to start checkout. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (checkingAccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Checking access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (subscription?.subscription_tier === 'pro_plus') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8 text-center">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              You already have full access!
            </h2>
            <p className="text-muted-foreground">
              FPK University platform access is included free with your Pro+ subscription.
            </p>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="mt-6"
            >
              Go to FPK University Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (hasFpkAccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-primary/50">
          <CardContent className="p-8 text-center">
            <Check className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              FPK University Access Active
            </h2>
            <p className="text-muted-foreground mb-6">
              You have full access to the FPK University platform.
            </p>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to FPK University Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const addonPrice = subscription?.subscription_tier === 'pro' ? '$2.99' : '$4.99';
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Unlock the Full FPK University Platform
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Add complete access to our interactive course catalog, learning tools, 
            and community features for just {addonPrice}/month.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Full Course Library Access</p>
                <p className="text-sm text-muted-foreground">50+ interactive courses across multiple subjects</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Advanced Learning Analytics</p>
                <p className="text-sm text-muted-foreground">Track your progress with detailed insights and metrics</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Community & Collaboration</p>
                <p className="text-sm text-muted-foreground">Join forums, study groups, and connect with learners</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Downloadable Resources</p>
                <p className="text-sm text-muted-foreground">Access study guides, worksheets, and reference materials</p>
              </div>
            </li>
          </ul>
          
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-center">
              <span className="font-semibold">Special Offer: </span>
              As an AI Coach subscriber, you get exclusive discounted pricing!
            </p>
          </div>
          
          <Button
            onClick={handlePurchaseAddon}
            disabled={isLoading || !subscription?.subscription_tier}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              `Add FPK University for ${addonPrice}/mo`
            )}
          </Button>
          
          {!subscription?.subscription_tier && (
            <p className="text-sm text-center text-muted-foreground">
              You need an active AI Coach subscription to add this feature.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
