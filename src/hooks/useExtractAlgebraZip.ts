import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useExtractAlgebraZip = () => {
  return useMutation({
    mutationFn: async () => {
      console.log('🚀 Starting algebra course zip extraction...');
      
      const zipUrl = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/interactive_algebra_course_COMPLETE.zip';
      
      const { data, error } = await supabase.functions.invoke('extract-algebra-zip', {
        body: { 
          zipUrl,
          courseId: 'interactive-algebra'
        }
      });

      if (error) {
        console.error('❌ Algebra zip extraction failed:', error);
        throw error;
      }

      console.log('✅ Algebra course content extracted successfully:', data);
      
      // Store extracted lesson content in localStorage for the components to access
      if (data.lessons) {
        localStorage.setItem('algebra-lessons-content', JSON.stringify(data.lessons));
      }
      
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 Algebra course ready!', data);
    },
    onError: (error) => {
      console.error('💥 Algebra course extraction error:', error);
    }
  });
};