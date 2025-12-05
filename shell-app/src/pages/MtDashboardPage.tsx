import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { AlertTriangle, Building, FileText, ShieldCheck, UserCheck, UserPlus, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Textarea } from "../components/ui/textarea";

type BadgeVariant = "secondary" | "default" | "outline" | "success" | "destructive" | "warning";
type Kpi = {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  isBadge?: boolean;
  badgeVariant?: BadgeVariant;
};

const kpiData: Kpi[] = [
  { title: "Active Students", value: "42", icon: Users, description: "Students with recent activity" },
  { title: "Documents Analyzed", value: "317", icon: FileText, description: "Total clinical documents processed" },
  {
    title: "Compliance Status",
    value: "Compliant",
    icon: ShieldCheck,
    description: "HIPAA & GDPR readiness",
    isBadge: true,
    badgeVariant: "success",
  },
  {
    title: "Open Incidents",
    value: "3",
    icon: AlertTriangle,
    description: "High-priority incidents needing review",
    isBadge: true,
    badgeVariant: "destructive",
  },
];

const recentActivity = [
  { user: "Dr. Anya Sharma", action: "Uploaded 'IEP Report 2025'", student: "Jace Mills", time: "2m ago" },
  { user: "System", action: "Generated Insight: 'Trend in Work Avoidance'", student: "Jace Mills", time: "15m ago" },
  { user: "Markus Thorne (Parent)", action: "Submitted a Parent Log", student: "Jace Mills", time: "1h ago" },
  { user: "System", action: "Flagged document for review: 'FBA Report'", student: "Chloe Garcia", time: "3h ago" },
];

const behaviorData = [
  { name: "SIB", value: 8 },
  { name: "Dysreg", value: 12 },
  { name: "Aggro", value: 5 },
  { name: "Elopement", value: 2 },
  { name: "Avoidance", value: 15 },
];

type OnboardingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const OnboardingModal = ({ open, onOpenChange }: OnboardingModalProps) => {
  const [step, setStep] = useState(1);

  const steps = [
    {
      step: 1,
      icon: Building,
      title: "Welcome to FPKx!",
      description: "Let's get your practice set up. First, what is the name of your organization?",
      content: (
        <div className="grid gap-2">
          <Label htmlFor="org-name">Organization Name</Label>
          <Input id="org-name" placeholder="e.g., BrigaCare Therapy, Northwood School District" />
        </div>
      ),
    },
    {
      step: 2,
      icon: UserPlus,
      title: "Invite Your Team",
      description: "Add the email addresses of the clinicians, therapists, or admins you want to invite.",
      content: (
        <div className="grid gap-2">
          <Label htmlFor="team-emails">Team Member Emails</Label>
          <Textarea id="team-emails" placeholder="Enter emails separated by commas..." />
        </div>
      ),
    },
    {
      step: 3,
      icon: UserCheck,
      title: "Create Your First Student Profile",
      description: "Let's add your first student or client to the system.",
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" placeholder="Jace" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input id="last-name" placeholder="Mills" />
          </div>
          <div className="grid gap-2 col-span-2">
            <Label htmlFor="student-id">Student ID (Optional)</Label>
            <Input id="student-id" placeholder="e.g., JM-12345" />
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step - 1];

  useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <currentStep.icon className="h-6 w-6 text-indigo-600" />
            {currentStep.title}
          </DialogTitle>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">{currentStep.content}</div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Step {step} of {steps.length}
          </div>
          <DialogFooter>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            {step < steps.length ? (
              <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
            ) : (
              <Button onClick={() => onOpenChange(false)}>Finish Setup</Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const MtDashboardPage = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const isNewUser = !localStorage.getItem("fpkx_onboarding_complete");
    if (isNewUser) {
      setShowOnboarding(true);
      localStorage.setItem("fpkx_onboarding_complete", "true");
    }
  }, []);

  return (
    <>
      <OnboardingModal open={showOnboarding} onOpenChange={setShowOnboarding} />
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Organization Dashboard</h1>
            <p className="text-slate-600 mt-1">
              High-level overview of your organization's clinical and behavioral data.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-800 hover:bg-indigo-50">
              Export
            </Button>
            <Button size="sm" className="bg-indigo-700 text-white hover:bg-indigo-800">
              New Report
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((item) => (
            <Card key={item.title} className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                {item.isBadge ? (
                  <Badge variant={item.badgeVariant} className="text-sm font-semibold">
                    {item.value}
                  </Badge>
                ) : (
                  <div className="text-3xl font-bold text-slate-900">{item.value}</div>
                )}
                <p className="text-xs text-slate-500 mt-1">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>A live feed of actions across your organization.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={`${activity.user}-${activity.time}`}>
                      <TableCell className="font-medium">{activity.user}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell className="text-slate-500">{activity.student}</TableCell>
                      <TableCell className="text-right text-slate-500">{activity.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Behavior Hotspots</CardTitle>
              <CardDescription>Top maladaptive behaviors recorded in the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={behaviorData} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <Bar dataKey="value" fill="#4338ca" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MtDashboardPage;
