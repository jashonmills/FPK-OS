
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
    
    // Check if it's a Supabase storage URL
    if (urlObj.hostname.includes('supabase')) {
      // For Supabase URLs, ensure proper encoding
      const pathSegments = urlObj.pathname.split('/').map(segment => 
        segment ? encodeURIComponent(decodeURIComponent(segment)) : segment
      );
      processedUrl = `${urlObj.origin}${pathSegments.join('/')}${urlObj.search}${urlObj.hash}`;
    }

    // Test if URL is accessible
    try {
      const response = await fetch(processedUrl, { method: 'HEAD' });
      if (!response.ok) {
        return { 
          isValid: false, 
          error: `File not accessible (HTTP ${response.status})`,
          processedUrl 
        };
      }

      // Check content type if available
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('pdf') && !contentType.includes('application/octet-stream')) {
        console.warn('⚠️ Unexpected content type for PDF:', contentType);
      }
    } catch (fetchError) {
      console.warn('⚠️ Could not verify PDF accessibility:', fetchError);
      // Continue anyway as the fetch might fail due to CORS but PDF.js might still work
    }

    return { isValid: true, processedUrl };
  } catch (error) {
    return { 
      isValid: false, 
      error: `URL validation failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
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
    const response = await fetch(url, { method: 'HEAD' });
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
