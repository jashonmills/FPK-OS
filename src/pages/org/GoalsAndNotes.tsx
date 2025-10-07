import React, { useState } from 'react';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, FileText, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GoalsPage from './goals';

export default function GoalsAndNotes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStudent, setFilterStudent] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterPrivacy, setFilterPrivacy] = useState('all');

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Goals & Notes</h1>
        <p className="text-white/80 mt-2 drop-shadow">
          Track learning objectives and manage student notes in one place
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="bg-orange-500/65 border border-orange-400/50">
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
              <h2 className="text-2xl font-bold text-white">Student Notes</h2>
              <p className="text-white/80 mt-1">View and manage notes for all students</p>
            </div>
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>

          {/* Filters */}
          <OrgCard className="bg-orange-500/65 border-orange-400/50">
            <OrgCardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                  <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
                <Select value={filterStudent} onValueChange={setFilterStudent}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="All Students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="student1">Student 1</SelectItem>
                    <SelectItem value="student2">Student 2</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCourse} onValueChange={setFilterCourse}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="course1">Course 1</SelectItem>
                    <SelectItem value="course2">Course 2</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPrivacy} onValueChange={setFilterPrivacy}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
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
          <div className="space-y-4">
            {[1, 2, 3].map((note) => (
              <OrgCard key={note} className="bg-orange-500/65 border-orange-400/50">
                <OrgCardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <OrgCardTitle className="text-white">Note Title {note}</OrgCardTitle>
                      <OrgCardDescription className="text-white/80">
                        Sample note content about student progress and observations...
                      </OrgCardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                      Edit
                    </Button>
                  </div>
                </OrgCardHeader>
                <OrgCardContent>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span>2 hours ago</span>
                    <span>•</span>
                    <span>By Instructor Name</span>
                    <span>•</span>
                    <span>Course: Mathematics</span>
                    <span>•</span>
                    <span className="text-white/90">Private</span>
                  </div>
                </OrgCardContent>
              </OrgCard>
            ))}
          </div>

          {/* Empty State (hidden when notes exist) */}
          <OrgCard className="bg-orange-500/65 border-orange-400/50 hidden">
            <OrgCardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-white/70 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Notes Yet</h3>
              <p className="text-white/80 mb-4">
                Start documenting student progress and important observations
              </p>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Plus className="h-4 w-4 mr-2" />
                Create First Note
              </Button>
            </OrgCardContent>
          </OrgCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
