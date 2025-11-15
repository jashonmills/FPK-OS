import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AIGoalSuggestionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  onGoalAdded: () => void;
}

export const AIGoalSuggestions = ({ open, onOpenChange, clientId, onGoalAdded }: AIGoalSuggestionsProps) => {
  const [addingGoalId, setAddingGoalId] = useState<string | null>(null);

  const { data: suggestions, isLoading, error } = useQuery({
    queryKey: ['ai-goal-suggestions', clientId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('suggest_goals_from_insights', {
        p_client_id: clientId
      });

      if (error) throw error;
      return data || [];
    },
    enabled: open && !!clientId,
  });

  const handleAddGoal = async (suggestion: any) => {
    setAddingGoalId(suggestion.goal_id);
    try {
      const goalData = {
        goal_title: suggestion.goal_title,
        goal_description: suggestion.goal_description,
        goal_type: suggestion.goal_type || 'general',
        target_value: suggestion.target_value || 100,
        current_value: 0,
        target_date: suggestion.target_date || null
      };

      const { error } = await supabase.rpc('create_goal', {
        p_client_id: clientId,
        p_goal_data: goalData
      });

      if (error) throw error;

      toast.success('Goal added to your dashboard!');
      onGoalAdded();
    } catch (error: any) {
      console.error('Error adding goal:', error);
      toast.error('Failed to add goal: ' + error.message);
    } finally {
      setAddingGoalId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Goal Suggestions
          </DialogTitle>
          <DialogDescription>
            These goals were discovered from insights in your uploaded documents
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Error Loading Suggestions</CardTitle>
                <CardDescription>
                  {error instanceof Error ? error.message : 'Failed to load AI suggestions'}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {!isLoading && !error && (!suggestions || suggestions.length === 0) && (
            <Card>
              <CardHeader>
                <CardTitle>No Suggestions Found</CardTitle>
                <CardDescription>
                  Upload documents with insights about your client to receive AI-powered goal suggestions
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {suggestions && suggestions.length > 0 && (
            <div className="space-y-4">
              {suggestions.map((suggestion: any) => (
                <Card key={suggestion.goal_id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <CardTitle className="text-lg">{suggestion.goal_title}</CardTitle>
                        <CardDescription className="text-sm">
                          {suggestion.goal_description}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddGoal(suggestion)}
                        disabled={addingGoalId === suggestion.goal_id}
                        className="gap-2 shrink-0"
                      >
                        {addingGoalId === suggestion.goal_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        Add Goal
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {suggestion.goal_type || 'general'}
                      </Badge>
                      {suggestion.target_value && (
                        <Badge variant="outline">
                          Target: {suggestion.target_value}
                        </Badge>
                      )}
                    </div>
                    
                    {suggestion.source_document && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                        <FileText className="h-4 w-4" />
                        <span className="line-clamp-1">
                          Source: {suggestion.source_document}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
