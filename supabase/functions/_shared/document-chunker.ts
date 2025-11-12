/**
 * Chunking strategy for large documents
 */

const CHUNK_SIZE_KB = 1536; // 1.5 MB per chunk (safe for API limits)

export interface DocumentChunk {
  data: Uint8Array;
  index: number;
  totalChunks: number;
}

/**
 * Check if document needs chunking
 */
export function needsChunking(fileSizeKb: number): boolean {
  return fileSizeKb > CHUNK_SIZE_KB;
}

/**
 * Split large PDF/image into processable chunks
 * For PDFs, we split by pages. For images, we can't chunk (not supported yet)
 */
export function chunkDocument(
  fileBytes: Uint8Array,
  fileType: string,
  fileSizeKb: number
): DocumentChunk[] {
  // For now, we don't actually split the file
  // This is a placeholder for future PDF page splitting
  // Instead, we process the whole document in one go
  
  const chunks: DocumentChunk[] = [];
  
  if (needsChunking(fileSizeKb)) {
    // TODO: Implement actual PDF page splitting
    // For now, warn and process as single chunk
    console.warn(`⚠️ Document is ${fileSizeKb}KB but chunking not yet implemented. Processing as single chunk.`);
  }
  
  // Single chunk for now
  chunks.push({
    data: fileBytes,
    index: 0,
    totalChunks: 1
  });
  
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
