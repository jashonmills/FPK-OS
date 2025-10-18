import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  published_at: string | null;
  status: string;
  focus_keyword: string | null;
}

interface BlogPreviewDialogProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlogPreviewDialog({ post, open, onOpenChange }: BlogPreviewDialogProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl flex-1">{post.title}</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meta Information */}
          <div className="border-b pb-4 space-y-2">
            {post.published_at && (
              <p className="text-sm text-muted-foreground">
                Published: {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </p>
            )}
            {post.meta_description && (
              <p className="text-sm text-muted-foreground italic">{post.meta_description}</p>
            )}
            {post.focus_keyword && (
              <p className="text-xs text-muted-foreground">
                Focus Keyword: <span className="font-medium">{post.focus_keyword}</span>
              </p>
            )}
          </div>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.featured_image_alt || post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-lg leading-relaxed">{post.excerpt}</p>
            </div>
          )}

          {/* Content Preview */}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: post.content.substring(0, 2000) + (post.content.length > 2000 ? '...' : '')
              }} 
            />
            {post.content.length > 2000 && (
              <p className="text-muted-foreground italic mt-4">
                Content preview truncated. Open in new tab to view the full post.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
