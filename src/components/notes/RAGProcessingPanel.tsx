
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, FileText, BookOpen, Target } from 'lucide-react';
import { useRAGIntegration } from '@/hooks/useRAGIntegration';
import { useNotes } from '@/hooks/useNotes';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useGoals } from '@/hooks/useGoals';
import { useToast } from '@/hooks/use-toast';
import RAGStatusIndicator from '@/components/ai-coach/RAGStatusIndicator';
import KnowledgeBaseSection from './KnowledgeBaseSection';

const RAGProcessingPanel: React.FC = () => {
  const { processUserContent, isProcessing } = useRAGIntegration();
  const { notes } = useNotes();
  const { flashcards } = useFlashcards();
  const { goals } = useGoals();
  const { toast } = useToast();

  const processAllNotes = async () => {
    if (!notes.length) {
      toast({
        title: "No Notes Found",
        description: "You don't have any notes to process yet.",
        variant: "destructive"
      });
      return;
    }

    for (const note of notes) {
      const content = `Title: ${note.title}\nContent: ${note.content || ''}\nCategory: ${note.category}`;
      await processUserContent(content, 'note');
    }
  };

  const processAllFlashcards = async () => {
    if (!flashcards.length) {
      toast({
        title: "No Flashcards Found",
        description: "You don't have any flashcards to process yet.",
        variant: "destructive"
      });
      return;
    }

    for (const card of flashcards) {
      const content = `Question: ${card.front_content}\nAnswer: ${card.back_content}`;
      await processUserContent(content, 'flashcard');
    }
  };

  const processAllGoals = async () => {
    if (!goals.length) {
      toast({
        title: "No Goals Found",
        description: "You don't have any goals to process yet.",
        variant: "destructive"
      });
      return;
    }

    for (const goal of goals) {
      const content = `Goal: ${goal.title}\nDescription: ${goal.description || ''}\nCategory: ${goal.category}`;
      await processUserContent(content, 'goal');
    }
  };

  return (
    <div className="space-y-6">
      <RAGStatusIndicator />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-purple-600" />
            Process Your Content for AI Enhancement
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Process your existing content to enhance AI responses with your personal knowledge.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3">
            <Button
              onClick={processAllNotes}
              disabled={isProcessing}
              variant="outline"
              className="justify-start gap-2"
            >
              <FileText className="h-4 w-4" />
              Process All Notes ({notes.length})
            </Button>
            
            <Button
              onClick={processAllFlashcards}
              disabled={isProcessing}
              variant="outline"
              className="justify-start gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Process All Flashcards ({flashcards.length})
            </Button>
            
            <Button
              onClick={processAllGoals}
              disabled={isProcessing}
              variant="outline"
              className="justify-start gap-2"
            >
              <Target className="h-4 w-4" />
              Process All Goals ({goals.length})
            </Button>
          </div>
          
          {isProcessing && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                Processing your content for AI enhancement...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <KnowledgeBaseSection />
    </div>
  );
};

export default RAGProcessingPanel;
