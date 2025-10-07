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

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  student_id: z.string().min(1, 'Student is required'),
  visibility_scope: z.enum(['student-only', 'instructor-visible', 'org-public']).default('instructor-visible'),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface OrgNoteCreationDialogProps {
  children?: React.ReactNode;
  organizationId: string;
  onNoteCreated?: () => void;
}

const categories = [
  'Academic Progress',
  'Behavioral Observation',
  'Parent Communication',
  'IEP Related',
  'General Note',
  'Attendance',
  'Health & Wellness',
];

export default function OrgNoteCreationDialog({ 
  children, 
  organizationId,
  onNoteCreated 
}: OrgNoteCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { createNote, isCreating } = useOrgNotes(organizationId);
  const { students } = useOrgStudents(organizationId);

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      student_id: '',
      visibility_scope: 'instructor-visible',
    },
  });

  const onSubmit = async (data: NoteFormData) => {
    try {
      console.log('📝 Submitting note with data:', data);
      
      // Find the selected student to get the correct ID
      const selectedStudent = students.find(s => s.id === data.student_id);
      
      // For member-students (id starts with "member-"), use linked_user_id
      // For profile-only students, use the org_students id
      const actualStudentId = selectedStudent?.linked_user_id || data.student_id;
      
      console.log('📝 Resolved student ID:', {
        originalId: data.student_id,
        linkedUserId: selectedStudent?.linked_user_id,
        actualId: actualStudentId
      });
      
      await createNote({
        title: data.title,
        content: data.content,
        category: data.category,
        student_id: actualStudentId,
        visibility_scope: data.visibility_scope,
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
          <DialogTitle>Create Student Note</DialogTitle>
          <DialogDescription>
            Document student progress, observations, or important information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      {categories.map((category) => (
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
