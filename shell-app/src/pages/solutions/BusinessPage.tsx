import {
  BookOpen,
  BrainCircuit,
  CheckCircle,
  Repeat,
  Scaling,
  Shield,
  ShieldCheck,
  Sparkles,
  Spline,
  UserPlus,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const painPoints = [
  {
    title: "The 'Brain Drain' Problem",
    description:
      "When a key employee leaves, their critical knowledge walks out the door. Your institutional memory is fragile and lives in disconnected silos.",
  },
  {
    title: "Onboarding Inefficiency",
    description:
      "Ramping up new hires takes months. They spend weeks searching for documents and asking repetitive questions instead of contributing value.",
  },
  {
    title: "Information Silos & 'Slack-lash'",
    description:
      "Key information is scattered across Google Drive, Confluence, Notion, and endless Slack threads. Finding a single source of truth is impossible.",
  },
  {
    title: "Meeting Redundancy",
    description:
      "Teams are stuck in back-to-back meetings re-explaining the same concepts because there is no central, trusted knowledge base.",
  },
  {
    title: "Inconsistent Processes",
    description:
      "Every team has their own way of doing things. Lack of standardization leads to errors, duplicated work, and friction between departments.",
  },
  {
    title: "Untapped Collective Intelligence",
    description:
      "Your organization is full of brilliant people, but their insights are isolated. You have no way to connect the dots and leverage your team's full potential.",
  },
];

const solutionPillars = [
  {
    icon: <BookOpen className="h-8 w-8 text-blue-500" />,
    title: "Create a Living Knowledge Base",
    description:
      "Centralize everything—SOPs, project plans, meeting notes, and best practices. FPK Pulse creates a single, searchable source of truth.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-500" />,
    title: "AI-Powered Workflow Automation",
    description:
      "Automate routine tasks and information retrieval. Let your team focus on high-value work while Pulse handles the knowledge overhead.",
  },
  {
    icon: <Scaling className="h-8 w-8 text-blue-500" />,
    title: "Scale Institutional Memory",
    description:
      "Capture, organize, and surface expertise from across your company. Turn individual knowledge into a durable, scalable asset.",
  },
];

const painToGainSolutions = [
  {
    pain: "The 'Brain Drain' Problem",
    gain: "FPK Pulse captures employee knowledge in a living, searchable database, turning individual expertise into a durable corporate asset.",
    icon: <BrainCircuit className="h-8 w-8 text-blue-500" />,
  },
  {
    pain: "Onboarding Inefficiency",
    gain: "New hires can access a centralized knowledge base from day one, dramatically reducing ramp-up time and repetitive questions.",
    icon: <UserPlus className="h-8 w-8 text-blue-500" />,
  },
  {
    pain: "Information Silos & 'Slack-lash'",
    gain: "Integrate scattered documents and conversations into a single source of truth, ending the frustrating search for key information.",
    icon: <Spline className="h-8 w-8 text-blue-500" />,
  },
  {
    pain: "Meeting Redundancy",
    gain: "A central, trusted knowledge base reduces the need for status update meetings, freeing up your team for high-value, collaborative work.",
    icon: <Repeat className="h-8 w-8 text-blue-500" />,
  },
  {
    pain: "Untapped Collective Intelligence",
    gain: "Our AI surfaces connections between different projects and ideas, revealing insights and opportunities that were previously hidden in silos.",
    icon: <Sparkles className="h-8 w-8 text-blue-500" />,
  },
  {
    pain: "Inconsistent Processes",
    gain: "Standardize your SOPs and best practices in FPK Pulse, ensuring every team member is operating from the same playbook.",
    icon: <ShieldCheck className="h-8 w-8 text-blue-500" />,
  },
];

const PainToGainSection = () => (
  <div className="py-24">
    <div className="mx-auto max-w-6xl px-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          From Friction to Flow
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
          FPK Pulse is built to solve the core operational drags on productivity and growth.
        </p>
      </div>
      <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {painToGainSolutions.map((solution) => (
          <div key={solution.pain} className="flex flex-col">
            <div className="flex items-center gap-4">
              {solution.icon}
              <h3 className="text-xl font-bold text-slate-500">PAIN: {solution.pain}</h3>
            </div>
            <div className="ml-4 mt-2 border-l-2 border-blue-500 pl-6">
              <p className="text-lg font-semibold text-slate-800">{solution.gain}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BusinessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-slate-900">
      <div className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-400">
            Solutions for Businesses & Teams
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Your Company&apos;s Collective Brain.
          </h1>
          <p className="mt-6 mx-auto max-w-3xl text-lg text-slate-200">
            Stop losing knowledge and start building intelligence. FPK Pulse centralizes information, automates
            workflows, and unlocks your team&apos;s full potential.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100"
              onClick={() => navigate("/solutions/business/configure")}
            >
              Build Your OS
            </button>
            <button
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100"
              onClick={() => navigate("/access?plan=business_demo")}
            >
              Book Your Enterprise Demo
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Is Your Knowledge Working for You?
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
              Your team&apos;s greatest asset is its collective intelligence. For most companies, that asset is
              scattered, disorganized, and leaking value every day.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {painPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl bg-white p-8 shadow-[0_10px_40px_-24px_rgba(15,23,42,0.2)]"
              >
                <CheckCircle className="h-8 w-8 text-rose-500" />
                <h3 className="mt-4 text-xl font-bold text-slate-900">{point.title}</h3>
                <p className="mt-2 text-slate-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PainToGainSection />

      <div className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              The FPK Pulse Advantage
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
              A unified platform to capture, connect, and scale your organization&apos;s most valuable knowledge.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
            {solutionPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_40px_-24px_rgba(15,23,42,0.25)]"
              >
                <div className="flex items-start gap-4">
                  {pillar.icon}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{pillar.title}</h3>
                    <p className="mt-2 text-slate-600">{pillar.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-blue-600 p-6 text-white shadow-[0_12px_50px_-24px_rgba(37,99,235,0.6)]">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-xl font-semibold">The Foundation: FPK Aegis AI Governance</h3>
                <p className="mt-2 text-blue-50">
                  Aegis is your guarantee of corporate data security. It provides a governance layer focused on
                  protecting <strong>proprietary information and intellectual property</strong>. All data is encrypted
                  in transit and at rest, with granular permissions ensuring that sensitive information is only
                  accessible to authorized personnel. Your competitive advantage stays within your walls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Stop Searching. Start Knowing.
          </h2>
          <p className="mt-4 text-lg text-slate-200">
            See how FPK Pulse can streamline your operations and give your team a competitive edge.
          </p>
          <div className="mt-8">
            <button
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100"
              onClick={() => navigate("/access?plan=business_demo")}
            >
              Book Your Enterprise Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
