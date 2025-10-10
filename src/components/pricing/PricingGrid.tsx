import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface PricingGridProps {
  billingCycle: 'monthly' | 'annual';
}

export const PricingGrid = ({ billingCycle }: PricingGridProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async (tier: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('manage-subscription', {
        body: {
          action: 'create_checkout',
          familyId: 'current_family_id', // This will be set dynamically
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
        aiDocAnalysis: true,
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
        aiDocAnalysis: true,
        predictiveInsights: true,
        interventionRecs: true,
        comments: true,
        prioritySupport: true,
      },
      cta: 'Start 14-Day Free Trial',
    },
  ];

  const featureRows = [
    { label: 'Student Profiles', key: 'students' },
    { label: 'User Accounts', key: 'users' },
    { label: 'Document Storage', key: 'storage' },
    { label: 'All 4 Log Forms', key: 'allLogs' },
    { label: 'Environmental Data', key: 'environmentalData' },
    { label: 'Universal Charts', key: 'universalCharts' },
    { label: 'Diagnosis-Specific Charts', key: 'diagnosisCharts' },
    { label: 'Export PDF Reports', key: 'pdfExport' },
    { label: 'AI Document Analysis', key: 'aiDocAnalysis' },
    { label: 'Predictive Insights', key: 'predictiveInsights' },
    { label: 'Intervention Recommendations', key: 'interventionRecs' },
    { label: 'Comment on Logs', key: 'comments' },
    { label: 'Priority Support', key: 'prioritySupport' },
  ];

  return (
    <div className="space-y-8">
      {/* Mobile View - Cards */}
      <div className="md:hidden grid gap-6">
        {tiers.map((tier) => {
          const price = billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
          const savings = billingCycle === 'annual' ? tier.monthlyPrice * 12 - tier.annualPrice : 0;

          return (
            <Card key={tier.name} className={`relative ${tier.badge ? 'border-primary border-2' : ''}`}>
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {tier.badge}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    ${price}
                    {price > 0 && (
                      <span className="text-base font-normal text-muted-foreground">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className="text-sm text-green-600 mt-1">Save ${savings}/year</p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full mb-6"
                  variant={tier.tier === 'free' ? 'outline' : 'default'}
                  onClick={() => tier.tier === 'free' ? navigate('/auth') : handleCheckout(tier.tier)}
                >
                  {tier.cta}
                </Button>
                <div className="space-y-3">
                  {featureRows.map((row) => {
                    const value = tier.features[row.key as keyof typeof tier.features];
                    return (
                      <div key={row.key} className="flex items-center justify-between">
                        <span className="text-sm">{row.label}</span>
                        {typeof value === 'boolean' ? (
                          value ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground" />
                          )
                        ) : (
                          <span className="font-medium">{value}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2">
              <th className="p-4 text-left font-semibold">Features</th>
              {tiers.map((tier) => (
                <th key={tier.name} className="p-4 text-center">
                  <div className="relative">
                    {tier.badge && (
                      <Badge className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        {tier.badge}
                      </Badge>
                    )}
                    <div className="font-bold text-xl mb-2">{tier.name}</div>
                    <div className="text-3xl font-bold text-primary">
                      ${billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice}
                      {tier.monthlyPrice > 0 && (
                        <span className="text-base font-normal text-muted-foreground">
                          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'annual' && tier.monthlyPrice > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        Save ${tier.monthlyPrice * 12 - tier.annualPrice}
                      </p>
                    )}
                    <Button
                      className="mt-4 w-full"
                      variant={tier.tier === 'free' ? 'outline' : 'default'}
                      onClick={() => tier.tier === 'free' ? navigate('/auth') : handleCheckout(tier.tier)}
                    >
                      {tier.cta}
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureRows.map((row, idx) => (
              <tr key={row.key} className={idx % 2 === 0 ? 'bg-muted/30' : ''}>
                <td className="p-4 font-medium">{row.label}</td>
                {tiers.map((tier) => {
                  const value = tier.features[row.key as keyof typeof tier.features];
                  return (
                    <td key={`${tier.name}-${row.key}`} className="p-4 text-center">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span className="font-medium">{value}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
