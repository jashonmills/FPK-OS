/**
 * Document Text Extraction Utility
 * Extracts text content from various document formats for AI context
 */

import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
}

export interface ExtractedContent {
  text: string;
  pageCount?: number;
  wordCount: number;
  error?: string;
}

/**
 * Extract text from a PDF file
 */
async function extractTextFromPDF(file: File): Promise<ExtractedContent> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const numPages = pdf.numPages;

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return {
      text: fullText.trim(),
      pageCount: numPages,
      wordCount: fullText.trim().split(/\s+/).length
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      text: '',
      wordCount: 0,
      error: `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Extract text from a plain text file
 */
async function extractTextFromTXT(file: File): Promise<ExtractedContent> {
  try {
    const text = await file.text();
    return {
      text: text.trim(),
      wordCount: text.trim().split(/\s+/).length
    };
  } catch (error) {
    console.error('TXT extraction error:', error);
    return {
      text: '',
      wordCount: 0,
      error: `Failed to read text file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Extract text from a DOCX file (limited support - basic text only)
 */
async function extractTextFromDOCX(file: File): Promise<ExtractedContent> {
  try {
    // For now, return a placeholder
    // Full DOCX parsing would require additional libraries like mammoth.js
    return {
      text: `[DOCX File: ${file.name}]\n\nNote: Full DOCX text extraction is not yet supported. Please use the document viewer or convert to PDF.`,
      wordCount: 0,
      error: 'DOCX text extraction not fully supported yet'
    };
  } catch (error) {
    console.error('DOCX extraction error:', error);
    return {
      text: '',
      wordCount: 0,
      error: `Failed to read DOCX file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Main function to extract text from any supported document type
 */
export async function extractDocumentText(file: File): Promise<ExtractedContent> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  console.log('[DocumentTextExtractor] Extracting text from:', fileName, 'Type:', fileType);

  // PDF files
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  }

  // Plain text files
  if (
    fileType === 'text/plain' ||
    fileName.endsWith('.txt') ||
    fileName.endsWith('.md')
  ) {
    return extractTextFromTXT(file);
  }

  // DOCX files
  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return extractTextFromDOCX(file);
  }

  // Unsupported file type
  return {
    text: '',
    wordCount: 0,
    error: `Unsupported file type: ${fileType || fileName.split('.').pop()}`
  };
}

/**
 * Fetch study material from database and extract its text
 */
export async function fetchAndExtractMaterialText(materialId: string): Promise<ExtractedContent> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Fetch material metadata
    const { data: material, error: materialError } = await supabase
      .from('ai_coach_study_materials')
      .select('file_url, file_type, title')
      .eq('id', materialId)
      .single();

    if (materialError || !material) {
      throw new Error('Material not found');
    }

    // Fetch the file from the file_url
    const response = await fetch(material.file_url);
    if (!response.ok) {
      throw new Error('Failed to fetch material file');
    }

    const blob = await response.blob();
    
    // Create File object and extract text
    const file = new File([blob], material.title, {
      type: material.file_type
    });

    return await extractDocumentText(file);
  } catch (error) {
    console.error('Material text extraction error:', error);
    return {
      text: '',
      wordCount: 0,
      error: `Failed to fetch and extract material: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Truncate text to a maximum number of tokens (approximate)
 * Useful for preparing content for AI context
 */
export function truncateToTokenLimit(text: string, maxTokens: number = 3000): string {
  // Rough approximation: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4;
  
  if (text.length <= maxChars) {
    return text;
  }

  // Truncate and add ellipsis
  return text.substring(0, maxChars) + '\n\n[Content truncated due to length...]';
}
