import { useState } from 'react';
import { AppBackground } from '@/components/layout/AppBackground';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PricingGrid } from '@/components/pricing/PricingGrid';
import { FAQ } from '@/components/pricing/FAQ';
import { AlaCarteSection } from '@/components/pricing/AlaCarteSection';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const navigate = useNavigate();

  return (
    <>
      <AppBackground />
      <div className="min-h-screen pb-20">
        {/* Header */}
        <div className="border-b glass-subtle">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Hero */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">
              Choose the Right Plan for Your Family
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Start free, upgrade when you're ready. All plans include our core features.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-2 glass-card rounded-full">
              <Label
                htmlFor="billing-toggle"
                className={`cursor-pointer px-4 py-2 rounded-full transition-colors ${
                  billingCycle === 'monthly' ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                Bill Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={billingCycle === 'annual'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
              />
              <Label
                htmlFor="billing-toggle"
                className={`cursor-pointer px-4 py-2 rounded-full transition-colors ${
                  billingCycle === 'annual' ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                Bill Annually
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Save 15%
                </span>
              </Label>
            </div>
          </div>
        </section>

        {/* Pricing Grid */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <PricingGrid billingCycle={billingCycle} />
          </div>
        </section>

        {/* À La Carte Section */}
        <AlaCarteSection />

        {/* FAQ */}
        <section className="px-4">
          <FAQ />
        </section>

        {/* CTA */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center glass-card p-12 rounded-2xl border-2">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Join families who trust us to track their student's progress.
            </p>
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8">
              Start Your Free Trial
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Pricing;
