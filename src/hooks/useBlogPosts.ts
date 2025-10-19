import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string | null;
  author_id: string | null;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  published_at: string | null;
  scheduled_for: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  content: string;
  excerpt: string | null;
  focus_keyword: string | null;
  seo_score: number;
  readability_score: number | null;
  word_count: number;
  read_time_minutes: number;
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
  blog_authors?: {
    id: string;
    display_name: string;
    author_slug?: string;
    bio?: string;
    credentials?: string;
    avatar_url?: string;
    is_ai_author?: boolean;
  };
  categories?: string[]; // Array of category IDs
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  usage_count: number;
}

export function useBlogPosts(status?: string) {
  return useQuery({
    queryKey: ['blog_posts', status],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data: posts, error: postsError } = await query;
      if (postsError) throw postsError;

      // Fetch authors separately
      const authorIds = [...new Set(posts?.map(p => p.author_id).filter(Boolean))];
      
      const authorsPromise = authorIds.length > 0 
        ? supabase.from('blog_authors').select('*').in('id', authorIds)
        : Promise.resolve({ data: [], error: null });

      // Fetch category relationships for all posts
      const postIds = posts?.map(p => p.id) || [];
      const categoriesPromise = postIds.length > 0
        ? supabase.from('blog_post_categories').select('post_id, category_id').in('post_id', postIds)
        : Promise.resolve({ data: [], error: null });

      const [authorsResult, categoriesResult] = await Promise.all([authorsPromise, categoriesPromise]);

      if (authorsResult.error) throw authorsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;

      // Combine posts with authors and categories
      const postsWithAuthors = posts?.map(post => ({
        ...post,
        blog_authors: post.author_id 
          ? authorsResult.data?.find(a => a.id === post.author_id) 
          : undefined,
        categories: categoriesResult.data
          ?.filter(pc => pc.post_id === post.id)
          .map(pc => pc.category_id) || []
      }));

      return postsWithAuthors as BlogPost[];
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog_post', slug],
    queryFn: async () => {
      const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!post) return null;

      // Fetch author separately if exists
      if (post.author_id) {
        const { data: author } = await supabase
          .from('blog_authors')
          .select('*')
          .eq('id', post.author_id)
          .maybeSingle();

        return {
          ...post,
          blog_authors: author || undefined
        } as BlogPost;
      }

      return post as BlogPost;
    },
    enabled: !!slug,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: any) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast({
        title: 'Success',
        description: 'Blog post created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog_post', data.slug] });
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ['blog_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as BlogCategory[];
    },
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: ['blog_tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) throw error;
      return data as BlogTag[];
    },
  });
}