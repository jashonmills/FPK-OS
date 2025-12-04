import {
  BarChart,
  BrainCircuit,
  Briefcase,
  CheckCircle,
  GraduationCap,
  Shield,
} from "lucide-react";

const painPoints = [
  {
    title: "Fragmented Data Silos",
    description:
      "Student information is scattered across a dozen incompatible systems—SIS, LMS, spreadsheets—making a unified view of a student impossible.",
  },
  {
    title: "Compliance & Reporting Burden",
    description:
      "Countless hours are wasted manually compiling data for state and federal reports, living in constant fear of a failed audit.",
  },
  {
    title: "AI Adoption Paralysis",
    description:
      "You know AI is the future, but the risks of data privacy, student safety, and harmful content make adoption feel impossible.",
  },
  {
    title: "Operational Inefficiency",
    description:
      "Administrative staff are bogged down by manual, repetitive tasks, pulling them away from high-impact educational initiatives.",
  },
  {
    title: "One-Size-Fits-None Technology",
    description:
      "Your current tools are rigid, failing to support the diverse needs of all students, especially the neurodiverse population.",
  },
  {
    title: "Lack of Actionable Insights",
    description:
      "You're drowning in data but starving for wisdom. You can't see the trends or make the data-driven decisions needed to improve outcomes.",
  },
];

const solutionPillars = [
  {
    icon: <GraduationCap className="h-8 w-8 text-indigo-500" />,
    title: "Integrated Student Information System (SIS)",
    description:
      "A single source of truth for admissions, enrollment, attendance, and demographics, seamlessly connected to all other modules.",
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-indigo-500" />,
    title: "Adaptive Learning with FPK University",
    description:
      "Deliver personalized, engaging curriculum that adapts to each student's pace and style, powered by our Socratic AI Coach.",
  },
  {
    icon: <BarChart className="h-8 w-8 text-indigo-500" />,
    title: "Clinical Data & Insights with FPK-X",
    description:
      "For the first time, integrate clinical-grade behavioral and learning data directly into your student profiles, unlocking deep, actionable insights.",
  },
  {
    icon: <Briefcase className="h-8 w-8 text-indigo-500" />,
    title: "Streamlined Operations with FPK Pulse",
    description:
      "Run your institution like a modern tech company. Manage internal projects, track budgets, and streamline administrative workflows in one powerful OS.",
  },
];

const EducationPage = () => {
  return (
    <div className="bg-white text-slate-900">
      <div className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-400">
            Education Solutions
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            The All-in-One Operating System for Modern Education.
          </h1>
          <p className="mt-6 mx-auto max-w-3xl text-lg text-slate-200">
            Unify admissions, learning, clinical data, and operations under a single, governed AI platform designed for
            student success and institutional efficiency.
          </p>
          <div className="mt-8">
            <button className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100">
              Request a Demo
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              We Understand Your World
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
              You're tasked with shaping the future, but you're held back by the tools of the past.
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

      <div className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              A Unified Platform for Unprecedented Results
            </h2>
          </div>
          <p className="mt-4 mx-auto max-w-2xl text-center text-lg text-slate-600">
            FPK-OS replaces your fragmented toolset with four powerful, interconnected engines, all protected by our
            foundational AI governance layer.
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
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
          <div className="mt-8 rounded-2xl bg-indigo-600 p-6 text-white shadow-[0_12px_50px_-24px_rgba(79,70,229,0.6)]">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-xl font-semibold">The Foundation: FPK Aegis AI Governance</h3>
                <p className="mt-2 text-indigo-100">
                  The engine that makes it all possible. Aegis is our unshakeable promise of trust, providing
                  enterprise-grade security, FERPA/HIPAA alignment, and content moderation for every interaction. Adopt
                  AI with confidence, knowing your students and your institution are protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Build the Future of Education?
          </h2>
          <p className="mt-4 text-lg text-slate-200">
            Stop wrestling with outdated tools. Let's build a more efficient, insightful, and successful institution
            together.
          </p>
          <div className="mt-8">
            <button className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100">
              Schedule Your Personalized Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
