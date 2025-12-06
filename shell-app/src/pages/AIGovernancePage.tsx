import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Switch } from "../components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { AlertTriangle, Brain, FileCheck2, Lock, ShieldAlert, ShieldCheck, SlidersHorizontal } from "lucide-react";

const policyControls = [
  { name: "Responsible AI charter", owner: "Compliance", enabled: true },
  { name: "Human-in-the-loop required for high-risk actions", owner: "Operations", enabled: true },
  { name: "Student data never leaves region", owner: "Security", enabled: true },
  { name: "Model prompts and outputs logged for 30 days", owner: "Trust & Safety", enabled: false },
];

const modelRegistry = [
  { name: "Classroom Coach", version: "v2.3", owner: "Curriculum", status: "Approved", risk: "Low", audit: "Dec 2025" },
  { name: "Attendance Assistant", version: "v1.4", owner: "Product", status: "Review", risk: "Medium", audit: "Nov 2025" },
  { name: "Payment Reconciler", version: "v1.1", owner: "Finance", status: "Sandbox", risk: "Medium", audit: "Oct 2025" },
  { name: "Wellness Companion", version: "v0.9", owner: "Counseling", status: "Blocked", risk: "High", audit: "Sep 2025" },
];

const incidentFeed = [
  { title: "Data export attempt blocked", severity: "High", time: "8m ago", detail: "PII attempted to leave US region." },
  { title: "Model drift detected", severity: "Medium", time: "2h ago", detail: "Sentiment shift on parent messages." },
  { title: "Bias check overdue", severity: "Low", time: "1d ago", detail: "Equity audit pending for Classroom Coach." },
];

const safeguardChecks = [
  { label: "Age-appropriate guardrails", progress: 86 },
  { label: "PII redaction coverage", progress: 74 },
  { label: "Toxicity and self-harm filters", progress: 92 },
  { label: "Accessibility and translation", progress: 68 },
];

export const AIGovernancePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Governance & Compliance</h1>
          <p className="text-slate-600">
            Monitor model risk, enforce policies, and prove compliance across the district.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <FileCheck2 className="mr-2 h-4 w-4" />
            Export Evidence
          </Button>
          <Button className="bg-primary-600 text-white hover:bg-primary-700">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Run Audit
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Policies</CardTitle>
            <ShieldAlert className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">12</div>
            <p className="text-sm text-slate-500">3 pending updates this week</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Models in Production</CardTitle>
            <Brain className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">8</div>
            <p className="text-sm text-slate-500">2 require quarterly review</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Open Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">3</div>
            <p className="text-sm text-slate-500">No P0 events in the last 24h</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Policy Controls</CardTitle>
            <CardDescription>Toggle safeguards and assign clear ownership for every control.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {policyControls.map((policy) => (
              <div
                key={policy.name}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">{policy.name}</p>
                  <p className="text-sm text-slate-500">Owner: {policy.owner}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={policy.enabled ? "default" : "secondary"}>
                    {policy.enabled ? "Enforced" : "Not enforced"}
                  </Badge>
                  <Switch aria-label={`Toggle ${policy.name}`} defaultChecked={policy.enabled} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Risk & Incident Center</CardTitle>
            <CardDescription>Live signals that need triage from the trust team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {incidentFeed.map((incident) => (
              <div key={incident.title} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{incident.severity}</Badge>
                    <p className="font-semibold text-slate-900">{incident.title}</p>
                  </div>
                  <span className="text-xs text-slate-500">{incident.time}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{incident.detail}</p>
              </div>
            ))}
            <Button variant="ghost" className="w-full justify-center">
              View incident log
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Model Registry</CardTitle>
              <CardDescription>Approval status, owners, and last audit date.</CardDescription>
            </div>
            <Button size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Manage SLAs
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Last Audit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelRegistry.map((model) => (
                  <TableRow key={model.name}>
                    <TableCell className="font-semibold text-slate-900">
                      {model.name} <span className="text-xs text-slate-500">{model.version}</span>
                    </TableCell>
                    <TableCell>{model.owner}</TableCell>
                    <TableCell>
                      <Badge variant={model.status === "Approved" ? "default" : model.status === "Blocked" ? "destructive" : "secondary"}>
                        {model.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{model.risk}</TableCell>
                    <TableCell>{model.audit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Safeguard Coverage</CardTitle>
            <CardDescription>Track how thoroughly protections are applied across products.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {safeguardChecks.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <span className="text-sm text-slate-600">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <Lock className="h-4 w-4 text-slate-500" />
              Next action: finalize updated data retention SOP for parent communications.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIGovernancePage;
