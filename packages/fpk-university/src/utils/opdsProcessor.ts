
import { OPDSService } from '@/services/opdsService';
import { PublicDomainBook } from '@/types/publicDomainBooks';

/**
 * Main processing function for OPDS ingestion
 * This would typically run as a scheduled job (weekly) to update the book catalog
 */
export class OPDSProcessor {
  /**
   * Process OPDS feed and return filtered books ready for database storage
   */
  static async processOPDSFeed(): Promise<PublicDomainBook[]> {
    try {
      console.log('🔄 Starting OPDS feed processing...');
      
      // Step 1: Fetch OPDS feed
      const feed = await OPDSService.fetchOPDSFeed();
      console.log(`📚 Found ${feed.entries.length} total books in feed`);
      
      // Step 2: Filter for neurodiversity-relevant content
      const filteredEntries = OPDSService.filterRelevantBooks(feed.entries);
      console.log(`🎯 Filtered to ${filteredEntries.length} relevant books`);
      
      // Step 3: Convert to PublicDomainBook format
      const books: PublicDomainBook[] = [];
      for (const entry of filteredEntries) {
        const book = OPDSService.convertToPublicDomainBook(entry);
        if (book) {
          books.push(book);
        }
      }
      
      console.log(`✅ Processed ${books.length} books successfully`);
      return books;
      
    } catch (error) {
      console.error('❌ Error processing OPDS feed:', error);
      throw error;
    }
  }

  /**
   * Validate book data before storage
   */
  static validateBook(book: PublicDomainBook): boolean {
    const required = ['id', 'title', 'author', 'epub_url'];
    return required.every(field => book[field as keyof PublicDomainBook]);
  }

  /**
   * Clean up old or invalid books from the collection
   */
  static shouldRemoveBook(book: PublicDomainBook, maxAge: number = 30): boolean {
    const lastUpdated = new Date(book.last_updated);
    const daysOld = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    return daysOld > maxAge;
  }
}

/**
 * Example usage for backend processing:
 * 
 * // Weekly cron job
 * async function updatePublicDomainBooks() {
 *   try {
 *     const books = await OPDSProcessor.processOPDSFeed();
 *     
 *     // Store in Supabase
 *     for (const book of books) {
 *       if (OPDSProcessor.validateBook(book)) {
 *         await supabase
 *           .from('public_domain_books')
 *           .upsert(book, { onConflict: 'gutenberg_id' });
 *       }
 *     }
 *     
 *     // Clean up old books
 *     const { data: existingBooks } = await supabase
 *       .from('public_domain_books')
 *       .select('*');
 *     
 *     for (const book of existingBooks || []) {
 *       if (OPDSProcessor.shouldRemoveBook(book)) {
 *         await supabase
 *           .from('public_domain_books')
 *           .delete()
 *           .eq('id', book.id);
 *       }
 *     }
 *     
 *   } catch (error) {
 *     console.error('Failed to update public domain books:', error);
 *   }
 * }
 */
