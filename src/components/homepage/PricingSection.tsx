import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  isPopular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '€0',
    period: '/forever',
    description: 'For getting started',
    features: [
      '50 AI Credits/month',
      'Basic Chat Access'
    ],
    buttonText: 'Start for Free',
    buttonLink: '#pricing-free',
    isPopular: false
  },
  {
    name: 'Individual',
    price: '€14.99',
    period: '/month',
    description: 'For the dedicated learner',
    features: [
      '1,000 AI Credits/month',
      'Advanced Analytics',
      'Flashcard Generation'
    ],
    buttonText: 'Choose Individual',
    buttonLink: '#pricing-individual',
    isPopular: false
  },
  {
    name: 'Family',
    price: '€23.99',
    period: '/month',
    description: 'For the whole household',
    features: [
      'Up to 4 Users',
      '2,500 Shared Credits',
      'Parental Controls'
    ],
    buttonText: 'Choose Family',
    buttonLink: '#pricing-family',
    isPopular: true
  },
  {
    name: 'Premium',
    price: '€49.99',
    period: '/month',
    description: 'For the power user',
    features: [
      '5,000 AI Credits/month',
      'Custom Study Plans',
      'Priority Support'
    ],
    buttonText: 'Choose Premium',
    buttonLink: '#pricing-premium',
    isPopular: false
  }
];

const PricingSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto rounded-2xl shadow-lg border border-white/20 p-8 sm:p-12 bg-white/60">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-slate-700">
            Start for free, then choose the plan that grows with you.
          </p>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col p-6 rounded-xl border transition-all duration-300 hover:shadow-xl ${
                tier.isPopular
                  ? 'bg-fpk-orange text-white shadow-2xl lg:scale-105 relative'
                  : 'bg-white/60 border-white/40 hover:bg-white/80'
              }`}
            >
              {/* Most Popular Badge */}
              {tier.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="px-4 py-1 text-sm font-semibold tracking-wide text-white bg-fpk-orange/90 rounded-full shadow-md border border-white/20">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <h3 className={`text-xl font-semibold ${tier.isPopular ? 'text-white' : 'text-slate-900'}`}>
                {tier.name}
              </h3>

              {/* Price */}
              <div className="mt-4">
                <span className={`text-4xl font-bold ${tier.isPopular ? 'text-white' : 'text-slate-900'}`}>
                  {tier.price}
                </span>
                <span className={`text-lg font-medium ${tier.isPopular ? 'text-white/80' : 'text-slate-500'}`}>
                  {tier.period}
                </span>
              </div>

              {/* Description */}
              <p className={`text-sm mt-2 ${tier.isPopular ? 'text-white/80' : 'text-slate-500'}`}>
                {tier.description}
              </p>

              {/* Features List */}
              <ul className="mt-6 space-y-3 flex-grow">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className={`w-5 h-5 mr-2 flex-shrink-0 ${tier.isPopular ? 'text-white' : 'text-green-600'}`} />
                    <span className={`text-sm ${tier.isPopular ? 'text-white' : 'text-slate-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={tier.buttonLink}
                className={`mt-8 w-full inline-block text-center px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                  tier.isPopular
                    ? 'bg-white text-fpk-orange hover:bg-slate-100'
                    : 'text-fpk-orange bg-white border border-fpk-orange/40 hover:bg-fpk-orange hover:text-white'
                }`}
              >
                {tier.buttonText}
              </a>
            </div>
          ))}
        </div>

        {/* Compare Features Link */}
        <div className="text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-fpk-orange hover:underline font-semibold text-lg transition-all"
          >
            Compare all features
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Full Feature Comparison</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-slate-700">
              <p className="mb-4">
                Detailed comparison table coming soon. This will include a comprehensive breakdown of all features across each tier.
              </p>
              <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                <p className="text-sm text-slate-600">
                  Placeholder for the full, detailed comparison table based on the four-tier structure.
                  This will include all features, limits, and benefits for Free, Individual, Family, and Premium plans.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-fpk-orange text-white hover:bg-fpk-orange/90"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PricingSection;
