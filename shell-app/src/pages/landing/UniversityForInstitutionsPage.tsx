import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, BrainCircuit, Building, CheckCircle, Users as NexusIcon, Zap } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
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
        description: "Run capital projects and IT rollouts inside Pulse, ensuring timelines and budgets stay on track.",
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
      { title: "Unified Budgeting", description: "Department heads manage budgets; leadership sees a campus-wide view." },
      { title: "Strategic Project Management", description: "Run curriculum builds and campus construction in one workspace." },
      { title: "Resource Allocation", description: "Invest confidently by linking spending to student outcomes." },
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

export const UniversityForInstitutionsPage = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

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
      <main className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Building className="h-12 w-12 mx-auto text-slate-700" />
            <h1 className="text-5xl font-bold mt-4">Your Complete Educational OS</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mt-3">
              One unified platform to run your entire institution, from admissions and academics to operations and alumni
              engagement.
            </p>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">An OS for Every Role.</h2>
            <div className="grid md:grid-cols-3 gap-6">
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

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Start with the Foundation, Expand When Ready.</h2>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="p-6 bg-slate-50 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Core University Platform</h3>
                <p className="text-slate-600 mb-6">
                  The foundational OS for modern education, included in every institutional plan.
                </p>
                <FeatureList
                  features={[
                    { title: "Student Information System (SIS)", description: "Manage records, attendance, and communication." },
                    { title: "Centralized Curriculum Hub", description: "Design, manage, and deploy your curriculum." },
                    { title: "AI-Powered Risk Assessment", description: "Proactively identify at-risk students." },
                    { title: "Role-Based Access Control (RBAC)", description: "Granular permissions for every role." },
                  ]}
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Popular Ecosystem Integrations</h3>
                <div className="grid grid-cols-2 gap-4">
                  {integrationCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setActiveModal(card.id)}
                      className="p-4 border rounded-lg text-left hover:bg-slate-50 transition-all"
                    >
                      <card.icon className="h-6 w-6 mb-2 text-indigo-600" />
                      <p className="font-semibold">{card.title}</p>
                      <p className="text-xs text-slate-500">{card.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold">Ready to Build Your Intelligent Campus?</h2>
            <Link to="/solutions/education/build-plan">
              <Button size="lg" className="mt-6 text-lg py-7 px-10">
                Build Your Custom Plan
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <DetailModal open={!!modalContent} onOpenChange={() => setActiveModal(null)} content={modalContent} />
    </div>
  );
};

export default UniversityForInstitutionsPage;
