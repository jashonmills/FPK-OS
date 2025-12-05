import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  BarChart2,
  Bell,
  Bot,
  Building,
  CheckSquare,
  DollarSign,
  Gamepad2,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  Sparkles,
  Users,
  BookOpen,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const allNavItems: Record<string, NavSection> = {
  admin: {
    title: "School Administration",
    items: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
      { id: "sis", label: "Student Info (SIS)", icon: <Users />, path: "/dashboard/sis" },
      { id: "sis", label: "Attendance & TUSLA", icon: <CheckSquare />, path: "/dashboard/attendance" },
      { id: "sis", label: "Assessments & Reports", icon: <BarChart2 />, path: "/dashboard/assessments" },
      { id: "sis", label: "Fees & Payments", icon: <DollarSign />, path: "/dashboard/payments" },
    ],
  },
  academics: {
    title: "Academics & Learning",
    items: [
      { id: "university", label: "Courses & Curriculum", icon: <BookOpen />, path: "/dashboard/courses" },
      { id: "university", label: "AI Coach", icon: <Bot />, path: "/dashboard/coach" },
    ],
  },
  people: {
    title: "People & Communication",
    items: [
      { id: "pulse", label: "Staff Management", icon: <Users />, path: "/dashboard/staff" },
      { id: "nexus", label: "Communication Hub", icon: <MessageSquare />, path: "/dashboard/hub" },
      { id: "fpk-nexus", label: "FPK Nexus", icon: <Shield />, path: "/dashboard/nexus" },
    ],
  },
  platform: {
    title: "Platform & Settings",
    items: [
      { id: "gamification", label: "Gamification", icon: <Gamepad2 />, path: "/dashboard/gamification" },
      { id: "website", label: "Website", icon: <Globe />, path: "/dashboard/website" },
      { id: "settings", label: "System Settings", icon: <Settings />, path: "/dashboard/settings" },
      { id: "aegis", label: "AI Governance", icon: <Shield />, path: "/dashboard/governance" },
    ],
  },
};

type DashboardLayoutProps = {
  subscribedFeatures: Set<string>;
  trialingFeatures: Set<string>;
  children?: React.ReactNode;
};

const TrialBanner: React.FC = () => {
  return (
    <div className="bg-yellow-100 px-4 py-2 text-center text-sm text-yellow-800 border-b border-yellow-200">
      <Sparkles className="inline h-4 w-4 text-yellow-600 mr-2" />
      You have <span className="font-semibold">28 days left</span> in your premium feature trial.{" "}
      <a className="font-semibold underline hover:text-yellow-900" href="#">
        Upgrade now
      </a>
      .
    </div>
  );
};

const Sidebar: React.FC<{ subscribedFeatures: Set<string>; trialingFeatures: Set<string> }> = ({
  subscribedFeatures,
  trialingFeatures,
}) => {
  const location = useLocation();

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col bg-gray-800 text-gray-200 shadow-2xl">
      <div className="flex h-16 items-center border-b border-gray-700 px-4">
        <img
          src="https://placehold.co/40x40/a7a7a7/FFFFFF/png"
          alt="Org Logo"
          className="mr-3 h-10 w-10 rounded-md"
        />
        <div>
          <p className="text-sm font-semibold text-white">ISOS</p>
          <p className="text-xs text-gray-400">White-labeled</p>
        </div>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-4">
        {Object.values(allNavItems).map((section) => {
          const items = section.items.map((item) => {
            // Aegis is always treated as subscribed (governance is included)
            if (
              item.id === "aegis" ||
              subscribedFeatures.has(item.id) ||
              item.id === "dashboard" ||
              item.id === "settings"
            ) {
              return { ...item, status: "subscribed" as const };
            }
            if (trialingFeatures.has(item.id)) {
              return { ...item, status: "trialing" as const };
            }
            return { ...item, status: "locked" as const };
          });
          if (items.every((i) => i.status === "locked")) return null;

          return (
            <div key={section.title}>
              <h3 className="px-4 pb-1 text-xs font-bold uppercase tracking-wide text-gray-500">
                {section.title}
              </h3>
              <div className="space-y-1">
                {items.map((item) => {
                  const active = location.pathname === item.path;
                  const isLocked = item.status === "locked";
                  const isTrial = item.status === "trialing";
                  return (
                    <div key={item.label} className="group relative">
                      {isLocked ? (
                        <div
                          className={`flex items-center rounded-md px-4 py-2 text-sm text-gray-500 ${
                            active ? "bg-gray-900 text-white" : "hover:bg-gray-700/40"
                          }`}
                          title="Upgrade to unlock this feature."
                        >
                          <span className="mr-3 h-5 w-5 text-gray-400">
                            <Lock className="h-5 w-5" />
                          </span>
                          <span className="flex-1">{item.label}</span>
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className={`flex items-center rounded-md px-4 py-2 text-sm transition-colors ${
                            active ? "bg-gray-900 text-white" : "hover:bg-gray-700 hover:text-white"
                          }`}
                          title={
                            isTrial ? "This feature is included in your trial. Upgrade to keep it." : undefined
                          }
                        >
                          <span className="mr-3 h-5 w-5 text-gray-300">{item.icon}</span>
                          <span className="flex-1">{item.label}</span>
                          {isTrial && <Sparkles className="h-4 w-4 text-yellow-300" />}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-gray-700 px-4 py-4">
        <Link
          to="/dashboard/organization"
          className="flex items-center rounded-md px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-700"
        >
          <Building className="mr-3 h-5 w-5" />
          Organization
        </Link>
      </div>
    </aside>
  );
};

const DashboardHeader: React.FC = () => {
  const user = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  };
  return (
    <header className="flex h-16 items-center justify-end border-b bg-white px-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 text-gray-500 hover:text-gray-800"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
            <img
              className="h-10 w-10 rounded-full"
              src={user.avatar}
              alt={user.name}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            Support
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  subscribedFeatures,
  trialingFeatures,
  children,
}) => {
  const [featureSubscribed, setFeatureSubscribed] = useState(subscribedFeatures);
  const [featureTrial, setFeatureTrial] = useState(trialingFeatures);

  useEffect(() => {
    setFeatureSubscribed(subscribedFeatures);
    setFeatureTrial(trialingFeatures);
  }, [subscribedFeatures, trialingFeatures]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar subscribedFeatures={featureSubscribed} trialingFeatures={featureTrial} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <TrialBanner />
        <main className="relative z-0 flex-1 overflow-y-auto bg-gray-50 p-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
