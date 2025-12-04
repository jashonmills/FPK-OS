import React, { useState } from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Eye,
  Mail,
  Calendar,
  BookOpen,
  Target,
  Filter,
  Upload,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImportStudentsCSV } from '@/components/students/ImportStudentsCSV';
import { EditStudentDialog } from '@/components/students/EditStudentDialog';
import { BulkStudentActions } from '@/components/students/BulkStudentActions';
import { useOrgStudents, type OrgStudent } from '@/hooks/useOrgStudents';
import { assertOrg } from '@/lib/org/context';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function StudentsPage() {
  const { currentOrg, getEffectiveRole } = useOrgContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const userRole = getEffectiveRole();
  const orgId = assertOrg();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<OrgStudent | null>(null);
  const [editingStudent, setEditingStudent] = useState<OrgStudent | null>(null);
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  // Use the proper hook for students
  const { 
    students, 
    isLoading, 
    updateStudent, 
    deleteStudent,
    isUpdating 
  } = useOrgStudents(orgId, searchQuery);

  if (!currentOrg) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Organization Selected</h1>
          <p className="text-muted-foreground">Please select an organization to view students.</p>
        </div>
      </div>
    );
  }

  const canManageMembers = userRole === 'owner' || userRole === 'instructor';
  
  const filteredStudents = searchQuery 
    ? students.filter(student => 
        student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.parent_email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  const getInitials = (name?: string, email?: string) => {
    if (name && name !== 'Unknown Student') {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleUpdateStudent = (data: Partial<OrgStudent> & { id: string }) => {
    updateStudent(data);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    deleteStudent(studentId);
  };

  const handleSelectStudent = (studentId: string) => {
    const newSelection = new Set(selectedStudentIds);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudentIds(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedStudentIds.size === filteredStudents.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const handleBulkDelete = async (studentIds: string[]) => {
    setIsProcessing(true);
    try {
      // Delete each student - cascades will handle related data
      for (const studentId of studentIds) {
        await deleteStudent(studentId);
      }
      
      toast({
        title: "Success",
        description: `Successfully deleted ${studentIds.length} student${studentIds.length > 1 ? 's' : ''}`,
      });
      setSelectedStudentIds(new Set());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkStatusChange = async (studentIds: string[], status: 'active' | 'inactive') => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('org_students')
        .update({ status })
        .in('id', studentIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully updated ${studentIds.length} student${studentIds.length > 1 ? 's' : ''}`,
      });
      setSelectedStudentIds(new Set());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkExport = (studentIds: string[]) => {
    const selectedData = students.filter(s => studentIds.includes(s.id));
    const csv = [
      ['Name', 'Email', 'Grade', 'Student ID', 'Status', 'Added Date'].join(','),
      ...selectedData.map(s => [
        s.full_name || '',
        s.parent_email || '',
        s.grade_level || '',
        s.student_id || '',
        s.linked_user_id ? 'Active Account' : 'Profile Only',
        new Date(s.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: `Exported ${selectedData.length} student${selectedData.length > 1 ? 's' : ''}`,
    });
  };

  const handleBulkEmail = (selectedStudents: OrgStudent[]) => {
    const emails = selectedStudents
      .filter(s => s.parent_email)
      .map(s => s.parent_email)
      .join(',');
    
    window.location.href = `mailto:${emails}`;
  };

  const selectedStudents = students.filter(s => selectedStudentIds.has(s.id));

  return (
    <div className="w-full max-w-7xl mx-auto px-6 space-y-6 overflow-x-hidden">
      {/* Bulk Actions Toolbar */}
      <BulkStudentActions
        selectedStudents={selectedStudents}
        onClearSelection={() => setSelectedStudentIds(new Set())}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkExport={handleBulkExport}
        onBulkEmail={handleBulkEmail}
        isProcessing={isProcessing}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Students</h1>
          <p className="text-white/80 drop-shadow">
            {filteredStudents.length} students in organization
          </p>
          </div>
        </div>
        
        {canManageMembers && (
          <Button 
            variant="outline"
            className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10 bg-transparent z-50 relative pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowImportCSV(true);
            }}
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-white">Total Students</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">{students.length}</div>
            <p className="text-xs text-white/80">
              Active students
            </p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-white">With Accounts</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">{students.filter(s => s.linked_user_id).length}</div>
            <p className="text-xs text-white/80">
              Can log in to platform
            </p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-white">Profile Only</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">{students.filter(s => !s.linked_user_id).length}</div>
            <p className="text-xs text-white/80">Awaiting activation</p>
          </OrgCardContent>
        </OrgCard>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-transparent border-white/20 text-white placeholder:text-white/60"
          />
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Students List */}
      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <OrgCardTitle className="text-white">Student Roster</OrgCardTitle>
              <OrgCardDescription className="text-white/80">
                Manage your organization's students
              </OrgCardDescription>
            </div>
            {filteredStudents.length > 0 && canManageMembers && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                {selectedStudentIds.size === filteredStudents.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>
        </OrgCardHeader>
        <OrgCardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-white/70">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">No Students Found</h3>
              <p className="text-white/80 mb-4">
                {searchQuery ? 'No students match your search.' : 'Start by adding students to your organization.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div 
                  key={student.id} 
                  className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                    selectedStudentIds.has(student.id) 
                      ? 'border-white/50 bg-white/20 shadow-md' 
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {canManageMembers && (
                      <Checkbox
                        checked={selectedStudentIds.has(student.id)}
                        onCheckedChange={() => handleSelectStudent(student.id)}
                        className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-orange-600"
                      />
                    )}
                    <Avatar>
                      <AvatarFallback className="bg-white/10 text-white">
                        {getInitials(student.full_name, student.parent_email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-white">
                        {student.full_name || 'Unnamed Student'}
                      </div>
                      <div className="text-sm text-white/70 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {student.parent_email || 'No email'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {student.grade_level && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Grade {student.grade_level}
                      </Badge>
                    )}
                    {student.linked_user_id ? (
                      <Badge variant="outline" className="bg-green-500/20 text-green-100 border-green-400/30">
                        Active Account
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30">
                        Profile Only
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs text-white/70 border-white/20">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(student.created_at).toLocaleDateString()}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="bg-transparent hover:bg-white/10 text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card dark:bg-card border border-border z-50">
                        <DropdownMenuItem onClick={() => setEditingStudent(student)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedStudent(student)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Progress
                        </DropdownMenuItem>
                        {canManageMembers && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Student
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </OrgCardContent>
      </OrgCard>

      {/* Edit Student Dialog */}
      <EditStudentDialog
        open={!!editingStudent}
        onOpenChange={(open) => !open && setEditingStudent(null)}
        onSubmit={handleUpdateStudent}
        student={editingStudent}
        isLoading={isUpdating}
      />

      {/* Student Detail Sheet */}
      <Sheet open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback className="bg-primary/20 text-primary">
                  {getInitials(selectedStudent?.full_name, selectedStudent?.parent_email)}
                </AvatarFallback>
              </Avatar>
              {selectedStudent?.full_name || 'Student Details'}
            </SheetTitle>
            <SheetDescription>
              View student progress and activity
            </SheetDescription>
          </SheetHeader>
          
          {selectedStudent && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selectedStudent.parent_email || 'No email'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Joined {new Date(selectedStudent.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Course Progress
                </h3>
                <div className="text-sm text-muted-foreground">
                  No course data available yet
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Active Goals
                </h3>
                <div className="text-sm text-muted-foreground">
                  No goals assigned yet
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Import CSV Modal */}
      <ImportStudentsCSV
        open={showImportCSV}
        onOpenChange={setShowImportCSV}
        orgId={orgId}
      />
    </div>
  );
}