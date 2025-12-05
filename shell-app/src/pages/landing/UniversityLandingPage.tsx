import { Link } from "react-router-dom";
import { BarChart, Building, CheckCircle, User, Zap, Users as NexusIcon } from "lucide-react";
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
    { title: "Student Information System (SIS)", description: "A complete OS to manage student records, attendance, and communication." },
    { title: "Centralized Curriculum Hub", description: "Design, manage, and deploy your entire curriculum from a single, collaborative space." },
    { title: "AI-Powered Risk Assessment", description: "Proactively identify at-risk students based on engagement and performance data." },
    { title: "Role-Based Access Control (RBAC)", description: "Granular permissions for every role to keep data secure and relevant." },
  ];

  const institutionAddonFeatures: Integration[] = [
    {
      icon: BarChart,
      title: "FPK Pulse Integration",
      description:
        "Manage school projects, track budgets for departments, and handle internal operations with Kanban and financial tools.",
    },
    {
      icon: NexusIcon,
      title: "FPK Nexus Integration",
      description:
        "Launch a private, secure social community for your students, staff, and alumni to foster connection and engagement.",
    },
    {
      icon: Zap,
      title: "FPK-X Clinical Suite",
      description:
        "For special education, integrate clinical-grade behavioral tracking, FBA/BIP builders, and the full assessment library.",
    },
  ];

  return (
    <div className="bg-white text-slate-800">
      <section className="bg-blue-50 py-20 px-4 text-center">
        <p className="font-semibold text-blue-600">FPK University</p>
        <h1 className="text-5xl font-bold tracking-tight mt-2">The Action Engine for Learning.</h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto text-slate-600">
          From personal knowledge mastery to a complete institutional operating system, FPK University transforms
          passive learning into measurable outcomes.
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

          <TabsContent value="institutions" className="mt-12">
            <div className="text-center mb-12">
              <Building className="h-10 w-10 mx-auto text-slate-700" />
              <h2 className="text-3xl font-bold mt-2">Your Complete Educational OS</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-2">
                One unified platform to run your entire institution, from admissions to alumni engagement.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Core University Platform</CardTitle>
                    <p className="text-slate-500">The foundational operating system for modern education.</p>
                  </CardHeader>
                  <CardContent>
                    <FeatureList features={institutionCoreFeatures} />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-center lg:text-left">Ecosystem Integrations</h3>
                {institutionAddonFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <feature.icon className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{feature.title}</p>
                      <p className="text-sm text-slate-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
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
