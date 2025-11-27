/**
 * Utility functions for converting HTML content to clean, readable text
 * and extracting meaningful content from SCORM packages
 */

/**
 * Convert HTML content to clean plain text
 * Strips HTML tags while preserving basic structure and readability
 */
export function htmlToText(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html
    // Remove script and style elements completely
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    
    // Convert common block elements to line breaks
    .replace(/<\/?(div|p|br|h[1-6]|li|tr)[^>]*>/gi, '\n')
    .replace(/<\/?(ul|ol|table)[^>]*>/gi, '\n\n')
    
    // Remove all remaining HTML tags
    .replace(/<[^>]*>/g, '')
    
    // Decode HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    
    // Clean up whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple line breaks with double
    .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
    .trim();
}

/**
 * Extract clean title from potentially HTML-encoded text
 */
export function cleanTitle(title: string): string {
  if (!title) return '';
  
  return htmlToText(title)
    .replace(/^(lesson|module|chapter|unit|topic)\s*\d*:?\s*/i, '') // Remove common prefixes
    .trim();
}

/**
 * Remove SCORM-specific prefixes and clean up descriptions
 */
export function cleanScormContent(content: string): string {
  if (!content) return '';
  
  return content
    .replace(/^imported from scorm:\s*/i, '') // Remove "Imported from SCORM:" prefix
    .replace(/content imported from scorm package/i, '') // Remove generic placeholder text
    .replace(/<div class="scorm-content">/gi, '') // Remove SCORM wrapper divs
    .replace(/<\/div>/gi, '')
    .trim();
}

/**
 * Extract meaningful content summary from HTML
 * Returns first paragraph or meaningful text content
 */
export function extractContentSummary(html: string, maxLength: number = 150): string {
  const text = htmlToText(html);
  const cleaned = cleanScormContent(text);
  
  if (!cleaned || cleaned.length === 0) {
    return '';
  }
  
  // Get first meaningful paragraph
  const paragraphs = cleaned.split('\n\n').filter(p => p.trim().length > 10);
  const firstParagraph = paragraphs[0] || cleaned;
  
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }
  
  // Truncate at word boundary
  const truncated = firstParagraph.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return (lastSpace > maxLength * 0.7 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

/**
 * Check if content appears to be placeholder/generic content
 */
export function isPlaceholderContent(content: string): boolean {
  if (!content) return true;
  
  const cleaned = cleanScormContent(htmlToText(content)).toLowerCase();
  
  const placeholderPhrases = [
    'content imported from scorm',
    'imported from scorm',
    'placeholder',
    'lorem ipsum',
    'sample content',
    'example content'
  ];
  
  return placeholderPhrases.some(phrase => cleaned.includes(phrase)) || cleaned.length < 10;
}