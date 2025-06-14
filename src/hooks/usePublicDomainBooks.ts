
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PublicDomainBook } from '@/types/publicDomainBooks';

// Mock data for testing - will be replaced with real Supabase data once migration is run
const mockBooks: PublicDomainBook[] = [
  {
    id: 'gutenberg-1',
    title: 'The Art of Teaching: Methods for All Subjects',
    author: 'John Dewey',
    subjects: ['education', 'teaching', 'learning', 'psychology'],
    cover_url: 'https://www.gutenberg.org/cache/epub/1/pg1.cover.medium.jpg',
    epub_url: 'https://www.gutenberg.org/ebooks/1.epub.noimages',
    gutenberg_id: 1,
    description: 'A comprehensive guide to teaching methods that accommodate different learning styles and abilities.',
    language: 'en',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'gutenberg-2',
    title: 'Understanding Child Development',
    author: 'Maria Montessori',
    subjects: ['child development', 'education', 'psychology', 'learning'],
    cover_url: 'https://www.gutenberg.org/cache/epub/2/pg2.cover.medium.jpg',
    epub_url: 'https://www.gutenberg.org/ebooks/2.epub.noimages',
    gutenberg_id: 2,
    description: 'Insights into how children learn and develop, with special attention to individual differences.',
    language: 'en',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'gutenberg-3',
    title: 'The Mind and How to Use It',
    author: 'William Walker Atkinson',
    subjects: ['psychology', 'mind', 'cognitive', 'self-help'],
    cover_url: 'https://www.gutenberg.org/cache/epub/3/pg3.cover.medium.jpg',
    epub_url: 'https://www.gutenberg.org/ebooks/3.epub.noimages',
    gutenberg_id: 3,
    description: 'A practical guide to understanding how the mind works and how to optimize mental performance.',
    language: 'en',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'gutenberg-4',
    title: 'Social Skills for Young People',
    author: 'Jane Addams',
    subjects: ['social skills', 'communication', 'youth', 'development'],
    cover_url: 'https://www.gutenberg.org/cache/epub/4/pg4.cover.medium.jpg',
    epub_url: 'https://www.gutenberg.org/ebooks/4.epub.noimages',
    gutenberg_id: 4,
    description: 'Essential social skills and communication strategies for young people navigating social situations.',
    language: 'en',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'gutenberg-5',
    title: 'Emotional Intelligence in Education',
    author: 'William James',
    subjects: ['emotional intelligence', 'education', 'psychology', 'students'],
    cover_url: 'https://www.gutenberg.org/cache/epub/5/pg5.cover.medium.jpg',
    epub_url: 'https://www.gutenberg.org/ebooks/5.epub.noimages',
    gutenberg_id: 5,
    description: 'How emotional intelligence impacts learning and academic success.',
    language: 'en',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'gutenberg-6',
    title: 'The Science of Learning',
    author: 'Hermann Ebbinghaus',
    subjects: ['learning', 'memory', 'cognitive science', 'education'],
    cover_url: 'https://www.gutenberg.org/cache/epub/6/pg6.cover.medium.jpg',
    epub_url: 'https://www.gutenberg.org/ebooks/6.epub.noimages',
    gutenberg_id: 6,
    description: 'Scientific principles behind how we learn and remember information.',
    language: 'en',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'gutenberg-7',
    title: 'Understanding Different Learning Styles',
    author: 'Helen Keller',
    subjects: ['learning styles', 'education', 'accessibility', 'inclusion'],
    cover_url: 'https://www.gutenberg.org/cache/epub/7/pg7.cover.medium.jpg',
    epub_url: 'https://www.gutenberg.org/ebooks/7.epub.noimages',
    gutenberg_id: 7,
    description: 'Insights into how different people learn and the importance of accessible education.',
    language: 'en',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'gutenberg-8',
    title: 'Inclusive Teaching Methods',
    author: 'Temple Grandin',
    subjects: ['inclusive education', 'teaching', 'autism', 'neurodiversity'],
    cover_url: 'https://www.gutenberg.org/cache/epub/8/pg8.cover.medium.jpg',
    epub_url: 'https://www.gutenberg.org/ebooks/8.epub.noimages',
    gutenberg_id: 8,
    description: 'Teaching strategies that work for students with diverse learning needs and abilities.',
    language: 'en',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

export const usePublicDomainBooks = () => {
  const { data: books = [], isLoading, error, refetch } = useQuery({
    queryKey: ['publicDomainBooks'],
    queryFn: async (): Promise<PublicDomainBook[]> => {
      console.log('🔄 Loading public domain books (mock data)...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`✅ Loaded ${mockBooks.length} books from mock data`);
      return mockBooks;
      
      // TODO: Replace with real Supabase query once migration is run:
      // const { data, error } = await supabase
      //   .from('public_domain_books')
      //   .select('*')
      //   .order('created_at', { ascending: false });
      // 
      // if (error) {
      //   console.error('❌ Error fetching public domain books:', error);
      //   throw new Error(`Failed to fetch books: ${error.message}`);
      // }
      // 
      // console.log(`✅ Loaded ${data?.length || 0} books from database`);
      // return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  return {
    books,
    isLoading,
    error: error?.message || null,
    refetch
  };
};
