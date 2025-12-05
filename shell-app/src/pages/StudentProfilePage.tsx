import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  BookOpen,
  CheckSquare,
  FileText,
  Bell,
  Home,
  Backpack,
  File,
  Video,
  Image,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export const StudentProfilePage = () => {
  const { studentId } = useParams();
  const student = {
    name: "Sarah Johnson",
    id: studentId,
    grade: "10",
    avatar: "/avatars/01.png",
    status: "Active",
  };

  return (
    <div>
      <Link
        to="/dashboard/students"
        className="mb-4 inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Student Directory
      </Link>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="h-20 w-20 rounded-full border-4 border-white shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {student.name}
            </h1>
            <p className="mt-1 text-slate-500">
              Student ID: {student.id} • Grade: {student.grade}
            </p>
          </div>
        </div>
        <Badge variant="success" className="text-base">
          {student.status}
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-3 h-5 w-5 text-primary-500" />
                Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Detailed demographic, contact, and guardian information.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="mr-3 h-5 w-5 text-primary-500" />
                Guardian Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Contact details for parents or guardians.
              </p>
            </CardContent>
          </Card>
          <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-800">
                <Backpack className="mr-3 h-5 w-5" />
                Digital Backpack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-indigo-700/80">
                A portfolio of the student's best work and key submissions.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <File className="mr-2 h-4 w-4 text-indigo-600" />
                  <span>History Essay - Final.pdf</span>
                </div>
                <div className="flex items-center text-sm">
                  <Video className="mr-2 h-4 w-4 text-indigo-600" />
                  <span>Science Fair Project.mp4</span>
                </div>
                <div className="flex items-center text-sm">
                  <Image className="mr-2 h-4 w-4 text-indigo-600" />
                  <span>Art Class Submission.png</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-3 h-5 w-5 text-primary-500" />
                Enrolled Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                List of current and past courses, grades, and progress.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckSquare className="mr-3 h-5 w-5 text-primary-500" />
                Attendance Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Calendar or list view of attendance, absences, and tardies.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-3 h-5 w-5 text-primary-500" />
                Assessments & Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Standardized test scores, report cards, and other assessments.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-3 h-5 w-5 text-primary-500" />
                Behavioral Notes & IEP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Communication logs, behavioral notes, and IEP details.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
