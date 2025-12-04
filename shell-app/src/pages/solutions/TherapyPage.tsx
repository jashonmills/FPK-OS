import {
  AreaChart,
  BarChart,
  Bot,
  CheckCircle,
  DatabaseZap,
  FileCog,
  FileText,
  Shield,
  ShieldCheck,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const painPoints = [
  {
    title: "Subjective Data & Insurance Audits",
    description:
      "Your interventions are powerful, but your data is anecdotal. Proving efficacy to insurance companies is a constant, uphill battle.",
  },
  {
    title: "Crushing Administrative Overhead",
    description:
      "Highly skilled clinicians spend up to 40% of their time on non-billable work like manual FBA/BIP creation and progress reports.",
  },
  {
    title: "HIPAA & FERPA Compliance Risks",
    description:
      "Using a patchwork of consumer tools for sensitive client data exposes your practice to massive financial and legal risks.",
  },
  {
    title: "Inconsistent Care & Staff Turnover",
    description:
      "When a therapist leaves, critical knowledge of a client's triggers and history walks out the door, disrupting continuity of care.",
  },
  {
    title: "Disconnected Parent Communication",
    description:
      "Parents feel out of the loop. Sharing data and progress securely is manual, time-consuming, and often ineffective.",
  },
  {
    title: "Lack of Predictive Insights",
    description:
      "You are always reacting to behaviors. You lack the data-driven tools to anticipate trends and proactively adjust plans.",
  },
];

const solutionPillars = [
  {
    icon: <FileText className="h-8 w-8 text-teal-500" />,
    title: "AI-Powered Document Intelligence",
    description:
      "Stop manual data entry. Automatically extract goals, baselines, and service hours from IEPs, 504s, and hundreds of other document types.",
  },
  {
    icon: <BarChart className="h-8 w-8 text-teal-500" />,
    title: "Clinical-Grade Visual Analytics",
    description:
      "Go beyond spreadsheets with specialized charts. Analyze behavior functions, track prompting levels, and correlate sleep with next-day outcomes.",
  },
  {
    icon: <Bot className="h-8 w-8 text-teal-500" />,
    title: "Automated Reporting & Assessment Wizards",
    description:
      "Generate comprehensive progress reports, FBAs, and BIPs in minutes, not hours, using guided workflows.",
  },
  {
    icon: <Users className="h-8 w-8 text-teal-500" />,
    title: "Optional Secure Community with FPK Nexus",
    description:
      "Provide families with a safe, moderated community space connected directly to their FPK-X portal.",
  },
];

const painToGainSolutions = [
  {
    pain: "Subjective Data & Insurance Audits",
    gain: "FPK-X's 27 specialized charts provide objective, quantifiable data on behavior, proving intervention efficacy and satisfying auditor requirements.",
    icon: <AreaChart className="h-8 w-8 text-teal-500" />,
  },
  {
    pain: "Crushing Administrative Overhead",
    gain: "Our AI-powered wizards automate the creation of FBAs, BIPs, and progress reports, cutting non-billable administrative time by up to 40%.",
    icon: <FileCog className="h-8 w-8 text-teal-500" />,
  },
  {
    pain: "HIPAA & FERPA Compliance Risks",
    gain: "Aegis ensures end-to-end encryption and strict access controls for all PHI, providing a HIPAA-compliant environment that eliminates the risk of using consumer-grade tools.",
    icon: <ShieldCheck className="h-8 w-8 text-teal-500" />,
  },
  {
    pain: "Inconsistent Care & Staff Turnover",
    gain: "FPK-X serves as a central repository for client history and intervention data, ensuring seamless continuity of care even when staff changes occur.",
    icon: <DatabaseZap className="h-8 w-8 text-teal-500" />,
  },
  {
    pain: "Disconnected Parent Communication",
    gain: "Securely share progress charts and reports with parents through a dedicated portal, enhancing collaboration and keeping them informed.",
    icon: <Share2 className="h-8 w-8 text-teal-500" />,
  },
  {
    pain: "Lack of Predictive Insights",
    gain: "Analyze correlations between variables like sleep, medication, and behavior to anticipate trends and proactively adjust treatment plans for better outcomes.",
    icon: <Sparkles className="h-8 w-8 text-teal-500" />,
  },
];

const PainToGainSection = () => (
  <div className="py-24">
    <div className="mx-auto max-w-6xl px-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          From Problem to Precision
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
          FPK-X is engineered to solve the specific operational and clinical challenges that modern therapy practices face.
        </p>
      </div>
      <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {painToGainSolutions.map((solution) => (
          <div key={solution.pain} className="flex flex-col">
            <div className="flex items-center gap-4">
              {solution.icon}
              <h3 className="text-xl font-bold text-slate-500">PAIN: {solution.pain}</h3>
            </div>
            <div className="ml-4 mt-2 border-l-2 border-teal-500 pl-6">
              <p className="text-lg font-semibold text-slate-800">{solution.gain}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TherapyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-slate-900">
      <div className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-400">
            Solutions for Therapy Centers & Clinics
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            The Clinical Intelligence Engine for Better Outcomes.
          </h1>
          <p className="mt-6 mx-auto max-w-3xl text-lg text-slate-200">
            Transform scattered observations into structured, quantifiable data. FPK-X is the HIPAA-compliant platform
            that automates reporting, proves efficacy, and empowers your clinicians to do their best work.
          </p>
          <div className="mt-8">
            <button
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100"
              onClick={() => navigate("/access?plan=business_demo")}
            >
              Book a Consultation
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Your Clinicians are Exceptional. Their Tools Should Be, Too.
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
              You are dedicated to delivering life-changing outcomes, but your practice is slowed by outdated processes
              and administrative burdens.
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
              The FPK-X Clinical Suite
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
              Purpose-built to solve the core challenges of a modern therapy practice, all protected by our foundational
              AI governance layer.
            </p>
          </div>
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
          <div className="mt-8 rounded-2xl bg-teal-600 p-6 text-white shadow-[0_12px_50px_-24px_rgba(20,184,166,0.6)]">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-xl font-semibold">The Foundation: FPK Aegis AI Governance</h3>
                <p className="mt-2 text-teal-50">
                  Aegis is your partner in clinical compliance. It provides a robust governance layer ensuring strict
                  <strong> HIPAA compliance </strong>
                  for all Protected Health Information (PHI). Our system enforces end-to-end encryption, granular access
                  controls, and detailed audit logs for every data interaction. You can leverage our powerful AI tools
                  with the absolute certainty that your client data and your practice are protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Elevate Your Practice?
          </h2>
          <p className="mt-4 text-lg text-slate-200">
            Spend less time on paperwork and more time changing lives. See how FPK-X can transform your operations.
          </p>
          <div className="mt-8">
            <button className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyPage;
