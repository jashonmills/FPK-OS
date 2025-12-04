import { Activity, BrainCircuit, GraduationCap, Shield } from "lucide-react";

const pillars = [
  {
    title: "FPK Aegis",
    description:
      "The AI Governance Layer. Our foundational promise of trust, providing enterprise-grade security, compliance, and content moderation for every interaction.",
    icon: <Shield className="h-6 w-6 text-slate-900" />,
  },
  {
    title: "FPK University",
    description:
      "The Action Engine. An adaptive learning platform with a Socratic AI Coach that transforms insights into personalized, engaging educational experiences.",
    icon: <GraduationCap className="h-6 w-6 text-slate-900" />,
  },
  {
    title: "FPK-X",
    description:
      "The Insight Engine. A clinical-grade data intelligence platform that turns scattered observations into structured, actionable insights.",
    icon: <BrainCircuit className="h-6 w-6 text-slate-900" />,
  },
  {
    title: "FPK Pulse",
    description:
      "The Operations Engine. A complete business OS to manage projects, people, and finances with unparalleled efficiency and real-time data.",
    icon: <Activity className="h-6 w-6 text-slate-900" />,
  },
];

const ProductPillars = () => {
  return (
    <section className="bg-slate-50 px-6 py-16 sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
            Product Pillars
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Our Technology Ecosystem
          </h2>
          <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
            Four engines, one governed platform. Explore the core pillars that
            power every experience across the FPK-OS.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_40px_-24px_rgba(15,23,42,0.35)]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
                {pillar.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductPillars;
