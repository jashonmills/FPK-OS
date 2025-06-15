
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
import { X, Sparkles } from 'lucide-react';
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
  const { saveToNotes, isSaving, generateSuggestedTags, generateTitle } = useSaveToNotes();
  
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
      setSaveFullResponse(!selectedText); // Default to selection if available
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
    await saveToNotes({
      title,
      content: noteContent,
      tags,
      originalQuestion,
      aiMode,
      generateFlashcards
    });
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Save to Notes
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Toggle for full response vs selection */}
          {selectedText && (
            <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
              <Checkbox
                id="save-full"
                checked={saveFullResponse}
                onCheckedChange={setSaveFullResponse}
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
            />
          </div>

          {/* Generate Flashcards Option */}
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Checkbox
              id="generate-flashcards"
              checked={generateFlashcards}
              onCheckedChange={setGenerateFlashcards}
            />
            <Label htmlFor="generate-flashcards" className="text-sm">
              Generate flashcards from this note
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
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !noteContent.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSaving ? 'Saving...' : 'Save to Notes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveToNotesDialog;
