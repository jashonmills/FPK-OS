import { useEffect, useMemo, useState } from "react";
import { BarChart, Check, DollarSign, LayoutGrid, Users as UsersIcon, Zap } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../components/ui/utils";

const BASE_PRICE_PER_USER = 4;

const A_LA_CARTE_PRICES: Record<string, number> = {
  pulse_kanban: 1.0,
  pulse_budgeting: 1.5,
  fkpx_logging: 2.0,
  fkpx_assessments: 3.0,
  fkpx_insight_engine: 2.5,
  nexus: 2.0,
  coach: 1.0,
};

const PACKAGES = [
  { id: "starter", name: "Starter School", description: "The essential OS for modern learning.", features: new Set<string>() },
  {
    id: "pro",
    name: "Professional School",
    description: "For institutions needing deeper integration.",
    features: new Set<string>(["pulse_kanban", "fkpx_logging"]),
  },
  {
    id: "enterprise",
    name: "Enterprise Campus",
    description: "The complete, unified FPK ecosystem.",
    features: new Set<string>(Object.keys(A_LA_CARTE_PRICES)),
  },
];

const ALL_FEATURES = {
  pulse: {
    name: "FPK Pulse Modules",
    icon: BarChart,
    items: [
      { id: "pulse_kanban", label: "Project Kanban Boards" },
      { id: "pulse_budgeting", label: "Department Budgeting Tools" },
    ],
  },
  fkpx: {
    name: "FPK-X Clinical & Behavioral Suite",
    icon: Zap,
    items: [
      { id: "fkpx_logging", label: "Incident & Behavioral Logging" },
      { id: "fkpx_assessments", label: "Full Assessment Library (BFA, SRS)" },
      { id: "fkpx_insight_engine", label: "AI Insight Engine" },
    ],
  },
  standalone: {
    name: "Platform Add-ons",
    icon: LayoutGrid,
    items: [
      { id: "nexus", label: "FPK Nexus Community Platform" },
      { id: "coach", label: "AI Study Coach Pro Access" },
    ],
  },
};

export const EducationPlanBuilderPage = () => {
  const [userCount, setUserCount] = useState(500);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set(PACKAGES.find((p) => p.id === "pro")?.features));
  const [activePackage, setActivePackage] = useState<string | null>("pro");

  const totalCost = useMemo(() => {
    let cost = userCount * BASE_PRICE_PER_USER;
    selectedFeatures.forEach((featureId) => {
      cost += userCount * (A_LA_CARTE_PRICES[featureId] || 0);
    });
    return cost;
  }, [userCount, selectedFeatures]);

  useEffect(() => {
    const pkg = PACKAGES.find((p) => p.id === activePackage);
    if (pkg) {
      setSelectedFeatures(new Set(pkg.features));
    }
  }, [activePackage]);

  const toggleFeature = (featureId: string) => {
    setActivePackage(null);
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) next.delete(featureId);
      else next.add(featureId);
      return next;
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Build Your Custom Education Plan</h1>
          <p className="mt-3 text-lg text-slate-600">Tailor the FPK OS to the specific needs of your institution.</p>
        </div>

        <div className="mt-16 grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Start with a Package</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-4">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setActivePackage(pkg.id)}
                    className={cn(
                      "p-4 border rounded-lg text-left transition-all h-full",
                      activePackage === pkg.id ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500" : "hover:bg-slate-100"
                    )}
                  >
                    <p className="font-semibold">{pkg.name}</p>
                    <p className="text-sm text-slate-500">{pkg.description}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Customize Your Plan (A La Carte)</CardTitle>
                <CardDescription>Fine-tune your OS by adding or removing individual features.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.values(ALL_FEATURES).map((category) => (
                  <div key={category.name}>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <category.icon className="h-5 w-5 text-slate-600" />
                      {category.name}
                    </h4>
                    <div className="space-y-2 pl-4">
                      {category.items.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-3">
                          <Checkbox id={feature.id} checked={selectedFeatures.has(feature.id)} onCheckedChange={() => toggleFeature(feature.id)} />
                          <Label htmlFor={feature.id} className="font-medium cursor-pointer">
                            {feature.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Estimate Your User Count</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="user-count">Students & Staff</Label>
                  <span className="font-bold text-lg flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-slate-500" />
                    {userCount.toLocaleString()}
                  </span>
                </div>
                <Input
                  id="user-count"
                  type="range"
                  min={50}
                  max={10000}
                  step={100}
                  value={userCount}
                  onChange={(e) => setUserCount(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>50</span>
                  <span>10,000</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="sticky top-24">
            <Card className="shadow-xl border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" /> Estimated Monthly Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold mb-2">${totalCost.toLocaleString()}</div>
                <div className="text-sm text-slate-500 mb-4">
                  <p>
                    <span className="font-semibold">{userCount.toLocaleString()} users</span> ×{" "}
                    <span className="font-semibold">${(totalCost / userCount || 0).toFixed(2)}/user</span>
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="font-semibold text-sm mb-2">Your Custom Plan Includes:</p>
                  <ul className="space-y-1 text-xs text-slate-600 max-h-40 overflow-auto pr-1">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Core University Platform
                    </li>
                    {[...selectedFeatures].map((id) => {
                      const feature = Object.values(ALL_FEATURES)
                        .flatMap((c) => c.items)
                        .find((f) => f.id === id);
                      return feature ? (
                        <li key={id} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {feature.label}
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
                <Button size="lg" className="w-full mt-6">
                  Request a Quote & Build Plan
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
