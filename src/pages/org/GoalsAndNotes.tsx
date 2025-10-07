import React, { useState } from 'react';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, FileText, Plus, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgNotes } from '@/hooks/useOrgNotes';
import { useOrgStudents } from '@/hooks/useOrgStudents';
import GoalsPage from './goals';
import OrgNoteCreationDialog from '@/components/organizations/OrgNoteCreationDialog';

export default function GoalsAndNotes() {
  const { currentOrg } = useOrgContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStudent, setFilterStudent] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterPrivacy, setFilterPrivacy] = useState('all');

  // Fetch real notes and students
  const { notes, isLoading: notesLoading, createNote, isCreating } = useOrgNotes(currentOrg?.organization_id);
  const { students } = useOrgStudents(currentOrg?.organization_id || '');

  // Filter notes based on search and filters
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStudent = filterStudent === 'all' || note.student_id === filterStudent;
    const matchesPrivacy = filterPrivacy === 'all' || 
      (filterPrivacy === 'private' && note.is_private) ||
      (filterPrivacy === 'shared' && !note.is_private);
    
    return matchesSearch && matchesStudent && matchesPrivacy;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Goals & Notes</h1>
        <p className="text-muted-foreground mt-2">
          Track learning objectives and manage student notes in one place
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          <GoalsPage />
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          {/* Notes Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Student Notes</h2>
              <p className="text-muted-foreground mt-1">View and manage notes for all students</p>
            </div>
            <OrgNoteCreationDialog organizationId={currentOrg?.organization_id || ''}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </OrgNoteCreationDialog>
          </div>

          {/* Filters */}
          <OrgCard className="bg-orange-500/65 border-orange-400/50">
            <OrgCardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStudent} onValueChange={setFilterStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterPrivacy} onValueChange={setFilterPrivacy}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Privacy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Privacy</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </OrgCardContent>
          </OrgCard>

          {/* Notes List */}
          {notesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredNotes.length === 0 ? (
            <OrgCard className="bg-orange-500/65 border-orange-400/50">
              <OrgCardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-white/60 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">No Notes Yet</h3>
                <p className="text-white/80 mb-4">
                  Start documenting student progress and important observations
                </p>
                <OrgNoteCreationDialog organizationId={currentOrg?.organization_id || ''}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Note
                  </Button>
                </OrgNoteCreationDialog>
              </OrgCardContent>
            </OrgCard>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map((note) => {
                const student = students.find(s => s.id === note.student_id);
                return (
                  <OrgCard key={note.id} className="bg-orange-500/65 border-orange-400/50">
                    <OrgCardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <OrgCardTitle className="text-white">{note.title}</OrgCardTitle>
                          <OrgCardDescription className="text-white/80">
                            {note.content || 'No content'}
                          </OrgCardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                          Edit
                        </Button>
                      </div>
                    </OrgCardHeader>
                    <OrgCardContent>
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <span>{new Date(note.created_at).toLocaleDateString()}</span>
                        {student && (
                          <>
                            <span>•</span>
                            <span>Student: {student.full_name}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{note.category}</span>
                        <span>•</span>
                        <span>{note.is_private ? 'Private' : 'Shared'}</span>
                      </div>
                    </OrgCardContent>
                  </OrgCard>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
