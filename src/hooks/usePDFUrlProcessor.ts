
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePDFUrlProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processFileUrl = useCallback(async (url: string): Promise<string[]> => {
    console.log('🔍 Processing PDF URL:', url.substring(0, 100) + '...');
    
    const urlVariants: string[] = [];
    
    if (url.includes('supabase') && url.includes('storage')) {
      urlVariants.push(url);
      
      const publicUrl = url.replace('/storage/v1/object/', '/storage/v1/object/public/');
      if (publicUrl !== url) {
        urlVariants.push(publicUrl);
      }
      
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const urlParts = url.split('/storage/v1/object/');
          if (urlParts.length > 1) {
            const [, pathPart] = urlParts;
            const pathSegments = pathPart.split('/');
            if (pathSegments.length >= 2) {
              const bucket = pathSegments[0];
              const filePath = pathSegments.slice(1).join('/');
              
              const { data: signedUrlData } = await supabase.storage
                .from(bucket)
                .createSignedUrl(filePath, 3600);
              
              if (signedUrlData?.signedUrl) {
                urlVariants.push(signedUrlData.signedUrl);
              }
            }
          }
        }
      } catch (error) {
        console.warn('Could not create signed URL:', error);
      }
    } else {
      urlVariants.push(url);
    }
    
    console.log('📄 Generated URL variants:', urlVariants.length);
    return urlVariants;
  }, []);

  const testUrlAccessibility = useCallback(async (url: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      
      console.log(`🌐 URL test result for ${url.substring(0, 50)}...:`, {
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type')
      });
      
      return response.ok;
    } catch (error) {
      console.warn(`❌ URL test failed for ${url.substring(0, 50)}...:`, error);
      return false;
    }
  }, []);

  const findWorkingUrl = useCallback(async (fileUrl: string): Promise<string | null> => {
    setIsProcessing(true);
    
    try {
      const urlVariants = await processFileUrl(fileUrl);
      
      for (const variant of urlVariants) {
        const isAccessible = await testUrlAccessibility(variant);
        if (isAccessible) {
          console.log('✅ Found working URL:', variant.substring(0, 100) + '...');
          return variant;
        }
      }
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [processFileUrl, testUrlAccessibility]);

  return {
    findWorkingUrl,
    isProcessing,
    processFileUrl,
    testUrlAccessibility
  };
};
