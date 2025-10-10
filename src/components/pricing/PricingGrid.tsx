import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFamily } from '@/contexts/FamilyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface PricingGridProps {
  billingCycle: 'monthly' | 'annual';
}

export const PricingGrid = ({ billingCycle }: PricingGridProps) => {
  const { user } = useAuth();
  const { selectedFamily } = useFamily();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Fetch family subscription data
  const { data: familyData } = useQuery({
    queryKey: ['family-subscription', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;
      
      const { data, error } = await supabase
        .from('families')
        .select('subscription_tier, subscription_status')
        .eq('id', selectedFamily.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id && !!user,
  });

  const currentTier = familyData?.subscription_tier || 'free';
  const subscriptionStatus = familyData?.subscription_status || 'active';

  const getButtonConfig = (tier: string): {
    text: string;
    action: () => void;
    variant: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
    disabled: boolean;
  } => {
    // Not authenticated
    if (!user) {
      return {
        text: tier === 'free' ? 'Start for Free' : 'Start 14-Day Free Trial',
        action: () => navigate('/auth'),
        variant: tier === 'free' ? 'outline' : 'default',
        disabled: false,
      };
    }

    // User is authenticated
    if (tier === 'free') {
      return {
        text: currentTier === 'free' ? 'Current Plan' : 'Downgrade to Free',
        action: currentTier === 'free' 
          ? () => navigate('/settings') 
          : () => handleManageSubscription(),
        variant: 'outline',
        disabled: currentTier === 'free',
      };
    }

    if (tier === 'team') {
      if (currentTier === 'pro') {
        return {
          text: 'Downgrade to Team',
          action: () => handleDowngrade('team'),
          variant: 'default',
          disabled: false,
        };
      }
      if (currentTier === 'team') {
        return {
          text: 'Current Plan',
          action: () => handleManageSubscription(),
          variant: 'default',
          disabled: false,
        };
      }
      // currentTier === 'free'
      return {
        text: 'Upgrade to Team',
        action: () => handleCheckout('team'),
        variant: 'default',
        disabled: false,
      };
    }

    if (tier === 'pro') {
      if (currentTier === 'pro') {
        return {
          text: 'Current Plan',
          action: () => handleManageSubscription(),
          variant: 'default',
          disabled: false,
        };
      }
      // currentTier === 'team' or 'free'
      return {
        text: 'Upgrade to Pro',
        action: () => handleCheckout('pro'),
        variant: 'default',
        disabled: false,
      };
    }

    return {
      text: 'Select Plan',
      action: () => {},
      variant: 'default',
      disabled: true,
    };
  };

  const handleManageSubscription = async () => {
    if (!selectedFamily?.id) {
      toast.error("Please select a family first");
      return;
    }

    setCheckoutLoading('manage');
    try {
      const { data, error } = await supabase.functions.invoke('manage-subscription', {
        body: {
          action: 'create_portal',
          familyId: selectedFamily.id,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error('Failed to open subscription portal. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleDowngrade = (targetTier: string) => {
    if (!window.confirm(`Are you sure you want to downgrade to ${targetTier === 'team' ? 'Collaborative Team' : 'Family'}? This will take effect at the end of your current billing period.`)) {
      return;
    }
    handleManageSubscription();
  };

  const handleCheckout = async (tier: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!selectedFamily?.id) {
      toast.error("Please select a family first");
      return;
    }

    setCheckoutLoading(tier);
    try {
      const { data, error } = await supabase.functions.invoke('manage-subscription', {
        body: {
          action: 'create_checkout',
          familyId: selectedFamily.id,
          tier,
          billingCycle,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const tiers = [
    {
      name: 'Family',
      tier: 'free',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Perfect for getting started',
      features: {
        students: '1',
        users: '2',
        storage: '500 MB',
        allLogs: true,
        environmentalData: true,
        universalCharts: true,
        diagnosisCharts: false,
        pdfExport: false,
        aiDocAnalysis: false,
        aiGoalGen: false,
        deepDive: false,
        resourcePack: false,
        predictiveInsights: false,
        interventionRecs: false,
        comments: false,
        prioritySupport: false,
      },
      cta: 'Start for Free',
    },
    {
      name: 'Collaborative Team',
      tier: 'team',
      monthlyPrice: 25,
      annualPrice: 255,
      description: 'For connecting your support team',
      features: {
        students: '5',
        users: '10',
        storage: '5 GB',
        allLogs: true,
        environmentalData: true,
        universalCharts: true,
        diagnosisCharts: true,
        pdfExport: true,
        aiDocAnalysis: '20/month',
        aiGoalGen: 'alacarte',
        deepDive: 'alacarte',
        resourcePack: 'alacarte',
        predictiveInsights: false,
        interventionRecs: false,
        comments: true,
        prioritySupport: false,
      },
      cta: 'Start 14-Day Free Trial',
      badge: 'Most Popular',
    },
    {
      name: 'Insights Pro',
      tier: 'pro',
      monthlyPrice: 60,
      annualPrice: 612,
      description: 'For AI-driven decision making',
      features: {
        students: 'Unlimited',
        users: 'Unlimited',
        storage: '20 GB',
        allLogs: true,
        environmentalData: true,
        universalCharts: true,
        diagnosisCharts: true,
        pdfExport: true,
        aiDocAnalysis: 'Unlimited',
        aiGoalGen: true,
        deepDive: 'alacarte',
        resourcePack: 'alacarte',
        predictiveInsights: true,
        interventionRecs: true,
        comments: true,
        prioritySupport: true,
      },
      cta: 'Start 14-Day Free Trial',
    },
  ];

  const featureRows = [
    { label: 'Students', key: 'students' },
    { label: 'Team Members', key: 'users' },
    { label: 'Storage', key: 'storage' },
    { label: 'All Activity Logs', key: 'allLogs' },
    { label: 'Environmental Context', key: 'environmentalData' },
    { label: 'Universal Charts', key: 'universalCharts' },
    { label: 'Diagnosis-Specific Charts', key: 'diagnosisCharts' },
    { label: 'PDF Export', key: 'pdfExport' },
    { label: 'AI Document Analysis', key: 'aiDocAnalysis' },
    { label: 'AI Goal Generation', key: 'aiGoalGen' },
    { label: 'On-Demand Deep-Dive', key: 'deepDive' },
    { label: 'Personalized Resource Pack', key: 'resourcePack' },
    { label: 'Predictive Insights', key: 'predictiveInsights' },
    { label: 'Intervention Recommendations', key: 'interventionRecs' },
    { label: 'Comment on Logs', key: 'comments' },
    { label: 'Priority Support', key: 'prioritySupport' },
  ];

  const renderFeatureValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground mx-auto" />
      );
    }
    if (value === 'alacarte') {
      return (
        <Badge variant="outline" className="text-xs">À La Carte</Badge>
      );
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div className="space-y-12">
      {/* Mobile: Card Layout */}
      <div className="grid md:hidden gap-6">
        {tiers.map((tier) => (
          <Card key={tier.tier} className={`${tier.badge ? 'border-primary' : ''} flex flex-col`}>
            <CardHeader>
              {tier.badge && (
                <Badge className="w-fit mb-2">{tier.badge}</Badge>
              )}
              <CardTitle className="min-h-[2rem]">{tier.name}</CardTitle>
              <CardDescription className="min-h-[3rem]">{tier.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice}
                </span>
                <span className="text-muted-foreground">
                  {billingCycle === 'monthly' ? '/month' : '/year'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              {(() => {
                const btnConfig = getButtonConfig(tier.tier);
                return (
                  <Button 
                    className="w-full" 
                    variant={btnConfig.variant}
                    onClick={btnConfig.action}
                    disabled={checkoutLoading !== null || btnConfig.disabled}
                  >
                    {checkoutLoading === tier.tier ? 'Processing...' : btnConfig.text}
                  </Button>
                );
              })()}
              <div className="space-y-2 flex-1">
                {featureRows.map((row) => {
                  const value = tier.features[row.key as keyof typeof tier.features];
                  return (
                    <div key={row.key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <div>{renderFeatureValue(value)}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 w-1/4"></th>
              {tiers.map((tier) => (
                <th key={tier.tier} className="p-4 text-center align-top">
                  <div className="space-y-2 flex flex-col h-full">
                    <div className="min-h-[32px] flex items-center justify-center">
                      {tier.badge && <Badge className="mx-auto">{tier.badge}</Badge>}
                    </div>
                    <div className="text-xl font-bold min-h-[2rem] flex items-center justify-center">{tier.name}</div>
                    <div className="text-sm text-muted-foreground min-h-[3rem] flex items-center justify-center">{tier.description}</div>
                    <div className="text-3xl font-bold min-h-[3rem] flex items-center justify-center">
                      ${billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice}
                    </div>
                    <div className="text-sm text-muted-foreground min-h-[2rem] flex items-center justify-center">
                      {billingCycle === 'monthly' ? '/month' : '/year'}
                    </div>
                    <div className="mt-auto pt-2">
                      {(() => {
                        const btnConfig = getButtonConfig(tier.tier);
                        return (
                          <Button 
                            className="w-full"
                            variant={btnConfig.variant}
                            onClick={btnConfig.action}
                            disabled={checkoutLoading !== null || btnConfig.disabled}
                          >
                            {checkoutLoading === tier.tier ? 'Processing...' : btnConfig.text}
                          </Button>
                        );
                      })()}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureRows.map((row) => (
              <tr key={row.key} className="border-b hover:bg-muted/50">
                <td className="p-4 font-medium">{row.label}</td>
                {tiers.map((tier) => (
                  <td key={tier.tier} className="p-4 text-center">
                    {renderFeatureValue(tier.features[row.key as keyof typeof tier.features])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
