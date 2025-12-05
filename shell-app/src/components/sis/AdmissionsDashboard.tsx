import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Progress } from "../ui/progress";
import {
  Plus,
  FileCheck,
  Send,
  UserCheck,
  UserPlus,
} from "lucide-react";

const funnelStages = [
  {
    title: "Applications Received",
    count: 12,
    icon: <FileCheck className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Documents Verified",
    count: 9,
    icon: <UserCheck className="h-6 w-6 text-yellow-500" />,
  },
  {
    title: "Offers Extended",
    count: 9,
    icon: <Send className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Offers Accepted",
    count: 7,
    icon: <UserPlus className="h-6 w-6 text-purple-500" />,
  },
];

const recentApplicants = [
  { id: "A012", name: "Liam Byrne", status: "Docs Pending", checklistProgress: 40 },
  { id: "A011", name: "Aoife Murphy", status: "Offer Extended", checklistProgress: 80 },
  { id: "A010", name: "Cian Sullivan", status: "Enrolled", checklistProgress: 100 },
];

export const AdmissionsDashboard = () => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-700">Admissions Funnel</h2>
        <Button className="bg-primary-600 text-white hover:bg-primary-700">
          <Plus className="mr-2 h-4 w-4" /> New Application
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {funnelStages.map((stage) => (
          <Card key={stage.title} className="transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stage.title}
              </CardTitle>
              {stage.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stage.count}</div>
              <p className="text-xs text-slate-500">in this stage</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Recent Applications
        </h3>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Checklist Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApplicants.map((app) => (
                <TableRow key={app.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>{app.status}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Progress value={app.checklistProgress} className="mr-2 w-40" />
                      <span>{app.checklistProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Checklist
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
