import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Notebook, Plus, Search, Filter, FileText, Users } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgNotes, useOrgNoteFolders } from '@/hooks/useOrgNotes';
import CreateNoteDialog from '@/components/instructor/CreateNoteDialog';
import CreateFolderDialog from '@/components/instructor/CreateFolderDialog';
import { MobilePageLayout, MobileSectionHeader, MobileButtonGroup } from '@/components/layout/MobilePageLayout';

export default function NotesManagement() {
  const { currentOrg } = useOrgContext();
  const [searchQuery, setSearchQuery] = useState('');
  const { notes: allNotes, isLoading } = useOrgNotes(currentOrg?.organization_id);
  const { folders, isLoading: foldersLoading } = useOrgNoteFolders(currentOrg?.organization_id);
  
  // Filter notes based on search query
  const notes = allNotes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentOrg) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <OrgCard>
          <OrgCardContent className="p-8 text-center">
            <p className="text-muted-foreground">No organization selected</p>
          </OrgCardContent>
        </OrgCard>
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
    <MobilePageLayout>
      <MobileSectionHeader
        title="Notes"
        subtitle="Manage instructional notes and resources for your organization"
        actions={
          <MobileButtonGroup>
            <CreateNoteDialog organizationId={currentOrg?.organization_id} />
            <CreateFolderDialog organizationId={currentOrg?.organization_id} />
          </MobileButtonGroup>
        }
      />

      {/* Stats Cards */}
      <div className="mobile-analytics-grid">
        <OrgCard className="bg-card border-border">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <Notebook className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Total Notes</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-foreground">{notes.length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-card border-border">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Shared Notes</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-blue-300">{notes.filter(n => n.visibility_scope === 'org-public').length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-card border-border">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Private Notes</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-foreground">{notes.filter(n => n.visibility_scope === 'student-only').length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-card border-border">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">This Week</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-300">{notes.filter(n => {
              const createdAt = new Date(n.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return createdAt >= weekAgo;
            }).length}</div>
          </OrgCardContent>
        </OrgCard>
      </div>

      {/* Search and Filters */}
      <OrgCard className="bg-card border-border">
        <OrgCardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
              placeholder="Search notes..." 
              className="pl-10 bg-white/20 border-white/30 text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </OrgCardHeader>
      </OrgCard>

      {/* Folders Section */}
      {folders.length > 0 && (
        <OrgCard className="bg-card border-border">
          <OrgCardHeader>
            <OrgCardTitle className="text-foreground flex items-center gap-2">
              <span>📁 Folders ({folders.length})</span>
            </OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {folders.map((folder) => (
                <div key={folder.id} className="flex items-center gap-2 p-2 bg-white/20 rounded text-sm text-foreground">
                  <span>📁</span>
                  <span className="truncate">{folder.name}</span>
                </div>
              ))}
            </div>
          </OrgCardContent>
        </OrgCard>
      )}

      {/* Notes Grid */}
      <div className="mobile-grid">
        {notes.map((note) => (
          <OrgCard key={note.id} className="flex flex-col bg-card border-border">
            <OrgCardHeader className="pb-3">
              <div className="space-y-2">
                <OrgCardTitle className="text-lg line-clamp-2 text-foreground">{note.title}</OrgCardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getCategoryColor(note.category) as any} className="bg-white/20 text-foreground border-white/30">
                    {note.category ? note.category.replace('-', ' ') : 'general'}
                  </Badge>
                  <Badge variant={getVisibilityColor(note.visibility_scope) as any} className="bg-white/20 text-foreground border-white/30">
                    {note.visibility_scope === 'org-public' ? 'shared' : 'private'}
                  </Badge>
                </div>
              </div>
            </OrgCardHeader>
            
            <OrgCardContent className="flex-1 flex flex-col">
              <OrgCardDescription className="line-clamp-3 mb-4 text-muted-foreground">
                {note.content}
              </OrgCardDescription>
              
              <div className="flex flex-wrap gap-1 mb-4">
              {note.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-white/20 text-foreground border-white/30">
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
                
                {note.visibility_scope === 'org-public' && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    Shared with organization
                  </div>
                )}
                
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="outline" size="sm" className="flex-1 border-white/30 text-foreground hover:bg-white/20 mobile-safe-text">
                    Edit
                  </Button>
                  <Button size="sm" className="flex-1 bg-white/20 hover:bg-white/30 text-foreground border-white/30 mobile-safe-text">
                    View
                  </Button>
                </div>
              </div>
            </OrgCardContent>
          </OrgCard>
        ))}
      </div>

      {/* Empty state */}
      {notes.length === 0 && !isLoading && (
        <OrgCard className="bg-card border-border">
          <OrgCardContent className="text-center py-12">
            <Notebook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">No Notes Created</h3>
            <p className="text-muted-foreground mb-4">
              Create instructional notes to organize your teaching materials.
            </p>
            <CreateNoteDialog organizationId={currentOrg?.organization_id} />
          </OrgCardContent>
        </OrgCard>
      )}
    </MobilePageLayout>
  );
}