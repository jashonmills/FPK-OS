import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useOrgNotes } from '@/hooks/useOrgNotes';
import { useOrgStudents } from '@/hooks/useOrgStudents';
import { useOrgMembers } from '@/hooks/useOrgMembers';

// Conditional schema based on user role
const instructorNoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  student_id: z.string().min(1, 'Student is required'),
  visibility_scope: z.enum(['student-only', 'instructor-visible', 'org-public']).default('instructor-visible'),
});

const studentNoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  recipient_type: z.enum(['self', 'specific_instructor', 'all_instructors']),
  recipient_id: z.string().optional(),
  visibility_scope: z.enum(['student-only', 'instructor-visible', 'org-public']).default('instructor-visible'),
});

type InstructorNoteFormData = z.infer<typeof instructorNoteSchema>;
type StudentNoteFormData = z.infer<typeof studentNoteSchema>;

interface OrgNoteCreationDialogProps {
  children?: React.ReactNode;
  organizationId: string;
  userRole?: string;
  currentUserId?: string;
  onNoteCreated?: () => void;
}

const instructorCategories = [
  'Academic Progress',
  'Behavioral Observation',
  'Parent Communication',
  'IEP Related',
  'General Note',
  'Attendance',
  'Health & Wellness',
];

const studentCategories = [
  'Personal Reflection',
  'Question for Educator',
  'Progress Update',
  'Request for Help',
  'General Message',
  'Course Feedback',
];

export default function OrgNoteCreationDialog({ 
  children, 
  organizationId,
  userRole = 'instructor',
  currentUserId,
  onNoteCreated 
}: OrgNoteCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { createNote, isCreating } = useOrgNotes(organizationId);
  const { students } = useOrgStudents(organizationId);
  const { members: orgMembers } = useOrgMembers();
  
  const isStudent = userRole === 'student';
  
  // Filter for instructors and owners only
  const instructors = orgMembers.filter(m => 
    m.role === 'instructor' || m.role === 'owner'
  );

  // Use conditional schema based on role
  const schema = isStudent ? studentNoteSchema : instructorNoteSchema;
  
  const form = useForm<InstructorNoteFormData | StudentNoteFormData>({
    resolver: zodResolver(schema),
    defaultValues: isStudent ? {
      title: '',
      content: '',
      category: '',
      recipient_type: 'self',
      recipient_id: '',
      visibility_scope: 'student-only',
    } : {
      title: '',
      content: '',
      category: '',
      student_id: '',
      visibility_scope: 'instructor-visible',
    },
  });
  
  // Watch recipient_type for conditional rendering
  const recipientType = form.watch('recipient_type' as any);

  const onSubmit = async (data: InstructorNoteFormData | StudentNoteFormData) => {
    try {
      console.log('📝 Submitting note with data:', data);
      
      let actualStudentId: string;
      let visibilityScope: 'student-only' | 'instructor-visible' | 'org-public';
      let metadata: Record<string, any> = {};

      if (isStudent) {
        // Student creating a note
        const studentData = data as StudentNoteFormData;
        actualStudentId = currentUserId!; // Student's own ID
        
        // Set visibility based on recipient type
        if (studentData.recipient_type === 'self') {
          visibilityScope = 'student-only';
        } else if (studentData.recipient_type === 'specific_instructor') {
          visibilityScope = 'instructor-visible';
          if (studentData.recipient_id) {
            metadata.recipient_id = studentData.recipient_id;
          }
        } else {
          visibilityScope = 'org-public';
        }
      } else {
        // Instructor creating a note
        const instructorData = data as InstructorNoteFormData;
        const selectedStudent = students.find(s => s.id === instructorData.student_id);
        actualStudentId = selectedStudent?.linked_user_id || instructorData.student_id;
        visibilityScope = instructorData.visibility_scope;
      }
      
      console.log('📝 Resolved note data:', {
        studentId: actualStudentId,
        visibilityScope,
        metadata
      });
      
      await createNote({
        title: data.title,
        content: data.content,
        category: data.category,
        student_id: actualStudentId,
        visibility_scope: visibilityScope,
        ...(Object.keys(metadata).length > 0 && { metadata }),
      });

      toast({
        title: "Success",
        description: "Note created successfully.",
      });
      
      form.reset();
      setOpen(false);
      
      if (onNoteCreated) {
        onNoteCreated();
      }
    } catch (error) {
      console.error('📝 Error creating note:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create note. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isStudent ? 'Create Note' : 'Create Student Note'}</DialogTitle>
          <DialogDescription>
            {isStudent 
              ? 'Write a personal note or message to educators' 
              : 'Document student progress, observations, or important information'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Student Selection (Instructors only) */}
            {!isStudent && (
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem 
                            key={student.id} 
                            value={student.id}
                          >
                            {student.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Note Type Selection (Students only) */}
            {isStudent && (
              <>
                <FormField
                  control={form.control}
                  name="recipient_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select note type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="self">Note for Myself</SelectItem>
                          <SelectItem value="specific_instructor">Note to Instructor</SelectItem>
                          <SelectItem value="all_instructors">Note to All Educators</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Instructor Selection (when specific_instructor is selected) */}
                {recipientType === 'specific_instructor' && (
                  <FormField
                    control={form.control}
                    name="recipient_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Instructor</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an instructor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {instructors.map((instructor) => (
                              <SelectItem 
                                key={instructor.user_id} 
                                value={instructor.user_id}
                              >
                                {instructor.full_name} ({instructor.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(isStudent ? studentCategories : instructorCategories).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter note details..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hide visibility selector for students - it's auto-set based on recipient_type */}
            {!isStudent && (
              <FormField
                control={form.control}
                name="visibility_scope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student-only">Student Only</SelectItem>
                        <SelectItem value="instructor-visible">Instructor Visible (Default)</SelectItem>
                        <SelectItem value="org-public">Organization Public</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose who can see this note
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Note
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
