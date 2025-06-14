
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
    try {
      new URL(processedUrl);
    } catch (urlError) {
      return { isValid: false, error: 'Invalid URL format' };
    }

    console.log('✅ PDF URL validation successful:', processedUrl);
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
