import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  MoreHorizontal,
  Search,
  Filter,
  List,
  LayoutGrid,
  User,
  Mail,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const mockStudents = [
  {
    id: "S001",
    name: "Sarah Johnson",
    grade: "10",
    pps: "1234567A",
    status: "Active",
    risk: "Low",
    avatar: "/avatars/01.png",
  },
  {
    id: "S002",
    name: "Michael O’Brien",
    grade: "11",
    pps: "7654321B",
    status: "Active",
    risk: "Low",
    avatar: "/avatars/02.png",
  },
  {
    id: "S003",
    name: "Emma Walsh",
    grade: "9",
    pps: "9876543C",
    status: "At Risk",
    risk: "High",
    avatar: "/avatars/03.png",
  },
  {
    id: "S004",
    name: "David Chen",
    grade: "12",
    pps: "1122334D",
    status: "Withdrawn",
    risk: "N/A",
    avatar: "/avatars/04.png",
  },
  {
    id: "S005",
    name: "Chloe Garcia",
    grade: "10",
    pps: "4455667E",
    status: "Active",
    risk: "Low",
    avatar: "/avatars/05.png",
  },
];

const StudentCard = ({ student, navigate }: any) => (
  <div
    className="flex cursor-pointer flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
    onClick={() => navigate(`/dashboard/students/${student.id}`)}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <img
          src={student.avatar}
          alt={student.name}
          className="h-12 w-12 rounded-full"
        />
        <div>
          <h3 className="font-bold text-slate-800">{student.name}</h3>
          <p className="text-sm text-slate-500">Grade {student.grade}</p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/students/${student.id}`);
            }}
          >
            View Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className="mt-4 space-y-2 text-sm">
      <div className="flex items-center text-slate-600">
        <User className="mr-2 h-4 w-4 text-slate-400" />
        <span>ID: {student.id}</span>
      </div>
      <div className="flex items-center text-slate-600">
        <Mail className="mr-2 h-4 w-4 text-slate-400" />
        <span>PPS: {student.pps}</span>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <Badge
        variant={
          student.status === "Active"
            ? "success"
            : student.status === "Withdrawn"
            ? "secondary"
            : "destructive"
        }
      >
        {student.status}
      </Badge>
      <Badge
        variant={
          student.risk === "Low"
            ? "default"
            : student.risk === "High"
            ? "destructive"
            : "secondary"
        }
        className="font-mono text-xs"
      >
        {student.risk}
      </Badge>
    </div>
  </div>
);

export const StudentDirectory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");

  const filteredStudents = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pps.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name, PPS number, or student ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="flex items-center bg-amber-500 text-white hover:bg-amber-600">
            <AlertTriangle className="mr-2 h-4 w-4" /> At-Risk Students
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="all-grades">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-grades">All Grades</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-status">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Statuses</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="hidden sm:flex">
            <Filter className="mr-2 h-4 w-4" /> More Filters
          </Button>
          <div className="flex items-center rounded-md bg-slate-100 p-1">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {view === "list" ? (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>PPS Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Risk</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => navigate(`/dashboard/students/${student.id}`)}
                >
                  <TableCell className="flex items-center space-x-3 font-medium">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span>{student.name}</span>
                  </TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.pps}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "Active"
                          ? "success"
                          : student.status === "Withdrawn"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.risk === "Low"
                          ? "default"
                          : student.risk === "High"
                          ? "destructive"
                          : "secondary"
                      }
                      className="font-mono text-xs"
                    >
                      {student.risk}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/students/${student.id}`);
                          }}
                        >
                          View Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
};
