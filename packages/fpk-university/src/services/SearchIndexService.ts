
/**
 * Client-side search index using trie data structure for instant typeahead
 */

import { PublicDomainBook } from '@/types/publicDomainBooks';

interface TrieNode {
  children: Map<string, TrieNode>;
  books: Set<string>; // Book IDs that match this prefix
  isWordEnd: boolean;
}

interface SearchSuggestion {
  term: string;
  type: 'title' | 'author' | 'subject';
  bookCount: number;
  books: string[]; // Sample book IDs
}

class SearchIndexService {
  private titleTrie: TrieNode;
  private authorTrie: TrieNode;
  private subjectTrie: TrieNode;
  private booksIndex: Map<string, PublicDomainBook>;
  private searchHistory: Map<string, number>; // term -> frequency
  private popularTerms: string[];

  constructor() {
    this.titleTrie = this.createTrieNode();
    this.authorTrie = this.createTrieNode();
    this.subjectTrie = this.createTrieNode();
    this.booksIndex = new Map();
    this.searchHistory = new Map();
    this.popularTerms = [];
  }

  private createTrieNode(): TrieNode {
    return {
      children: new Map(),
      books: new Set(),
      isWordEnd: false
    };
  }

  /**
   * Index books for fast searching
   */
  indexBooks(books: PublicDomainBook[]): void {
    console.log('🔍 Building search index for', books.length, 'books...');
    
    // Clear existing indices
    this.titleTrie = this.createTrieNode();
    this.authorTrie = this.createTrieNode();
    this.subjectTrie = this.createTrieNode();
    this.booksIndex.clear();

    books.forEach(book => {
      this.booksIndex.set(book.id, book);
      
      // Index title
      this.insertIntoTrie(this.titleTrie, book.title.toLowerCase(), book.id);
      
      // Index author
      this.insertIntoTrie(this.authorTrie, book.author.toLowerCase(), book.id);
      
      // Index subjects
      book.subjects?.forEach(subject => {
        this.insertIntoTrie(this.subjectTrie, subject.toLowerCase(), book.id);
      });
    });

    console.log('✅ Search index built successfully');
  }

