/**
 * Document Parser Helper
 * 
 * Parses various document formats (PDF, DOCX, TXT) and extracts text content.
 * This module is designed for Deno edge functions and uses npm: imports.
 */

// @deno-types="npm:@types/pdf-parse"
import pdfParse from "npm:pdf-parse@1.1.1";
import mammoth from "npm:mammoth@1.8.0";

export interface ParsedDocument {
  text: string;
  metadata?: {
    pageCount?: number;
    author?: string;
    title?: string;
    [key: string]: any;
  };
}

/**
 * Parse a PDF file and extract text content
 */
async function parsePDF(fileBuffer: ArrayBuffer): Promise<ParsedDocument> {
  try {
    console.log('[PDF Parser] Starting PDF parsing...');
    const data = await pdfParse(Buffer.from(fileBuffer));
    
    console.log('[PDF Parser] ✅ PDF parsed successfully:', {
      pages: data.numpages,
      textLength: data.text.length
    });
    
    return {
      text: data.text,
      metadata: {
        pageCount: data.numpages,
        title: data.info?.Title,
        author: data.info?.Author
      }
    };
  } catch (error) {
    console.error('[PDF Parser] ❌ PDF parsing failed:', error);
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

/**
 * Parse a DOCX file and extract text content
 */
async function parseDOCX(fileBuffer: ArrayBuffer): Promise<ParsedDocument> {
  try {
    console.log('[DOCX Parser] Starting DOCX parsing...');
    const result = await mammoth.extractRawText({ buffer: Buffer.from(fileBuffer) });
    
    console.log('[DOCX Parser] ✅ DOCX parsed successfully:', {
      textLength: result.value.length,
      warnings: result.messages.length
    });
    
    if (result.messages.length > 0) {
      console.warn('[DOCX Parser] Warnings:', result.messages);
    }
    
    return {
      text: result.value,
      metadata: {}
    };
  } catch (error) {
    console.error('[DOCX Parser] ❌ DOCX parsing failed:', error);
    throw new Error(`DOCX parsing failed: ${error.message}`);
  }
}

/**
 * Parse a plain text file
 */
async function parseText(fileBuffer: ArrayBuffer): Promise<ParsedDocument> {
  try {
    console.log('[Text Parser] Parsing text file...');
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(fileBuffer);
    
    console.log('[Text Parser] ✅ Text file parsed:', {
      textLength: text.length
    });
    
    return {
      text,
      metadata: {}
    };
  } catch (error) {
    console.error('[Text Parser] ❌ Text parsing failed:', error);
    throw new Error(`Text parsing failed: ${error.message}`);
  }
}

/**
 * Main document parser - automatically detects file type and uses appropriate parser
 */
export async function parseDocument(
  fileBuffer: ArrayBuffer,
  fileType: string,
  fileName: string
): Promise<ParsedDocument> {
  console.log('[Document Parser] Starting document parsing:', {
    fileName,
    fileType,
    bufferSize: fileBuffer.byteLength
  });
  
  // Normalize file type
  const normalizedType = fileType.toLowerCase();
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  
  // Determine parser based on file type and extension
  if (normalizedType.includes('pdf') || fileExtension === 'pdf') {
    return await parsePDF(fileBuffer);
  } else if (
    normalizedType.includes('wordprocessingml') || 
    normalizedType.includes('msword') ||
    fileExtension === 'docx' ||
    fileExtension === 'doc'
  ) {
    return await parseDOCX(fileBuffer);
  } else if (
    normalizedType.includes('text') || 
    fileExtension === 'txt' ||
    fileExtension === 'md'
  ) {
    return await parseText(fileBuffer);
  } else {
    // Default to text parsing for unknown types
    console.warn('[Document Parser] Unknown file type, attempting text parsing');
    return await parseText(fileBuffer);
  }
}

/**
 * Truncate text to a maximum length while preserving word boundaries
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // Find the last space before maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}
