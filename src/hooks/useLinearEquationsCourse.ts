import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useProcessLinearEquationsCourse() {
  return useMutation({
    mutationFn: async (organizationId: string) => {
      const { data, error } = await supabase.functions.invoke('process-linear-equations-course', {
        body: { organizationId }
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Linear Equations course created successfully!');
      console.log('Course processing result:', data);
    },
    onError: (error) => {
      console.error('Error processing course:', error);
      toast.error('Failed to create Linear Equations course');
    },
  });
}