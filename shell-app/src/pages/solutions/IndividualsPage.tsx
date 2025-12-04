import {
  Brain,
  CheckCircle,
  FileText,
  Library,
  Lightbulb,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";

const painPoints = [
  {
    title: "Information Overload",
    description:
      "You consume countless articles, podcasts, and books, but the knowledge feels fragmented. It's a stream of information with no structure.",
  },
  {
    title: 'The "Forgetting Curve"',
    description:
      "You learn something new and exciting, but within a week, it's gone. Your hard-earned knowledge evaporates without a system to retain it.",
  },
  {
    title: "Scattered Notes & Ideas",
    description:
      "Your insights are spread across notebooks, random documents, and bookmarking apps. There's no central place to connect ideas and build upon them.",
  },
  {
    title: "Passive Consumption vs. Active Creation",
    description:
      "You feel like a consumer of information rather than a creator of knowledge. You want to turn what you learn into tangible projects and skills.",
  },
  {
    title: "Lack of a Personalized Path",
    description:
      "Generic online courses don't adapt to what you already know or what you want to achieve. Your learning journey feels inefficient and one-size-fits-all.",
  },
  {
    title: 'The "Someday/Maybe" Pile',
    description:
      "Your ambition is huge, but your projects and goals are disorganized. Great ideas languish in a digital pile of 'someday' intentions.",
  },
];

const solutionPillars = [
  {
    icon: <Library className="h-8 w-8 text-purple-500" />,
    title: "Build Your Personal Knowledge Library",
    description:
      "Go beyond note-taking. FPK University helps you build a structured, interconnected library of everything you learn—your personal second brain.",
  },
  {
    icon: <Sparkles className="h-8 w-8 text-purple-500" />,
    title: "Adaptive Learning Paths",
    description:
      "Stop learning what you already know. Our AI assesses your knowledge and generates personalized paths that adapt in real time to your goals.",
  },
  {
    icon: <Target className="h-8 w-8 text-purple-500" />,
    title: "From Knowledge to Action",
    description:
      "Connect your learning directly to your goals. Turn insights from your library into projects, habits, and real-world outcomes.",
  },
];

const painToGainSolutions = [
  {
    pain: "Information Overload",
    gain: "FPK University's structured library turns a chaotic stream of information into an organized, interconnected personal knowledge base.",
    icon: <Library className="h-8 w-8 text-purple-500" />,
  },
  {
    pain: 'The "Forgetting Curve"',
    gain: "Our adaptive learning engine uses principles of spaced repetition to resurface key concepts, ensuring long-term retention.",
    icon: <Brain className="h-8 w-8 text-purple-500" />,
  },
  {
    pain: "Scattered Notes & Ideas",
    gain: "Centralize all your highlights, notes, and ideas in one place. Our AI helps you discover novel connections between them.",
    icon: <FileText className="h-8 w-8 text-purple-500" />,
  },
  {
    pain: "Passive Consumption vs. Active Creation",
    gain: "Integrated project tools allow you to turn a piece of knowledge into a task or project with a single click, bridging the gap between learning and doing.",
    icon: <Workflow className="h-8 w-8 text-purple-500" />,
  },
  {
    pain: "Lack of a Personalized Path",
    gain: "The Socratic AI Coach assesses your goals and existing knowledge to build a unique, adaptive curriculum just for you.",
    icon: <Lightbulb className="h-8 w-8 text-purple-500" />,
  },
  {
    pain: 'The "Someday/Maybe" Pile',
    gain: "Organize your ambitions with clear goal-setting and project management features, turning 'someday' into a concrete plan.",
    icon: <Target className="h-8 w-8 text-purple-500" />,
  },
];

const PainToGainSection = () => (
  <div className="py-24">
    <div className="mx-auto max-w-6xl px-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          From Ambition to Achievement
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
          A system designed to structure your knowledge and activate your potential.
        </p>
      </div>
      <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {painToGainSolutions.map((solution) => (
          <div key={solution.pain} className="flex flex-col">
            <div className="flex items-center gap-4">
              {solution.icon}
              <h3 className="text-xl font-bold text-slate-500">PAIN: {solution.pain}</h3>
            </div>
            <div className="ml-4 mt-2 border-l-2 border-purple-500 pl-6">
              <p className="text-lg font-semibold text-slate-800">{solution.gain}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const IndividualsPage = () => {
  return (
    <div className="bg-white text-slate-900">
      <div className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-purple-400">
            Solutions for Individuals
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Your Second Brain, Supercharged.
          </h1>
          <p className="mt-6 mx-auto max-w-3xl text-lg text-slate-200">
            Stop forgetting, start building. FPK University organizes your knowledge, personalizes your education, and
            turns ambition into achievement.
          </p>
          <div className="mt-8">
            <button className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100">
              Start Building for Free
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Are You Learning or Just Consuming?
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
              In a world of endless information, the real challenge isn't access—it&apos;s synthesis. You&apos;re ready
              to build lasting knowledge, not just scroll through feeds.
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
              The FPK University Toolkit
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
              A powerful suite of tools designed for the serious learner, creator, and thinker.
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
          <div className="mt-8 rounded-2xl bg-purple-600 p-6 text-white shadow-[0_12px_50px_-24px_rgba(124,58,237,0.6)]">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-xl font-semibold">The Foundation: FPK Aegis AI Governance</h3>
                <p className="mt-2 text-purple-50">
                  Your knowledge is your own. Period. Aegis is our commitment to
                  <strong> personal data ownership and intellectual privacy </strong>
                  . Your data is never used to train our models without your explicit opt-in consent. You own your
                  knowledge library, and you can export it at any time. This is your private intellectual space, and we
                  are its sworn protector.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Unlock Your Full Potential.
          </h2>
          <p className="mt-4 text-lg text-slate-200">
            Start organizing your mind and achieving your goals today. Your journey starts here.
          </p>
          <div className="mt-8">
            <button className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100">
              Sign Up Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualsPage;
