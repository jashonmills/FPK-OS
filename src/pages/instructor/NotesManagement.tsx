import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Notebook, Plus, Search, Filter, FileText, Users } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgNotes } from '@/hooks/useOrgNotes';
import CreateNoteDialog from '@/components/instructor/CreateNoteDialog';
import CreateFolderDialog from '@/components/instructor/CreateFolderDialog';

export default function NotesManagement() {
  const { currentOrg } = useOrgContext();
  const [searchQuery, setSearchQuery] = useState('');
  const { notes, isLoading } = useOrgNotes(searchQuery);

  if (!currentOrg) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No organization selected</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getCategoryColor = (category?: string) => {
    if (!category) return 'secondary';
    switch (category) {
      case 'progress-report': return 'default';
      case 'teaching-resource': return 'secondary';
      case 'curriculum': return 'outline';
      default: return 'secondary';
    }
  };

  const getVisibilityColor = (visibility_scope: string) => {
    switch (visibility_scope) {
      case 'organization': return 'default';
      case 'student': return 'default';
      case 'private': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground mt-2">
            Manage instructional notes and resources for your organization
          </p>
        </div>
        <div className="flex gap-2">
          <CreateNoteDialog />
          <CreateFolderDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Notebook className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Notes</span>
            </div>
            <div className="text-2xl font-bold mt-2">{notes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Shared Notes</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-blue-600">{notes.filter(n => n.visibility_scope === 'organization').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Private Notes</span>
            </div>
            <div className="text-2xl font-bold mt-2">{notes.filter(n => n.visibility_scope === 'private').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">This Week</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-600">{notes.filter(n => {
              const createdAt = new Date(n.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return createdAt >= weekAgo;
            }).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
              placeholder="Search notes..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <Card key={note.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="space-y-2">
                <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getCategoryColor(note.category) as any}>
                    {note.category ? note.category.replace('-', ' ') : 'general'}
                  </Badge>
                  <Badge variant={getVisibilityColor(note.visibility_scope) as any}>
                    {note.visibility_scope === 'organization' ? 'shared' : 'private'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="line-clamp-3 mb-4">
                {note.content}
              </CardDescription>
              
              <div className="flex flex-wrap gap-1 mb-4">
              {note.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              </div>
              
              <div className="mt-auto space-y-3">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(note.created_at).toLocaleDateString()}
                  <br />
                  Updated: {new Date(note.updated_at).toLocaleDateString()}
                </div>
                
                {note.visibility_scope === 'organization' && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    Shared with organization
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" className="flex-1">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {notes.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Notebook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Notes Created</h3>
            <p className="text-muted-foreground mb-4">
              Create instructional notes to organize your teaching materials.
            </p>
            <CreateNoteDialog />
          </CardContent>
        </Card>
      )}
    </div>
  );
}