import { Building, GraduationCap, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export const UniversityLandingPage = () => {
  return (
    <div className="bg-white text-slate-800">
      <section className="bg-blue-50 py-24 px-6 text-center">
        <GraduationCap className="h-16 w-16 mx-auto text-blue-600" />
        <h1 className="text-5xl font-bold tracking-tight mt-4">
          Unlocking Creativity, Confidence, and Visual Learning
        </h1>
        <p className="mt-6 text-lg max-w-3xl mx-auto text-slate-600">
          FPK University is an innovative learning platform designed to make education accessible, engaging, and effective for
          all students by adapting to the individual, not the other way around.
        </p>
      </section>

      <section className="py-24 px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">A Tailored OS for Every Learner</h2>
          <p className="mt-3 text-lg text-slate-600">
            Whether you are on a personal growth journey or transforming an entire institution, FPK University has a path for you.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <User className="h-12 w-12 mx-auto text-blue-600" />
            <h3 className="text-2xl font-bold mt-4">For Individuals</h3>
            <p className="mt-2 text-slate-600 h-16">
              The ultimate toolkit for the serious learner. Build your second brain and master skills your way.
            </p>
            <Link to="/university/for-individuals">
              <Button size="lg" className="mt-6 w-full bg-blue-600 hover:bg-blue-700">
                Explore Individual Plans
              </Button>
            </Link>
          </Card>

          <Card className="p-8 text-center">
            <Building className="h-12 w-12 mx-auto text-slate-700" />
            <h3 className="text-2xl font-bold mt-4">For Institutions</h3>
            <p className="mt-2 text-slate-600 h-16">
              A complete, unified OS to run your entire institution, from admissions to alumni engagement.
            </p>
            <Link to="/university/for-institutions">
              <Button size="lg" className="mt-6 w-full" variant="outline">
                Explore Institutional Plans
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default UniversityLandingPage;
