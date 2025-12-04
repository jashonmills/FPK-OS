
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface PendingBook {
  id: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
  user_id: string;
  uploader_email?: string;
}

export const useAdminBookApproval = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending books with uploader information
  const { data: pendingBooks = [], isLoading } = useQuery({
    queryKey: ['admin-pending-books'],
    queryFn: async () => {
      console.log('📚 Fetching pending books for admin review...');
      
      // First get pending books
      const { data: books, error: booksError } = await supabase
        .from('user_uploaded_books')
        .select('id, file_name, file_url, uploaded_at, user_id')
        .eq('status', 'pending')
        .order('uploaded_at', { ascending: false });

      if (booksError) {
        console.error('Error fetching pending books:', booksError);
        throw booksError;
      }

      // Get uploader emails from profiles table
      const userIds = books.map(book => book.user_id);
      if (userIds.length === 0) return [];

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
      }

      // Combine books with uploader info
      const booksWithUploaders = books.map(book => ({
        ...book,
        uploader_email: profiles?.find(p => p.id === book.user_id)?.full_name || 'Unknown User'
      }));

      console.log(`📚 Found ${booksWithUploaders.length} pending books`);
      return booksWithUploaders as PendingBook[];
    },
    enabled: !!user,
  });

  // Approve individual book
  const approveBookMutation = useMutation({
    mutationFn: async (bookId: string) => {
      const { error } = await supabase
        .from('user_uploaded_books')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq('id', bookId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-books'] });
      queryClient.invalidateQueries({ queryKey: ['approved-uploaded-books'] });
      toast({
        title: "Book approved",
        description: "The book has been approved and added to the community library.",
      });
    },
    onError: (error) => {
      console.error('Error approving book:', error);
      toast({
        title: "Error approving book",
        description: "Failed to approve the book. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Reject individual book
  const rejectBookMutation = useMutation({
    mutationFn: async ({ bookId, notes }: { bookId: string; notes?: string }) => {
      const { error } = await supabase
        .from('user_uploaded_books')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
          notes: notes || 'Rejected by admin'
        })
        .eq('id', bookId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-books'] });
      toast({
        title: "Book rejected",
        description: "The book has been rejected.",
      });
    },
    onError: (error) => {
      console.error('Error rejecting book:', error);
      toast({
        title: "Error rejecting book",
        description: "Failed to reject the book. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Bulk approve books
  const bulkApproveMutation = useMutation({
    mutationFn: async (bookIds: string[]) => {
      const { error } = await supabase
        .from('user_uploaded_books')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .in('id', bookIds);

      if (error) throw error;
    },
    onSuccess: (_, bookIds) => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-books'] });
      queryClient.invalidateQueries({ queryKey: ['approved-uploaded-books'] });
      toast({
        title: "Books approved",
        description: `${bookIds.length} books have been approved and added to the community library.`,
      });
    },
    onError: (error) => {
      console.error('Error bulk approving books:', error);
      toast({
        title: "Error approving books",
        description: "Failed to approve the selected books. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Bulk reject books
  const bulkRejectMutation = useMutation({
    mutationFn: async ({ bookIds, notes }: { bookIds: string[]; notes?: string }) => {
      const { error } = await supabase
        .from('user_uploaded_books')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
          notes: notes || 'Rejected by admin'
        })
        .in('id', bookIds);

      if (error) throw error;
    },
    onSuccess: (_, { bookIds }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-books'] });
      toast({
        title: "Books rejected",
        description: `${bookIds.length} books have been rejected.`,
      });
    },
    onError: (error) => {
      console.error('Error bulk rejecting books:', error);
      toast({
        title: "Error rejecting books",
        description: "Failed to reject the selected books. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    pendingBooks,
    isLoading,
    approveBook: approveBookMutation.mutate,
    rejectBook: rejectBookMutation.mutate,
    bulkApprove: bulkApproveMutation.mutate,
    bulkReject: bulkRejectMutation.mutate,
    isApproving: approveBookMutation.isPending,
    isRejecting: rejectBookMutation.isPending,
    isBulkApproving: bulkApproveMutation.isPending,
    isBulkRejecting: bulkRejectMutation.isPending,
  };
};
