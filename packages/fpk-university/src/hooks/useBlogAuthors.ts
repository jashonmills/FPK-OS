import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface BlogAuthor {
  id: string;
  user_id: string | null;
  display_name: string;
  author_slug?: string;
  bio?: string;
  credentials?: string;
  avatar_url?: string;
  is_ai_author?: boolean;
  social_links?: any;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useBlogAuthors() {
  return useQuery({
    queryKey: ['blog_authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .eq('is_active', true)
        .order('display_name');

      if (error) throw error;
      return data as BlogAuthor[];
    }
  });
}

export function useBlogAuthor(id: string) {
  return useQuery({
    queryKey: ['blog_author', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as BlogAuthor;
    },
    enabled: !!id
  });
}

export function useBlogAuthorBySlug(slug: string) {
  return useQuery({
    queryKey: ['blog_author_slug', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .or(`author_slug.eq.${slug},id.eq.${slug}`)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as BlogAuthor;
    },
    enabled: !!slug
  });
}

export function useCreateBlogAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (author: Partial<BlogAuthor> & { display_name: string; is_ai_author?: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if user is admin
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      const isAdmin = userRoles?.some(r => r.role === 'admin');

      // For non-admins creating non-AI authors, check if they already have an author profile
      if (!isAdmin && !author.is_ai_author) {
        const { data: existingAuthor } = await supabase
          .from('blog_authors')
          .select('id, display_name')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingAuthor) {
          throw new Error(`You already have an author profile: "${existingAuthor.display_name}". Please edit your existing profile or create an AI author instead.`);
        }
      }

      // For AI authors or admin-created authors, set user_id to NULL
      // For regular authors, use the current user's ID
      const authorData = {
        ...author,
        user_id: (author.is_ai_author || isAdmin) ? null : user.id
      };

      const { data, error } = await supabase
        .from('blog_authors')
        .insert([authorData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_authors'] });
      toast({ title: 'Author created successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create author',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
}

export function useUpdateBlogAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...author }: Partial<BlogAuthor> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_authors')
        .update(author)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_authors'] });
      toast({ title: 'Author updated successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update author',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
}

export function useDeleteBlogAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_authors')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_authors'] });
      toast({ title: 'Author deleted successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete author',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
}
