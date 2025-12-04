
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserUploadedBook {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserUploadedBooks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's own uploads
  const { data: userUploads = [], isLoading: isLoadingUserUploads } = useQuery({
    queryKey: ['user-uploaded-books', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_uploaded_books')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching user uploads:', error);
        throw error;
      }

      return data as UserUploadedBook[];
    },
    enabled: !!user,
  });

  // Get all approved uploads for global library
  const { data: approvedUploads = [], isLoading: isLoadingApproved } = useQuery({
    queryKey: ['approved-uploaded-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_uploaded_books')
        .select('*')
        .eq('status', 'approved')
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching approved uploads:', error);
        throw error;
      }

      return data as UserUploadedBook[];
    },
  });

  // Upload a new PDF
  const uploadPDFMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');

      console.log('📤 Starting PDF upload for:', file.name);
      
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `user-uploads/${user.id}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('library-book-pdf')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('📤 File uploaded to storage:', uploadData.path);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('library-book-pdf')
        .getPublicUrl(uploadData.path);

      console.log('📤 Public URL generated:', publicUrl);

      // Insert record into database
      const { data: dbData, error: dbError } = await supabase
        .from('user_uploaded_books')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      console.log('📤 Upload completed:', dbData);
      return dbData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-uploaded-books', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['approved-uploaded-books'] });
    },
  });

  return {
    userUploads,
    approvedUploads,
    isLoadingUserUploads,
    isLoadingApproved,
    uploadPDF: uploadPDFMutation.mutate,
    isUploading: uploadPDFMutation.isPending,
    uploadError: uploadPDFMutation.error,
  };
};
