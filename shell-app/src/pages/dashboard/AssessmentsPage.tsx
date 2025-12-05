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
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  BarChart,
  Target,
  FileWarning,
  Edit,
  Send,
  Bot,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";

const mockItemAnalysis = [
  {
    question: "Q7: Algebra - Quadratic Equations",
    correctRate: "48%",
    flagged: true,
    subject: "Math",
  },
  {
    question: "Q3: Reading Comprehension - Main Idea",
    correctRate: "92%",
    flagged: false,
    subject: "English",
  },
  {
    question: "Q12: Chemistry - Balancing Reactions",
    correctRate: "55%",
    flagged: true,
    subject: "Science",
  },
];

const mockReportCardData = {
  studentName: "Sarah Johnson",
  grade: 10,
  term: "Fall 2025",
  courses: [
    {
      name: "Algebra II",
      grade: "B+",
      score: 88,
      comments:
        "Sarah shows strong potential but should review homework more consistently.",
    },
    {
      name: "World History",
      grade: "A",
      score: 95,
      comments: "Excellent participation and insightful essays.",
    },
    {
      name: "Chemistry I",
      grade: "B-",
      score: 81,
      comments: "Struggled with stoichiometry but improved significantly.",
    },
  ],
};

const GrowthTrajectoryChart = () => (
  <div className="flex h-80 w-full items-center justify-center rounded-lg bg-slate-50 p-4">
    <p className="text-slate-500">
      A sophisticated line chart showing actual vs. projected growth for
      different classes would be rendered here.
    </p>
  </div>
);

const ReportCardPreview = ({ data }: { data: typeof mockReportCardData }) => (
  <div className="rounded-lg border bg-white p-8 shadow-inner">
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h3 className="text-2xl font-bold">{data.studentName}</h3>
        <p className="text-slate-600">
          Grade {data.grade} - {data.term}
        </p>
      </div>
      <div className="h-12 w-24 rounded bg-slate-200" />
    </div>
    <div className="mt-6 space-y-4">
      {data.courses.map((course) => (
        <div key={course.name} className="grid grid-cols-4 items-start gap-4">
          <p className="col-span-1 font-semibold">{course.name}</p>
          <p className="col-span-2 text-slate-600">{course.comments}</p>
          <div className="col-span-1 text-right">
            <span className="text-lg font-bold">{course.grade}</span>
            <span className="ml-2 text-slate-500">({course.score}%)</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AssessmentsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Academic Intelligence Center
        </h1>
        <p className="mt-1 text-slate-500">
          From macro trends to individual student growth, turn assessment data
          into action.
        </p>
      </div>

      <Tabs defaultValue="command" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-3 bg-slate-200/60 p-1">
          <TabsTrigger value="command" className="py-2 text-sm">
            <BarChart className="mr-2 h-4 w-4" />
            Assessment Command
          </TabsTrigger>
          <TabsTrigger value="studio" className="py-2 text-sm">
            <Edit className="mr-2 h-4 w-4" />
            Report Card Studio
          </TabsTrigger>
          <TabsTrigger value="analysis" className="py-2 text-sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Longitudinal Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="command" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-3 h-5 w-5 text-primary-600" />
                  Class Growth Trajectory
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Actual vs. Projected Performance for Fall 2025
                </p>
              </CardHeader>
              <CardContent>
                <GrowthTrajectoryChart />
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileWarning className="mr-3 h-5 w-5 text-amber-600" />
                  Automated Item Analysis
                </CardTitle>
                <p className="text-sm text-slate-500">
                  AI-flagged concepts where students are struggling most across
                  recent tests.
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question/Concept</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-right">Success Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockItemAnalysis.map((item) => (
                      <TableRow
                        key={item.question}
                        className={item.flagged ? "bg-amber-50" : ""}
                      >
                        <TableCell className="font-medium">
                          {item.question}
                        </TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell className="text-right font-mono">
                          {item.correctRate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="studio" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Studio Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">Load Grade 10 Roster</Button>
                  <Button variant="outline" className="w-full">
                    Select Template: Standard HS
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-blue-200 bg-blue-50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <Bot className="mr-3 h-5 w-5" />
                    AI Comment Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-blue-800">
                    For: &apos;Chemistry I&apos; (B-)
                  </p>
                  <p className="mb-3 text-xs text-blue-600">
                    Suggested Comments:
                  </p>
                  <div className="space-y-2">
                    <button className="w-full rounded-md bg-blue-100 p-2 text-left text-sm hover:bg-blue-200">
                      "Shows strong effort, but needs to review lab procedures."
                    </button>
                    <button className="w-full rounded-md bg-blue-100 p-2 text-left text-sm hover:bg-blue-200">
                      "Improving steadily, especially in understanding chemical bonds."
                    </button>
                  </div>
                </CardContent>
              </Card>
              <Button size="lg" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Distribute All to Parent Portal
              </Button>
            </div>
            <div className="col-span-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Live Preview: Sarah Johnson</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReportCardPreview data={mockReportCardData} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Cohort Performance Over Time</CardTitle>
              <p className="text-sm text-slate-500">
                Track a single graduating class&apos;s standardized test scores
                as they progress through the school.
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-4 rounded-lg border bg-slate-50 p-4">
                <label className="font-medium">Select Cohort:</label>
                <Button variant="secondary">
                  Class of 2028{" "}
                  <SlidersHorizontal className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-slate-600">Currently in Grade 10</p>
              </div>
              <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-slate-50 p-4">
                <p className="text-slate-500">
                  A multi-year line chart showing this cohort&apos;s performance
                  from 2022-2025 would be rendered here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssessmentsPage;
