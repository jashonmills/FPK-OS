import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { DollarSign, Users, BarChart, Settings, PlusCircle } from "lucide-react";

const mockSchools = [
  { name: "St. Josephs Mel NS", enrollment: 350, attendance: "94%", revenue: "€525,000" },
  { name: "Oakwood Academy", enrollment: 420, attendance: "92%", revenue: "€630,000" },
];

// --- MODALS ---
const TrustSettingsModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Trust-Wide Settings</DialogTitle>
        <DialogDescription>Manage global settings for all schools in the organization.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">Organization Name</Label>
          <Input id="org-name" defaultValue="Prestige Worldwide" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-logo">Organization Logo</Label>
          <Input id="org-logo" type="file" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-announcement">Global Announcement</Label>
          <Input id="org-announcement" placeholder="Announce something to all schools..." />
        </div>
      </div>
      <DialogFooter>
        <Button>Save & Apply</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const AddSchoolModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New School Wizard</DialogTitle>
        <DialogDescription>Provision a new school instance on the platform.</DialogDescription>
      </DialogHeader>
      <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg my-4">
        <p className="text-slate-500">A multi-step form for school details and admin creation would go here.</p>
      </div>
      <DialogFooter>
        <Button>Provision School</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const OrganizationHubPage = () => {
  const [activeModal, setActiveModal] = useState<null | "settings" | "addSchool">(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Multi-School Command Center</h1>
          <p className="text-slate-500 mt-1">
            Monitor and manage all schools within the Prestige Worldwide organization.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveModal("settings")}>
            <Settings className="h-4 w-4 mr-2" />
            Trust Settings
          </Button>
          <Button onClick={() => setActiveModal("addSchool")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New School
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€1,155,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollment</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">770</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <BarChart className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">93%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Managed Schools</CardTitle>
          <CardDescription>Overview of each school in your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School Name</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSchools.map((s) => (
                <TableRow key={s.name}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.enrollment}</TableCell>
                  <TableCell>{s.attendance}</TableCell>
                  <TableCell>{s.revenue}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Dashboard
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <TrustSettingsModal open={activeModal === "settings"} onOpenChange={() => setActiveModal(null)} />
      <AddSchoolModal open={activeModal === "addSchool"} onOpenChange={() => setActiveModal(null)} />
    </div>
  );
};

export default OrganizationHubPage;