  private insertIntoTrie(root: TrieNode, word: string, bookId: string): void {
    let current = root;
    
    // Insert each character
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, this.createTrieNode());
      }
      current = current.children.get(char)!;
      current.books.add(bookId);
    }
    
    current.isWordEnd = true;
  }

  /**
   * Get instant search suggestions as user types
   */
  getInstantSuggestions(query: string, maxSuggestions = 8): SearchSuggestion[] {
    if (!query.trim() || query.length < 2) return [];

    const normalizedQuery = query.toLowerCase();
    const suggestions: SearchSuggestion[] = [];

    // Get suggestions from each trie
    const titleSuggestions = this.getTrieSuggestions(this.titleTrie, normalizedQuery, 'title');
    const authorSuggestions = this.getTrieSuggestions(this.authorTrie, normalizedQuery, 'author');
    const subjectSuggestions = this.getTrieSuggestions(this.subjectTrie, normalizedQuery, 'subject');

    // Combine and prioritize suggestions
    suggestions.push(...titleSuggestions.slice(0, 3));
    suggestions.push(...authorSuggestions.slice(0, 3));
    suggestions.push(...subjectSuggestions.slice(0, 2));

    // Sort by relevance (book count and search history)
    return suggestions
      .sort((a, b) => {
        const aFreq = this.searchHistory.get(a.term) || 0;
        const bFreq = this.searchHistory.get(b.term) || 0;
        
        if (aFreq !== bFreq) return bFreq - aFreq;
        return b.bookCount - a.bookCount;
      })
      .slice(0, maxSuggestions);
  }

  private getTrieSuggestions(root: TrieNode, prefix: string, type: 'title' | 'author' | 'subject'): SearchSuggestion[] {
    let current = root;
    
    // Navigate to prefix
    for (const char of prefix) {
      if (!current.children.has(char)) return [];
      current = current.children.get(char)!;
    }

    // Collect suggestions from this point
    const suggestions: SearchSuggestion[] = [];
    this.collectSuggestions(current, prefix, type, suggestions, 5);
    
    return suggestions;
  }

  private collectSuggestions(
    node: TrieNode, 
    currentWord: string, 
    type: 'title' | 'author' | 'subject',
    suggestions: SearchSuggestion[],
    maxDepth: number
  ): void {
    if (maxDepth <= 0 || suggestions.length >= 10) return;

    if (node.isWordEnd && node.books.size > 0) {
      suggestions.push({
        term: currentWord,
        type,
        bookCount: node.books.size,
        books: Array.from(node.books).slice(0, 3)
      });
    }

    // Continue collecting from children
    for (const [char, childNode] of node.children) {
      this.collectSuggestions(
        childNode, 
        currentWord + char, 
        type, 
        suggestions, 
        maxDepth - 1
      );
    }
  }

  /**
   * Perform instant search on indexed books
   */
  instantSearch(query: string): PublicDomainBook[] {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase();
    const matchingBookIds = new Set<string>();

    // Search in titles
    this.searchInTrie(this.titleTrie, normalizedQuery, matchingBookIds);
    
    // Search in authors
    this.searchInTrie(this.authorTrie, normalizedQuery, matchingBookIds);
    
    // Search in subjects
    this.searchInTrie(this.subjectTrie, normalizedQuery, matchingBookIds);

    // Convert IDs to books and rank by relevance
    const books = Array.from(matchingBookIds)
      .map(id => this.booksIndex.get(id))
      .filter(Boolean) as PublicDomainBook[];

    return this.rankSearchResults(books, query);
  }

  private searchInTrie(root: TrieNode, query: string, results: Set<string>): void {
    let current = root;
    
    // Navigate to query prefix
    for (const char of query) {
      if (!current.children.has(char)) return;
      current = current.children.get(char)!;
    }

    // Add all books that match this prefix
    current.books.forEach(bookId => results.add(bookId));
  }

  private rankSearchResults(books: PublicDomainBook[], query: string): PublicDomainBook[] {
    const normalizedQuery = query.toLowerCase();
    
    return books.sort((a, b) => {
      // Exact title matches first
      const aExactTitle = a.title.toLowerCase() === normalizedQuery ? 1 : 0;
      const bExactTitle = b.title.toLowerCase() === normalizedQuery ? 1 : 0;
      if (aExactTitle !== bExactTitle) return bExactTitle - aExactTitle;

      // Title starts with query
      const aTitleStart = a.title.toLowerCase().startsWith(normalizedQuery) ? 1 : 0;
      const bTitleStart = b.title.toLowerCase().startsWith(normalizedQuery) ? 1 : 0;
      if (aTitleStart !== bTitleStart) return bTitleStart - aTitleStart;

      // Author matches
      const aAuthorMatch = a.author.toLowerCase().includes(normalizedQuery) ? 1 : 0;
      const bAuthorMatch = b.author.toLowerCase().includes(normalizedQuery) ? 1 : 0;
      if (aAuthorMatch !== bAuthorMatch) return bAuthorMatch - aAuthorMatch;

      // Default to alphabetical by title
      return a.title.localeCompare(b.title);
    });
  }

  /**
   * Record search term for analytics and suggestions
   */
  recordSearch(term: string): void {
    const normalizedTerm = term.toLowerCase().trim();
    if (!normalizedTerm) return;

    const current = this.searchHistory.get(normalizedTerm) || 0;
    this.searchHistory.set(normalizedTerm, current + 1);

    // Update popular terms list
    this.updatePopularTerms();
  }

  private updatePopularTerms(): void {
    this.popularTerms = Array.from(this.searchHistory.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([term]) => term);
  }

  /**
   * Get popular search terms for suggestions
   */
  getPopularTerms(): string[] {
    return [...this.popularTerms];
  }

  /**
   * Get search statistics
   */
  getSearchStats() {
    return {
      indexedBooks: this.booksIndex.size,
      searchHistory: this.searchHistory.size,
      popularTerms: this.popularTerms.length,
      totalSearches: Array.from(this.searchHistory.values()).reduce((sum, count) => sum + count, 0)
    };
  }

  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    this.searchHistory.clear();
    this.popularTerms = [];
  }
}

// Global search index instance
export const searchIndexService = new SearchIndexService();
