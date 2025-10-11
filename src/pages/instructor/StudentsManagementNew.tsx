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
import { useOrgContext } from "@/components/organizations/OrgContext";
import { AddStudentDialog } from "@/components/students/AddStudentDialog";
import { EditStudentDialog } from "@/components/students/EditStudentDialog";
import { StudentsTable } from "@/components/students/StudentsTable";
import { GenerateActivationLinkDialog } from "@/components/students/GenerateActivationLinkDialog";
import { StudentActivityHeatmap } from "@/components/students/StudentActivityHeatmap";
import { ImportStudentsCSV } from "@/components/students/ImportStudentsCSV";
import { StudentEmailConfirmationDialog } from "@/components/students/StudentEmailConfirmationDialog";
import { useEmailInvitation } from "@/hooks/useInvitationSystem";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { OrgStudent } from "@/hooks/useOrgStudents";
export default function StudentsManagementNew() {
  const {
    orgId
  } = useParams<{
    orgId: string;
  }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<OrgStudent | null>(null);
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [newlyCreatedStudent, setNewlyCreatedStudent] = useState<OrgStudent | null>(null);
  const isMobile = useIsMobile();
  const {
    currentOrg
  } = useOrgContext();
  const {
    students,
    isLoading: studentsLoading,
    createStudent,
    createStudentAsync,
    updateStudent,
    deleteStudent,
    isCreating,
    isUpdating
  } = useOrgStudents(orgId || '', searchQuery);
  const {
    members
  } = useOrgMembers();

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
  const handleAddStudent = async (studentData: any) => {
    try {
      const createdStudent = await createStudentAsync(studentData);
      if (createdStudent) {
        setNewlyCreatedStudent(createdStudent as OrgStudent);
        setShowEmailConfirmation(true);
      }
    } catch (error) {
      // Error handling is already done in the mutation
      console.error('Error creating student:', error);
    }
  };
  const handleEditStudent = (student: OrgStudent) => {
    setSelectedStudent(student);
    setShowEditDialog(true);
  };
  const handleUpdateStudent = (data: Partial<OrgStudent> & {
    id: string;
  }) => {
    updateStudent(data);
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
  const handleGenerateActivationLink = (student: OrgStudent) => {
    setSelectedStudent(student);
    setShowActivationDialog(true);
  };
  const handleBulkImport = () => {
    setShowImportCSV(true);
  };
  // Invite dialog removed - use email invitations instead

  // Check orgId after all hooks have been called
  if (!orgId) {
    return <PageShell>
        <div className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Organization not found</p>
          </div>
        </div>
      </PageShell>;
  }
  return <PageShell>
      <div className={cn("space-y-4 org-background viewport-constrain", isMobile ? "p-3" : "p-6 space-y-6")}>
        <header className={cn("flex justify-between gap-4", isMobile && "flex-col items-start space-y-3")}>
          <div className={isMobile ? "w-full" : ""}>
            <h1 className="text-xl sm:text-2xl font-bold">Students</h1>
            <p className="text-sm text-muted-foreground">
              Manage your organization's student roster and profiles
            </p>
          </div>
          <div className={cn("flex gap-2", isMobile && "w-full mobile-button-group")}>
            <Button variant="outline" onClick={handleBulkImport} className={cn(isMobile && "flex-1 min-w-0")}>
              <Download className="h-4 w-4 mr-1 sm:mr-2" />
              {isMobile ? "Import" : "Import CSV"}
            </Button>
            
            <Button onClick={() => setShowAddDialog(true)} className={cn(isMobile && "flex-1 min-w-0")}>
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              {isMobile ? "Add" : "Add Student"}
            </Button>
          </div>
        </header>

        {/* Student Activity Heatmap */}
        <StudentActivityHeatmap orgId={orgId} className="mb-6" />

        {/* Stats Cards */}
        <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3 gap-4")}>
          <Card className="org-tile">
            <CardHeader className={cn("flex flex-row items-center justify-between space-y-0", isMobile ? "pb-2 px-4 pt-4" : "pb-2")}>
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className={isMobile ? "px-4 pb-4" : ""}>
              <div className={cn("font-bold", isMobile ? "text-xl" : "text-2xl")}>{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Student profiles in organization
              </p>
            </CardContent>
          </Card>
          <Card className="org-tile">
            <CardHeader className={cn("flex flex-row items-center justify-between space-y-0", isMobile ? "pb-2 px-4 pt-4" : "pb-2")}>
              <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className={isMobile ? "px-4 pb-4" : ""}>
              <div className={cn("font-bold", isMobile ? "text-xl" : "text-2xl")}>{linkedStudents}</div>
              <p className="text-xs text-muted-foreground">
                Students with active accounts
              </p>
            </CardContent>
          </Card>
          <Card className="org-tile">
            <CardHeader className={cn("flex flex-row items-center justify-between space-y-0", isMobile ? "pb-2 px-4 pt-4" : "pb-2")}>
              <CardTitle className="text-sm font-medium">Activation Rate</CardTitle>
              <Badge variant="outline" className="px-2 py-1 text-xs">
                {totalStudents > 0 ? Math.round(linkedStudents / totalStudents * 100) : 0}%
              </Badge>
            </CardHeader>
            <CardContent className={isMobile ? "px-4 pb-4" : ""}>
              <div className={cn("font-bold", isMobile ? "text-xl" : "text-2xl")}>{totalStudents - linkedStudents}</div>
              <p className="text-xs text-muted-foreground">
                Pending account activation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="org-tile">
          <CardHeader className={isMobile ? "px-4 pt-4 pb-3" : ""}>
            <CardTitle className={cn(isMobile ? "text-lg" : "text-lg")}>Student Roster</CardTitle>
            <CardDescription>
              Search and filter your student profiles
            </CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? "px-4 pb-4" : ""}>
            <div className={cn("flex gap-3 mb-4", isMobile && "flex-col")}>
              <Input className={cn(isMobile ? "w-full" : "max-w-xs")} placeholder="Search students..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className={cn(isMobile ? "w-full" : "w-[180px]")}>
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

            <div className={cn("overflow-x-auto", isMobile && "mobile-responsive-table")}>
              {studentsLoading ? <div className="text-center py-12">
                  <div className="text-muted-foreground">Loading students...</div>
                </div> : <StudentsTable students={filteredStudents} onEditStudent={handleEditStudent} onDeleteStudent={handleDeleteStudent} onSendInvite={handleSendInvite} onGenerateActivationLink={handleGenerateActivationLink} />}
            </div>
          </CardContent>
        </Card>

        <AddStudentDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSubmit={handleAddStudent} isLoading={isCreating} />

        <EditStudentDialog open={showEditDialog} onOpenChange={setShowEditDialog} onSubmit={handleUpdateStudent} student={selectedStudent} isLoading={isUpdating} />

        <ImportStudentsCSV open={showImportCSV} onOpenChange={setShowImportCSV} orgId={orgId!} />

        <GenerateActivationLinkDialog open={showActivationDialog} onOpenChange={setShowActivationDialog} student={selectedStudent} orgSlug={currentOrg?.organizations?.slug || orgId!} />

        <StudentEmailConfirmationDialog
          open={showEmailConfirmation}
          onOpenChange={setShowEmailConfirmation}
          studentId={newlyCreatedStudent?.id || ''}
          studentName={newlyCreatedStudent?.full_name || ''}
          parentEmail={newlyCreatedStudent?.parent_email}
          orgId={orgId}
        />
      </div>
    </PageShell>;
}