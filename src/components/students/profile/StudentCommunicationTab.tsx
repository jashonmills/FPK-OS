import React, { useState } from 'react';
import { OrgStudent } from '@/hooks/useOrgStudents';
import { useStudentNotes } from '@/hooks/useStudentNotes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, MessageSquare, StickyNote, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface StudentCommunicationTabProps {
  student: OrgStudent;
  orgId: string;
}

export function StudentCommunicationTab({ student, orgId }: StudentCommunicationTabProps) {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<'general' | 'academic' | 'behavioral' | 'administrative' | 'medical'>('general');
  const [notePriority, setNotePriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');

  const { notes, isLoading, createNote, deleteNote, isCreating } = useStudentNotes(student.id, orgId);

  const handleCreateNote = () => {
    if (!noteContent.trim()) return;

    // For member-students, use linked_user_id; for profile-only students, use the org_students id
    const actualStudentId = student.linked_user_id || student.id;

    createNote({
      student_id: actualStudentId,
      org_id: orgId,
      title: noteTitle.trim() || undefined,
      content: noteContent.trim(),
      note_type: noteType,
      priority: notePriority,
    });

    setIsNoteDialogOpen(false);
    setNoteTitle('');
    setNoteContent('');
    setNoteType('general');
    setNotePriority('normal');
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'normal':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'academic':
        return 'default';
      case 'behavioral':
        return 'secondary';
      case 'medical':
        return 'destructive';
      case 'administrative':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading communication history...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Communication & Notes</h3>
          <p className="text-muted-foreground">Manage notes and communications with {student.full_name}</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Note for {student.full_name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="note-title">Title (Optional)</Label>
                  <Input
                    id="note-title"
                    placeholder="Note title..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="note-type">Type</Label>
                    <Select value={noteType} onValueChange={(value: any) => setNoteType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="administrative">Administrative</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="note-priority">Priority</Label>
                    <Select value={notePriority} onValueChange={(value: any) => setNotePriority(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="note-content">Content</Label>
                  <Textarea
                    id="note-content"
                    placeholder="Write your note here..."
                    rows={6}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNote} disabled={!noteContent.trim() || isCreating}>
                    {isCreating ? 'Creating...' : 'Create Note'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Notes Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start documenting important information about {student.full_name} by adding your first note.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getTypeBadgeVariant(note.note_type)}>
                      {note.note_type}
                    </Badge>
                    <Badge variant={getPriorityBadgeVariant(note.priority)}>
                      {note.priority}
                    </Badge>
                  </div>
                  {note.title && (
                    <CardTitle className="text-base">{note.title}</CardTitle>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(note.created_at), 'MMM dd, yyyy • h:mm a')}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Note
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteNote(note.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Note
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Messages Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Messaging System Coming Soon</h3>
            <p>Direct messaging with students and parents will be available in a future update.</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}