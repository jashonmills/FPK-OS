
import { useState, useEffect } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';

export const usePublicDomainBooks = () => {
  const [books, setBooks] = useState<PublicDomainBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicDomainBooks();
  }, []);

  const fetchPublicDomainBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, we'll use mock data. In a real implementation, this would
      // fetch from a Supabase table populated by the OPDS ingestion service
      const mockBooks: PublicDomainBook[] = [
        {
          id: 'gutenberg-1',
          title: 'The Psychology of Learning',
          author: 'Educational Collective',
          subjects: ['psychology', 'education', 'learning'],
          cover_url: 'https://covers.openlibrary.org/b/id/8225261-M.jpg',
          epub_url: 'https://example.com/psychology-learning.epub',
          gutenberg_id: 12345,
          description: 'A comprehensive guide to understanding how we learn and process information.',
          language: 'en',
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: 'gutenberg-2',
          title: 'Understanding Different Minds',
          author: 'Dr. Sarah Johnson',
          subjects: ['psychology', 'neurodiversity', 'autism'],
          cover_url: 'https://covers.openlibrary.org/b/id/8225262-M.jpg',
          epub_url: 'https://example.com/different-minds.epub',
          gutenberg_id: 12346,
          description: 'Exploring the beautiful diversity of human cognition and neurodiversity.',
          language: 'en',
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: 'gutenberg-3',
          title: 'Inclusive Teaching Methods',
          author: 'Educational Research Group',
          subjects: ['education', 'teaching', 'inclusive'],
          cover_url: 'https://covers.openlibrary.org/b/id/8225263-M.jpg',
          epub_url: 'https://example.com/inclusive-teaching.epub',
          gutenberg_id: 12347,
          description: 'Modern approaches to inclusive education that work for all learners.',
          language: 'en',
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ];
      
      setBooks(mockBooks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    books,
    isLoading,
    error,
    refetch: fetchPublicDomainBooks
  };
};
