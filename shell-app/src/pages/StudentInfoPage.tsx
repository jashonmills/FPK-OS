import { FileText, Users, BarChart2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { StudentDirectory } from "../components/sis/StudentDirectory";
import { AdmissionsDashboard } from "../components/sis/AdmissionsDashboard";
import { AnalyticsDashboard } from "../components/sis/AnalyticsDashboard";

export const StudentInfoPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Student Information System
        </h1>
        <p className="mt-1 text-slate-500">
          Oversee your institution&apos;s complete student lifecycle, from
          admissions to analytics.
        </p>
      </div>

      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="grid h-12 w-full grid-cols-3 rounded-lg bg-slate-100/80 p-1.5">
          <TabsTrigger value="directory" className="text-sm font-semibold">
            <Users className="mr-2 h-4 w-4" /> Student Directory
          </TabsTrigger>
          <TabsTrigger value="admissions" className="text-sm font-semibold">
            <FileText className="mr-2 h-4 w-4" /> Enrollment & Admissions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm font-semibold">
            <BarChart2 className="mr-2 h-4 w-4" /> Analytics & Reporting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="mt-6">
          <StudentDirectory />
        </TabsContent>
        <TabsContent value="admissions" className="mt-6">
          <AdmissionsDashboard />
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentInfoPage;
