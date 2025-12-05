import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";
import {
  Bot,
  Search,
  AlertTriangle,
  Sparkles,
  UserX,
  FileWarning,
  DollarSign,
  ArrowRight,
} from "lucide-react";

// --- ADVANCED MOCK DATA & COMPONENTS ---
const mockBriefingItems = [
  { id: "absences", icon: <UserX className="text-red-500" />, title: "3 Unexplained Absences Today", description: "Requires guardian contact." },
  { id: "invoices", icon: <DollarSign className="text-amber-500" />, title: "€6,200 in Overdue Invoices", description: "4 invoices are more than 30 days past due." },
  { id: "concept", icon: <FileWarning className="text-blue-500" />, title: "Low Success on Math Concept", description: "48% success rate on 'Quadratic Equations'." },
];
const mockProactiveCards = [
  {
    id: "stem",
    type: "Opportunity",
    icon: <Sparkles className="text-green-500" />,
    title: "High-Achievers in STEM",
    description: "5 students in Grade 9 are excelling in both Math and Science. Consider recommending them for the Advanced STEM program.",
    action: "View Students",
  },
  {
    id: "history",
    type: "Risk",
    icon: <AlertTriangle className="text-red-500" />,
    title: "History Exam Performance Dip",
    description: "The average grade for the mid-term History exam was 15% lower than the previous year.",
    action: "Analyze Report",
  },
];

// --- MODAL COMPONENTS ---
const AbsencesModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Unexplained Absences</DialogTitle>
        <DialogDescription>Select students to contact their guardians.</DialogDescription>
      </DialogHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">
              <Checkbox aria-label="Select all" />
            </TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-center">
              <Checkbox aria-label="Select Chloe Garcia" />
            </TableCell>
            <TableCell>Chloe Garcia</TableCell>
            <TableCell>10</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center">
              <Checkbox aria-label="Select Sean Kelly" />
            </TableCell>
            <TableCell>Sean Kelly</TableCell>
            <TableCell>9</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center">
              <Checkbox aria-label="Select Michael O'Brien" />
            </TableCell>
            <TableCell>Michael O'Brien</TableCell>
            <TableCell>11</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <DialogFooter>
        <Button className="w-full sm:w-auto">Contact 3 Guardians</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const InvoicesModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Overdue Invoices</DialogTitle>
        <DialogDescription>Send reminders for overdue payments.</DialogDescription>
      </DialogHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">
              <Checkbox aria-label="Select all invoices" />
            </TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Days Overdue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-center">
              <Checkbox aria-label="Select invoice Michael" />
            </TableCell>
            <TableCell>Michael O’Brien</TableCell>
            <TableCell>€1,550.00</TableCell>
            <TableCell>12</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center">
              <Checkbox aria-label="Select invoice Emma" />
            </TableCell>
            <TableCell>Emma Walsh</TableCell>
            <TableCell>€75.00</TableCell>
            <TableCell>5</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center">
              <Checkbox aria-label="Select invoice Liam" />
            </TableCell>
            <TableCell>Liam Byrne</TableCell>
            <TableCell>€820.00</TableCell>
            <TableCell>31</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <DialogFooter>
        <Button className="w-full sm:w-auto">Send 3 Reminders</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const StemStudentsModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>High-Achievers in STEM</DialogTitle>
        <DialogDescription>These students show strong potential in Math and Science.</DialogDescription>
      </DialogHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Fionn Boyle</TableCell>
            <TableCell>9</TableCell>
            <TableCell>
              <Button variant="link" size="sm">
                View Profile <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Amelia Grant</TableCell>
            <TableCell>9</TableCell>
            <TableCell>
              <Button variant="link" size="sm">
                View Profile <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Keelan Murphy</TableCell>
            <TableCell>9</TableCell>
            <TableCell>
              <Button variant="link" size="sm">
                View Profile <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DialogContent>
  </Dialog>
);

const HistoryReportModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>History Exam Performance Analysis</DialogTitle>
        <DialogDescription>Comparison of grade distribution between Fall 2024 and Fall 2025.</DialogDescription>
      </DialogHeader>
      <div className="h-80 w-full bg-slate-50 rounded-lg flex items-center justify-center p-4">
        <p className="text-slate-500">
          A side-by-side bar chart comparing grade distributions would be rendered here.
        </p>
      </div>
    </DialogContent>
  </Dialog>
);

export const AICoachPage = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Ask anything... e.g., 'Show me all students with >10 absences and a failing grade in Math'"
          className="w-full h-14 pl-12 pr-4 text-base rounded-xl shadow-lg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-3 text-primary-600" />
                Your Morning Briefing
              </CardTitle>
              <CardDescription>Top cross-functional priorities for today.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {mockBriefingItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveModal(item.id)}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-slate-800">Proactive Insights</h2>
          {mockProactiveCards.map((card) => (
            <Card
              key={card.id}
              className={`shadow-sm border-l-4 ${card.type === "Risk" ? "border-red-500" : "border-green-500"}`}
            >
              <CardHeader className="flex flex-row items-start gap-4 pb-4">
                <div className="mt-1">{card.icon}</div>
                <div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription className="mt-1">{card.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setActiveModal(card.id)}>{card.action}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* --- RENDER MODALS --- */}
      <AbsencesModal open={activeModal === "absences"} onOpenChange={() => setActiveModal(null)} />
      <InvoicesModal open={activeModal === "invoices"} onOpenChange={() => setActiveModal(null)} />
      <StemStudentsModal open={activeModal === "stem"} onOpenChange={() => setActiveModal(null)} />
      <HistoryReportModal open={activeModal === "history"} onOpenChange={() => setActiveModal(null)} />
    </div>
  );
};

export default AICoachPage;
