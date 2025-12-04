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
    name: "Hobby",
    price: "$0",
    frequency: "/forever",
    description: "Organize your ideas and learn new things.",
    features: [
      "Up to 1,000 knowledge blocks",
      "Access to public course library",
      "Web clipper for 50 articles/mo",
      "Standard import/export",
    ],
    cta: "Start for Free",
    planId: "individual_free",
  },
  {
    name: "Pro",
    price: "$15",
    frequency: "/month",
    description: "The ultimate toolkit for serious learners.",
    features: [
      "Unlimited knowledge blocks",
      "AI Study Coach",
      "Unlimited web clipper usage",
      "Advanced search & filtering",
      "Connect to external tools (Notion, etc.)",
      "Priority support",
    ],
    cta: "Start 14-Day Free Trial",
    planId: "individual_pro_monthly",
    featured: true,
  },
  {
    name: "Lifetime",
    price: "$499",
    frequency: "/one-time",
    description: "Pay once. Own your second brain forever.",
    features: [
      "All Pro features, forever",
      "All future updates included",
      "Exclusive access to beta features",
    ],
    cta: "Get Lifetime Access",
    planId: "individual_pro_lifetime",
  },
];

const IndividualsPricingPage = () => {
  const navigate = useNavigate();

  const handleCtaClick = (planId: string) => {
    navigate(`/access?plan=${planId}`);
  };

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Invest in Your Mind
          </h1>
          <p className="mt-4 text-xl text-slate-600">
            A simple plan to help you learn faster, remember more, and achieve your goals.
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

export default IndividualsPricingPage;
