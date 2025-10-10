import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

export const PricingTeaser = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: 'Family',
      price: 'Free Forever',
      tagline: 'For getting started and organizing your world.',
      features: [
        '1 Student Profile',
        '2 User Accounts',
        'Core Data & Sleep Logging',
        'Universal Analytics Dashboard',
      ],
      button: 'Get Started for Free',
      action: () => navigate('/auth'),
      variant: 'outline' as const,
    },
    {
      name: 'Collaborative Team',
      price: '$25 / month',
      tagline: 'For connecting your entire support team.',
      features: [
        'Up to 5 Student Profiles',
        'Up to 10 User Accounts',
        'AI-Powered Document Analysis',
        'Exportable PDF Reports',
      ],
      button: 'Choose Team Plan',
      action: () => navigate('/pricing'),
      variant: 'default' as const,
      badge: 'Most Popular',
    },
    {
      name: 'Insights Pro',
      price: '$60 / month',
      tagline: 'For proactive, AI-driven decision making.',
      features: [
        'Unlimited Students & Users',
        'Predictive AI Insight Engine',
        'Intervention Recommendations',
        'Priority Support',
      ],
      button: 'Explore Pro Plan',
      action: () => navigate('/pricing'),
      variant: 'secondary' as const,
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            A Plan for Every Family's Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start for free and grow with a team that's always on the same page.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
                  {tier.price}
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
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={tier.variant}
                  className="w-full mt-6"
                  size="lg"
                  onClick={tier.action}
                >
                  {tier.button}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
