import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, CreditCard, Home, Lock } from "lucide-react";

const formatPlanName = (planId = "") =>
  planId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [planDetails, setPlanDetails] = useState<{
    plan: string;
    seats: string;
    products: string[];
    isB2B: boolean;
  }>({
    plan: "",
    seats: "1",
    products: [],
    isB2B: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = params.get("plan") || "individual_pro";
    const isB2B =
      plan.includes("business") ||
      plan.includes("education") ||
      plan.includes("therapy") ||
      plan.includes("library");

    setPlanDetails({
      plan: formatPlanName(plan),
      seats: params.get("seats") || params.get("patrons") || "1",
      products: params.getAll("products"),
      isB2B,
    });
  }, [location.search]);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleFinalLaunch = () => {
    navigate("/dashboard");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800">
              Create Your Account
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-slate-600">
                  Full Name
                </label>
                <input
                  id="name"
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-slate-600">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="jane.doe@example.com"
                  className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-slate-600">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>
            <button
              className="w-full transform rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-indigo-700"
              onClick={nextStep}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-slate-500 backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-white">
                Google
              </button>
              <button className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-white">
                Microsoft
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800">
              {planDetails.isB2B
                ? "Set Up Your Organization"
                : "Complete Your Profile"}
            </h2>
            <div className="space-y-4">
              {planDetails.isB2B ? (
                <>
                  <div className="space-y-2">
                    <label htmlFor="orgName" className="text-slate-600">
                      Organization Name
                    </label>
                    <input
                      id="orgName"
                      placeholder="Acme Corporation"
                      className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-slate-600">
                      Your Role
                    </label>
                    <input
                      id="role"
                      placeholder="Project Manager"
                      className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label htmlFor="profileName" className="text-slate-600">
                    Profile Name
                  </label>
                  <input
                    id="profileName"
                    placeholder="The Doe Family"
                    className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              )}
            </div>
            <button
              className="w-full transform rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-indigo-700"
              onClick={nextStep}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button
              className="text-sm font-semibold text-indigo-600"
              onClick={prevStep}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800">
              Confirm Your Plan
            </h2>
            <div className="rounded-xl border border-indigo-200 bg-white/80">
              <div className="p-4">
                <h4 className="font-bold text-indigo-900">
                  {planDetails.plan}
                </h4>
                {planDetails.isB2B && (
                  <p className="text-sm text-slate-700">
                    {planDetails.seats} Seats
                  </p>
                )}
                {planDetails.products.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                    {planDetails.products.map((p) => (
                      <li key={p}>{formatPlanName(p)}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-700">
                Payment Information
              </h3>
              <div className="rounded-lg border bg-white/60 p-4 text-center text-slate-500">
                <CreditCard className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <p className="font-bold">Stripe Payment Gateway</p>
                <p className="text-sm">
                  This is where the Stripe Elements component will be rendered.
                </p>
                <p className="mt-2 flex items-center justify-center text-sm">
                  <Lock className="mr-1 h-3 w-3" />
                  Secure payment processing by Stripe.
                </p>
              </div>
            </div>

            <button
              className="w-full transform rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-green-700"
              onClick={handleFinalLaunch}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Setup & Launch
            </button>
            <button
              className="text-sm font-semibold text-indigo-600"
              onClick={prevStep}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-white p-4">
      <button
        className="absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:text-slate-900"
        onClick={() => navigate("/")}
      >
        <Home className="mr-2 h-4 w-4" /> Back to Site
      </button>
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
            FPK
          </div>
        </div>
        <div className="rounded-2xl border border-white/50 bg-white/60 p-8 shadow-2xl backdrop-blur-xl">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
