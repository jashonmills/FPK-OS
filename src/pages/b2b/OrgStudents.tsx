import { useState } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, GraduationCap, Calendar, School, Filter, CheckSquare, Square } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AddStudentDialog } from '@/components/b2b/AddStudentDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BulkActionsToolbar } from '@/components/b2b/BulkActionsToolbar';
import { AssignStaffDialog } from '@/components/b2b/AssignStaffDialog';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

export const OrgStudents = () => {
  const { selectedOrganization, students, isLoading, refreshStudents } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  if (!selectedOrganization) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Organization Selected</CardTitle>
            <CardDescription>
              Please select an organization from the sidebar to manage students.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.student_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || student.grade_level === gradeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && student.is_active !== false) ||
      (statusFilter === 'inactive' && student.is_active === false);
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleExportCSV = () => {
    const selectedStudents = students.filter(s => selectedStudentIds.includes(s.id));
    
    const csvHeaders = ['Name', 'Date of Birth', 'Age', 'Grade', 'School', 'Primary Diagnosis', 'Status'];
    const csvRows = selectedStudents.map(student => {
      const age = Math.floor((new Date().getTime() - new Date(student.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      const diagnosis = student.primary_diagnosis?.join('; ') || '';
      const status = student.is_active !== false ? 'Active' : 'Inactive';
      
      return [
        student.student_name,
        format(new Date(student.date_of_birth), 'MM/dd/yyyy'),
        age.toString(),
        student.grade_level || '',
        student.school_name || '',
        diagnosis,
        status,
      ];
    });

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `students-export-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    toast.success(`Exported ${selectedStudents.length} students to CSV`);
  };

  const handleToggleStatus = async () => {
    try {
      const selectedStudents = students.filter(s => selectedStudentIds.includes(s.id));
      
      for (const student of selectedStudents) {
        const newStatus = !student.is_active;
        const { error } = await supabase
          .from('students')
          .update({ is_active: newStatus })
          .eq('id', student.id);

        if (error) throw error;
      }

      toast.success(`Updated status for ${selectedStudents.length} student(s)`);
      setSelectedStudentIds([]);
      refreshStudents();
    } catch (error) {
      console.error('Error updating student status:', error);
      toast.error('Failed to update student status');
    }
  };

  const allSelected = filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length;
  const someSelected = selectedStudentIds.length > 0 && selectedStudentIds.length < filteredStudents.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Roster</h1>
          <p className="text-muted-foreground">
            Manage students in {selectedOrganization.org_name}
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="K">Kindergarten</SelectItem>
              <SelectItem value="1">1st Grade</SelectItem>
              <SelectItem value="2">2nd Grade</SelectItem>
              <SelectItem value="3">3rd Grade</SelectItem>
              <SelectItem value="4">4th Grade</SelectItem>
              <SelectItem value="5">5th Grade</SelectItem>
              <SelectItem value="6">6th Grade</SelectItem>
              <SelectItem value="7">7th Grade</SelectItem>
              <SelectItem value="8">8th Grade</SelectItem>
              <SelectItem value="9">9th Grade</SelectItem>
              <SelectItem value="10">10th Grade</SelectItem>
              <SelectItem value="11">11th Grade</SelectItem>
              <SelectItem value="12">12th Grade</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredStudents.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            className={someSelected ? 'data-[state=checked]:bg-primary/50' : ''}
          />
          <button
            onClick={handleSelectAll}
            className="hover:text-foreground transition-colors"
          >
            {allSelected ? 'Deselect all' : someSelected ? `${selectedStudentIds.length} selected` : 'Select all'}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No students found' : 'No students yet'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first student to the roster'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Card 
              key={student.id} 
              className={`hover:shadow-lg transition-all ${
                selectedStudentIds.includes(student.id) ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedStudentIds.includes(student.id)}
                    onCheckedChange={() => handleToggleStudent(student.id)}
                    className="mt-1"
                  />
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={student.profile_image_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {student.student_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg truncate">
                        {student.student_name}
                      </CardTitle>
                      {student.is_active === false && (
                        <Badge variant="outline" className="text-xs">Inactive</Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(student.date_of_birth), 'MMM d, yyyy')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {student.grade_level && (
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>Grade {student.grade_level}</span>
                  </div>
                )}
                {student.school_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{student.school_name}</span>
                  </div>
                )}
                {student.primary_diagnosis && student.primary_diagnosis.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {student.primary_diagnosis.slice(0, 2).map((diagnosis, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {diagnosis}
                      </Badge>
                    ))}
                    {student.primary_diagnosis.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{student.primary_diagnosis.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        organizationId={selectedOrganization.id}
      />

      <AssignStaffDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        organizationId={selectedOrganization.id}
        selectedStudentIds={selectedStudentIds}
        onSuccess={() => {
          setSelectedStudentIds([]);
          toast.success('Students assigned successfully');
        }}
      />

      <BulkActionsToolbar
        selectedCount={selectedStudentIds.length}
        onExportCSV={handleExportCSV}
        onAssignStaff={() => setIsAssignDialogOpen(true)}
        onToggleStatus={handleToggleStatus}
        onClearSelection={() => setSelectedStudentIds([])}
      />
    </div>
  );
};
