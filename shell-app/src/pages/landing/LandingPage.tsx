import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart, BookOpen, BrainCircuit, Library, Users, Zap } from "lucide-react";
import { Button } from "../../components/ui/button";

type ProductPillarCardProps = {
  icon: (props: { className?: string }) => ReactNode;
  title: string;
  description: string;
  href: string;
};

type SolutionCardProps = {
  title: string;
  description: string;
  href: string;
};

const ProductPillarCard = ({ icon: Icon, title, description, href }: ProductPillarCardProps) => (
  <Link
    to={href}
    className="block p-8 bg-slate-50 rounded-lg border hover:border-indigo-300 hover:shadow-lg transition-all"
  >
    <div className="flex items-center justify-center h-12 w-12 bg-indigo-100 rounded-full">
      <Icon className="h-6 w-6 text-indigo-600" />
    </div>
    <h3 className="mt-4 text-xl font-semibold">{title}</h3>
    <p className="mt-1 text-slate-600">{description}</p>
  </Link>
);

const SolutionCard = ({ title, description, href }: SolutionCardProps) => (
  <Link
    to={href}
    className="block p-6 bg-white rounded-lg border hover:border-indigo-300 hover:shadow-md transition-all"
  >
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-slate-500 mt-1">{description}</p>
    <p className="text-sm font-semibold text-indigo-600 mt-4">Learn More →</p>
  </Link>
);

const LandingPage = () => {
  return (
    <div className="bg-white text-slate-800">
      <section className="relative text-center py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute top-0 left-0 -z-10" />
        <p className="font-semibold text-indigo-600">FPK-OS • AI ECOSYSTEM</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-2">
          The Trusted AI Ecosystem
          <br />
          for Human Potential.
        </h1>
        <p className="mt-6 text-lg max-w-3xl mx-auto text-slate-600">
          Powerful, governed applications for schools and businesses. Life-changing tools for families and individuals.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" className="inline-flex items-center">
            Explore the Ecosystem <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm mt-4 text-slate-500">Trusted by leading schools, therapy centers, and businesses.</p>
      </section>

      <main className="py-24 px-6">
        <section className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-semibold text-indigo-600 uppercase">Product Pillars</p>
            <h2 className="text-4xl font-bold mt-2">Our Technology Ecosystem</h2>
            <p className="mt-3 text-lg text-slate-600 max-w-3xl mx-auto">
              Six core engines, one governed platform. Explore the pillars that power every experience across the
              FPK-OS.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductPillarCard
              icon={BookOpen}
              title="FPK University"
              description="The Action Engine. An adaptive learning platform with a Socratic AI Coach."
              href="/university"
            />
            <ProductPillarCard
              icon={Zap}
              title="FPK-X"
              description="The Insight Engine. A clinical-grade data intelligence platform for therapy and analysis."
              href="/fkpx"
            />
            <ProductPillarCard
              icon={BarChart}
              title="FPK Pulse"
              description="The Operations Engine. A complete business OS to manage projects, people, and finances."
              href="/pulse"
            />
            <ProductPillarCard
              icon={Users}
              title="FPK Nexus"
              description="The Community Engine. A private, secure social media platform for any organization."
              href="/nexus"
            />
            <ProductPillarCard
              icon={Library}
              title="Library Portal"
              description="The Resource Engine. Free and paid educational materials for libraries and communities."
              href="/library-portal"
            />
            <ProductPillarCard
              icon={BrainCircuit}
              title="AI Study Coach"
              description="The Personal Tutor. A standalone AI interface for focused, one-on-one learning."
              href="/ai-study-coach"
            />
          </div>
        </section>

        <section className="max-w-7xl mx-auto mt-32">
          <div className="text-center mb-16">
            <p className="font-semibold text-indigo-600 uppercase">Segments</p>
            <h2 className="text-4xl font-bold mt-2">Solutions for Every Need</h2>
            <p className="mt-3 text-lg text-slate-600 max-w-3xl mx-auto">
              Choose the path that fits you best. Each experience is tailored with governance, accessibility, and
              measurable outcomes in mind.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SolutionCard
              title="For Schools & Universities"
              description="The complete, integrated OS for modern education."
              href="/university/institutions"
            />
            <SolutionCard
              title="For Therapy Centers & Clinics"
              description="A HIPAA-grade clinical intelligence platform."
              href="/fkpx/agencies"
            />
            <SolutionCard
              title="For Parents & Families"
              description="Empower your journey. Gain clarity on your child's needs."
              href="/fkpx/individuals"
            />
            <SolutionCard
              title="For Businesses & Teams"
              description="The all-in-one platform to run your operations."
              href="/pulse/businesses"
            />
            <SolutionCard
              title="For Individuals"
              description="Master new skills or organize your work."
              href="/university/individuals"
            />
            <SolutionCard
              title="For Libraries & Communities"
              description="Our commitment to public good."
              href="/library-portal"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
