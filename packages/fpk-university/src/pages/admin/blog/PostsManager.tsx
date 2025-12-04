import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileEdit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { useBlogPosts, useDeleteBlogPost, BlogPost } from '@/hooks/useBlogPosts';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobilePostCard } from '@/components/admin/MobilePostCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransparentTile } from '@/components/ui/transparent-tile';
import { PostPreviewDialog } from '@/components/blog/PostPreviewDialog';
import { AIBlogWizard } from '@/components/blog/AIBlogWizard';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function PostsManager() {
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: posts = [], isLoading } = useBlogPosts(statusFilter);
  const deletePost = useDeleteBlogPost();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any>(null);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showAIWizard, setShowAIWizard] = useState(false);

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    try {
      await deletePost.mutateAsync(postToDelete.id);
      toast({ title: 'Post deleted successfully' });
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Failed to delete post',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'archived':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="h-12 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Generator Card */}
      <Card className="bg-gradient-to-br from-pink-500/5 to-purple-500/5 border-pink-500/20">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Sparkles className="h-5 w-5 text-pink-600 shrink-0" />
            <span>AI Content Generator</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Create SEO-optimized blog posts with AI from your knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <Button 
            onClick={() => setShowAIWizard(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-full min-h-[44px]"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Articles
          </Button>
        </CardContent>
      </Card>

      {/* All Articles Section */}
      <TransparentTile className="p-4 sm:p-6">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold">All Articles</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage your published and draft content</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px] min-h-[44px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm z-50">
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => navigate('/dashboard/admin/blog/new')} 
              size="sm"
              className="w-full sm:w-auto min-h-[44px]"
            >
              <FileEdit className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>
        </div>
      </TransparentTile>

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No posts found. {statusFilter !== 'all' && 'Try changing the filter or '}
              Create your first blog post from the Blog Hub.
            </div>
          ) : (
            posts.map((post) => (
              <MobilePostCard
                key={post.id}
                post={post}
                onView={() => {
                  setPreviewPost(post);
                  setPreviewOpen(true);
                }}
                onEdit={() => navigate(`/dashboard/admin/blog/edit/${post.slug}`)}
                onDelete={() => {
                  setPostToDelete(post);
                  setDeleteDialogOpen(true);
                }}
                getStatusBadgeColor={getStatusBadgeColor}
              />
            ))
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="border rounded-lg bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold min-w-[200px]">Title</TableHead>
                <TableHead className="hidden md:table-cell font-semibold">Status</TableHead>
                <TableHead className="hidden lg:table-cell font-semibold">Views</TableHead>
                <TableHead className="hidden xl:table-cell font-semibold">Updated</TableHead>
                <TableHead className="text-right font-semibold sticky right-0 bg-card">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No posts found. {statusFilter !== 'all' && 'Try changing the filter or '}
                    Create your first blog post from the Blog Hub.
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium line-clamp-1">{post.title}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(post.status)}`}>
                            {post.status}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(post.status)}`}>
                        {post.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5" />
                        {post.views_count}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-muted-foreground text-sm">
                      {post.updated_at ? format(new Date(post.updated_at), 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setPreviewPost(post);
                            setPreviewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => navigate(`/dashboard/admin/blog/edit/${post.slug}`)}
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setPostToDelete(post);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <PostPreviewDialog
        post={previewPost}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      <AIBlogWizard open={showAIWizard} onOpenChange={setShowAIWizard} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
