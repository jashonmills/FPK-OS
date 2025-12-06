import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BarChart,
  BrainCircuit,
  Building,
  CheckCircle,
  Eye,
  GraduationCap,
  Users as NexusIcon,
  Zap,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

type DetailContent = {
  title: string;
  description: string;
  useCases: string[];
};

type RoleCard = {
  id: keyof typeof ROLE_DETAILS;
  title: string;
  subtitle: string;
  description: string;
};

const ROLE_DETAILS: Record<string, DetailContent> = {
  provost: {
    title: "For the Provost: A Unified Academic Command Center",
    description:
      "Move beyond spreadsheets and disconnected systems. Gain a real-time, 360-degree view of your institution's academic health.",
    useCases: [
      "Model new programs and instantly see budget forecasts from Pulse plus prerequisite success data from FPK-X.",
      "The AI Risk Assessor spots patterns of disengagement across SIS, LMS, and community hubs before students fall behind.",
      "Generate accreditation-ready reports on student performance, curriculum efficacy, and faculty engagement with FPK Aegis audit trails.",
    ],
  },
  dean: {
    title: "For the Dean of Students: The Student Wellness Ecosystem",
    description:
      "Shift from reactive crisis management to proactive, holistic student support with a complete picture of every learner.",
    useCases: [
      "AI-driven alerts combine attendance, FPK-X behavioral logs, and Nexus activity to flag early warning signs.",
      "Create secure, unified records to coordinate advisors, counseling, and residential life so no student slips through.",
      "Build moderated Nexus communities for clubs, peer groups, and support networks to drive belonging.",
    ],
  },
  coo: {
    title: "For the COO/CFO: The Operational Intelligence Hub",
    description:
      "Achieve operational efficiency and financial clarity by connecting budgets, projects, and enrollment in one source of truth.",
    useCases: [
      "Pulse surfaces live departmental budgets, project spend, and resource allocation linked to University SIS enrollment.",
      "Model growth and spending scenarios; see how new programs impact budget and faculty needs with predictive analytics.",
      "Manage capital projects and IT rollouts inside Pulse to keep timelines and budgets on track.",
    ],
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 120 } },
};

