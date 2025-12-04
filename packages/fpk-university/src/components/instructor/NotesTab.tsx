import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Plus, 
  Eye, 
  EyeOff, 
  Lock, 
  Users,
  User,
  FolderOpen,
  Calendar
} from 'lucide-react';
import CreateNoteDialog from '@/components/instructor/CreateNoteDialog';

interface NotesTabProps {
  organizationId: string;
}

export default function NotesTab({ organizationId }: NotesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('/');
  const [visibilityFilter, setVisibilityFilter] = useState('all');

  // Placeholder data - will be replaced with real data hooks
  const notes = [
    {
      id: '1',
      title: 'Math Progress Review',
      content: 'John is showing great improvement in algebra concepts...',
      student: 'John Doe',
      visibility: 'instructor-visible',
      isPrivate: false,
      category: 'Progress',
      folder: '/Math',
      createdAt: '2024-01-15',
      tags: ['algebra', 'improvement']
    },
    {
      id: '2',
      title: 'Reading Difficulties',
      content: 'Jane is struggling with complex sentence structures...',
      student: 'Jane Smith',
      visibility: 'student-only',
      isPrivate: true,
      category: 'Concerns',
      folder: '/Reading',
      createdAt: '2024-01-14',
      tags: ['reading', 'support-needed']
    },
    {
      id: '3',
      title: 'Parent Meeting Notes',
      content: 'Discussed learning goals and progress with parents...',
      student: 'Mike Johnson',
      visibility: 'org-public',
      isPrivate: false,
      category: 'Communication',
      folder: '/General',
      createdAt: '2024-01-13',
      tags: ['parents', 'meeting']
    }
  ];

  const folders = [
    { name: 'Math', path: '/Math', count: 3 },
    { name: 'Reading', path: '/Reading', count: 5 },
    { name: 'General', path: '/General', count: 2 }
  ];

  const getVisibilityIcon = (visibility: string, isPrivate: boolean) => {
    if (isPrivate) return <Lock className="h-4 w-4" />;
    switch (visibility) {
      case 'student-only': return <User className="h-4 w-4" />;
      case 'instructor-visible': return <Eye className="h-4 w-4" />;
      case 'org-public': return <Users className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getVisibilityColor = (visibility: string, isPrivate: boolean) => {
    if (isPrivate) return 'destructive';
    switch (visibility) {
      case 'student-only': return 'default';
      case 'instructor-visible': return 'secondary';
      case 'org-public': return 'outline';
      default: return 'secondary';
    }
  };

  const getVisibilityText = (visibility: string, isPrivate: boolean) => {
    if (isPrivate) return 'Private';
    switch (visibility) {
      case 'student-only': return 'Student Only';
      case 'instructor-visible': return 'Instructor';
      case 'org-public': return 'Organization';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notes Management</h2>
          <p className="text-muted-foreground">Create and manage notes for your students</p>
        </div>
        <CreateNoteDialog organizationId={organizationId}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Note
          </Button>
        </CreateNoteDialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Folder sidebar */}
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Folders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedFolder === '/' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedFolder('/')}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                All Notes
              </Button>
              {folders.map((folder) => (
                <Button
                  key={folder.path}
                  variant={selectedFolder === folder.path ? 'default' : 'ghost'}
                  className="w-full justify-between"
                  onClick={() => setSelectedFolder(folder.path)}
                >
                  <span className="flex items-center">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    {folder.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {folder.count}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Visibility filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { key: 'all', label: 'All Notes', icon: Eye },
                { key: 'student-only', label: 'Student Only', icon: User },
                { key: 'instructor-visible', label: 'Instructor', icon: Eye },
                { key: 'org-public', label: 'Organization', icon: Users },
                { key: 'private', label: 'Private', icon: Lock }
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={visibilityFilter === filter.key ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setVisibilityFilter(filter.key)}
                >
                  <filter.icon className="h-4 w-4 mr-2" />
                  {filter.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Notes content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Notes list */}
          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{note.title}</h3>
                        <Badge variant={getVisibilityColor(note.visibility, note.isPrivate)}>
                          <span className="flex items-center gap-1">
                            {getVisibilityIcon(note.visibility, note.isPrivate)}
                            {getVisibilityText(note.visibility, note.isPrivate)}
                          </span>
                        </Badge>
                        <Badge variant="outline">{note.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {note.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {note.student}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(note.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <FolderOpen className="h-4 w-4" />
                          {note.folder}
                        </div>
                      </div>
                      {note.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit Note
                    </Button>
                    <Button variant="outline" size="sm">
                      View Full Note
                    </Button>
                    <Button variant="outline" size="sm">
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty state */}
          {notes.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Notes Found</h3>
                <p className="text-muted-foreground mb-4">
                  Create notes to track student progress and important observations.
                </p>
                <CreateNoteDialog organizationId={organizationId}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Note
                  </Button>
                </CreateNoteDialog>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}