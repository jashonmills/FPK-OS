import { supabase } from '@/integrations/supabase/client';

export async function uploadVectorImages() {
  try {
    console.log('Calling upload-vector-images function...');
    const { data, error } = await supabase.functions.invoke('upload-vector-images', {
      method: 'POST'
    });
    
    if (error) {
      console.error('Function invocation error:', error);
      throw error;
    }
    
    console.log('Upload function response:', data);
    return data;
  } catch (error) {
    console.error('Error uploading vector images:', error);
    throw error;
  }
}