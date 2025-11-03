import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useHelp } from '@/contexts/HelpContext';
import { HelpSearch } from './HelpSearch';
import { HelpCategoryNav } from './HelpCategoryNav';
import { HelpArticleViewer } from './HelpArticleViewer';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
}

export const HelpCenter = () => {
  const { isHelpCenterOpen, closeHelpCenter, currentArticleSlug } = useHelp();
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (currentArticleSlug) {
      loadArticle(currentArticleSlug);
      trackView(currentArticleSlug);
    } else {
      loadDefaultArticle();
    }
  }, [currentArticleSlug]);

  const loadArticle = async (slug: string) => {
    const { data } = await supabase
      .from('help_articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data) {
      setCurrentArticle(data);
    }
  };

  const loadDefaultArticle = async () => {
    const { data } = await supabase
      .from('help_articles')
      .select('*')
      .eq('slug', 'getting-started-employee')
      .single();

    if (data) {
      setCurrentArticle(data);
    }
  };

  const trackView = async (slug: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('help_analytics').insert({
      user_id: user.id,
      article_slug: slug,
      action: 'view',
      metadata: {},
    });
  };

  return (
    <Dialog open={isHelpCenterOpen} onOpenChange={closeHelpCenter}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl">Help Center</DialogTitle>
          <div className="pt-4">
            <HelpSearch />
          </div>
        </DialogHeader>

        <Separator />

        <div className="flex h-full overflow-hidden">
          <div className="w-64 border-r">
            <HelpCategoryNav />
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {currentArticle ? (
              <HelpArticleViewer article={currentArticle} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select an article to view
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
