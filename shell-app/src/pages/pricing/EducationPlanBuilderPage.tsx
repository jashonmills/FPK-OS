import { DollarSign, Users, Check } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useState } from "react";

export const EducationPlanBuilderPage = () => {
  const [userCount, setUserCount] = useState(500);

  const coreFeatures = [
    "Student Information System (SIS)",
    "Centralized Curriculum Hub",
    "AI-Powered Risk Assessment",
    "Role-Based Access Control (RBAC)",
    "AI Governance & Compliance Module",
  ];

  const addonFeatures = [
    { id: "pulse", label: "FPK Pulse Integration (Project Management)" },
    { id: "nexus", label: "FPK Nexus (Private Social Platform)" },
    { id: "coach", label: "Standalone AI Study Coach Access" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Build Your Custom Education Plan</h1>
          <p className="mt-3 text-lg text-slate-600">Tailor the FPK OS to the specific needs of your institution.</p>
        </div>

        <div className="mt-16 grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Core Platform Features (Included)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {coreFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Your Add-ons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addonFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-3">
                    <Checkbox id={feature.id} />
                    <Label htmlFor={feature.id} className="font-medium">
                      {feature.label}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estimate Your User Count</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="user-count">Students & Staff</Label>
                  <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <Users className="h-4 w-4 text-slate-500" />
                    {userCount}
                  </div>
                </div>
                <Input
                  id="user-count"
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={userCount}
                  onChange={(e) => setUserCount(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>50</span>
                  <span>5000</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" /> Estimated Monthly Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">$2,500</div>
              <p className="text-sm text-slate-500 mb-6">
                This is an estimate. Our team will contact you to finalize pricing and details.
              </p>
              <Button size="lg" className="w-full">
                Request a Quote
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EducationPlanBuilderPage;
