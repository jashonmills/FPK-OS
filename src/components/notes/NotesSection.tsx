import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNotes } from '@/hooks/useNotes';
import { Plus, Edit, Trash2, Save, X, Sparkles, ChevronDown } from 'lucide-react';
import { featureFlagService } from '@/services/FeatureFlagService';
import VoiceInputButton from './VoiceInputButton';

interface NotesSectionProps {
  filterCategory?: string | null;
  highlightNoteId?: string | null;
}

const NotesSection: React.FC<NotesSectionProps> = ({ 
  filterCategory = null, 
  highlightNoteId = null 
}) => {
  const { notes, createNote, updateNote, deleteNote, isCreating } = useNotes();
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', content: '' });
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  const isCollapsibleEnabled = featureFlagService.isEnabled('collapsibleNotes');

  // Filter notes based on category
  const filteredNotes = React.useMemo(() => {
    if (!filterCategory) return notes;
    
    return notes.filter(note => {
      if (filterCategory === 'ai-insights') {
        return note.category === 'ai-insights' || note.tags?.includes('AI Insights');
      }
      return note.category === filterCategory;
    });
  }, [notes, filterCategory]);

  // Auto-scroll to highlighted note and expand it
  useEffect(() => {
    if (highlightNoteId && filteredNotes.length > 0) {
      if (isCollapsibleEnabled) {
        setExpandedNote(highlightNoteId);
      }
      
      const noteElement = document.getElementById(`note-${highlightNoteId}`);
      if (noteElement) {
        noteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add temporary highlight
        noteElement.classList.add('ring-2', 'ring-purple-500', 'ring-opacity-50');
        setTimeout(() => {
          noteElement.classList.remove('ring-2', 'ring-purple-500', 'ring-opacity-50');
        }, 3000);
      }
    }
  }, [highlightNoteId, filteredNotes, isCollapsibleEnabled]);

  const handleCreateNote = () => {
    if (newNote.title.trim()) {
      const category = filterCategory === 'ai-insights' ? 'ai-insights' : 'study';
      createNote({
        title: newNote.title,
        content: newNote.content,
        category: category
      });
      setNewNote({ title: '', content: '' });
    }
  };

  const handleEditNote = (note: any) => {
    setEditingNote(note.id);
    setEditData({ title: note.title, content: note.content || '' });
  };

  const handleSaveEdit = () => {
    if (editingNote && editData.title.trim()) {
      updateNote({
        id: editingNote,
        title: editData.title,
        content: editData.content
      });
      setEditingNote(null);
      setEditData({ title: '', content: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditData({ title: '', content: '' });
  };

  const handleTitleVoiceInput = (transcription: string) => {
    setNewNote(prev => ({ ...prev, title: prev.title + transcription }));
  };

  const handleContentVoiceInput = (transcription: string) => {
    setNewNote(prev => ({ ...prev, content: prev.content + transcription }));
  };

  const handleEditTitleVoiceInput = (transcription: string) => {
    setEditData(prev => ({ ...prev, title: prev.title + transcription }));
  };

  const handleEditContentVoiceInput = (transcription: string) => {
    setEditData(prev => ({ ...prev, content: prev.content + transcription }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai-insights':
        return <Sparkles className="h-4 w-4 text-purple-600" />;
      default:
        return '📚';
    }
  };

  const getHeaderTitle = () => {
    switch (filterCategory) {
      case 'ai-insights':
        return (
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Learning Coach Insights
          </div>
        );
      case 'study':
        return '📚 Study Notes';
      default:
        return '📚 Your Study Notes';
    }
  };

  const getEmptyStateMessage = () => {
    switch (filterCategory) {
      case 'ai-insights':
        return {
          title: 'No AI insights yet',
          subtitle: 'Save responses from your AI Learning Coach to see them here!'
        };
      case 'study':
        return {
          title: 'No study notes yet',
          subtitle: 'Create your first study note above!'
        };
      default:
        return {
          title: 'No notes yet',
          subtitle: 'Create your first study note above!'
        };
    }
  };

  // Render accordion note (new layout)
  const renderAccordionNote = (note: any) => (
    <AccordionItem
      key={note.id}
      value={note.id}
      id={`note-${note.id}`}
      className={`border rounded-lg transition-all duration-300 ${
        highlightNoteId === note.id ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
      }`}
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getCategoryIcon(note.category)}
            <h3 className="font-medium text-left truncate">{note.title}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mr-2">
            <span className="text-xs text-gray-500">
              {new Date(note.created_at).toLocaleDateString()}
            </span>
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditNote(note);
                }}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        {note.content && (
          <p className="text-gray-600 whitespace-pre-wrap mb-3">{note.content}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {note.category === 'ai-insights' ? 'AI Insight' : note.category}
          </Badge>
          {note.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  // Render traditional note layout
  const renderTraditionalNote = (note: any) => (
    <div 
      key={note.id} 
      id={`note-${note.id}`}
      className={`p-4 bg-white border rounded-lg space-y-3 transition-all duration-300 ${
        highlightNoteId === note.id ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
      }`}
    >
      {editingNote === note.id ? (
        <>
          <div className="flex gap-2">
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="font-medium flex-1"
            />
            <VoiceInputButton 
              onTranscription={handleEditTitleVoiceInput}
              placeholder="edit title voice"
            />
          </div>
          <div className="space-y-2">
            <textarea
              className="w-full min-h-[80px] p-3 border border-input rounded-md resize-none"
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
            />
            <div className="flex justify-end">
              <VoiceInputButton 
                onTranscription={handleEditContentVoiceInput}
                placeholder="edit content voice"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {getCategoryIcon(note.category)}
              <h3 className="font-medium text-lg truncate">{note.title}</h3>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm" variant="ghost" onClick={() => handleEditNote(note)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => deleteNote(note.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {note.content && (
            <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {note.category === 'ai-insights' ? 'AI Insight' : note.category}
            </Badge>
            {note.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            <span>Created: {new Date(note.created_at).toLocaleDateString()}</span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Card className="fpk-card border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getHeaderTitle()}
          {filteredNotes.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {filteredNotes.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create New Note - Only show for study notes or all notes */}
        {(filterCategory !== 'ai-insights') && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="note-title">Note Title</Label>
              <div className="flex gap-2">
                <Input
                  id="note-title"
                  placeholder="Enter note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="flex-1"
                />
                <VoiceInputButton 
                  onTranscription={handleTitleVoiceInput}
                  placeholder="title voice input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-content">Content</Label>
              <div className="space-y-2">
                <textarea
                  id="note-content"
                  className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none"
                  placeholder="Write your note content here..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
                <div className="flex justify-end">
                  <VoiceInputButton 
                    onTranscription={handleContentVoiceInput}
                    placeholder="content voice input"
                  />
                </div>
              </div>
            </div>
            <Button 
              onClick={handleCreateNote} 
              disabled={!newNote.title.trim() || isCreating}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? 'Creating...' : 'Create Note'}
            </Button>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg font-medium mb-2">{getEmptyStateMessage().title}</p>
              <p className="text-sm">{getEmptyStateMessage().subtitle}</p>
            </div>
          ) : isCollapsibleEnabled ? (
            <Accordion 
              type="single" 
              collapsible 
              value={expandedNote || undefined}
              onValueChange={setExpandedNote}
              className="space-y-2"
            >
              {filteredNotes.map(renderAccordionNote)}
            </Accordion>
          ) : (
            filteredNotes.map(renderTraditionalNote)
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