const DetailModal = ({
  open,
  onOpenChange,
  content,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: DetailContent | null;
}) => {
  if (!content) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">{content.title}</DialogTitle>
          <DialogDescription className="text-slate-500 pt-2">{content.description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h4 className="font-semibold text-slate-800 mb-3">Key Use Cases</h4>
          <ul className="space-y-2">
            {content.useCases.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
                <p className="text-slate-600">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const UniversityForInstitutionsPage = () => {
  const [activeModal, setActiveModal] = useState<keyof typeof ROLE_DETAILS | null>(null);

  const roleCards: RoleCard[] = [
    {
      id: "provost",
      title: "Provost / Academic Leadership",
      subtitle: "Curriculum excellence and outcomes",
      description:
        "Design a new program; Pulse forecasts budget, AI Coach checks overlaps, FPK-X shows prerequisite success to set requirements.",
    },
    {
      id: "dean",
      title: "Dean of Students",
      subtitle: "Engagement, wellness, retention",
      description:
        "Engagement drops; AI Risk flags. FPK-X logs show anxiety notes. Nexus spins up a peer group and counseling connection.",
    },
    {
      id: "coo",
      title: "COO / Finance",
      subtitle: "Efficiency and resource allocation",
      description:
        "Plan next year's budget in Pulse. Track spend, see Arts building +15% while enrollment up 10%—clear revenue vs expense view.",
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-800">
      <main>
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-24 px-6 bg-gradient-to-b from-white to-slate-50"
        >
          <Building className="h-16 w-16 mx-auto text-indigo-600 bg-indigo-100 p-3 rounded-xl shadow-md" />
          <h1 className="text-5xl font-bold tracking-tight mt-6">Your Complete Educational OS</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mt-4">
            One unified platform to run your entire institution, from admissions and academics to operations and alumni engagement.
          </p>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="py-24 px-6"
        >
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold">Your Institution's Central Nervous System</h2>
            <p className="mt-4 text-lg text-slate-600">
              FPK OS connects your academics, operations, community, and student wellness into a single, intelligent ecosystem,
              all governed by our FPK Aegis AI layer.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="mt-16 max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-2xl shadow-slate-200/50"
          >
            <div className="relative flex justify-center items-center">
              <div className="absolute w-48 h-48 bg-indigo-600 rounded-full flex flex-col justify-center items-center text-white shadow-lg">
                <BrainCircuit className="h-8 w-8" />
                <span className="font-bold mt-1">FPK Aegis AI</span>
              </div>
              <div
                className="absolute animate-spin-slow"
                style={{ width: "400px", height: "400px", border: "2px dashed #d1d5db", borderRadius: "50%" }}
              />
              <div className="absolute" style={{ transform: "translate(0, -200px)" }}>
                <div className="p-3 bg-white rounded-lg shadow-md text-center">
                  <GraduationCap className="h-6 w-6 mx-auto text-blue-500" />
                  <span className="text-xs font-semibold">University</span>
                </div>
              </div>
              <div className="absolute" style={{ transform: "translate(200px, 0)" }}>
                <div className="p-3 bg-white rounded-lg shadow-md text-center">
                  <BarChart className="h-6 w-6 mx-auto text-green-500" />
                  <span className="text-xs font-semibold">Pulse</span>
                </div>
              </div>
              <div className="absolute" style={{ transform: "translate(0, 200px)" }}>
                <div className="p-3 bg-white rounded-lg shadow-md text-center">
                  <Zap className="h-6 w-6 mx-auto text-red-500" />
                  <span className="text-xs font-semibold">FPK-X</span>
                </div>
              </div>
              <div className="absolute" style={{ transform: "translate(-200px, 0)" }}>
                <div className="p-3 bg-white rounded-lg shadow-md text-center">
                  <NexusIcon className="h-6 w-6 mx-auto text-purple-500" />
                  <span className="text-xs font-semibold">Nexus</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="py-24 px-6 bg-white"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center">
            An OS for Every Role.
          </motion.h2>
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {roleCards.map((card) => (
              <motion.div variants={itemVariants} key={card.id}>
                <Card className="flex flex-col h-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                    <p className="text-sm text-slate-500">{card.subtitle}</p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-slate-600">{card.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button onClick={() => setActiveModal(card.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      More Info
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="py-24 px-6"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center">
            Flexible Packages for Every Institution.
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-4 text-lg text-slate-600 text-center max-w-3xl mx-auto">
            Start with a powerful foundation or build a complete, campus-wide OS. Full customization is available on the next page.
          </motion.p>
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <motion.div variants={itemVariants}>
              <Card className="p-6 shadow-lg">
                <h3 className="font-bold text-xl">Core ISOS</h3>
                <p className="text-sm text-slate-500 mt-1">The essential Student Information & Learning OS.</p>
                <p className="mt-4 font-semibold text-indigo-600">Includes: FPK University</p>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="p-6 shadow-lg ring-2 ring-indigo-500 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full">
                  POPULAR
                </div>
                <h3 className="font-bold text-xl">The Professional Bundle</h3>
                <p className="text-sm text-slate-500 mt-1">Academic, operational, and wellness tools.</p>
                <p className="mt-4 font-semibold text-indigo-600">Includes: University + Pulse + FPK-X</p>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="p-6 shadow-lg">
                <h3 className="font-bold text-xl">The Complete Ecosystem</h3>
                <p className="text-sm text-slate-500 mt-1">A single, unified OS for your entire institution.</p>
                <p className="mt-4 font-semibold text-indigo-600">Includes: All FPK Products</p>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-24 px-6 bg-white"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold">Ready to Build Your Intelligent Campus?</h2>
            <Link to="/solutions/education/build-plan">
              <Button
                size="lg"
                className="mt-8 text-lg py-8 px-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Build Your Custom Plan
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.section>
      </main>

      <DetailModal open={!!activeModal} onOpenChange={() => setActiveModal(null)} content={activeModal ? ROLE_DETAILS[activeModal] : null} />
    </div>
  );
};

export default UniversityForInstitutionsPage;
