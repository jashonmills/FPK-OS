import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArticleEditorModal } from './ArticleEditorModal';

export function ArticleListManager() {
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_articles')
        .select(`
          *,
          article_categories(name, slug),
          article_authors(name, credentials)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from('public_articles')
        .update({ is_published: !isPublished })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Article updated successfully');
    },
    onError: () => {
      toast.error('Failed to update article');
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('public_articles')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Article deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete article');
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading articles...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Articles ({articles?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles?.map((article) => (
              <div
                key={article.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{article.title}</h3>
                    {article.is_published ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="w-3 h-3" />
                        Draft
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{article.article_categories?.name}</span>
                    <span>
                      {article.article_authors?.name}
                      {article.article_authors?.credentials && 
                        `, ${article.article_authors.credentials}`
                      }
                    </span>
                    <span>{article.reading_time_minutes} min read</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {article.is_published && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link to={`/guides/${article.article_categories?.slug}/${article.slug}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingArticle(article)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublishMutation.mutate({ 
                      id: article.id, 
                      isPublished: article.is_published 
                    })}
                  >
                    {article.is_published ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this article?')) {
                        deleteArticleMutation.mutate(article.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}

            {(!articles || articles.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No articles yet. Generate some using the AI Article Generator above!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {editingArticle && (
        <ArticleEditorModal
          article={editingArticle}
          onClose={() => setEditingArticle(null)}
          onSave={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
            setEditingArticle(null);
          }}
        />
      )}
    </>
  );
}
