import { useState } from "react";
import { Check, Zap, BarChart, BrainCircuit } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";

type Plan = {
  title: string;
  price: { monthly: number; annual: number };
  tagline: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

type AddOn = {
  id: string;
  icon: typeof Zap;
  title: string;
  description: string;
  price: { monthly: number; annual: number };
};

export const IndividualPlanBuilderPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans: Record<string, Plan> = {
    explorer: {
      title: "Explorer",
      price: { monthly: 0, annual: 0 },
      tagline: "Start building your second brain.",
      features: [
        "Personal Knowledge Library (200 notes)",
        "Web Clipper & Ingestion",
        "Basic AI Socratic Coach (5 sessions/mo)",
      ],
      cta: "Start for Free",
    },
    architect: {
      title: "Architect",
      price: { monthly: 12, annual: 10 },
      tagline: "Unlock the complete Action Engine.",
      features: [
        "Everything in Explorer, plus:",
        "Unlimited Knowledge Library",
        "Unlimited AI Socratic Coach",
        "Adaptive Learning Paths",
        "Spaced Repetition System (SRS)",
      ],
      cta: "Choose Architect",
      highlight: true,
    },
  };

  const addons: AddOn[] = [
    {
      id: "fkpx",
      icon: Zap,
      title: "FPK-X Add-on",
      description: "The Insight Engine. Track personal metrics and analyze documents.",
      price: { monthly: 8, annual: 6 },
    },
    {
      id: "pulse",
      icon: BarChart,
      title: "FPK Pulse Add-on",
      description: "The Operations Engine. Manage personal projects with Kanban boards.",
      price: { monthly: 5, annual: 4 },
    },
    {
      id: "coach-pro",
      icon: BrainCircuit,
      title: "AI Coach Pro",
      description: "Advanced, multi-modal AI capabilities for deeper analysis.",
      price: { monthly: 10, annual: 8 },
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Your Journey to a Second Brain Starts Now.</h1>
          <p className="mt-3 text-lg text-slate-600">
            Choose a plan that fits your learning style, then customize it with powerful add-ons.
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 my-10">
          <Label htmlFor="billing-cycle">Monthly</Label>
          <Switch
            id="billing-cycle"
            checked={isAnnual}
            onChange={(e) => setIsAnnual(e.target.checked)}
            aria-label="Toggle annual billing"
          />
          <Label htmlFor="billing-cycle" className="font-semibold text-indigo-600">
            Annual (Save 20%)
          </Label>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {Object.values(plans).map((plan) => (
            <Card
              key={plan.title}
              className={`flex flex-col ${plan.highlight ? "border-indigo-500 shadow-md" : ""}`}
            >
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-slate-500">
                    /month{isAnnual && plan.price.annual > 0 ? ", billed annually" : ""}
                  </span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 pt-0">
                <Button size="lg" className="w-full">
                  {plan.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Supercharge Your OS with A La Carte Add-ons</h2>
            <p className="mt-2 text-slate-600">Add powerful capabilities from the FPK ecosystem to your plan.</p>
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            {addons.map((addon) => (
              <Card key={addon.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <addon.icon className="h-6 w-6 text-indigo-600" />
                  <div>
                    <p className="font-semibold">{addon.title}</p>
                    <p className="text-sm text-slate-500">{addon.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      +${isAnnual ? addon.price.annual : addon.price.monthly}
                      <span className="text-sm font-normal text-slate-500">/mo</span>
                    </p>
                  </div>
                  <Button variant="outline">Add</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default IndividualPlanBuilderPage;
