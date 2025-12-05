import { FastForward, Scissors, Sparkles, User, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

type Feature = { title: string; description: string };

const FeatureList = ({ features }: { features: Feature[] }) => (
  <ul className="space-y-3">
    {features.map((feature, index) => (
      <li key={index} className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
        <div>
          <p className="font-semibold">{feature.title}</p>
          <p className="text-sm text-slate-600">{feature.description}</p>
        </div>
      </li>
    ))}
  </ul>
);

export const UniversityForIndividualsPage = () => {
  return (
    <div className="bg-white text-slate-800">
      <main className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <User className="h-12 w-12 mx-auto text-blue-600" />
            <h1 className="text-5xl font-bold mt-4">Your Brain Doesn't Fit in a Box.</h1>
            <p className="text-xl text-slate-600 mt-3">
              Traditional learning tools are rigid. FPK University is a flexible, AI-powered toolkit designed to adapt to you—your
              goals, your pace, and your unique way of thinking.
            </p>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Learning, Reimagined for Every Mind.</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <Scissors className="h-10 w-10 mx-auto text-blue-500" />
                <h3 className="font-semibold text-lg mt-4">Microlearning</h3>
                <p className="text-slate-600 mt-2 text-sm">Break down complex topics into manageable, chunked-down pieces.</p>
              </div>
              <div className="p-6">
                <Sparkles className="h-10 w-10 mx-auto text-blue-500" />
                <h3 className="font-semibold text-lg mt-4">Active Engagement</h3>
                <p className="text-slate-600 mt-2 text-sm">AI Coach and SRS actively engage your mind to build long-term memory.</p>
              </div>
              <div className="p-6">
                <FastForward className="h-10 w-10 mx-auto text-blue-500" />
                <h3 className="font-semibold text-lg mt-4">Personalized Pacing</h3>
                <p className="text-slate-600 mt-2 text-sm">Adaptive Learning Paths adjust your study plan in real time.</p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Your Personal Toolkit for Lifelong Learning.</h2>
            <Card className="bg-slate-50/50 border-slate-200">
              <CardContent className="p-8">
                <FeatureList
                  features={[
                    {
                      title: "Build Your Second Brain",
                      description: "Capture everything you learn into a single, interconnected library that grows with you.",
                    },
                    {
                      title: "Your 24/7 AI Study Partner",
                      description: "A patient, Socratic tutor that guides you to discover answers yourself.",
                    },
                    {
                      title: "The Fastest Route to Mastery",
                      description: "Tell the AI what you want to learn and receive a custom plan that adapts to your progress.",
                    },
                    {
                      title: "Conquer the Forgetting Curve",
                      description: "Intelligent SRS flashcards to lock knowledge into long-term memory.",
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold">Ready to Unlock Your Full Potential?</h2>
            <Link to="/university/pricing">
              <Button size="lg" className="mt-6 text-lg py-7 px-10 bg-blue-600 hover:bg-blue-700">
                Choose Your Plan
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UniversityForIndividualsPage;
