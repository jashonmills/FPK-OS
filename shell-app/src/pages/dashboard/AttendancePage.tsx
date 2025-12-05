import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import {
  Calendar,
  FileText,
  Download,
  Filter,
  AlertTriangle,
  UserX,
  Inbox,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  MessageSquare,
  History,
  FilePlus,
  Send,
} from "lucide-react";

const dailyAttendanceData = [
  { id: "S001", name: "Sarah Johnson", grade: 10, status: "Present", notes: "", time: "08:55" },
  { id: "S002", name: "Michael O’Brien", grade: 11, status: "Absent", notes: "Parent called, sick.", time: null },
  { id: "S003", name: "Emma Walsh", grade: 9, status: "Late", notes: "Arrived at 9:15 AM", time: "09:15" },
  { id: "S004", name: "David Chen", grade: 12, status: "Present", notes: "", time: "08:58" },
  { id: "S005", name: "Chloe Garcia", grade: 10, status: "Absent", notes: "Unexplained", time: null },
  { id: "S006", name: "Sean Kelly", grade: 9, status: "Absent", notes: "Unexplained", time: null },
];

const tuslaCaseFiles = [
  { caseId: "CF001", studentName: "Chloe Garcia", daysAbsent: 21, status: "Pending Report", lastAction: "Flagged by system", nextStep: "Generate & Send Report" },
  { caseId: "CF002", studentName: "Liam Murphy", daysAbsent: 25, status: "Report Sent", lastAction: "Report sent on 2025-11-28", nextStep: "Awaiting TUSLA confirmation" },
  { caseId: "CF003", studentName: "Fionn Boyle", daysAbsent: 32, status: "Resolved", lastAction: "Intervention plan successful", nextStep: "Monitor" },
];

const statusBadge = (status: string) => {
  if (status === "Present") return "success";
  if (status === "Late") return "warning";
  return "destructive";
};

const caseStatusBadge = (status: string) => {
  if (status === "Pending Report") return "destructive";
  if (status === "Report Sent") return "warning";
  return "success";
};

const ContactGuardiansModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[650px]">
      <DialogHeader>
        <DialogTitle>Contact Guardians: Unexplained Absences</DialogTitle>
        <DialogDescription>
          Contact guardians for Chloe Garcia and Sean Kelly. All communications
          will be logged automatically.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-6 py-4">
        {[
          { name: "Chloe Garcia", grade: "10", guardian: "Maria Garcia (Mother)" },
          { name: "Sean Kelly", grade: "9", guardian: "David Kelly (Father)" },
        ].map((student) => (
          <div key={student.name} className="space-y-4 rounded-lg border p-4">
            <h4 className="font-semibold">
              {student.name} (Grade {student.grade})
            </h4>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">{student.guardian}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Message Template..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unexplained-absence">
                  Template: Unexplained Absence
                </SelectItem>
                <SelectItem value="attendance-concern">
                  Template: General Attendance Concern
                </SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Or write a custom message..." rows={3} />
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Send & Log SMS
            </Button>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

const EditAttendanceModal = ({
  record,
  onClose,
}: {
  record: typeof dailyAttendanceData[number];
  onClose: () => void;
}) => (
  <Dialog open={!!record} onOpenChange={(o) => !o && onClose()}>
    {record && (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Attendance Record</DialogTitle>
          <DialogDescription>
            Editing record for <span className="font-semibold">{record.name}</span>{" "}
            on <span className="font-semibold">Dec 5, 2025</span>. Changes will be
            logged.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Attendance Status
            </label>
            <Select defaultValue={record.status}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason for Change (Required)
            </label>
            <Input
              id="reason"
              placeholder="e.g., Parent called to report sickness."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Additional Notes
            </label>
            <Textarea
              id="notes"
              defaultValue={record.notes}
              placeholder="Add any relevant details..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" size="lg" onClick={onClose}>
            Save & Log Change
          </Button>
        </DialogFooter>
      </DialogContent>
    )}
  </Dialog>
);

const ViewCaseFileModal = ({
  caseFile,
  onClose,
}: {
  caseFile: typeof tuslaCaseFiles[number] | null;
  onClose: () => void;
}) => (
  <Dialog open={!!caseFile} onOpenChange={(o) => !o && onClose()}>
    {caseFile && (
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            TUSLA Case File: {caseFile.studentName}
          </DialogTitle>
          <div className="flex items-center gap-4 pt-1">
            <Badge variant={caseStatusBadge(caseFile.status)}>
              {caseFile.status}
            </Badge>
            <p className="text-sm text-slate-500">Case ID: {caseFile.caseId}</p>
          </div>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-4">
            <h4 className="font-semibold text-slate-800">Case History</h4>
            <div className="space-y-4 border-l-2 pl-4 text-xs text-slate-600">
              <p>
                <span className="font-semibold">2025-12-05:</span> System flagged
                student (21 days absent).
              </p>
              <p>
                <span className="font-semibold">2025-11-20:</span> Automated
                attendance concern email sent.
              </p>
              <p>
                <span className="font-semibold">2025-11-10:</span> Teacher logged
                concern about frequent absences.
              </p>
            </div>
          </div>
          <div className="col-span-2 space-y-6">
            <div>
              <h4 className="mb-2 font-semibold text-slate-800">
                Attendance Visualization
              </h4>
              <div className="flex h-32 w-full items-center justify-center rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  A calendar or chart visualizing {caseFile.studentName}&apos;s
                  absences would be here.
                </p>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-slate-800">Action Panel</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto justify-start p-4"
                >
                  <FilePlus className="mr-3 h-5 w-5" />
                  <div>
                    <p className="font-semibold">Log Intervention</p>
                    <p className="text-xs font-normal text-slate-500">
                      Add a note, call log, or meeting.
                    </p>
                  </div>
                </Button>
                <Button className="h-auto justify-start bg-primary-600 p-4 text-white hover:bg-primary-700">
                  <Download className="mr-3 h-5 w-5" />
                  <div>
                    <p className="font-semibold">Generate TUSLA Report</p>
                    <p className="text-xs font-normal text-slate-200">
                      Create the official PDF for submission.
                    </p>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    )}
  </Dialog>
);

export const AttendancePage = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [activeRecord, setActiveRecord] =
    useState<(typeof dailyAttendanceData)[number] | null>(null);
  const [activeCaseFile, setActiveCaseFile] =
    useState<(typeof tuslaCaseFiles)[number] | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Attendance Command Center
        </h1>
        <p className="mt-1 text-slate-500">
          Intelligent insights, interactive tools, and automated compliance for
          attendance management.
        </p>
      </div>

      <Tabs defaultValue="intelligence" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-3 bg-slate-200/60 p-1">
          <TabsTrigger value="intelligence" className="py-2 text-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Attendance Intelligence
          </TabsTrigger>
          <TabsTrigger value="rollcall" className="py-2 text-sm">
            <Calendar className="mr-2 h-4 w-4" />
            Interactive Roll Call
          </TabsTrigger>
          <TabsTrigger value="compliance" className="py-2 text-sm">
            <FileText className="mr-2 h-4 w-4" />
            Compliance Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="intelligence" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Inbox className="mr-3 h-5 w-5 text-primary-600" />
                Your Daily Briefing
              </CardTitle>
              <CardDescription>
                Top attendance priorities for today, December 5, 2025.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-sm">
                <div className="mr-4 text-primary-600">
                  <UserX size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">
                    2 Unexplained Absences
                  </h4>
                  <p className="text-sm text-slate-600">
                    Chloe Garcia and Sean Kelly are marked absent without
                    explanation.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-primary-600 hover:text-primary-700"
                  onClick={() => setContactOpen(true)}
                >
                  Contact Guardians
                </Button>
              </div>
              <div className="flex items-start rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-sm">
                <div className="mr-4 text-amber-600">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">
                    1 Student Nearing Threshold
                  </h4>
                  <p className="text-sm text-slate-600">
                    Fionn Boyle has 18 absences and is approaching the TUSLA
                    reporting limit.
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  View Profile
                </Button>
              </div>
              <div className="flex items-start rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-sm">
                <div className="mr-4 text-red-500">
                  <TrendingDown size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">
                    Grade 9 Attendance Dip
                  </h4>
                  <p className="text-sm text-slate-600">
                    Attendance in Grade 9 has dropped by 3% this week.
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Analyze Trend
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Overall Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">96.8%</div>
                <p className="text-sm text-slate-500">
                  <TrendingUp className="mr-1 inline h-4 w-4 text-green-500" />
                  +0.2% vs last week
                </p>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Chronic Absenteeism (&gt;10%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <p className="text-sm text-slate-500">Students at risk</p>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Perfect Attendance Streaks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">124</div>
                <p className="text-sm text-slate-500">
                  Students with 100% this term
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rollcall" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Roll Call for December 5, 2025</CardTitle>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Present</DropdownMenuItem>
                      <DropdownMenuItem>Absent</DropdownMenuItem>
                      <DropdownMenuItem>Late</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline">Bulk Actions</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Time</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyAttendanceData.map((s) => (
                    <TableRow key={s.id} className="hover:bg-slate-50">
                      <TableCell className="font-mono text-xs">
                        {s.time || "---"}
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.grade}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadge(s.status)}>
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {s.notes}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveRecord(s)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card className="border-blue-200 bg-blue-50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-900">
                TUSLA Compliance Automation Hub
              </CardTitle>
              <CardDescription className="text-blue-700">
                This hub automatically creates and tracks case files for
                students exceeding 20 days of absence, ensuring a complete audit
                trail.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Case Files</CardTitle>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export All Case Histories
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Days Absent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Step</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tuslaCaseFiles.map((c) => (
                    <TableRow key={c.caseId} className="hover:bg-slate-50">
                      <TableCell className="font-mono text-xs">
                        {c.caseId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {c.studentName}
                      </TableCell>
                      <TableCell>{c.daysAbsent}</TableCell>
                      <TableCell>
                        <Badge variant={caseStatusBadge(c.status)}>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {c.nextStep}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveCaseFile(c)}
                        >
                          View Case File
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ContactGuardiansModal
        open={contactOpen}
        onOpenChange={setContactOpen}
      />
      {activeRecord && (
        <EditAttendanceModal
          record={activeRecord}
          onClose={() => setActiveRecord(null)}
        />
      )}
      <ViewCaseFileModal
        caseFile={activeCaseFile}
        onClose={() => setActiveCaseFile(null)}
      />
    </div>
  );
};

export default AttendancePage;
