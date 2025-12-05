import { Link } from "react-router-dom";
import { BarChart, CheckCircle, User, Zap, Users as NexusIcon, BrainCircuit } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

type Feature = { title: string; description: string };
type Integration = { icon: typeof BarChart; title: string; description: string };

const FeatureList = ({ features }: { features: Feature[] }) => (
  <ul className="space-y-3">
    {features.map((feature, index) => (
      <li key={index} className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
        <div>
          <p className="font-semibold">{feature.title}</p>
          <p className="text-sm text-slate-600">{feature.description}</p>
        </div>
      </li>
    ))}
  </ul>
);

export const UniversityLandingPage = () => {
  const individualFeatures: Feature[] = [
    { title: "Personal Knowledge Library", description: "A 'second brain' to capture and connect everything you learn." },
    { title: "AI Socratic Coach", description: "An interactive AI tutor that asks you questions to deepen your understanding." },
    { title: "Adaptive Learning Paths", description: "AI-generated study plans that adapt to your progress and help you master new skills." },
    { title: "Spaced Repetition System (SRS)", description: "Intelligent flashcards to combat the forgetting curve and lock in knowledge." },
  ];

  const institutionCoreFeatures: Feature[] = [
    { title: "Student Information System (SIS)", description: "Manage records, attendance, and communication in one governed layer." },
    { title: "Centralized Curriculum Hub", description: "Design, manage, and deploy curriculum collaboratively." },
    { title: "AI-Powered Risk Assessment", description: "Proactively spot at-risk students with academic + wellness signals." },
    { title: "Role-Based Access Control (RBAC)", description: "Granular permissions for admins, faculty, staff, and partners." },
    { title: "FPK Aegis Governance", description: "Audit-ready controls for data, AI usage, and compliance." },
  ];

  const institutionAddonFeatures: Integration[] = [
    {
      icon: BarChart,
      title: "FPK Pulse Integration",
      description: "Project ops + budgeting synced to academic planning and enrollment.",
    },
    {
      icon: NexusIcon,
      title: "FPK Nexus Integration",
      description: "Private community for students, staff, alumni—auth and roles managed centrally.",
    },
    {
      icon: Zap,
      title: "FPK-X Clinical Suite",
      description: "Behavioral tracking, FBA/BIP builders, assessment library, and risk alerts.",
    },
    {
      icon: BrainCircuit,
      title: "AI Study Coach Pro",
      description: "Advanced AI tutoring available to all enrolled learners.",
    },
  ];

  return (
    <div className="bg-white text-slate-800">
      <section className="bg-blue-50 py-20 px-4 text-center">
        <p className="font-semibold text-blue-600">FPK University</p>
        <h1 className="text-5xl font-bold tracking-tight mt-2">The Action Engine for Learning.</h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto text-slate-600">
          From personal mastery to a fully intelligent campus, FPK University connects every part of your ecosystem.
        </p>
      </section>

      <main className="py-24 px-6 max-w-7xl mx-auto">
        <Tabs defaultValue="institutions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="individuals">For Individuals</TabsTrigger>
            <TabsTrigger value="institutions">For Institutions</TabsTrigger>
          </TabsList>

          <TabsContent value="individuals" className="mt-12">
            <Card className="max-w-lg mx-auto border-blue-200 shadow-lg">
              <CardHeader className="text-center">
                <User className="h-10 w-10 mx-auto text-blue-600" />
                <CardTitle className="text-3xl mt-2">Build Your Second Brain</CardTitle>
                <p className="text-slate-500">The ultimate toolkit for the serious learner.</p>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <FeatureList features={individualFeatures} />
                <Link to="/university/pricing" className="w-full block">
                  <Button size="lg" className="w-full mt-8 bg-blue-600 hover:bg-blue-700">
                    Choose Your Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="institutions" className="mt-12 space-y-12">
            {/* Section 1: Vision */}
            <Card className="overflow-hidden border-slate-200">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 space-y-3">
                  <p className="font-semibold text-indigo-600 uppercase text-xs tracking-wide">Vision</p>
                  <h2 className="text-3xl font-bold">The FPK OS: Your Institution's Central Nervous System.</h2>
                  <p className="text-slate-600">
                    Move beyond siloed software. Connect academics, operations, community, and student wellness into a
                    single, intelligent, and predictive ecosystem.
                  </p>
                </div>
                <div className="p-8 bg-gradient-to-br from-indigo-50 via-white to-slate-50">
                  <div className="relative h-72 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-radial from-indigo-100 via-transparent to-transparent" />
                    <div className="relative z-10 text-center">
                      <div className="inline-flex flex-col items-center justify-center rounded-full border-2 border-indigo-400/70 bg-white px-6 py-4 shadow-md">
                        <span className="text-xs font-semibold text-indigo-700 tracking-wide">FPK Aegis AI Core</span>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700">
                        <div className="rounded-lg bg-white/80 border p-3 shadow-sm">
                          Academics ↔ Wellness
                          <p className="text-xs text-slate-500 mt-1">
                            Spot at-risk students when grades dip and behavioral logs spike.
                          </p>
                        </div>
                        <div className="rounded-lg bg-white/80 border p-3 shadow-sm">
                          Academics ↔ Ops
                          <p className="text-xs text-slate-500 mt-1">
                            Auto-budget for curriculum changes using enrollment + course data.
                          </p>
                        </div>
                        <div className="rounded-lg bg-white/80 border p-3 shadow-sm">
                          Community ↔ Academics
                          <p className="text-xs text-slate-500 mt-1">
                            Alumni mentorship groups formed from course & career paths.
                          </p>
                        </div>
                        <div className="rounded-lg bg-white/80 border p-3 shadow-sm">
                          Ops ↔ Wellness
                          <p className="text-xs text-slate-500 mt-1">
                            Staffing models informed by attendance and counseling demand.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 2: Role spotlights */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="font-semibold text-indigo-600 uppercase text-xs tracking-wide">Deep Dive</p>
                <h3 className="text-2xl font-bold mt-1">An OS for Every Role</h3>
                <p className="text-slate-600 mt-2">
                  Real scenarios that show how leadership, student affairs, and operations work together on one platform.
                </p>
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Provost / Academic Leadership</CardTitle>
                    <p className="text-sm text-slate-500">Curriculum excellence and outcomes</p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-700">
                    <p>
                      Design a new data science program in University. Pulse forecasts budget for software and hiring.
                      AI Coach analyzes overlaps; FPK-X shows prerequisite success data to set requirements.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Dean of Students</CardTitle>
                    <p className="text-sm text-slate-500">Engagement, wellness, retention</p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-700">
                    <p>
                      Engagement drops; AI Risk flags. FPK-X logs show anxiety notes. Nexus spins up a peer group and
                      counseling connection—documented in one secure record.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>COO / Finance</CardTitle>
                    <p className="text-sm text-slate-500">Efficiency and resource allocation</p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-700">
                    <p>
                      Plan next year's budget in Pulse. Track department spend, see Arts building +15% while enrollment
                      up 10% in University SIS—get a clear revenue vs. expense view.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Section 3: Building blocks */}
            <Card>
              <div className="grid lg:grid-cols-2">
                <div className="p-8 border-r border-slate-100 space-y-3">
                  <p className="font-semibold text-indigo-600 uppercase text-xs tracking-wide">Starting Point</p>
                  <h3 className="text-2xl font-bold">The Core Package</h3>
                  <p className="text-slate-600">Every institutional plan starts with the powerful FPK University core.</p>
                  <FeatureList features={institutionCoreFeatures} />
                </div>
                <div className="p-8 space-y-4">
                  <p className="font-semibold text-indigo-600 uppercase text-xs tracking-wide">Popular Integrations</p>
                  <h3 className="text-2xl font-bold">Expand When Ready</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {institutionAddonFeatures.map((feature) => (
                      <div key={feature.title} className="flex items-start gap-3 rounded-lg border p-3 bg-slate-50">
                        <feature.icon className="h-5 w-5 text-indigo-600 mt-0.5" />
                        <div>
                          <p className="font-semibold">{feature.title}</p>
                          <p className="text-xs text-slate-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 4: CTA */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to Build Your Intelligent Campus?</h3>
              <p className="text-slate-600 mb-4">Step into the plan builder and configure your institution in minutes.</p>
              <Link to="/solutions/education/build-plan">
                <Button size="lg" variant="outline" className="text-lg py-6 px-8">
                  Build Your Custom Institution Plan
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UniversityLandingPage;
