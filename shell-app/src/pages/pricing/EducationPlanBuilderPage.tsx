import { useEffect, useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { cn } from "../../components/ui/utils";
import { BarChart, Check, DollarSign, LayoutGrid, Zap } from "lucide-react";

const BASE_PRICE_PER_USER = 4;
const CORE_FEATURES = [
  "Student Information System (SIS)",
  "Centralized Curriculum Hub",
  "AI-Powered Risk Assessment",
  "Role-Based Access Control (RBAC)",
  "FPK Aegis Governance Layer",
];

const A_LA_CARTE_PRICES: Record<string, { price: number; label: string }> = {
  pulse_kanban: { price: 1.0, label: "Project Kanban Boards" },
  pulse_budgeting: { price: 1.5, label: "Department Budgeting Tools" },
  fkpx_logging: { price: 2.0, label: "Incident & Behavioral Logging" },
  fkpx_assessments: { price: 3.0, label: "Full Assessment Library (BFA, SRS)" },
  fkpx_insight_engine: { price: 2.5, label: "AI Insight Engine" },
  nexus: { price: 2.0, label: "FPK Nexus Community Platform" },
  coach: { price: 1.0, label: "AI Study Coach Pro Access" },
};

const PACKAGES = [
  { id: "core", name: "Core ISOS", description: "The essential Student Information & Learning OS.", features: new Set<string>() },
  {
    id: "ops",
    name: "Operations-Focused",
    description: "Integrates project management and budgeting.",
    features: new Set<string>(["pulse_kanban", "pulse_budgeting"]),
  },
  {
    id: "community",
    name: "Community-Focused",
    description: "Build a vibrant, private digital community.",
    features: new Set<string>(["nexus"]),
  },
  {
    id: "wellness",
    name: "Wellness-Focused",
    description: "Behavioral tracking and support tools.",
    features: new Set<string>(["fkpx_logging", "fkpx_assessments"]),
  },
  {
    id: "pro",
    name: "The Professional Bundle",
    description: "Our most popular, balanced package.",
    features: new Set<string>(["pulse_kanban", "fkpx_logging"]),
  },
  {
    id: "enterprise",
    name: "The Complete Ecosystem",
    description: "The ultimate, unified OS for your institution.",
    features: new Set<string>(Object.keys(A_LA_CARTE_PRICES)),
  },
];

const ALL_FEATURES_CATEGORIZED = {
  pulse: {
    name: "FPK Pulse Modules",
    icon: BarChart,
    color: "text-blue-600",
    items: ["pulse_kanban", "pulse_budgeting"],
  },
  fkpx: {
    name: "FPK-X Clinical & Behavioral Suite",
    icon: Zap,
    color: "text-teal-600",
    items: ["fkpx_logging", "fkpx_assessments", "fkpx_insight_engine"],
  },
  standalone: {
    name: "Platform Add-ons",
    icon: LayoutGrid,
    color: "text-slate-600",
    items: ["nexus", "coach"],
  },
};

export const EducationPlanBuilderPage = () => {
  const [userCount, setUserCount] = useState(500);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set(PACKAGES.find((p) => p.id === "pro")?.features ?? []));
  const [activePackage, setActivePackage] = useState<string | null>("pro");

  const totalCost = useMemo(() => {
    let cost = userCount * BASE_PRICE_PER_USER;
    selectedFeatures.forEach((featureId) => {
      cost += userCount * (A_LA_CARTE_PRICES[featureId]?.price || 0);
    });
    return cost;
  }, [userCount, selectedFeatures]);

  useEffect(() => {
    const packageData = PACKAGES.find((p) => p.id === activePackage);
    if (packageData) {
      setSelectedFeatures(new Set(packageData.features));
    }
  }, [activePackage]);

  const toggleFeature = (featureId: string) => {
    setActivePackage(null);
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      next.has(featureId) ? next.delete(featureId) : next.add(featureId);
      return next;
    });
  };

  const selectedList = [...selectedFeatures];

  return (
    <div className="bg-white min-h-screen">
      <main className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Build Your Custom Education Plan</h1>
          <p className="mt-3 text-lg text-slate-600">Tailor the FPK OS to the specific needs of your institution.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800">1. Start with a Package</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setActivePackage(pkg.id)}
                    className={cn(
                      "p-4 border rounded-lg text-left transition-all h-full flex flex-col justify-between",
                      activePackage === pkg.id ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500" : "hover:bg-slate-50"
                    )}
                  >
                    <p className="font-semibold text-slate-800">{pkg.name}</p>
                    <p className="text-sm text-slate-500 mt-1">{pkg.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800">2. Customize Your Plan (A La Carte)</h2>
              <div className="space-y-6">
                {Object.values(ALL_FEATURES_CATEGORIZED).map((category) => (
                  <div key={category.name}>
                    <h4 className={cn("font-semibold mb-3 flex items-center gap-2", category.color)}>
                      <category.icon className="h-5 w-5" />
                      {category.name}
                    </h4>
                    <div className="space-y-3 pl-8 border-l-2 border-slate-200">
                      {category.items.map((featureId) => (
                        <div key={featureId} className="flex items-center space-x-3">
                          <Checkbox
                            id={featureId}
                            checked={selectedFeatures.has(featureId)}
                            onCheckedChange={() => toggleFeature(featureId)}
                            aria-label={`Toggle ${A_LA_CARTE_PRICES[featureId].label}`}
                          />
                          <Label htmlFor={featureId} className="font-medium cursor-pointer text-sm text-slate-700">
                            {A_LA_CARTE_PRICES[featureId].label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800">3. Estimate Your User Count</h2>
              <div className="p-6 border rounded-lg bg-white">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-slate-700" htmlFor="user-range">
                    Students & Staff
                  </Label>
                  <span className="font-bold text-lg text-slate-800">{userCount.toLocaleString()}</span>
                </div>
                <Input
                  id="user-range"
                  type="range"
                  min={50}
                  max={10000}
                  step={50}
                  value={userCount}
                  onChange={(e) => setUserCount(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>50</span>
                  <span>10,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky top-24">
            <Card className="shadow-xl border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700">
                  <DollarSign className="h-5 w-5" /> Estimated Monthly Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold mb-2 text-slate-900">${totalCost.toLocaleString()}</div>
                <div className="text-sm text-slate-500 mb-4">
                  <p>
                    {userCount.toLocaleString()} users × ${(totalCost / userCount || 0).toFixed(2)}/user
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="font-semibold text-sm mb-2 text-slate-800">Your Custom Plan Includes:</p>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="core">
                      <AccordionTrigger className="text-sm font-medium py-2">Core University Platform</AccordionTrigger>
                      <AccordionContent className="pl-4 pb-2">
                        <ul className="space-y-1 text-xs text-slate-600">
                          {CORE_FEATURES.map((f) => (
                            <li key={f} className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="mt-3 space-y-2">
                    {selectedList.map((id) => {
                      const feature = A_LA_CARTE_PRICES[id];
                      const addOnCost = userCount * (feature?.price || 0);
                      return feature ? (
                        <div key={id} className="flex items-center justify-between text-sm text-slate-700 border-b pb-1">
                          <span>{feature.label}</span>
                          <span className="font-semibold">+${addOnCost.toLocaleString()}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                <Button size="lg" className="w-full mt-6">
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EducationPlanBuilderPage;
