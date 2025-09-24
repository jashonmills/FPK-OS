import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useOrgAssignments } from '@/hooks/useOrgAssignments';
import { useOrgMembers } from '@/hooks/useOrgMembers';
import { CourseCard } from '@/types/course-card';
import { Users, Calendar, FileText } from 'lucide-react';

interface AssignmentCreateDialogProps {
  course: CourseCard;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AssignmentCreateDialog({ course, trigger, open: controlledOpen, onOpenChange }: AssignmentCreateDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };
  const [title, setTitle] = useState(`${course.title} Assignment`);
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [required, setRequired] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  const { createAssignment, isCreating } = useOrgAssignments();
  const { members } = useOrgMembers();

  const students = members?.filter(member => member.role === 'student') || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createAssignment({
        title,
        type: 'course',
        resource_id: course.id,
        target_members: selectedMembers,
        metadata: {
          instructions,
          due_date: dueDate || null,
          required,
          course_title: course.title
        }
      });
      
      setOpen(false);
      // Reset form
      setTitle(`${course.title} Assignment`);
      setInstructions('');
      setDueDate('');
      setRequired(true);
      setSelectedMembers([]);
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllStudents = () => {
    setSelectedMembers(students.map(s => s.user_id));
  };

  const clearSelection = () => {
    setSelectedMembers([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            Assign
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Assignment
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Info */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Course</h4>
            <div className="flex items-center gap-3">
              {course.thumbnail_url && (
                <img 
                  src={course.thumbnail_url} 
                  alt={course.title}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium">{course.title}</p>
                {course.instructor_name && (
                  <p className="text-sm text-muted-foreground">
                    by {course.instructor_name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Assignment Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter assignment title"
                required
              />
            </div>

            <div>
              <Label htmlFor="instructions">Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Add any specific instructions for students..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date (Optional)
                </Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="required"
                  checked={required}
                  onCheckedChange={(checked) => setRequired(checked === true)}
                />
                <Label htmlFor="required">Mark as required</Label>
              </div>
            </div>
          </div>

          {/* Student Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Assign to Students ({selectedMembers.length} selected)
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllStudents}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
              {students.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No students found in this organization
                </p>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <div key={student.user_id} className="flex items-center space-x-2">
                      <Checkbox
                        id={student.user_id}
                        checked={selectedMembers.includes(student.user_id)}
                        onCheckedChange={() => toggleMember(student.user_id)}
                      />
                      <Label htmlFor={student.user_id} className="text-sm">
                        {student.profiles?.display_name || student.profiles?.email || 'Unknown User'}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating || selectedMembers.length === 0}
            >
              {isCreating ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}