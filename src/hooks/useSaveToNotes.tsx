import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '@/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ToastAction } from '@/components/ui/toast';
import React from 'react';

interface SaveToNotesData {
  title: string;
  content: string;
  tags: string[];
  originalQuestion?: string;
  aiMode?: string;
  generateFlashcards: boolean;
}

export const useSaveToNotes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [lastSavedNote, setLastSavedNote] = useState<any>(null);
  const [flashcardGenerationError, setFlashcardGenerationError] = useState<string | null>(null);
  const { createNote } = useNotes();
  const { user } = useAuth();
  const { toast } = useToast();

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => {
    setIsDialogOpen(false);
    setFlashcardGenerationError(null);
  };

  const saveToNotes = async (data: SaveToNotesData) => {
    setIsSaving(true);
    setFlashcardGenerationError(null);
    
    try {
      // Prepare metadata
      const metadata = {
        originalQuestion: data.originalQuestion,
        aiMode: data.aiMode,
        savedAt: new Date().toISOString(),
        source: 'ai-coach'
      };

      // Create the note with AI Insights category
      const noteData = {
        title: data.title,
        content: data.content,
        tags: ['AI Insights', ...data.tags],
        category: 'ai-insights'
      };

      createNote(noteData);

      // Store reference for undo functionality
      setLastSavedNote({
        ...noteData,
        metadata,
        generateFlashcards: data.generateFlashcards
      });

      // Show note saved confirmation
      toast({
        title: "Note Saved",
        description: "Your AI response has been saved to notes.",
      });

      // Generate flashcards if requested
      if (data.generateFlashcards && user) {
        setIsGeneratingFlashcards(true);
        
        try {
          console.log('🎯 Starting flashcard generation for AI Coach content...');
          console.log('Content length:', data.content.length);
          console.log('Content preview:', data.content.substring(0, 100) + '...');
          
          const { data: result, error } = await supabase.functions.invoke('process-file-flashcards', {
            body: {
              content: data.content,
              title: data.title,
              source: 'ai-coach-note',
              userId: user.id,
              previewMode: false // Save directly to database
            }
          });
          
          if (error) {
            console.error('❌ Edge function error:', error);
            throw new Error(`Flashcard generation failed: ${error.message}`);
          }

          console.log('✅ Flashcard generation result:', result);
          
          if (result?.flashcardsGenerated > 0) {
            toast({
              title: "🎉 Flashcards Created!",
              description: `Generated ${result.flashcardsGenerated} flashcards from your AI response. Check your Flashcard Manager!`,
              action: (
                <ToastAction
                  altText="View flashcards"
                  onClick={() => navigate('/dashboard/learner/flashcards')}
                >
                  View Flashcards
                </ToastAction>
              )
            });
          } else {
            throw new Error('No flashcards were generated from the content');
          }
          
        } catch (error) {
          console.error('💥 Flashcard generation error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          setFlashcardGenerationError(errorMessage);
          
          toast({
            title: "⚠️ Flashcard Generation Failed",
            description: `Note saved successfully, but flashcard generation failed: ${errorMessage}`,
            variant: "destructive",
            action: (
              <ToastAction
                altText="Retry"
                onClick={() => retryFlashcardGeneration(data)}
              >
                Retry
              </ToastAction>
            )
          });
        } finally {
          setIsGeneratingFlashcards(false);
        }
      }

      closeDialog();
    } catch (error) {
      console.error('Error saving to notes:', error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const retryFlashcardGeneration = async (data: SaveToNotesData) => {
    if (!user || !data.generateFlashcards) return;
    
    setIsGeneratingFlashcards(true);
    setFlashcardGenerationError(null);
    
    try {
      console.log('🔄 Retrying flashcard generation...');
      
      const { data: result, error } = await supabase.functions.invoke('process-file-flashcards', {
        body: {
          content: data.content,
          title: data.title,
          source: 'ai-coach-note',
          userId: user.id,
          previewMode: false
        }
      });
      
      if (error) {
        throw new Error(`Retry failed: ${error.message}`);
      }

      if (result?.flashcardsGenerated > 0) {
        toast({
          title: "✅ Flashcards Generated!",
          description: `Successfully created ${result.flashcardsGenerated} flashcards on retry.`,
        });
      } else {
        throw new Error('Retry generated no flashcards');
      }
      
    } catch (error) {
      console.error('Retry failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Retry failed';
      setFlashcardGenerationError(errorMessage);
      
      toast({
        title: "Retry Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  const undoSave = () => {
    if (lastSavedNote) {
      toast({
        title: "Undo completed",
        description: "The saved note has been removed."
      });
      setLastSavedNote(null);
    }
  };

  const generateSuggestedTags = (content: string, originalQuestion?: string): string[] => {
    const commonTags: string[] = [];
    const text = `${content} ${originalQuestion || ''}`.toLowerCase();

    // Subject-based tags
    if (text.includes('history') || text.includes('civil war') || text.includes('revolution')) {
      commonTags.push('History');
    }
    if (text.includes('science') || text.includes('physics') || text.includes('chemistry')) {
      commonTags.push('Science');
    }
    if (text.includes('math') || text.includes('equation') || text.includes('calculation')) {
      commonTags.push('Mathematics');
    }
    if (text.includes('literature') || text.includes('novel') || text.includes('poem')) {
      commonTags.push('Literature');
    }

    // Type-based tags
    if (text.includes('definition') || text.includes('meaning')) {
      commonTags.push('Definitions');
    }
    if (text.includes('strategy') || text.includes('technique') || text.includes('method')) {
      commonTags.push('Study Strategy');
    }
    if (text.includes('quiz') || text.includes('test') || text.includes('exam')) {
      commonTags.push('Test Prep');
    }

    return commonTags.slice(0, 3);
  };

  const generateTitle = (content: string, originalQuestion?: string): string => {
    if (originalQuestion && originalQuestion.length > 0) {
      let title = originalQuestion.replace(/^(what|how|why|when|where|who)\s+/i, '');
      title = title.charAt(0).toUpperCase() + title.slice(1);
      if (title.length > 60) {
        title = title.substring(0, 57) + '...';
      }
      return title;
    }

    const sentences = content.split(/[.!?]+/);
    const firstSentence = sentences[0]?.trim();
    
    if (firstSentence && firstSentence.length > 10) {
      let title = firstSentence;
      if (title.length > 60) {
        title = title.substring(0, 57) + '...';
      }
      return title;
    }

    return 'AI Coach Insight';
  };

  return {
    isDialogOpen,
    isSaving,
    isGeneratingFlashcards,
    flashcardGenerationError,
    lastSavedNote,
    openDialog,
    closeDialog,
    saveToNotes,
    retryFlashcardGeneration,
    undoSave,
    generateSuggestedTags,
    generateTitle
  };
};
