
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Sparkles, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useSaveToNotes } from '@/hooks/useSaveToNotes';

interface SaveToNotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  selectedText?: string;
  originalQuestion?: string;
  aiMode?: string;
}

const SaveToNotesDialog: React.FC<SaveToNotesDialogProps> = ({
  isOpen,
  onClose,
  content,
  selectedText,
  originalQuestion,
  aiMode
}) => {
  const { 
    saveToNotes, 
    isSaving, 
    isGeneratingFlashcards, 
    flashcardGenerationError,
    retryFlashcardGeneration,
    generateSuggestedTags, 
    generateTitle 
  } = useSaveToNotes();
  
  const [title, setTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [generateFlashcards, setGenerateFlashcards] = useState(false);
  const [saveFullResponse, setSaveFullResponse] = useState(true);

  // Initialize form data when dialog opens
  useEffect(() => {
    if (isOpen) {
      const textToSave = selectedText && !saveFullResponse ? selectedText : content;
      setNoteContent(textToSave);
      setTitle(generateTitle(textToSave, originalQuestion));
      setTags(generateSuggestedTags(textToSave, originalQuestion));
      setSaveFullResponse(!selectedText);
    }
  }, [isOpen, content, selectedText, originalQuestion]);

  // Update content when toggle changes
  useEffect(() => {
    if (isOpen) {
      const textToSave = saveFullResponse ? content : (selectedText || content);
      setNoteContent(textToSave);
      setTitle(generateTitle(textToSave, originalQuestion));
    }
  }, [saveFullResponse, content, selectedText, originalQuestion, isOpen]);

  const handleAddTag = (tagToAdd: string) => {
    const trimmedTag = tagToAdd.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput.trim()) {
        handleAddTag(tagInput);
        setTagInput('');
      }
    }
  };

  const handleSave = async () => {
    const saveData = {
      title,
      content: noteContent,
      tags,
      originalQuestion,
      aiMode,
      generateFlashcards
    };

    await saveToNotes(saveData);
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setTitle('');
    setNoteContent('');
    setTags([]);
    setTagInput('');
    setGenerateFlashcards(false);
    setSaveFullResponse(true);
  };

  const handleRetry = () => {
    const saveData = {
      title,
      content: noteContent,
      tags,
      originalQuestion,
      aiMode,
      generateFlashcards: true
    };
    retryFlashcardGeneration(saveData);
  };

  // Handler functions to properly convert CheckedState to boolean
  const handleSaveFullResponseChange = (checked: boolean | "indeterminate") => {
    setSaveFullResponse(checked === true);
  };

  const handleGenerateFlashcardsChange = (checked: boolean | "indeterminate") => {
    setGenerateFlashcards(checked === true);
  };

  const isProcessing = isSaving || isGeneratingFlashcards;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Save to Notes
            {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Processing Status */}
          {isGeneratingFlashcards && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Generating flashcards from your AI response... This may take a moment.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {flashcardGenerationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Flashcard generation failed: {flashcardGenerationError}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={isProcessing}
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Toggle for full response vs selection */}
          {selectedText && (
            <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
              <Checkbox
                id="save-full"
                checked={saveFullResponse}
                onCheckedChange={handleSaveFullResponseChange}
                disabled={isProcessing}
              />
              <Label htmlFor="save-full" className="text-sm">
                Save full response (uncheck to save only selected text)
              </Label>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full"
              disabled={isProcessing}
            />
          </div>

          {/* Content Preview */}
          <div className="space-y-2">
            <Label htmlFor="note-content">Content</Label>
            <Textarea
              id="note-content"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Note content..."
              className="min-h-[120px] max-h-[200px]"
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground">
              {noteContent.length} characters
              {selectedText && !saveFullResponse && (
                <span className="text-purple-600 ml-2">• Selected text only</span>
              )}
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                    aria-label={`Remove ${tag} tag`}
                    disabled={isProcessing}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyPress}
              placeholder="Add tags (press Enter or comma to add)..."
              className="w-full"
              disabled={isProcessing}
            />
          </div>

          {/* Generate Flashcards Option */}
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Checkbox
              id="generate-flashcards"
              checked={generateFlashcards}
              onCheckedChange={handleGenerateFlashcardsChange}
              disabled={isProcessing}
            />
            <Label htmlFor="generate-flashcards" className="text-sm">
              Generate flashcards from this note
              {generateFlashcards && (
                <span className="block text-xs text-muted-foreground mt-1">
                  AI will create study flashcards from the key concepts in your note
                </span>
              )}
            </Label>
          </div>

          {/* Metadata Preview */}
          {(originalQuestion || aiMode) && (
            <div className="p-3 bg-gray-50 rounded-lg text-xs text-muted-foreground">
              <p className="font-medium mb-1">Will be saved with:</p>
              {originalQuestion && (
                <p>• Original question: "{originalQuestion.substring(0, 50)}..."</p>
              )}
              {aiMode && <p>• AI mode: {aiMode}</p>}
              <p>• Source: AI Learning Coach</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isProcessing || !title.trim() || !noteContent.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {isSaving ? 'Saving...' : 'Generating...'}
              </>
            ) : (
              'Save to Notes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveToNotesDialog;
