import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, BrainCircuit, Building, CheckCircle, User, Zap, Users as NexusIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";

type Feature = { title: string; description: string };
type Integration = { id: string; icon: typeof BarChart; title: string; description: string };
type RoleCard = { id: string; title: string; subtitle: string; description: string };
type DetailContent = { title: string; description: string; features: Feature[] };

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

const DetailModal = ({
  open,
  onOpenChange,
  content,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: DetailContent | null;
}) => {
  if (!content) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ul className="space-y-4">
            {content.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ROLE_DETAILS: Record<string, DetailContent> = {
  provost: {
    title: "For the Provost: A Unified Academic Command Center",
    description:
      "Move beyond spreadsheets and disconnected systems. Gain a real-time, 360-degree view of your institution's academic health, from curriculum design to student outcomes.",
    features: [
      {
        title: "Data-Driven Curriculum Design",
        description:
          "Model new programs and instantly see budget forecasts from Pulse, prerequisite success data from FPK-X, and potential faculty workloads.",
      },
      {
        title: "Proactive Student Success",
        description:
          "The AI Risk Assessor spots patterns of disengagement across SIS, LMS, and community hubs before students fall behind.",
      },
      {
        title: "Accreditation & Reporting, Simplified",
        description:
          "Generate reports on student performance, curriculum efficacy, and faculty engagement with an immutable FPK Aegis audit trail.",
      },
    ],
  },
  dean: {
    title: "For the Dean of Students: The Student Wellness Ecosystem",
    description:
      "Shift from reactive crisis management to proactive, holistic student support. Intervene early with a complete picture of each student.",
    features: [
      {
        title: "Early Warning System",
        description:
          "Get AI-driven alerts that combine class attendance, FPK-X behavioral logs, and Nexus community activity.",
      },
      {
        title: "Coordinated Care Network",
        description:
          "Create a secure, unified record coordinating advisors, counseling, and residential life so no student slips through.",
      },
      {
        title: "Foster a Thriving Community",
        description:
          "Use FPK Nexus to build moderated, safe spaces for clubs, peer groups, and support networks to drive belonging.",
      },
    ],
  },
  coo: {
    title: "For the COO/CFO: The Operational Intelligence Hub",
    description:
      "Achieve operational efficiency and financial clarity. Connect budget, projects, and enrollment into a single source of truth.",
    features: [
      {
        title: "Real-Time Financial Oversight",
        description:
          "Pulse surfaces live departmental budgets, project spend, and resource allocation linked to enrollment in University SIS.",
      },
      {
        title: "Strategic Resource Planning",
        description:
          "Model growth and spending scenarios; see how new programs impact budget and faculty needs with predictive analytics.",
      },
      {
        title: "Campus-Wide Project Management",
        description:
          "Run capital projects and IT rollouts inside Pulse, ensuring timelines and budgets stay on track.",
      },
    ],
  },
};

const INTEGRATION_DETAILS: Record<string, DetailContent> = {
  pulse: {
    title: "FPK Pulse: The Operations Engine",
    description:
      "Transform operations with unified budgeting, projects, and resource allocation tied directly to the academic mission.",
    features: [
      { title: "Unified Budgeting", description: "Department heads manage budgets; leadership sees a real-time, campus-wide view." },
      { title: "Strategic Project Management", description: "Run curriculum builds and campus construction in one collaborative space." },
      { title: "Resource Allocation", description: "Invest with confidence by linking spending to student outcomes." },
    ],
  },
  nexus: {
    title: "FPK Nexus: The Community Engine",
    description:
      "Build a vibrant, secure digital campus. Nexus is your private social platform, fully integrated with SIS for roles and auth.",
    features: [
      { title: "Safe Student Engagement", description: "Moderated, positive spaces for students to connect and collaborate." },
      { title: "Alumni & Mentorship Networks", description: "Dedicated space for alumni to mentor current students and give back." },
      { title: "Centralized Communication", description: "Replace scattered emails with unified announcements and event promotion." },
    ],
  },
  fkpx: {
    title: "FPK-X: The Clinical & Wellness Engine",
    description:
      "Empower special education and wellness teams with clinical-grade tracking, assessments, and intervention tooling.",
    features: [
      { title: "Behavioral & Wellness Logging", description: "HIPAA/FERPA-compliant logs across teachers, counselors, and RAs." },
      { title: "Professional Assessment Library", description: "Access FBA/BIP builders and full assessment suites to craft plans." },
      { title: "AI-Powered Insight Engine", description: "Analyze trends and surface proactive interventions for at-risk students." },
    ],
  },
  coach: {
    title: "AI Study Coach Pro",
    description:
      "Provide every student a 24/7 AI tutor that deepens understanding through Socratic dialogue and adaptive learning.",
    features: [
      { title: "Deepen Understanding", description: "Guiding questions that force critical thinking instead of giving answers." },
      { title: "Personalized Study Plans", description: "Adaptive plans tuned to each learner's courses and goals." },
      { title: "Reduce Faculty Workload", description: "Offload FAQs and supplemental instruction so faculty focus on impact." },
    ],
  },
};

export const UniversityLandingPage = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const individualFeatures: Feature[] = [
    { title: "Personal Knowledge Library", description: "A 'second brain' to capture and connect everything you learn." },
    { title: "AI Socratic Coach", description: "An interactive AI tutor that asks you questions to deepen your understanding." },
    { title: "Adaptive Learning Paths", description: "AI-generated study plans that adapt to your progress and help you master new skills." },
    { title: "Spaced Repetition System (SRS)", description: "Intelligent flashcards to combat the forgetting curve and lock in knowledge." },
  ];

  const roleCards: RoleCard[] = [
    {
      id: "provost",
      title: "Provost / Academic Leadership",
      subtitle: "Curriculum excellence and outcomes",
      description:
        "Design a new data science program in University. Pulse forecasts budget for software and hiring. AI Coach analyzes overlaps; FPK-X shows prerequisite success data to set requirements.",
    },
    {
      id: "dean",
      title: "Dean of Students",
      subtitle: "Engagement, wellness, retention",
      description:
        "Engagement drops; AI Risk flags. FPK-X logs show anxiety notes. Nexus spins up a peer group and counseling connection—documented in one secure record.",
    },
    {
      id: "coo",
      title: "COO / Finance",
      subtitle: "Efficiency and resource allocation",
      description:
        "Plan next year’s budget in Pulse. Track department spend, see Arts building +15% while enrollment up 10% in University SIS—get a clear revenue vs. expense view.",
    },
  ];

  const integrationCards: Integration[] = [
    { id: "pulse", icon: BarChart, title: "FPK Pulse Integration", description: "Project ops + budgeting synced to academic planning and enrollment." },
    { id: "nexus", icon: NexusIcon, title: "FPK Nexus Integration", description: "Private community for students, staff, alumni—auth and roles managed centrally." },
    { id: "fkpx", icon: Zap, title: "FPK-X Clinical Suite", description: "Behavioral tracking, FBA/BIP builders, assessment library, and risk alerts." },
    { id: "coach", icon: BrainCircuit, title: "AI Study Coach Pro", description: "Advanced AI tutoring available to all enrolled learners." },
  ];

  const modalContent: DetailContent | null =
    (activeModal && (ROLE_DETAILS[activeModal] ?? INTEGRATION_DETAILS[activeModal])) || null;

  return (
    <div className="bg-white text-slate-800">
      <section className="bg-blue-50 py-20 px-4 text-center">
        <p className="font-semibold text-blue-600">FPK University</p>
        <h1 className="text-5xl font-bold tracking-tight mt-2">The Action Engine for Learning.</h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto text-slate-600">
          From personal knowledge mastery to a complete institutional operating system, FPK University transforms passive learning into measurable outcomes.
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
                <Link to="/university/pricing" className="w-full">
                  <Button size="lg" className="w-full mt-8 bg-blue-600 hover:bg-blue-700">
                    Choose Your Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="institutions" className="mt-12 space-y-12">
            <div className="text-center mb-4">
              <Building className="h-10 w-10 mx-auto text-slate-700" />
              <h2 className="text-3xl font-bold mt-2">Your Complete Educational OS</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-2">
                One unified platform to run your entire institution, from admissions to alumni engagement.
              </p>
            </div>

            <Card className="overflow-hidden border-slate-200">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 space-y-3">
                  <p className="font-semibold text-indigo-600 uppercase text-xs tracking-wide">Vision</p>
                  <h3 className="text-3xl font-bold">The FPK OS: Your Institution's Central Nervous System.</h3>
                  <p className="text-slate-600">
                    Move beyond siloed software. Connect academics, operations, community, and student wellness into a single,
                    intelligent, and predictive ecosystem.
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

            <div className="space-y-4">
              <div className="text-center">
                <p className="font-semibold text-indigo-600 uppercase text-xs tracking-wide">Deep Dive</p>
                <h3 className="text-2xl font-bold mt-1">An OS for Every Role</h3>
                <p className="text-slate-600 mt-2">
                  Real scenarios showing how leadership, student affairs, and operations work together on one platform.
                </p>
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                {roleCards.map((card) => (
                  <Card key={card.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{card.title}</CardTitle>
                      <p className="text-sm text-slate-500">{card.subtitle}</p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-slate-600">{card.description}</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button variant="outline" onClick={() => setActiveModal(card.id)}>
                        More Info
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card>
              <div className="grid lg:grid-cols-2">
                <div className="p-8 border-r border-slate-100 space-y-3">
                  <p className="font-semibold text-indigo-600 uppercase text-xs tracking-wide">Starting Point</p>
                  <h3 className="text-2xl font-bold">The Core Package</h3>
                  <p className="text-slate-600">Every institutional plan starts with the powerful FPK University core.</p>
                  <FeatureList
                    features={[
                      { title: "Student Information System (SIS)", description: "Manage records, attendance, and communication." },
                      { title: "Centralized Curriculum Hub", description: "Design, manage, and deploy your curriculum." },
                      { title: "AI-Powered Risk Assessment", description: "Proactively identify at-risk students." },
                      { title: "Role-Based Access Control (RBAC)", description: "Granular permissions for every role." },
                      { title: "FPK Aegis Governance Layer", description: "Audit-ready controls for data, AI usage, and compliance." },
                    ]}
                  />
                </div>
                <div className="p-8 space-y-4">
                  <p className="font-semibold text-indigo-600 uppercase text-xs tracking-wide">Popular Integrations</p>
                  <h3 className="text-2xl font-bold">Expand When Ready</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {integrationCards.map((feature) => (
                      <button
                        key={feature.id}
                        onClick={() => setActiveModal(feature.id)}
                        className="flex items-start gap-3 rounded-lg border p-3 bg-slate-50 text-left hover:bg-slate-100 transition"
                      >
                        <feature.icon className="h-5 w-5 text-indigo-600 mt-0.5" />
                        <div>
                          <p className="font-semibold">{feature.title}</p>
                          <p className="text-xs text-slate-600">{feature.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

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

      <DetailModal open={!!modalContent} onOpenChange={() => setActiveModal(null)} content={modalContent} />
    </div>
  );
};

export default UniversityLandingPage;
