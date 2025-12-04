
import { OPDSFeed, OPDSEntry, PublicDomainBook } from '@/types/publicDomainBooks';

const GUTENBERG_OPDS_URL = 'https://gutenberg.org/ebooks.opds';

// Keywords for filtering neurodiversity-relevant content
const NEURODIVERSITY_KEYWORDS = [
  'autism', 'adhd', 'neurodiversity', 'learning', 'education', 'teaching',
  'psychology', 'behavior', 'development', 'cognitive', 'mind', 'brain',
  'inclusive', 'special needs', 'disability', 'mental health', 'social skills',
  'communication', 'sensory', 'emotional', 'self-help', 'understanding'
];

export class OPDSService {
  /**
   * Fetch and parse OPDS feed from Project Gutenberg
   */
  static async fetchOPDSFeed(): Promise<OPDSFeed> {
    try {
      const response = await fetch(GUTENBERG_OPDS_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch OPDS feed: ${response.status}`);
      }
      
      const xmlText = await response.text();
      return this.parseOPDSXML(xmlText);
    } catch (error) {
      console.error('Error fetching OPDS feed:', error);
      throw error;
    }
  }

  /**
   * Parse OPDS XML into structured data
   */
  static parseOPDSXML(xmlText: string): OPDSFeed {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    
    const feedTitle = doc.querySelector('feed > title')?.textContent || 'Project Gutenberg';
    const feedUpdated = doc.querySelector('feed > updated')?.textContent || new Date().toISOString();
    
    const entries: OPDSEntry[] = [];
    const entryElements = doc.querySelectorAll('entry');
    
    entryElements.forEach(entry => {
      const id = entry.querySelector('id')?.textContent || '';
      const title = entry.querySelector('title')?.textContent || '';
      const author = entry.querySelector('author name')?.textContent || 'Unknown Author';
      const summary = entry.querySelector('summary')?.textContent || '';
      const updated = entry.querySelector('updated')?.textContent || '';
      
      // Extract subjects/categories
      const subjects: string[] = [];
      const categoryElements = entry.querySelectorAll('category');
      categoryElements.forEach(cat => {
        const term = cat.getAttribute('term');
        if (term) subjects.push(term);
      });
      
      // Extract download links
      const links: Array<{ href: string; type: string; rel: string }> = [];
      const linkElements = entry.querySelectorAll('link');
      linkElements.forEach(link => {
        const href = link.getAttribute('href');
        const type = link.getAttribute('type');
        const rel = link.getAttribute('rel');
        if (href && type && rel) {
          links.push({ href, type, rel });
        }
      });
      
      if (id && title) {
        entries.push({
          id,
          title,
          author,
          summary,
          subjects,
          links,
          updated
        });
      }
    });
    
    return {
      title: feedTitle,
      updated: feedUpdated,
      entries
    };
  }

  /**
   * Filter entries for neurodiversity-relevant content
   */
  static filterRelevantBooks(entries: OPDSEntry[]): OPDSEntry[] {
    return entries.filter(entry => {
      const searchText = `${entry.title} ${entry.author} ${entry.summary} ${entry.subjects.join(' ')}`.toLowerCase();
      
      return NEURODIVERSITY_KEYWORDS.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
    });
  }

  /**
   * Convert OPDS entry to PublicDomainBook format
   */
  static convertToPublicDomainBook(entry: OPDSEntry): PublicDomainBook | null {
    // Find EPUB download link
    const epubLink = entry.links.find(link => 
      link.type === 'application/epub+zip' || 
      link.href.includes('.epub')
    );
    
    if (!epubLink) return null;
    
    // Extract Gutenberg ID from entry ID
    const gutenbergId = parseInt(entry.id.split('/').pop() || '0');
    
    // Generate cover URL (Project Gutenberg pattern)
    const coverUrl = `https://gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.cover.medium.jpg`;
    
    return {
      id: entry.id,
      title: entry.title,
      author: entry.author,
      subjects: entry.subjects,
      cover_url: coverUrl,
      epub_url: epubLink.href,
      gutenberg_id: gutenbergId,
      description: entry.summary,
      language: 'en', // Most Gutenberg books are English
      last_updated: entry.updated,
      created_at: new Date().toISOString()
    };
  }
}
