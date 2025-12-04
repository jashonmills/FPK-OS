import {
  Brain,
  CheckCircle,
  Heart,
  Shield,
  Users,
} from "lucide-react";
import Header from "../../components/layout/Header";

const painPoints = [
  {
    title: 'The "Why?" Crisis',
    description:
      "You see patterns in your child's behavior but struggle to explain them. You feel helpless trying to understand the triggers behind meltdowns.",
  },
  {
    title: "A Mountain of Paperwork",
    description:
      "You're drowning in IEPs, evaluations, and therapy notes—an overwhelming binder that offers no clear answers.",
  },
  {
    title: "Feeling Dismissed and Unheard",
    description:
      "You advocate for your child, but without clear, organized data, it feels like doctors and educators aren't grasping the full picture.",
  },
  {
    title: "The Isolation Epidemic",
    description:
      "You feel alone. Friends and family try to understand, but few truly know what this journey is like.",
  },
  {
    title: "Doubt and Uncertainty",
    description:
      "Are therapies working? Is your child making progress? You invest time and money, but the path forward feels unclear.",
  },
  {
    title: "Fear of the Digital World",
    description:
      "You want your child to benefit from technology and community, but you're worried about safety and toxicity online.",
  },
];

const solutionPillars = [
  {
    icon: <Heart className="h-8 w-8 text-pink-500" />,
    title: "Gain Clarity with FPK-X",
    description:
      "Transform daily observations into clear charts and data that reveal patterns, track progress, and help you answer “Why?”",
  },
  {
    icon: <Brain className="h-8 w-8 text-pink-500" />,
    title: "Take Action with FPK University",
    description:
      "Access personalized, adaptive learning modules. Turn insights from FPK-X into effective, engaging activities at home.",
  },
  {
    icon: <Users className="h-8 w-8 text-pink-500" />,
    title: "Find Your Community with FPK Nexus",
    description:
      "Join a private, AI-moderated network—a safe harbor to connect with other parents, share experiences, and find support.",
  },
];

const ParentsPage = () => {
  return (
    <div className="bg-white text-slate-900">
      <Header />

      <div className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-pink-400">
            Solutions for Parents & Families
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            From Chaos to Clarity. Your Journey, Empowered.
          </h1>
          <p className="mt-6 mx-auto max-w-3xl text-lg text-slate-200">
            You are the expert on your child. We provide the tools to prove it. Gain clarity with FPK-X, access
            personalized learning with FPK University, and find your community in FPK Nexus.
          </p>
          <div className="mt-8">
            <button className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              You Are Not Alone in This.
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
              We understand the challenges, the worries, and the profound desire to give your child the best future.
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
              Your All-in-One Support System
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
              Three powerful engines, one seamless experience, all protected by our foundational AI governance layer to
              keep your family's data safe.
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
          <div className="mt-8 rounded-2xl bg-pink-600 p-6 text-white shadow-[0_12px_50px_-24px_rgba(219,39,119,0.6)]">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-xl font-semibold">The Foundation: FPK Aegis AI Governance</h3>
                <p className="mt-2 text-pink-50">
                  Your family's privacy is our sacred trust. Every piece of data is protected by enterprise-grade
                  security and governed by AI designed to be safe, private, and helpful—never intrusive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Take the First Step Toward Clarity Today
          </h2>
          <p className="mt-4 text-lg text-slate-200">
            Join thousands of families who have transformed their journey. Your 14-day free trial is waiting.
          </p>
          <div className="mt-8">
            <button className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100">
              Start My Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentsPage;
