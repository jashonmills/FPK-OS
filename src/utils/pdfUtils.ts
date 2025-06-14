
import { supabase } from '@/integrations/supabase/client';

export interface PDFValidationResult {
  isValid: boolean;
  error?: string;
  processedUrl?: string;
}

/**
 * Validates and processes a PDF URL for loading
 */
export const validatePDFUrl = async (url: string): Promise<PDFValidationResult> => {
  try {
    console.log('🔍 Starting PDF URL validation for:', url.substring(0, 100) + '...');
    
    // Basic URL validation
    if (!url || typeof url !== 'string') {
      console.error('❌ Invalid URL provided:', typeof url);
      return { isValid: false, error: 'Invalid URL provided' };
    }

    let processedUrl = url.trim();

    // Add protocol if missing
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      console.log('🔧 Adding https protocol to URL');
      processedUrl = 'https://' + processedUrl;
    }

    // Validate URL format
    try {
      const urlObj = new URL(processedUrl);
      console.log('✅ URL format valid:', {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        pathname: urlObj.pathname.substring(0, 50) + '...'
      });
    } catch (urlError) {
      console.error('❌ Invalid URL format:', urlError);
      return { isValid: false, error: 'Invalid URL format' };
    }

    // Test URL accessibility with detailed logging
    try {
      console.log('🌐 Testing URL accessibility...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ Request timeout after 10 seconds');
        controller.abort();
      }, 10000);
      
      const response = await fetch(processedUrl, { 
        method: 'HEAD',
        signal: controller.signal,
        mode: 'cors',
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      
      console.log('📊 URL accessibility test result:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        headers: {
          'content-type': response.headers.get('content-type'),
          'content-length': response.headers.get('content-length'),
          'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        }
      });

      if (!response.ok) {
        console.error(`❌ URL not accessible: ${response.status} ${response.statusText}`);
        return { 
          isValid: false, 
          error: `File not accessible: ${response.status} ${response.statusText}` 
        };
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('pdf') && !contentType.includes('application/octet-stream')) {
        console.warn('⚠️ Content type may not be PDF:', contentType);
      }

    } catch (fetchError: any) {
      console.error('❌ URL accessibility test failed:', {
        name: fetchError.name,
        message: fetchError.message,
        stack: fetchError.stack
      });

      if (fetchError.name === 'AbortError') {
        return { 
          isValid: false, 
          error: 'Request timed out. The file may be too large or the server is slow.' 
        };
      }

      // Don't fail validation just because of CORS or network issues
      // The PDF viewer might still be able to load it
      console.log('⚠️ Continuing despite fetch error - PDF viewer may still work');
    }

    console.log('✅ PDF URL validation completed:', processedUrl.substring(0, 100) + '...');
    return { isValid: true, processedUrl };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ PDF URL validation failed:', {
      error: errorMessage,
      url: url.substring(0, 100) + '...'
    });
    
    return { 
      isValid: false, 
      error: `URL validation failed: ${errorMessage}` 
    };
  }
};

/**
 * Gets PDF metadata without fully loading the document
 */
export const getPDFMetadata = async (url: string) => {
  try {
    console.log('📄 Getting PDF metadata for:', url.substring(0, 100) + '...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    const metadata = {
      size: response.headers.get('content-length'),
      lastModified: response.headers.get('last-modified'),
      contentType: response.headers.get('content-type'),
      accessible: response.ok
    };
    
    console.log('📊 PDF metadata:', metadata);
    return metadata;
  } catch (error) {
    console.warn('⚠️ Could not fetch PDF metadata:', error);
    return null;
  }
};
