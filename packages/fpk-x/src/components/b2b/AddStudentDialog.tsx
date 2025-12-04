import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const studentSchema = z.object({
  student_name: z.string().min(1, 'Student name is required'),
  date_of_birth: z.date({
    required_error: 'Date of birth is required',
  }),
  grade_level: z.string().optional(),
  school_name: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

export const AddStudentDialog = ({ open, onOpenChange, organizationId }: AddStudentDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      student_name: '',
      grade_level: '',
      school_name: '',
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    if (!user) {
      toast.error('You must be logged in to add students');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check for duplicate family name and generate unique name if needed
      let familyName = `${data.student_name}'s Team`;
      const { data: existingFamilies } = await supabase
        .from('families')
        .select('family_name')
        .eq('created_by', user.id)
        .ilike('family_name', `${familyName}%`);

      if (existingFamilies && existingFamilies.length > 0) {
        // Add a number suffix to make it unique
        familyName = `${data.student_name}'s Team (${existingFamilies.length + 1})`;
      }

      // Create a family for this student
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .insert({
          family_name: familyName,
          created_by: user.id,
        })
        .select()
        .single();

      if (familyError) {
        // Handle unique constraint violation
        if (familyError.code === '23505') {
          toast.error('A family with this name already exists. Please try again.');
          setIsSubmitting(false);
          return;
        }
        throw familyError;
      }

      // Create the student record
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          family_id: familyData.id,
          organization_id: organizationId,
          added_by_org_member_id: user.id,
          student_name: data.student_name,
          date_of_birth: format(data.date_of_birth, 'yyyy-MM-dd'),
          grade_level: data.grade_level || null,
          school_name: data.school_name || null,
        });

      if (studentError) throw studentError;

      toast.success('Student added successfully');
      queryClient.invalidateQueries({ queryKey: ['organization-students'] });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast.error(error.message || 'Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Add a student to your organization's roster
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="student_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter student's full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grade_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Level</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., K, 1, 2, 12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="school_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter school name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Student'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
