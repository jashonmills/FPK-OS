
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, FileText, BookOpen, Target, CheckCircle, Loader2 } from 'lucide-react';
import { useRAGIntegration } from '@/hooks/useRAGIntegration';
import { useNotes } from '@/hooks/useNotes';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useGoals } from '@/hooks/useGoals';
import { useToast } from '@/hooks/use-toast';
import RAGStatusIndicator from '@/components/ai-coach/RAGStatusIndicator';
import KnowledgeBaseSection from './KnowledgeBaseSection';

const RAGProcessingPanel: React.FC = () => {
  const { processUserContent, isProcessing, refreshStats } = useRAGIntegration();
  const { notes } = useNotes();
  const { flashcards } = useFlashcards();
  const { goals } = useGoals();
  const { toast } = useToast();
  
  const [processingState, setProcessingState] = useState<{
    type: string | null;
    current: number;
    total: number;
  }>({ type: null, current: 0, total: 0 });

  const processAllNotes = async () => {
    if (!notes.length) {
      toast({
        title: "No Notes Found",
        description: "You don't have any notes to process yet.",
        variant: "destructive"
      });
      return;
    }

    setProcessingState({ type: 'notes', current: 0, total: notes.length });
    
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      setProcessingState({ type: 'notes', current: i + 1, total: notes.length });
      
      const content = `Title: ${note.title}\nContent: ${note.content || ''}\nCategory: ${note.category}`;
      await processUserContent(content, 'note');
    }
    
    setProcessingState({ type: null, current: 0, total: 0 });
    await refreshStats();
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

    setProcessingState({ type: 'flashcards', current: 0, total: flashcards.length });
    
    for (let i = 0; i < flashcards.length; i++) {
      const card = flashcards[i];
      setProcessingState({ type: 'flashcards', current: i + 1, total: flashcards.length });
      
      const content = `Question: ${card.front_content}\nAnswer: ${card.back_content}`;
      await processUserContent(content, 'flashcard');
    }
    
    setProcessingState({ type: null, current: 0, total: 0 });
    await refreshStats();
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

    setProcessingState({ type: 'goals', current: 0, total: goals.length });
    
    for (let i = 0; i < goals.length; i++) {
      const goal = goals[i];
      setProcessingState({ type: 'goals', current: i + 1, total: goals.length });
      
      const content = `Goal: ${goal.title}\nDescription: ${goal.description || ''}\nCategory: ${goal.category}`;
      await processUserContent(content, 'goal');
    }
    
    setProcessingState({ type: null, current: 0, total: 0 });
    await refreshStats();
  };

  const isCurrentlyProcessing = isProcessing || processingState.type !== null;

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
              disabled={isCurrentlyProcessing}
              variant="outline"
              className="justify-start gap-2"
            >
              {processingState.type === 'notes' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Process All Notes ({notes.length})
              {processingState.type === 'notes' && (
                <span className="ml-auto text-xs">
                  {processingState.current}/{processingState.total}
                </span>
              )}
            </Button>
            
            <Button
              onClick={processAllFlashcards}
              disabled={isCurrentlyProcessing}
              variant="outline"
              className="justify-start gap-2"
            >
              {processingState.type === 'flashcards' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BookOpen className="h-4 w-4" />
              )}
              Process All Flashcards ({flashcards.length})
              {processingState.type === 'flashcards' && (
                <span className="ml-auto text-xs">
                  {processingState.current}/{processingState.total}
                </span>
              )}
            </Button>
            
            <Button
              onClick={processAllGoals}
              disabled={isCurrentlyProcessing}
              variant="outline"
              className="justify-start gap-2"
            >
              {processingState.type === 'goals' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Target className="h-4 w-4" />
              )}
              Process All Goals ({goals.length})
              {processingState.type === 'goals' && (
                <span className="ml-auto text-xs">
                  {processingState.current}/{processingState.total}
                </span>
              )}
            </Button>
          </div>
          
          {isCurrentlyProcessing && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {processingState.type ? (
                  `Processing ${processingState.type}... (${processingState.current}/${processingState.total})`
                ) : (
                  'Processing your content for AI enhancement...'
                )}
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
