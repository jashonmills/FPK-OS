
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Download, User, Hash, Loader2 } from 'lucide-react';
import { useQuizletSearch } from '@/hooks/useQuizletSearch';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { QuizletSet } from '@/types/quizlet';
import { useToast } from '@/hooks/use-toast';

interface QuizletSearchTabProps {
  onImport: (cards: Array<{ term: string; definition: string }>, setTitle: string) => void;
}

const QuizletSearchTab: React.FC<QuizletSearchTabProps> = ({ onImport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [importingSetId, setImportingSetId] = useState<string | null>(null);
  const { searchResults, isLoading, error, searchSets, getSetDetails } = useQuizletSearch();
  const { toast } = useToast();

  // Debounced search with 300ms delay
  const debouncedSearch = useDebouncedSearch(searchSets, 300);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleImport = async (set: QuizletSet) => {
    if (importingSetId) return; // Prevent multiple imports

    setImportingSetId(set.id);

    try {
      const setDetails = await getSetDetails(set.id);
      
      if (!setDetails || !setDetails.terms || setDetails.terms.length === 0) {
        toast({
          title: "Import Failed",
          description: "No terms found in this Quizlet set.",
          variant: "destructive",
        });
        return;
      }

      // Convert Quizlet terms to our flashcard format
      const cards = setDetails.terms.map(term => ({
        term: term.term,
        definition: term.definition
      }));

      onImport(cards, set.title);

      toast({
        title: "Import Successful",
        description: `Imported ${cards.length} cards from Quizlet: ${set.title}`,
      });

      console.log(`📥 Imported ${cards.length} cards from Quizlet set: ${set.title}`);
    } catch (err) {
      console.error('❌ Import failed:', err);
      toast({
        title: "Import Failed",
        description: "Failed to import flashcards from Quizlet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImportingSetId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search Quizlet sets…"
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
          aria-label="Search Quizlet flashcard sets"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Search Results */}
      <ScrollArea className="h-[300px]">
        <div className="space-y-3">
          {searchResults.length > 0 ? (
            searchResults.map((set) => (
              <div
                key={set.id}
                className="p-4 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate mb-2">
                      {set.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {set.creator}
                      </span>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {set.termCount} terms
                      </Badge>
                    </div>
                    {set.description && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {set.description}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleImport(set)}
                    disabled={importingSetId === set.id}
                    className="flex-shrink-0"
                    aria-label={`Import ${set.title} flashcard set`}
                  >
                    {importingSetId === set.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-1" />
                        Import
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
          ) : searchQuery && !isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm mb-2">No Quizlet sets found</p>
              <p className="text-xs text-gray-400">
                Try searching with different keywords
              </p>
            </div>
          ) : !searchQuery ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm mb-2">Search Quizlet sets</p>
              <p className="text-xs text-gray-400">
                Enter keywords to find flashcard sets from Quizlet
              </p>
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
};

export default QuizletSearchTab;
