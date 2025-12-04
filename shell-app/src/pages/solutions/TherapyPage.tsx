import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield, FileText, BarChart, Bot, Users } from 'lucide-react';

const painPoints = [
  { title: "Subjective Data & Insurance Audits", description: "Your interventions are powerful, but your data is anecdotal. Proving efficacy to insurance companies is a constant, uphill battle." },
  { title: "Crushing Administrative Overhead", description: "Your highly-paid clinicians are spending up to 40% of their time on non-billable work like manual FBA/BIP creation and progress reports." },
  { title: "HIPAA & FERPA Compliance Risks", description: "Using a patchwork of consumer-grade tools like Google Drive and Dropbox for sensitive client data exposes your practice to massive financial and legal risks." },
  { title: "Inconsistent Care & Staff Turnover", description: "When a therapist leaves, their critical knowledge of a client's triggers and history walks out the door, disrupting the continuity of care." },
  { title: "Disconnected Parent Communication", description: "Parents feel out of the loop. Sharing data and progress in a secure, understandable way is manual, time-consuming, and often ineffective." },
  { title: "Lack of Predictive Insights", description: "You're always reacting to behaviors. You lack the data-driven tools to anticipate trends, predict regressions, and proactively adjust treatment plans." },
];

const solutionPillars = [
  { icon: <FileText className="h-8 w-8 text-teal-500" />, title: "AI-Powered Document Intelligence", description: "Stop manual data entry. Automatically extract goals, baselines, and service hours from IEPs, 504s, and 470+ other document types." },
  { icon: <BarChart className="h-8 w-8 text-teal-500" />, title: "Clinical-Grade Visual Analytics", description: "Go beyond spreadsheets with 27 specialized charts. Analyze behavior functions, track prompting levels, and correlate sleep with next-day outcomes." },
  { icon: <Bot className="h-8 w-8 text-teal-500" />, title: "Automated Reporting & Assessment Wizards", description: "Slash administrative time. Generate comprehensive progress reports, FBAs, and BIPs in minutes, not hours, using our guided workflows." },
  { icon: <Users className="h-8 w-8 text-teal-500" />, title: "Optional Secure Community with FPK Nexus", description: "Provide families with a safe, moderated community space to connect with others, integrated directly with their FPK-X portal." },
];

export const TherapyPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      <Header />

      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-400">SOLUTIONS FOR THERAPY CENTERS & CLINICS</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            The Clinical Intelligence Engine for Better Outcomes.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-300">
            Transform scattered observations into structured, quantifiable data. FPK-X is the HIPAA-compliant platform that automates reporting, proves efficacy, and empowers your clinicians to do their best work.
          </p>
          <div className="mt-8">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200">Book a Consultation</Button>
          </div>
        </div>
      </div>

      {/* Pain Points Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Your Clinicians are Exceptional. Their Tools Should Be, Too.</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              You're dedicated to delivering life-changing outcomes, but your practice is slowed by outdated processes and administrative burdens.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {painPoints.map((point) => (
              <div key={point.title} className="bg-white p-8 rounded-lg shadow-md">
                <CheckCircle className="h-8 w-8 text-red-500" />
                <h3 className="mt-4 text-xl font-bold">{point.title}</h3>
                <p className="mt-2 text-gray-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solution Pillars Section */}
      <div className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">The FPK-X Clinical Suite</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Purpose-built to solve the core challenges of a modern therapy practice, all protected by our foundational AI governance layer.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {solutionPillars.map((pillar) => (
              <Card key={pillar.title}>
                <CardHeader className="flex flex-row items-start gap-4">
                  {pillar.icon}
                  <div>
                    <CardTitle className="text-xl">{pillar.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-8 bg-teal-600 text-white">
            <CardHeader className="flex flex-row items-start gap-4">
              <Shield className="h-8 w-8 text-white" />
              <div>
                <CardTitle className="text-xl">The Foundation: FPK Aegis AI Governance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Operate with total confidence. Aegis ensures every piece of data is handled with HIPAA/FERPA-grade security. Our AI models are governed by strict clinical and privacy protocols, protecting your clients, your staff, and your practice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gray-900">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white">Ready to Elevate Your Practice?</h2>
          <p className="mt-4 text-lg text-gray-300">
            Spend less time on paperwork and more time changing lives. See how FPK-X can transform your operations.
          </p>
          <div className="mt-8">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200">Schedule a Demo</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
