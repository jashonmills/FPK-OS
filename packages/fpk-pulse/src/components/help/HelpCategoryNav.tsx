import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useHelp } from '@/contexts/HelpContext';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BookOpen 
} from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  category: string;
}

const categoryIcons: Record<string, any> = {
  core: LayoutDashboard,
  admin: Users,
  collaboration: MessageSquare,
  'getting-started': BookOpen,
};

const categoryNames: Record<string, string> = {
  core: 'Core Features',
  admin: 'Administrative Features',
  collaboration: 'Collaboration',
  'getting-started': 'Getting Started',
};

export const HelpCategoryNav = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['core']);
  const { currentArticleSlug, setCurrentArticleSlug } = useHelp();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const { data } = await supabase
      .from('help_articles')
      .select('slug, title, category')
      .order('order_index');

    if (data) {
      setArticles(data);
    }
  };

  const groupedArticles = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-4">
        {Object.entries(groupedArticles).map(([category, categoryArticles]) => {
          const Icon = categoryIcons[category] || BookOpen;
          const isExpanded = expandedCategories.includes(category);

          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium text-sm">
                    {categoryNames[category] || category}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {categoryArticles.length}
                </span>
              </button>

              {isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {categoryArticles.map((article) => (
                    <button
                      key={article.slug}
                      onClick={() => setCurrentArticleSlug(article.slug)}
                      className={cn(
                        "w-full text-left p-2 text-sm rounded-md transition-colors",
                        currentArticleSlug === article.slug
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      )}
                    >
                      {article.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
