import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useExtractLinearEquationsZip() {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('extract-linear-equations-zip');

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Zip file extracted successfully!');
      console.log('Zip extraction result:', data);
    },
    onError: (error) => {
      console.error('Error extracting zip:', error);
      toast.error('Failed to extract zip file');
    },
  });
}