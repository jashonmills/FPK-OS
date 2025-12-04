import { supabase } from '@/integrations/supabase/client';

export async function testScormContentGeneration(packageId: string) {
  console.log('🧪 Testing SCORM content generation for package:', packageId);
  
  try {
    // Test health endpoint first
    const healthResponse = await fetch('/api/scorm-content-proxy?health=1');
    console.log('🏥 Proxy health:', healthResponse.ok ? 'OK' : 'Failed');
    
    // Check if content exists
    const testPath = `content/index.html`;
    const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/scorm-content-proxy?pkg=${packageId}&path=${testPath}`;
    
    console.log('🔍 Testing content URL:', proxyUrl);
    const contentResponse = await fetch(proxyUrl);
    console.log('📄 Content response:', contentResponse.status, contentResponse.statusText);
    
    if (!contentResponse.ok) {
      console.log('❌ Content not found, triggering generation...');
      
      // Trigger content generation
      const { data, error } = await supabase.functions.invoke('scorm-generate-content', {
        body: { packageId }
      });
      
      if (error) {
        console.error('❌ Generation failed:', error);
        return { success: false, error };
      }
      
      console.log('✅ Generation result:', data);
      
      // Test again after generation
      const retryResponse = await fetch(proxyUrl);
      console.log('🔄 Retry response:', retryResponse.status, retryResponse.statusText);
      
      return { 
        success: retryResponse.ok, 
        generated: true, 
        finalStatus: retryResponse.status 
      };
    } else {
      console.log('✅ Content already available');
      return { success: true, generated: false, finalStatus: contentResponse.status };
    }
    
  } catch (error) {
    console.error('🚨 Test failed:', error);
    return { success: false, error: String(error) };
  }
}