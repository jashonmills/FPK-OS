import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Tier = {
  name: string;
  price: string;
  frequency: string;
  description: string;
  features: string[];
  cta: string;
  planId: string;
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Basic",
    price: "$0",
    frequency: "/forever",
    description: "Get started with core tools for one child.",
    features: [
      "Track up to 10 skills in FPK-X",
      "Access to FPK University public library",
      "Join public community groups in FPK Nexus",
      "1 Child Profile",
    ],
    cta: "Start for Free",
    planId: "family_free",
  },
  {
    name: "Premium",
    price: "$29",
    frequency: "/month",
    description: "Unlock the full suite for your whole family.",
    features: [
      "Unlimited skill tracking in FPK-X",
      "Full access to FPK University courses",
      "AI Study Coach for each child",
      "Private family groups in FPK Nexus",
      "Up to 5 Child Profiles",
      "Share data with clinicians & educators",
    ],
    cta: "Start 14-Day Free Trial",
    planId: "family_premium_monthly",
    featured: true,
  },
  {
    name: "Premium Annual",
    price: "$299",
    frequency: "/year",
    description: "Save over 15% with an annual plan.",
    features: [
      "All Premium features",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Start 14-Day Free Trial",
    planId: "family_premium_annual",
  },
];

const ParentsPricingPage = () => {
  const navigate = useNavigate();

  const handleCtaClick = (planId: string) => {
    navigate(`/onboarding?plan=${planId}`);
  };

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            The Right Plan for Your Family
          </h1>
          <p className="mt-4 text-xl text-slate-600">
            Simple, transparent pricing. Cancel anytime.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex h-full flex-col rounded-2xl border bg-white shadow-lg ${
                tier.featured ? "border-indigo-500 shadow-indigo-200" : "border-slate-200"
              }`}
            >
              <div className="p-6">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">{tier.name}</h2>
                  {tier.featured && (
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="mt-2 h-12 text-sm text-slate-600">{tier.description}</p>
                <div className="mt-4">
                  <span className="text-5xl font-extrabold text-slate-900">
                    {tier.price}
                  </span>
                  <span className="text-lg font-medium text-slate-500">
                    {tier.frequency}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6 pt-0">
                <ul className="space-y-4 text-slate-800">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 ${
                    tier.featured
                      ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                      : "bg-slate-900 hover:bg-slate-800 shadow-slate-300"
                  }`}
                  onClick={() => handleCtaClick(tier.planId)}
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentsPricingPage;
