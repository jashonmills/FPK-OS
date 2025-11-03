import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { useHelp } from '@/contexts/HelpContext';

interface SearchResult {
  slug: string;
  title: string;
  category: string;
}

export const HelpSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { setCurrentArticleSlug } = useHelp();

  useEffect(() => {
    const searchArticles = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      const { data, error } = await supabase
        .from('help_articles')
        .select('slug, title, category')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(5);

      if (!error && data) {
        setResults(data);
        setShowResults(true);
      }
    };

    const debounce = setTimeout(searchArticles, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelectResult = (slug: string) => {
    setCurrentArticleSlug(slug);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search help articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-10"
        />
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 p-2 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.slug}
              onClick={() => handleSelectResult(result.slug)}
              className="w-full text-left p-3 hover:bg-accent rounded-md transition-colors"
            >
              <p className="font-medium">{result.title}</p>
              <p className="text-sm text-muted-foreground capitalize">{result.category}</p>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
};
