import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';

interface ArticleViewerModalProps {
  article: any;
  onClose: () => void;
}

export function ArticleViewerModal({ article, onClose }: ArticleViewerModalProps) {
  if (!article) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DialogTitle className="flex-1">{article.title}</DialogTitle>
              <Badge variant={article.is_published ? 'default' : 'secondary'}>
                {article.is_published ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {article.author?.name && <span>{article.author.name}</span>}
              {article.category?.name && <span>{article.category.name}</span>}
              {article.reading_time_minutes && <span>{article.reading_time_minutes} min read</span>}
              {article.updated_at && <span>Updated {format(new Date(article.updated_at), 'MMM d, yyyy')}</span>}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 mt-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {article.description && (
              <div className="text-muted-foreground italic mb-4">
                {article.description}
              </div>
            )}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content || 'No content available'}
            </ReactMarkdown>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
