import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, UserPlus, Download } from "lucide-react";
import { useOrgStudents } from "@/hooks/useOrgStudents";
import { useOrgMembers } from "@/hooks/useOrgMembers";
import { AddStudentDialog } from "@/components/students/AddStudentDialog";
import { StudentsTable } from "@/components/students/StudentsTable";
import { toast } from "sonner";

export default function StudentsManagementNew() {
  const { orgId } = useParams<{ orgId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    students,
    isLoading: studentsLoading,
    createStudent,
    updateStudent,
    deleteStudent,
    isCreating,
  } = useOrgStudents(orgId!, searchQuery);

  const { members } = useOrgMembers();

  // Filter students based on status
  const filteredStudents = students.filter(student => {
    if (statusFilter === "all") return true;
    if (statusFilter === "linked") return !!student.linked_user_id;
    if (statusFilter === "unlinked") return !student.linked_user_id;
    return student.status === statusFilter;
  });

  // Get stats
  const totalStudents = students.length;
  const linkedStudents = students.filter(s => s.linked_user_id).length;
  const activeMembers = members.filter(m => m.role === 'student').length;

  const handleAddStudent = (studentData: any) => {
    createStudent(studentData);
  };

  const handleEditStudent = (student: any) => {
    // TODO: Implement edit dialog
    toast.info("Edit functionality coming soon");
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm("Are you sure you want to remove this student?")) {
      deleteStudent(studentId);
    }
  };

  const handleSendInvite = (student: any) => {
    // TODO: Implement invite functionality
    toast.info("Invite functionality coming soon");
  };

  const handleBulkImport = () => {
    // TODO: Implement CSV bulk import
    toast.info("Bulk import functionality coming soon");
  };

  if (!orgId) {
    return (
      <PageShell>
        <div className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Organization not found</p>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="p-6 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Students</h1>
            <p className="text-muted-foreground">
              Manage your organization's student roster and profiles
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBulkImport}>
              <Download className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Students
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Student profiles in organization
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{linkedStudents}</div>
              <p className="text-xs text-muted-foreground">
                Students with active accounts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activation Rate</CardTitle>
              <Badge variant="outline" className="px-2 py-1">
                {totalStudents > 0 ? Math.round((linkedStudents / totalStudents) * 100) : 0}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents - linkedStudents}</div>
              <p className="text-xs text-muted-foreground">
                Pending account activation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Student Roster</CardTitle>
            <CardDescription>
              Search and filter your student profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <Input
                className="max-w-xs"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="linked">Active Accounts</SelectItem>
                  <SelectItem value="unlinked">Profile Only</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {studentsLoading ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">Loading students...</div>
              </div>
            ) : (
              <StudentsTable
                students={filteredStudents}
                onEditStudent={handleEditStudent}
                onDeleteStudent={handleDeleteStudent}
                onSendInvite={handleSendInvite}
              />
            )}
          </CardContent>
        </Card>

        <AddStudentDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={handleAddStudent}
          isLoading={isCreating}
        />
      </div>
    </PageShell>
  );
}