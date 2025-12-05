import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Building, Lock, Plug, Database, Upload, KeyRound, RefreshCw } from "lucide-react";

export const SystemSettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Control Panel</h1>
        <p className="text-slate-500 mt-1">Manage the core configuration of your entire school platform.</p>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-3 text-primary-600" />
              General Settings
            </CardTitle>
            <CardDescription>Manage your school's identity and core academic calendar.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">School Name</p>
              <Input defaultValue="Prestige Worldwide Academy" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">School Logo</p>
              <div className="flex gap-2">
                <Input type="file" />
                <Button variant="secondary">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">Academic Year Start</p>
              <Input type="date" defaultValue="2025-09-01" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">Academic Year End</p>
              <Input type="date" defaultValue="2026-06-15" />
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-3 text-primary-600" />
              Security & Access
            </CardTitle>
            <CardDescription>Configure password policies, authentication, and session settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-semibold text-slate-800">Enforce Two-Factor Authentication (2FA)</p>
                <p className="text-sm text-slate-500">Require all staff members to use 2FA.</p>
              </div>
              <Checkbox aria-label="Enforce 2FA" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">Password Policy</p>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="strong">Strong</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">Session Timeout (minutes)</p>
                <Input type="number" defaultValue="60" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrations & API */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plug className="h-5 w-5 mr-3 text-primary-600" />
              Integrations & API
            </CardTitle>
            <CardDescription>Manage API keys and webhooks for connecting to external services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">API Keys</p>
              <Button variant="outline">
                <KeyRound className="h-4 w-4 mr-2" />
                Manage API Keys
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium">Webhook Endpoints</p>
              <Button variant="outline">
                <Plug className="h-4 w-4 mr-2" />
                Configure Webhooks
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-3 text-primary-600" />
              Data & Privacy
            </CardTitle>
            <CardDescription>Manage system backups and view audit logs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Backup</p>
                <p className="text-sm text-slate-500">Last backup: Today at 02:00 AM</p>
              </div>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Backup Now
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium">Audit Log</p>
              <Button variant="link">View Full Audit Log</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
