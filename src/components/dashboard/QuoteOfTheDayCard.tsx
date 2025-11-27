
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Quote, RotateCcw, BookOpen } from 'lucide-react';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';
import { useNotes } from '@/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface QuoteOfTheDayCardProps {
  className?: string;
}

const QuoteOfTheDayCard: React.FC<QuoteOfTheDayCardProps> = ({ className }) => {
  const { data: quote, isLoading, error, refetch } = useQuoteOfTheDay();
  const { createNote, isCreating } = useNotes();
  const { toast } = useToast();

  const handleSaveToNotes = () => {
    if (!quote) return;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const noteTitle = `Quote of the Day – ${today}`;
    const noteContent = `"${quote.content}"\n\n— ${quote.author}`;

    createNote({
      title: noteTitle,
      content: noteContent,
      tags: ['Quote of the Day', 'Inspiration'],
      category: 'inspiration'
    });

    toast({
      title: "Quote saved to your notes!",
      description: "You can find it in your Notes collection.",
    });
  };

  if (error) {
    return (
      <Card className={cn("bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 h-full flex flex-col", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Quote of the Day</CardTitle>
          <Quote className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          <div className="text-center py-8">
            <RotateCcw className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <div className="text-sm font-medium text-purple-900 mb-2">
              Unable to load today's quote
            </div>
            <p className="text-xs text-purple-700 mb-4">Try again later</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="bg-purple-600 border-purple-500 text-white hover:bg-purple-700"
            >
              <RotateCcw className="h-3 w-3 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 relative h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-purple-800">Quote of the Day</CardTitle>
        <Quote className="h-4 w-4 text-purple-600" />
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        {isLoading ? (
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <Skeleton className="h-16 w-full rounded" />
            <Skeleton className="h-4 w-3/4 ml-auto" />
          </div>
        ) : quote ? (
          <div className="flex-1 flex flex-col">
            <div className="text-center space-y-3 flex-1 flex flex-col justify-center">
              <blockquote className="text-lg font-medium text-purple-900 leading-relaxed">
                "{quote.content}"
              </blockquote>
              <cite className="block text-right text-sm italic text-purple-700">
                — {quote.author}
              </cite>
            </div>
            
            <div className="flex justify-end pt-2 mt-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveToNotes}
                disabled={isCreating}
                className="bg-white/50 border-purple-300 text-purple-700 hover:bg-white hover:text-purple-900 text-xs"
              >
                <BookOpen className="h-3 w-3 mr-1" />
                {isCreating ? 'Saving...' : 'Save to Notes'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 flex-1 flex flex-col justify-center">
            <Quote className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <div className="text-sm text-purple-700">No quote available</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuoteOfTheDayCard;
