import { Building, CheckCircle, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

type Feature = { title: string; description: string };

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
    {
      title: "Personal Knowledge Library",
      description:
        "A 'second brain' to capture and connect everything you learn from articles, books, and videos.",
    },
    {
      title: "AI Socratic Coach",
      description: "An interactive AI tutor that asks you questions to deepen your understanding and recall.",
    },
    {
      title: "Adaptive Learning Paths",
      description: "AI-generated study plans that adapt to your progress and help you master new skills.",
    },
    {
      title: "Spaced Repetition System (SRS)",
      description: "Intelligent flashcards to combat the forgetting curve and lock in knowledge.",
    },
  ];

  const institutionFeatures: Feature[] = [
    {
      title: "Centralized Curriculum Hub",
      description: "Design, manage, and deploy your entire curriculum from a single, collaborative space.",
    },
    {
      title: "Student Information System (SIS)",
      description:
        "A complete OS to manage student records, attendance, and communication, all under one governed AI layer.",
    },
    {
      title: "AI-Powered Risk Assessment",
      description: "Proactively identify at-risk students based on engagement and performance data.",
    },
    {
      title: "Role-Based Access Control (RBAC)",
      description: "Granular permissions for every role to keep data secure and relevant.",
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
        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="border-blue-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl">For Individuals</CardTitle>
                  <p className="text-slate-500">Build your second brain.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <FeatureList features={individualFeatures} />
              <Button size="lg" className="w-full mt-8 bg-blue-600 hover:bg-blue-700">
                Choose Your Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-slate-600" />
                <div>
                  <CardTitle className="text-2xl">For Institutions</CardTitle>
                  <p className="text-slate-500">Your complete educational OS.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <FeatureList features={institutionFeatures} />
              <Button size="lg" variant="outline" className="w-full mt-8">
                Build Your Custom Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UniversityLandingPage;
