import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BlogPost } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import { Calendar, Clock, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';

interface PostPreviewDialogProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostPreviewDialog({ post, open, onOpenChange }: PostPreviewDialogProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Preview: {post.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {post.featured_image_url && (
            <div className="relative h-64 w-full overflow-hidden rounded-lg">
              <img
                src={post.featured_image_url}
                alt={post.featured_image_alt || post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            
            {post.excerpt && (
              <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">{post.status}</Badge>
              {post.published_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.read_time_minutes} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views_count} views</span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none dark:prose-invert">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
