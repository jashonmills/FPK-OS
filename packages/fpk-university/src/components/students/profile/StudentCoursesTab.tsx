import React, { useState } from 'react';
import { OrgStudent } from '@/hooks/useOrgStudents';
import { useStudentCourseAssignments } from '@/hooks/useStudentCourseAssignments';
import { useOrganizationCourseAssignments } from '@/hooks/useOrganizationCourseAssignments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, BookOpen, Calendar, MoreHorizontal, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface StudentCoursesTabProps {
  student: OrgStudent;
  orgId: string;
}

export function StudentCoursesTab({ student, orgId }: StudentCoursesTabProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const { assignments, isLoading, assignCourse, removeAssignment, isAssigning } = useStudentCourseAssignments(student.id, orgId);
  const { assignedCourses: availableCourses } = useOrganizationCourseAssignments(orgId);

  // Get courses that are not yet assigned to this student
  const unassignedCourses = availableCourses.filter(course => 
    !assignments.some(assignment => assignment.course_id === course.course_id)
  );

  const handleAssignCourse = () => {
    if (!selectedCourseId) return;

    assignCourse({
      student_id: student.id,
      course_id: selectedCourseId,
      org_id: orgId,
      due_date: dueDate || undefined,
      notes: notes || undefined,
    });

    setIsAssignDialogOpen(false);
    setSelectedCourseId('');
    setDueDate('');
    setNotes('');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'paused':
        return 'outline';
      case 'dropped':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading course assignments...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Course Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Course Assignments</h3>
          <p className="text-muted-foreground">Manage courses assigned to {student.full_name}</p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-white">
              <Plus className="h-4 w-4 mr-2" />
              Assign Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Course to {student.full_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="course">Select Course</Label>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {unassignedCourses.map((course) => (
                      <SelectItem key={course.course_id} value={course.course_id}>
                        {course.course_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due_date">Due Date (Optional)</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this assignment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAssignCourse} disabled={!selectedCourseId || isAssigning}>
                  {isAssigning ? 'Assigning...' : 'Assign Course'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Assignments Grid */}
      {assignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Courses Assigned</h3>
            <p className="text-muted-foreground text-center mb-4">
              This student hasn't been assigned any courses yet. Click "Assign Course" to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium truncate">
                  {assignment.course_id}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => removeAssignment(assignment.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Assignment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={getStatusBadgeVariant(assignment.status)}>
                    {assignment.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {assignment.progress_percentage}%
                  </span>
                </div>
                <Progress value={assignment.progress_percentage} className="w-full" />
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Assigned: {format(new Date(assignment.assigned_at), 'MMM dd, yyyy')}
                  </div>
                  {assignment.due_date && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Due: {format(new Date(assignment.due_date), 'MMM dd, yyyy')}
                    </div>
                  )}
                  {assignment.last_accessed_at && (
                    <div className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Last accessed: {format(new Date(assignment.last_accessed_at), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
                {assignment.notes && (
                  <div className="text-xs">
                    <p className="font-medium">Notes:</p>
                    <p className="text-muted-foreground">{assignment.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}