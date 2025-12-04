/**
 * Chunking strategy for large documents
 * 
 * IMPORTANT: Claude's PDF API can handle multi-page PDFs natively up to 32MB.
 * Since we can't split PDFs without external libraries in Deno, we rely on:
 * 1. Claude's native PDF processing (handles pages internally)
 * 2. File size limits enforced before upload
 * 3. Model fallback hierarchy for reliability
 * 
 * Future enhancement: If PDF splitting is needed, consider using a 
 * dedicated service or library that supports page extraction.
 */

const CHUNK_SIZE_KB = 1536; // 1.5 MB per chunk (theoretical limit)
const MAX_SINGLE_CHUNK_KB = 5120; // 5 MB - process as single chunk if below this

export interface DocumentChunk {
  data: Uint8Array;
  index: number;
  totalChunks: number;
}

/**
 * Check if document needs chunking
 * Currently, we process everything as a single chunk since:
 * - Claude API handles multi-page PDFs natively
 * - File size is pre-validated to be under 5MB
 * - Splitting PDFs requires external libraries not available in Deno
 */
export function needsChunking(fileSizeKb: number): boolean {
  // For now, always return false since we process whole documents
  // Future: Could return true if fileSizeKb > MAX_SINGLE_CHUNK_KB and implement actual splitting
  return false;
}

/**
 * Process document for extraction
 * 
 * CURRENT IMPLEMENTATION:
 * - Processes entire document as single chunk
 * - Claude API handles multi-page PDFs internally
 * - File size pre-validated to be under 5MB limit
 * 
 * FUTURE ENHANCEMENT (if needed):
 * To implement true page-by-page chunking:
 * 1. Use a PDF library (e.g., pdf-lib, pdf.js) to split PDF by pages
 * 2. Create separate chunks for each page or group of pages
 * 3. Process chunks sequentially through model fallback
 * 4. Combine results with combineChunks()
 * 
 * NOTE: This requires adding external dependencies which may increase
 * edge function cold start time and complexity.
 */
export function chunkDocument(
  fileBytes: Uint8Array,
  fileType: string,
  fileSizeKb: number
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  
  // Log document info for monitoring
  console.log(`📄 Processing document: ${(fileSizeKb / 1024).toFixed(2)}MB, type: ${fileType}`);
  
  if (fileSizeKb > MAX_SINGLE_CHUNK_KB) {
    console.warn(`⚠️ Large document detected: ${(fileSizeKb / 1024).toFixed(2)}MB`);
    console.warn(`   Relying on Claude's native multi-page PDF processing`);
    console.warn(`   Consider implementing PDF splitting if extraction fails`);
  }
  
  // Process as single chunk - Claude handles pagination internally
  chunks.push({
    data: fileBytes,
    index: 0,
    totalChunks: 1
  });
  
  console.log(`✓ Created ${chunks.length} chunk(s) for processing`);
  
  return chunks;
}

/**
 * Combine extracted text from multiple chunks
 */
export function combineChunks(chunkResults: Array<{ text: string; index: number }>): string {
  // Sort by index
  chunkResults.sort((a, b) => a.index - b.index);
  
  // Combine with spacing
  return chunkResults
    .map(chunk => chunk.text)
    .join('\n\n---PAGE BREAK---\n\n');
}
