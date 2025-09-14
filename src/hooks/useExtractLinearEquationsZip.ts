import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useExtractLinearEquationsZip() {
  return useMutation({
    mutationFn: async () => {
      console.log('Calling extract-linear-equations-zip function...');
      const { data, error } = await supabase.functions.invoke('extract-linear-equations-zip');

      if (error) {
        console.error('Error invoking function:', error);
        throw error;
      }

      console.log('Function response:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Zip extraction result:', data);
      if (data?.lessonComponents) {
        console.log('Found lesson components:', Object.keys(data.lessonComponents));
        Object.entries(data.lessonComponents).forEach(([filename, content]) => {
          console.log(`${filename}: ${(content as string).substring(0, 200)}...`);
        });
      }
      toast.success('Zip file extracted successfully!');
    },
    onError: (error) => {
      console.error('Error extracting zip:', error);
      toast.error('Failed to extract zip file');
    },
  });
}