import { useNavigate, useSearchParams } from "react-router-dom";
import { FpkLogo } from "../../components/FpkLogo";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

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

const AccessPortalPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const plan = (searchParams.get("plan") as PlanKey) || "default";
  const details = planDetails[plan] || planDetails.default;

  const handleAccess = () => {
    navigate(details.dashboardUrl);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 text-gray-900">
      <div className="flex w-full max-w-4xl flex-col items-center gap-10 rounded-2xl bg-white/90 p-8 shadow-xl shadow-slate-900/10 backdrop-blur">
        <div className="flex flex-col items-center text-center">
          <FpkLogo className="mb-3 h-12 w-12 text-gray-800" />
          <h1 className="text-2xl font-bold tracking-tight">FPK OS Ecosystem</h1>
          <p className="mt-1 text-sm text-gray-600">
            The Future-Proof Knowledge Operating System
          </p>
        </div>

        <Tabs defaultValue="signup" className="w-full max-w-xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to access your FPK OS dashboards.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signin">Email</Label>
                  <Input
                    id="email-signin"
                    type="email"
                    placeholder="name@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signin">Password</Label>
                  <Input id="password-signin" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleAccess}>
                  Sign In
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>{details.title}</CardTitle>
                <CardDescription>{details.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name-signup">Full Name</Label>
                  <Input id="name-signup" placeholder="First Last" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="name@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input id="password-signup" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleAccess}>
                  {details.cta}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccessPortalPage;
