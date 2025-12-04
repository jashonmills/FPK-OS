import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HelpArticleViewerProps {
  article: {
    id: string;
    slug: string;
    title: string;
    content: string;
    category: string;
  };
}

export const HelpArticleViewer = ({ article }: HelpArticleViewerProps) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = async (helpful: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('help_analytics').insert({
        user_id: user.id,
        article_slug: article.slug,
        action: helpful ? 'helpful' : 'not_helpful',
        metadata: {},
      });

      setFeedbackGiven(true);
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        <p className="text-sm text-muted-foreground capitalize">{article.category} Features</p>
      </div>

      <Card className="p-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-semibold mt-5 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>,
              p: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-4 bg-muted/50 py-2">
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                ) : (
                  <code className={className}>{children}</code>
                );
              },
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </Card>

      {!feedbackGiven && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Was this article helpful?</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedback(true)}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Yes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedback(false)}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                No
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
