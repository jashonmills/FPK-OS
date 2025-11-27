
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PublicDomainBook } from '@/types/publicDomainBooks';

interface AddBookData {
  openlibrary_key: string;
  title: string;
  author: string;
  cover_i?: number;
  first_publish_year?: number;
}

export const useAddPublicDomainBook = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (bookData: AddBookData): Promise<PublicDomainBook> => {
      console.log('📚 Adding book to public domain collection:', bookData.title);

      // Check if book already exists
      const { data: existingBook } = await supabase
        .from('public_domain_books')
        .select('id')
        .eq('openlibrary_key', bookData.openlibrary_key)
        .maybeSingle();

      if (existingBook) {
        throw new Error('Book already exists in collection');
      }

      // Generate a unique ID and create book record
      const bookId = `openlibrary-${bookData.openlibrary_key.replace('/works/', '')}`;
      
      const newBook = {
        id: bookId,
        title: bookData.title,
        author: bookData.author,
        subjects: ['literature', 'public domain'],
        cover_url: bookData.cover_i 
          ? `https://covers.openlibrary.org/b/id/${bookData.cover_i}-L.jpg`
          : null,
        epub_url: `https://openlibrary.org${bookData.openlibrary_key}`, // Placeholder for now
        gutenberg_id: Math.floor(Math.random() * 999999) + 100000, // Generate pseudo-ID
        description: `Added from OpenLibrary. First published: ${bookData.first_publish_year || 'Unknown'}`,
        language: 'en',
        openlibrary_key: bookData.openlibrary_key,
        is_user_added: true
      };

      const { data, error } = await supabase
        .from('public_domain_books')
        .insert(newBook)
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding book:', error);
        throw new Error(`Failed to add book: ${error.message}`);
      }

      console.log('✅ Successfully added book to collection');
      return data as PublicDomainBook;
    },
    onSuccess: () => {
      // Invalidate and refetch the public domain books
      queryClient.invalidateQueries({ queryKey: ['publicDomainBooks'] });
    },
  });

  return {
    addBook: mutation.mutate,
    isAdding: mutation.isPending,
    error: mutation.error?.message || null,
  };
};
