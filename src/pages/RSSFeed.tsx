import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function RSSFeed() {
  const [rssContent, setRssContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRSS() {
      try {
        const { data, error } = await supabase.functions.invoke('generate-rss-feed');
        
        if (error) throw error;
        
        setRssContent(data);
      } catch (err) {
        console.error('Error fetching RSS feed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load RSS feed');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRSS();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <pre className="p-4 text-xs overflow-auto">{rssContent}</pre>
    </div>
  );
}
