import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectPortal,
} from "../ui/select";
import { Users, BarChart, PieChart, TrendingUp, Download } from "lucide-react";

const kpiCards = [
  { title: "Total Active Students", value: "1,284", icon: <Users />, change: "+12 since last month" },
  { title: "Avg. Daily Attendance", value: "94.7%", icon: <BarChart />, change: "-0.2% vs last week" },
  { title: "Enrollment by Grade", value: "View Chart", icon: <PieChart />, change: "Grade 10 has most students" },
  { title: "Withdrawal Rate", value: "2.1%", icon: <TrendingUp className="text-red-500" />, change: "+0.5% vs last year" },
];

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {kpi.title}
              </CardTitle>
              <div className="text-slate-400">{kpi.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-slate-500">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle>Enrollment Trends by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              A line chart showing student enrollment over the past 12 months
              would be rendered here.
            </p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle>Student Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Pie charts or bar charts showing student demographics would be
              rendered here.
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-500">
            Generate and export custom reports for state funding, internal
            audits, or specific inquiries.
          </p>
          <div className="flex flex-wrap items-end gap-4 rounded-lg border bg-slate-50 p-4">
            <div className="min-w-[150px] flex-1 space-y-1.5">
              <label className="text-sm font-medium">Data Set</label>
              <Select defaultValue="attendance">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="grades">Grades</SelectItem>
                  </SelectContent>
                </SelectPortal>
              </Select>
            </div>
            <div className="min-w-[150px] flex-1 space-y-1.5">
              <label className="text-sm font-medium">Filters</label>
              <Select defaultValue="grade-10">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent>
                    <SelectItem value="grade-10">Grade 10</SelectItem>
                  </SelectContent>
                </SelectPortal>
              </Select>
            </div>
            <div className="min-w-[150px] flex-1 space-y-1.5">
              <label className="text-sm font-medium">Group By</label>
              <Select defaultValue="student">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </SelectPortal>
              </Select>
            </div>
            <Button className="bg-primary-600 text-white hover:bg-primary-700">
              <Download className="mr-2 h-4 w-4" />
              Generate & Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
