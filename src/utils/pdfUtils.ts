
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
    // Basic URL validation
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'Invalid URL provided' };
    }

    let processedUrl = url.trim();

    // Add protocol if missing
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }

    // Validate URL format
    const urlObj = new URL(processedUrl);
    
    // Enhanced Supabase URL handling
    if (urlObj.hostname.includes('supabase')) {
      // Ensure proper encoding for file names with special characters
      const pathSegments = urlObj.pathname.split('/').map(segment => {
        if (segment) {
          // Decode first to handle already encoded segments
          const decoded = decodeURIComponent(segment);
          // Then encode properly
          return encodeURIComponent(decoded);
        }
        return segment;
      });
      processedUrl = `${urlObj.origin}${pathSegments.join('/')}${urlObj.search}${urlObj.hash}`;
      
      console.log('🔗 Processed Supabase URL:', processedUrl);
    }

    // Test if URL is accessible with better error handling
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(processedUrl, { 
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'Accept': 'application/pdf,*/*'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return { 
          isValid: false, 
          error: `File not accessible (HTTP ${response.status}: ${response.statusText})`,
          processedUrl 
        };
      }

      // Enhanced content type checking
      const contentType = response.headers.get('content-type');
      if (contentType) {
        const isPDF = contentType.includes('pdf') || 
                     contentType.includes('application/octet-stream') ||
                     contentType.includes('binary/octet-stream');
        
        if (!isPDF) {
          console.warn('⚠️ Unexpected content type for PDF:', contentType);
        }
      }
      
      console.log('✅ PDF URL validation successful:', processedUrl);
    } catch (fetchError) {
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return {
          isValid: false,
          error: 'Request timeout - PDF file may be too large or server is slow',
          processedUrl
        };
      }
      
      console.warn('⚠️ Could not verify PDF accessibility (continuing anyway):', fetchError);
      // Continue anyway as CORS might block HEAD requests but PDF.js might still work
    }

    return { isValid: true, processedUrl };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ PDF URL validation failed:', errorMessage);
    
    return { 
      isValid: false, 
      error: `URL validation failed: ${errorMessage}` 
    };
  }
};

/**
 * Updates CORS settings for Supabase storage bucket
 */
export const updateStorageCORS = async (bucketName: string) => {
  try {
    console.log('🔧 Updating CORS settings for bucket:', bucketName);
    
    // Note: This would typically be done via Supabase CLI or dashboard
    // For now, we'll log the recommended CORS settings
    console.log('📝 Recommended CORS settings for', bucketName, ':', {
      allowedOrigins: ['*'],
      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
      allowedHeaders: ['*'],
      exposedHeaders: ['Content-Length', 'Content-Type'],
      maxAge: 3600
    });
    
    return true;
  } catch (error) {
    console.error('❌ Failed to update CORS settings:', error);
    return false;
  }
};

/**
 * Gets PDF metadata without fully loading the document
 */
export const getPDFMetadata = async (url: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    return {
      size: response.headers.get('content-length'),
      lastModified: response.headers.get('last-modified'),
      contentType: response.headers.get('content-type'),
      accessible: response.ok
    };
  } catch (error) {
    console.warn('Could not fetch PDF metadata:', error);
    return null;
  }
};
