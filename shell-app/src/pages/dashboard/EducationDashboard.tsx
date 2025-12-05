import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  Bell,
  Bot,
  CheckCircle,
  FileText,
  Info,
  Shield,
  Settings,
  UploadCloud,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  trend,
  icon,
  color,
}: {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="flex items-start justify-between rounded-lg border bg-white p-4 shadow-sm">
    <div>
      <p className="text-xs uppercase text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="mt-1 flex items-center text-xs text-green-600">
        <ArrowUp className="mr-1 h-3 w-3" />
        <span>{trend}</span>
      </div>
    </div>
    <div className={`rounded-full p-2 ${color}`}>{icon}</div>
  </div>
);

const WelcomeTour = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState(1);
  const [knowledgeSource, setKnowledgeSource] = useState<"default" | "custom">(
    "default"
  );
  const [scrapeEnabled, setScrapeEnabled] = useState(false);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="text-2xl font-bold text-gray-900">
              Welcome to FPK OS!
            </h3>
            <p className="mt-2 text-gray-600">
              Let&apos;s get your institution set up in a few quick steps.
            </p>
            <button
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary-600)] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-700)]"
              onClick={next}
            >
              Let&apos;s Go! <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-lg font-bold text-gray-900">
              Step 1: Configure AI Knowledge Base
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Choose how the AI learns about your institution. You can change
              this anytime.
            </p>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-200 p-1">
                <button
                  onClick={() => setKnowledgeSource("default")}
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                    knowledgeSource === "default"
                      ? "bg-white shadow"
                      : "text-gray-600"
                  }`}
                >
                  FPK Default
                </button>
                <button
                  onClick={() => setKnowledgeSource("custom")}
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                    knowledgeSource === "custom"
                      ? "bg-white shadow"
                      : "text-gray-600"
                  }`}
                >
                  Custom
                </button>
              </div>

              {knowledgeSource === "custom" && (
                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 animate-fade-in">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Organization Website URL
                    </label>
                    <input
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                      placeholder="https://yourschool.edu"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="scrape-toggle"
                      type="checkbox"
                      checked={scrapeEnabled}
                      onChange={(e) => setScrapeEnabled(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)]"
                    />
                    <label
                      htmlFor="scrape-toggle"
                      className="flex-1 text-sm font-semibold text-gray-700"
                    >
                      Scrape website to build knowledge base
                    </label>
                    <span
                      className="rounded-full p-1"
                      title="Our AI will read your site to auto-ingest policies and public info."
                    >
                      <Info className="h-4 w-4 text-gray-500" />
                    </span>
                  </div>
                  <div className="relative rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                    <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag & drop documents here, or{" "}
                      <span className="font-semibold text-[var(--color-primary-600)]">
                        browse files
                      </span>
                    </p>
                    <input
                      type="file"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      multiple
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                onClick={back}
              >
                Back
              </button>
              <button
                className="inline-flex items-center rounded-full bg-[var(--color-primary-600)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-700)]"
                onClick={next}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-lg font-bold text-gray-900">
              Step 2: Invite Your Team
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Add other administrators or teachers.
            </p>
            <div className="mt-4 space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="colleague1@example.edu"
              />
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="colleague2@example.edu"
              />
            </div>
            <div className="mt-6 flex justify-between">
              <button
                className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                onClick={back}
              >
                Back
              </button>
              <button
                className="inline-flex items-center rounded-full bg-[var(--color-primary-600)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-700)]"
                onClick={next}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h3 className="text-lg font-bold text-gray-900">
              Step 3: Create Your First Course
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Give your first course a name to get started.
            </p>
            <div className="mt-4 space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Course Name
              </label>
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="e.g., Grade 10 - Biology"
              />
            </div>
            <div className="mt-6 flex justify-between">
              <button
                className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                onClick={back}
              >
                Back
              </button>
              <button
                className="inline-flex items-center rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-700"
                onClick={onFinish}
              >
                Finish Setup
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-lg animate-fade-in rounded-xl border bg-gradient-to-br from-white to-gray-50 p-8 shadow-2xl">
        <button
          className="absolute right-3 top-3 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          onClick={onFinish}
          title="Skip for now"
        >
          <X className="h-5 w-5" />
        </button>
        {renderStep()}
      </div>
    </div>
  );
};

const EducationDashboard = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const alerts = [
    {
      title: "Unexplained Absence Spike",
      detail: "Year 10 attendance dropped below threshold (85%) today.",
      time: "10 mins ago",
      type: "warning",
    },
    {
      title: "Compliance Check Passed",
      detail: "TUSLA audit packet generated and ready for submission.",
      time: "25 mins ago",
      type: "success",
    },
    {
      title: "Report Ready",
      detail: "Weekly assessment insights are ready to share with staff.",
      time: "1 hour ago",
      type: "info",
    },
  ];

  const quickActions = [
    { label: "Send Urgent Notice", icon: <Bell className="mx-auto h-6 w-6 text-gray-600" /> },
    { label: "Generate Report", icon: <FileText className="mx-auto h-6 w-6 text-gray-600" /> },
    { label: "Admit Student", icon: <UserPlus className="mx-auto h-6 w-6 text-gray-600" /> },
    { label: "Maintenance Task", icon: <Settings className="mx-auto h-6 w-6 text-gray-600" /> },
  ];

  return (
    <div className="animate-fade-in">
      {showWelcome && <WelcomeTour onFinish={() => setShowWelcome(false)} />}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ISOS Command Center</h1>
          <p className="text-sm text-gray-500">
            Live operational overview for School Administrators
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <CheckCircle className="mr-2 h-4 w-4" />
          System Operational
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          title="Live Attendance"
          value="94.2%"
          trend="+1.2% vs last week"
          icon={<Users className="text-blue-800" />}
          color="bg-blue-100"
        />
        <StatCard
          title="TUSLA Compliance"
          value="100%"
          trend="Audit-Ready"
          icon={<Shield className="text-green-800" />}
          color="bg-green-100"
        />
        <StatCard
          title="FPK Score"
          value="8.4/10"
          trend="High Performance"
          icon={<Bot className="text-purple-800" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Pending Alerts"
          value="3"
          trend="Requires Action"
          icon={<AlertTriangle className="text-red-800" />}
          color="bg-red-100"
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800">Live Compliance & Operational Alerts</h3>
          <div className="mt-4 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className="flex items-center rounded-md border border-gray-100 p-3 transition hover:bg-gray-50"
              >
                <AlertTriangle className="mr-4 h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{alert.title}</p>
                  <p className="text-xs text-gray-500">{alert.detail}</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-800">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="rounded-md p-2 transition hover:-translate-y-0.5 hover:bg-gray-100"
                >
                  {action.icon}
                  <span className="mt-1 block text-xs">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="flex items-center font-bold text-blue-900">
              <Bot className="mr-2 h-5 w-5" /> FPK Insight
            </h4>
            <p className="mt-2 text-sm text-blue-800">
              <span className="font-semibold">Resource Optimization:</span> Based on current
              absenteeism trends, you can reduce substitute teacher allocation by 15% next week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationDashboard;
