// Temporary utility to upload Snugz logo
import { supabase } from '@/integrations/supabase/client';
import snugzLogo from '@/assets/snugz-logo.png';

export async function uploadSnugzLogo() {
  try {
    // Fetch the image as a blob
    const response = await fetch(snugzLogo);
    const blob = await response.blob();
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('partner-logos')
      .upload('snugz-logo.png', blob, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('partner-logos')
      .getPublicUrl('snugz-logo.png');
    
    console.log('Logo uploaded successfully:', publicUrlData.publicUrl);
    
    // Update the partner_resources record
    const { error: updateError } = await supabase
      .from('partner_resources')
      .update({ logo_url: publicUrlData.publicUrl })
      .eq('name', 'Snugz');
    
    if (updateError) throw updateError;
    
    console.log('Partner resource updated successfully');
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
}
