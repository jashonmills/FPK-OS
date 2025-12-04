import {
  Briefcase,
  HeartPulse,
  Library,
  School,
  User,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Segment = {
  title: string;
  description: string;
  icon: ReactNode;
  cta: string;
  path: string;
};

const segments: Segment[] = [
  {
    title: "For Schools & Universities",
    description:
      "The complete, integrated OS for modern education. Manage everything from admissions and learning to clinical data and operations, all under one governed AI layer.",
    icon: <School className="h-6 w-6 text-slate-900" />,
    cta: "Learn More",
    path: "/solutions/education",
  },
  {
    title: "For Therapy Centers & Clinics",
    description:
      "A HIPAA-grade clinical intelligence platform. Transform observations into data, automate reporting, and deliver better outcomes with FPK-X.",
    icon: <HeartPulse className="h-6 w-6 text-slate-900" />,
    cta: "Learn More",
    path: "/solutions/therapy",
  },
  {
    title: "For Parents & Families",
    description:
      "Empower your journey. Gain clarity on your child's needs with FPK-X, access personalized learning with FPK University, and find your community in FPK Nexus.",
    icon: <Users className="h-6 w-6 text-slate-900" />,
    cta: "Learn More",
    path: "/solutions/parents",
  },
  {
    title: "For Businesses & Teams",
    description:
      "The all-in-one platform to run your operations. Manage projects, track finances, and collaborate effectively with FPK Pulse, our powerful business OS.",
    icon: <Briefcase className="h-6 w-6 text-slate-900" />,
    cta: "Learn More",
    path: "/solutions/business",
  },
  {
    title: "For Individuals",
    description:
      "Achieve your personal and professional goals. Master new skills with our Socratic AI Coach or organize your work with a personal FPK Pulse workspace.",
    icon: <User className="h-6 w-6 text-slate-900" />,
    cta: "Learn More",
    path: "/solutions/individuals",
  },
  {
    title: "For Libraries & Communities",
    description:
      "Our commitment to public good. Provide your community with free access to our course catalog and a safe, governed AI terminal for public use.",
    icon: <Library className="h-6 w-6 text-slate-900" />,
    cta: "Learn More",
    path: "/solutions/libraries",
  },
];

const AudienceSegments = () => {
  return (
    <section className="bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
            Segments
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Solutions for Every Need
          </h2>
          <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
            Choose the path that fits you best. Each experience is tailored with
            governance, accessibility, and measurable outcomes in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {segments.map((segment) => (
            <Link key={segment.title} to={segment.path} className="block no-underline">
              <div className="group relative flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_40px_-24px_rgba(15,23,42,0.35)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_20px_60px_-30px_rgba(15,23,42,0.4)]">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
                  {segment.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {segment.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {segment.description}
                  </p>
                </div>
                <span className="mt-auto inline-flex items-center text-sm font-semibold text-slate-900 transition group-hover:translate-x-1">
                  {segment.cta}
                  <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSegments;
