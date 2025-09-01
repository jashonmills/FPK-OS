import { supabase } from '@/integrations/supabase/client';

export async function uploadCourseImages() {
  try {
    console.log('Calling upload-course-images function...');
    const { data, error } = await supabase.functions.invoke('upload-course-images', {
      method: 'POST'
    });
    
    if (error) {
      console.error('Function invocation error:', error);
      throw error;
    }
    
    console.log('Upload function response:', data);
    return data;
  } catch (error) {
    console.error('Error uploading course images:', error);
    throw error;
  }
}