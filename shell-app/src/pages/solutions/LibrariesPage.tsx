import {
  AreaChart,
  BarChart,
  BookHeart,
  Briefcase,
  CheckCircle,
  Globe,
  GraduationCap,
  Library as LibraryIcon,
  Shield,
  ShieldCheck,
  Users,
  WifiOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const painPoints = [
  {
    title: "The Digital Divide",
    description:
      "Patrons need modern learning tools, but budgets are tight and many digital options aren’t built for public settings.",
  },
  {
    title: "Providing a Safe Online Space",
    description:
      "You want to foster community, but unmoderated platforms are risky. You need a safe, controlled environment for patrons.",
  },
  {
    title: "Outdated Program Offerings",
    description:
      "Your community wants digital literacy and AI workshops, but building curriculum from scratch is a monumental task.",
  },
  {
    title: "Reaching Underserved Patrons",
    description:
      "It’s challenging to provide accessible resources for patrons with diverse needs, including neurodiverse individuals and their families.",
  },
  {
    title: "Demonstrating Community Impact",
    description:
      "Funding depends on proving value. You need better data to show how programs drive engagement and learning outcomes.",
  },
  {
    title: "Resource and Staffing Constraints",
    description:
      "Your team is passionate but small. You need tools that are easy to deploy and maintain without heavy staffing.",
  },
];

const painToGainSolutions = [
  {
    pain: "The Digital Divide",
    gain: "Our institutional licensing provides cost-effective, equitable access to premium learning tools for every member of your community.",
    icon: <Globe className="h-8 w-8 text-green-500" />,
  },
  {
    pain: "Providing a Safe Online Space",
    gain: "FPK Nexus, governed by Aegis, offers an AI-moderated, CIPA-compliant community platform, free from the risks of public social media.",
    icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
  },
  {
    pain: "Outdated Program Offerings",
    gain: "Use our turnkey curriculum to instantly offer workshops on vital modern skills like AI literacy and personal knowledge management.",
    icon: <GraduationCap className="h-8 w-8 text-green-500" />,
  },
  {
    pain: "Reaching Underserved Patrons",
    gain: "The FPK ecosystem includes specialized tools and adaptive learning paths designed to support neurodiverse patrons and their families.",
    icon: <BookHeart className="h-8 w-8 text-green-500" />,
  },
  {
    pain: "Demonstrating Community Impact",
    gain: "Our analytics dashboard provides anonymized, aggregated data on platform usage and learning outcomes to support your funding requests.",
    icon: <AreaChart className="h-8 w-8 text-green-500" />,
  },
  {
    pain: "Resource and Staffing Constraints",
    gain: "As a fully-hosted, easy-to-manage platform, FPK requires minimal IT overhead, freeing your staff to focus on patron engagement.",
    icon: <WifiOff className="h-8 w-8 text-green-500" />,
  },
];

const PainToGainSection = () => (
  <div className="py-24">
    <div className="mx-auto max-w-6xl px-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          From Public Service to Public Powerhouse
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
          Digital tools designed for the core mission of community and public institutions.
        </p>
      </div>
      <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {painToGainSolutions.map((solution) => (
          <div key={solution.pain} className="flex flex-col">
            <div className="flex items-center gap-4">
              {solution.icon}
              <h3 className="text-xl font-bold text-slate-500">PAIN: {solution.pain}</h3>
            </div>
            <div className="ml-4 mt-2 border-l-2 border-green-500 pl-6">
              <p className="text-lg font-semibold text-slate-800">{solution.gain}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LibrariesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-slate-900">
      <div className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-green-400">
            Solutions for Libraries & Communities
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            The Modern Public Utility for Knowledge.
          </h1>
          <p className="mt-6 mx-auto max-w-3xl text-lg text-slate-200">
            Empower your community with safe, equitable access to world-class learning tools. The FPK ecosystem provides
            the digital infrastructure for the library of the future, starting with a robust free plan.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100"
              onClick={() => navigate("/solutions/libraries/configure?plan=free")}
            >
              Start with the Free Community Plan
            </button>
            <button
              className="inline-flex items-center rounded-full border border-white/70 bg-transparent px-6 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              onClick={() => navigate("/solutions/libraries/configure")}
            >
              Explore Premium Licensing
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Serving a Digital Community is Complex.
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
              You are the trusted heart of your community, but the move to a digital-first world brings new challenges
              for access, safety, and engagement.
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

      <div className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Two Ways to Partner: Free & Premium
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              We believe in the mission of public libraries. Start with a powerful free plan, then add premium options
              to expand your digital branch.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-green-500 bg-white shadow-lg">
              <div className="border-b border-green-100 px-6 py-4">
                <h3 className="text-2xl font-bold text-green-700">
                  Community Access Plan (Free)
                </h3>
                <p className="text-slate-600">
                  Core digital infrastructure for every library, at no cost.
                </p>
              </div>
              <div className="space-y-4 px-6 py-6">
                <div className="flex items-start">
                  <Shield className="mr-4 mt-1 h-8 w-8 flex-shrink-0 text-green-600" />
                  <div>
                    <h4 className="font-semibold">FPK Aegis Governance</h4>
                    <p className="text-sm text-slate-600">
                      CIPA-compliant content filtering and patron data privacy to ensure a safe online environment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <LibraryIcon className="mr-4 mt-1 h-8 w-8 flex-shrink-0 text-green-600" />
                  <div>
                    <h4 className="font-semibold">Basic Digital Resource Hub</h4>
                    <p className="text-sm text-slate-600">
                      Provide access to public domain e-books, audiobooks, and our library of open courseware.
                    </p>
                  </div>
                </div>
                <button
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-green-700"
                  onClick={() => navigate("/solutions/libraries/configure?plan=free")}
                >
                  Get Started for Free
                </button>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-indigo-500 bg-white shadow-lg">
              <div className="border-b border-indigo-100 px-6 py-4">
                <h3 className="text-2xl font-bold text-indigo-700">
                  Premium Institutional Licensing
                </h3>
                <p className="text-slate-600">
                  Unlock the full ecosystem to become a true digital-first institution.
                </p>
              </div>
              <div className="space-y-4 px-6 py-6">
                <p className="font-semibold text-slate-800">
                  Includes all Free features, plus:
                </p>
                <div className="flex items-start">
                  <Users className="mr-4 mt-1 h-8 w-8 flex-shrink-0 text-indigo-600" />
                  <div>
                    <h4 className="font-semibold">FPK Nexus Community Platform</h4>
                    <p className="text-sm text-slate-600">
                      Host safe, AI-moderated community groups for book clubs, local events, and more.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Briefcase className="mr-4 mt-1 h-8 w-8 flex-shrink-0 text-indigo-600" />
                  <div>
                    <h4 className="font-semibold">FPK Pulse for Operations</h4>
                    <p className="text-sm text-slate-600">
                      Streamline library operations, manage projects, and centralize internal knowledge.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BarChart className="mr-4 mt-1 h-8 w-8 flex-shrink-0 text-indigo-600" />
                  <div>
                    <h4 className="font-semibold">Premium Content & Analytics</h4>
                    <p className="text-sm text-slate-600">
                      Access licensed courseware, premium media, and advanced patron analytics dashboards.
                    </p>
                  </div>
                </div>
                <button
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-700"
                  onClick={() => navigate("/solutions/libraries/configure")}
                >
                  Explore Premium Options
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Become a Future-Ready Institution.
          </h2>
          <p className="mt-4 text-lg text-slate-200">
            Discover how our special licensing for public institutions can help you serve your community better.
          </p>
          <div className="mt-8">
            <button className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100">
              Contact Us for a Partnership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrariesPage;
