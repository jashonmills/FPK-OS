import { useState } from 'react';
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
  const [lastSavedNote, setLastSavedNote] = useState<any>(null);
  const { createNote } = useNotes();
  const { user } = useAuth();
  const { toast } = useToast();

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const saveToNotes = async (data: SaveToNotesData) => {
    setIsSaving(true);
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

      // Generate flashcards if requested
      if (data.generateFlashcards && user) {
        try {
          console.log('Generating flashcards from AI Coach content...');
          
          await supabase.functions.invoke('process-file-flashcards', {
            body: {
              content: data.content,
              title: data.title,
              source: 'ai-coach-note',
              userId: user.id,
              previewMode: false // Save directly to database
            }
          });
          
          toast({
            title: "Saved to Notes",
            description: "Note saved and flashcards are being generated. Check Flashcard Manager in a moment.",
            action: React.createElement(ToastAction, {
              altText: "View notes",
              onClick: () => window.location.href = '/dashboard/learner/notes?filter=ai-insights'
            }, "View Notes")
          });
        } catch (error) {
          console.error('Error generating flashcards:', error);
          toast({
            title: "Saved to Notes",
            description: "Note saved successfully, but flashcard generation failed.",
            action: React.createElement(ToastAction, {
              altText: "View notes",
              onClick: () => window.location.href = '/dashboard/learner/notes?filter=ai-insights'
            }, "View Notes")
          });
        }
      } else {
        toast({
          title: "Saved to Notes",
          description: "AI response has been saved to your notes.",
          action: React.createElement(ToastAction, {
            altText: "View notes",
            onClick: () => window.location.href = '/dashboard/learner/notes?filter=ai-insights'
          }, "View Notes")
        });
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

    return commonTags.slice(0, 3); // Limit to 3 suggestions
  };

  const generateTitle = (content: string, originalQuestion?: string): string => {
    if (originalQuestion && originalQuestion.length > 0) {
      // Use the original question as base, clean it up
      let title = originalQuestion.replace(/^(what|how|why|when|where|who)\s+/i, '');
      title = title.charAt(0).toUpperCase() + title.slice(1);
      if (title.length > 60) {
        title = title.substring(0, 57) + '...';
      }
      return title;
    }

    // Extract from content - take first meaningful sentence
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
    lastSavedNote,
    openDialog,
    closeDialog,
    saveToNotes,
    undoSave,
    generateSuggestedTags,
    generateTitle
  };
};
