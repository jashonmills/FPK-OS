import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronDown, ChevronUp, Zap, Sparkles, Target, BookOpen } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const PricingTeaser = () => {
  const navigate = useNavigate();
  const [expandedTier, setExpandedTier] = useState<number | null>(null);
  const [showALaCarte, setShowALaCarte] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');

  const eurRate = 0.92;

  const convertPrice = (price: number) => {
    if (currency === 'EUR') {
      return (price * eurRate).toFixed(2);
    }
    return price.toFixed(2);
  };

  const currencySymbol = currency === 'EUR' ? '€' : '$';

  const tiers = [
    {
      name: 'Family',
      price: 0,
      priceLabel: 'Free Forever',
      tagline: 'For getting started and organizing your world.',
      features: [
        '1 Student Profile',
        '2 User Accounts',
        '400 AI Credits/month',
        'Core Data & Sleep Logging',
        'Universal Analytics Dashboard',
      ],
      detailedFeatures: [
        'All Activity Logs',
        'Environmental Context Data',
        'Universal Charts',
        '500 MB Storage',
      ],
      button: 'Get Started for Free',
      action: () => navigate('/auth'),
      variant: 'outline' as const,
    },
    {
      name: 'Collaborative Team',
      price: 25,
      priceLabel: null,
      tagline: 'For connecting your entire support team.',
      features: [
        'Up to 5 Student Profiles',
        'Up to 10 User Accounts',
        '2,000 AI Credits/month',
        'AI-Powered Document Analysis (20/month)',
        'Exportable PDF Reports',
      ],
      detailedFeatures: [
        'All Activity Logs',
        'Environmental Context Data',
        'Universal Charts',
        'Diagnosis-Specific Charts',
        'Comment on Logs',
        '5 GB Storage',
        'À La Carte: Goal Generation, Deep-Dive, Resource Pack',
      ],
      button: 'Choose Team Plan',
      action: () => navigate('/pricing'),
      variant: 'default' as const,
      badge: 'Most Popular',
    },
    {
      name: 'Insights Pro',
      price: 60,
      priceLabel: null,
      tagline: 'For proactive, AI-driven decision making.',
      features: [
        'Unlimited Students & Users',
        '6,000 AI Credits/month',
        'Unlimited AI Document Analysis',
        'Predictive AI Insight Engine',
        'Intervention Recommendations',
      ],
      detailedFeatures: [
        'Everything in Team, plus:',
        'AI Goal Generation (Included)',
        'Priority Support',
        '20 GB Storage',
        'À La Carte: Deep-Dive, Resource Pack',
      ],
      button: 'Explore Pro Plan',
      action: () => navigate('/pricing'),
      variant: 'secondary' as const,
    },
  ];

  const creditPacks = [
    { name: 'Starter Pack', price: 5, credits: '500 Credits' },
    { name: 'Value Pack', price: 10, credits: '1,200 Credits', bonus: '20% Bonus' },
    { name: 'Pro Pack', price: 20, credits: '3,000 Credits', bonus: '50% Bonus' },
  ];

  const alaCarteTools = [
    { name: 'Document Deep-Dive', price: 9.99, icon: Sparkles },
    { name: 'AI Goal Generation', price: 4.99, icon: Target },
    { name: 'Personalized Resource Pack', price: 19.99, icon: BookOpen },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            A Plan for Every Family's Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start for free and grow with a team that's always on the same page.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>AI Credits Power Everything:</strong> Text-to-Speech (1 credit per 1,000 chars), AI Chat, Document Analysis, and more.
          </p>
          
          {/* Currency Toggle */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Label htmlFor="currency-toggle-home" className={currency === 'USD' ? 'font-semibold' : 'text-muted-foreground'}>
              USD ($)
            </Label>
            <Switch
              id="currency-toggle-home"
              checked={currency === 'EUR'}
              onCheckedChange={(checked) => setCurrency(checked ? 'EUR' : 'USD')}
            />
            <Label htmlFor="currency-toggle-home" className={currency === 'EUR' ? 'font-semibold' : 'text-muted-foreground'}>
              EUR (€)
            </Label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={`glass-card relative flex flex-col ${
                tier.badge ? 'border-primary border-2 shadow-lg' : ''
              }`}
            >
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {tier.badge}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="text-3xl font-bold text-primary mt-2">
                  {tier.priceLabel || `${currencySymbol}${convertPrice(tier.price)} / month`}
                </div>
                <CardDescription className="text-base mt-2">
                  {tier.tagline}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col">
                <ul className="space-y-3 flex-grow">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Collapsible open={expandedTier === index} onOpenChange={() => setExpandedTier(expandedTier === index ? null : index)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full">
                      {expandedTier === index ? (
                        <>Less Details <ChevronUp className="ml-2 h-4 w-4" /></>
                      ) : (
                        <>More Details <ChevronDown className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <Separator className="mb-3" />
                    <ul className="space-y-2">
                      {tier.detailedFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>

                <Button
                  variant={tier.variant}
                  className="w-full mt-4"
                  size="lg"
                  onClick={tier.action}
                >
                  {tier.button}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* À La Carte Section */}
        <Collapsible open={showALaCarte} onOpenChange={setShowALaCarte}>
          <div className="text-center mb-6">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="lg">
                {showALaCarte ? (
                  <>Hide À La Carte Options <ChevronUp className="ml-2 h-5 w-5" /></>
                ) : (
                  <>View À La Carte Options <ChevronDown className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* AI Credit Packs */}
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">AI Credit Packs</CardTitle>
                  </div>
                  <CardDescription>
                    Never expire. Work across all AI features.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {creditPacks.map((pack, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{pack.name}</p>
                          <p className="text-sm text-muted-foreground">{pack.credits}</p>
                          {pack.bonus && (
                            <Badge variant="secondary" className="mt-1 text-xs">{pack.bonus}</Badge>
                          )}
                        </div>
                        <p className="text-lg font-bold text-primary">{currencySymbol}{convertPrice(pack.price)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* On-Demand Tools */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl">On-Demand AI Tools</CardTitle>
                  <CardDescription>
                    For Team & Pro subscribers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alaCarteTools.map((tool, i) => {
                      const Icon = tool.icon;
                      return (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-primary" />
                            <p className="font-medium text-sm">{tool.name}</p>
                          </div>
                          <p className="text-lg font-bold text-primary">{currencySymbol}{convertPrice(tool.price)}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-6">
              <Button onClick={() => navigate('/pricing')} size="lg">
                View Full Pricing Details
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
};
