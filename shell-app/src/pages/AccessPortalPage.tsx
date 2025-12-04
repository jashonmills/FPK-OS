import { useNavigate, useSearchParams } from "react-router-dom";

const planDetails = {
  default: {
    title: "Access Your Account",
    description: "Sign in or create an account to continue.",
    cta: "Continue",
    dashboardUrl: "/dashboard",
  },
  family_trial: {
    title: "Start Your Free Family Trial",
    description:
      "Create your account to begin your 14-day trial of FPK-X and FPK Nexus for your family.",
    cta: "Start My Free Trial",
    dashboardUrl: "/dashboard/family",
  },
  business_demo: {
    title: "Request Your Business Demo",
    description:
      "Create an account and a specialist will contact you to schedule your FPK Pulse demo.",
    cta: "Request Demo",
    dashboardUrl: "/dashboard/business",
  },
  university_free: {
    title: "Join FPK University",
    description:
      "Create your free account and start building your Second Brain today.",
    cta: "Sign Up Free",
    dashboardUrl: "/dashboard/university",
  },
} as const;

type PlanKey = keyof typeof planDetails;
type Tab = "signin" | "signup";

const AccessPortalPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const plan = (searchParams.get("plan") as PlanKey) || "default";
  const tab = (searchParams.get("tab") as Tab) || "signup";
  const details = planDetails[plan] || planDetails.default;

  const handleAccess = () => {
    navigate(details.dashboardUrl);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-900">
      <div className="flex w-full max-w-4xl flex-col items-center gap-10 rounded-2xl bg-white/90 p-8 shadow-xl shadow-slate-900/10 backdrop-blur">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-base font-bold text-white">
            FPK
          </div>
          <h1 className="text-2xl font-bold tracking-tight">FPK OS Ecosystem</h1>
          <p className="mt-1 text-sm text-slate-600">
            The Future-Proof Knowledge Operating System
          </p>
        </div>

        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-900/5">
          <div className="grid grid-cols-2 text-center text-sm font-semibold text-slate-600">
            <a
              href="/access?tab=signin"
              className={`px-4 py-3 ${
                tab === "signin" ? "text-slate-900" : "hover:text-slate-800"
              }`}
            >
              Sign In
            </a>
            <a
              href={`/access?tab=signup${plan !== "default" ? `&plan=${plan}` : ""}`}
              className={`px-4 py-3 ${
                tab === "signup" ? "text-slate-900" : "hover:text-slate-800"
              }`}
            >
              Create Account
            </a>
          </div>
          <div className="border-t border-slate-200" />

          {tab === "signin" ? (
            <div className="grid gap-6 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Sign in to access your FPK OS dashboards.
                </p>
              </div>
              <div className="space-y-4">
                <label className="block space-y-2 text-left text-sm font-medium text-slate-700">
                  <span>Email</span>
                  <input
                    id="email-signin"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
                  />
                </label>
                <label className="block space-y-2 text-left text-sm font-medium text-slate-700">
                  <span>Password</span>
                  <input
                    id="password-signin"
                    type="password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
                  />
                </label>
              </div>
              <button
                onClick={handleAccess}
                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="grid gap-6 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{details.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{details.description}</p>
              </div>
              <div className="space-y-4">
                <label className="block space-y-2 text-left text-sm font-medium text-slate-700">
                  <span>Full Name</span>
                  <input
                    id="name-signup"
                    placeholder="First Last"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
                  />
                </label>
                <label className="block space-y-2 text-left text-sm font-medium text-slate-700">
                  <span>Email</span>
                  <input
                    id="email-signup"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
                  />
                </label>
                <label className="block space-y-2 text-left text-sm font-medium text-slate-700">
                  <span>Password</span>
                  <input
                    id="password-signup"
                    type="password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
                  />
                </label>
              </div>
              <button
                onClick={handleAccess}
                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                {details.cta}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessPortalPage;
