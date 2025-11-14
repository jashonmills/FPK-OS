import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check } from 'lucide-react';
import { findCategoryByKeyword, type OracleMatch } from './OracleKeywordMap';
import { DOCUMENT_TYPE_CATEGORIES } from './BedrockDocumentPage';

interface OracleRecommendationProps {
  onCategorySelect: (category: string) => void;
  currentCategory?: string;
}

export const OracleRecommendation = ({
  onCategorySelect,
  currentCategory,
}: OracleRecommendationProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [recommendation, setRecommendation] = useState<OracleMatch | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Find recommendation when debounced term changes
  useEffect(() => {
    if (debouncedTerm) {
      const result = findCategoryByKeyword(debouncedTerm);
      setRecommendation(result);
    } else {
      setRecommendation(null);
    }
  }, [debouncedTerm]);

  const handleAccept = () => {
    if (recommendation) {
      onCategorySelect(recommendation.category);
      setSearchTerm('');
      setRecommendation(null);
    }
  };

  // Get the label for the recommended category
  const getCategoryLabel = (categoryValue: string): string => {
    for (const group of Object.values(DOCUMENT_TYPE_CATEGORIES)) {
      const type = group.types.find((t) => t.value === categoryValue);
      if (type) {
        return type.label;
      }
    }
    return categoryValue;
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">FPK-X Oracle</h3>
          <Badge variant="secondary" className="text-xs">Smart Recommendations</Badge>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Describe your document (e.g., 'IEP goals', 'behavior plan', 'insurance claim')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">
            Type keywords to get instant category suggestions
          </p>
        </div>

        {recommendation && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Recommendation</span>
                {recommendation.confidence === 'high' && (
                  <Badge variant="default" className="text-xs">High Confidence</Badge>
                )}
              </div>
              <p className="text-sm text-foreground font-semibold">
                {getCategoryLabel(recommendation.category)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Matched: "{recommendation.matchedKeyword}"
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleAccept}
              className="ml-2"
              disabled={currentCategory === recommendation.category}
            >
              {currentCategory === recommendation.category ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Selected
                </>
              ) : (
                'Accept'
              )}
            </Button>
          </div>
        )}

        {searchTerm && !recommendation && debouncedTerm && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              🔍 No match found. Try broader terms like 'IEP', 'evaluation', or 'therapy note', or select manually below.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
