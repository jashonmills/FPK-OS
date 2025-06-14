
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNotes } from '@/hooks/useNotes';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';

const NotesSection: React.FC = () => {
  const { notes, createNote, updateNote, deleteNote, isCreating } = useNotes();
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', content: '' });

  const handleCreateNote = () => {
    if (newNote.title.trim()) {
      createNote({
        title: newNote.title,
        content: newNote.content,
        category: 'study'
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

  return (
    <Card className="fpk-card border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📚 Your Study Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create New Note */}
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

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg font-medium mb-2">No notes yet</p>
              <p className="text-sm">Create your first study note above!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="p-4 bg-white border rounded-lg space-y-3">
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
                      <h3 className="font-medium text-lg">{note.title}</h3>
                      <div className="flex gap-2">
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
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Badge variant="secondary" className="text-xs">
                        {note.category}
                      </Badge>
                      <span>Created: {new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
