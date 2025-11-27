import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useOrgMembers } from '@/hooks/useOrgMembers';
import { useOrgGroups } from '@/hooks/useOrgGroups';
import { useOrgAssignments } from '@/hooks/useOrgAssignments';
import { BookOpen, Users, UserPlus, Loader2, Calendar } from 'lucide-react';
import type { CourseCard } from '@/types/course-card';
import { Progress } from '@/components/ui/progress';

interface BulkAssignmentDialogProps {
  courses: CourseCard[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BulkAssignmentDialog({ 
  courses, 
  open, 
  onOpenChange,
  onSuccess 
}: BulkAssignmentDialogProps) {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'groups' | 'both'>('students');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const { members, isLoading: membersLoading } = useOrgMembers();
  const { groups, isLoading: groupsLoading } = useOrgGroups();
  const { createAssignment } = useOrgAssignments();

  const students = members.filter(m => m.role === 'student');

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const toggleGroup = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const selectAllStudents = () => {
    setSelectedMembers(students.map(s => s.user_id));
  };

  const selectAllGroups = () => {
    setSelectedGroups(groups.map(g => g.id));
  };

  const clearStudents = () => setSelectedMembers([]);
  const clearGroups = () => setSelectedGroups([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetMembers = activeTab === 'groups' ? [] : selectedMembers;
    const targetGroups = activeTab === 'students' ? [] : selectedGroups;

    if (targetMembers.length === 0 && targetGroups.length === 0) return;

    setIsSubmitting(true);
    setProgress({ current: 0, total: courses.length });

    try {
      let successCount = 0;

      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        try {
          await createAssignment({
            title: assignmentTitle || `${course.title} - Assignment`,
            type: 'course',
            resource_id: course.id,
            metadata: { 
              instructions: instructions || `Complete the course: ${course.title}`,
              due_at: dueDate ? new Date(dueDate).toISOString() : undefined,
              required: isRequired
            },
            target_members: targetMembers.length > 0 ? targetMembers : undefined,
            target_groups: targetGroups.length > 0 ? targetGroups : undefined,
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to assign ${course.title}:`, error);
        }
        setProgress({ current: i + 1, total: courses.length });
      }

      // Reset form
      setAssignmentTitle('');
      setInstructions('');
      setDueDate('');
      setIsRequired(false);
      setSelectedMembers([]);
      setSelectedGroups([]);
      
      onSuccess?.();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const getTotalTargets = () => {
    if (activeTab === 'students') return selectedMembers.length;
    if (activeTab === 'groups') return selectedGroups.length;
    return selectedMembers.length + selectedGroups.length;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bulk Assign Courses</DialogTitle>
          <DialogDescription>
            Assign {courses.length} course{courses.length !== 1 ? 's' : ''} to students or groups
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selected Courses */}
          <div>
            <Label className="mb-2 block">Selected Courses ({courses.length})</Label>
            <ScrollArea className="h-32 border rounded-lg p-3">
              <div className="space-y-2">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-3 p-2 rounded bg-muted/50">
                    <img
                      src={course.thumbnail_url || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8'}
                      alt={course.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{course.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {course.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Assignment Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Assignment Title (Optional)</Label>
              <Input
                id="title"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                placeholder="Leave empty to use course titles"
              />
            </div>

            <div>
              <Label htmlFor="instructions">Instructions (Optional)</Label>
              <Input
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Leave empty for default instructions"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date (Optional)
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={isRequired}
                    onCheckedChange={(checked) => setIsRequired(checked as boolean)}
                  />
                  <span className="text-sm">Mark as Required</span>
                </label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Target Selection */}
          <div>
            <Label className="mb-3 block">Assign to</Label>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="students">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Students
                </TabsTrigger>
                <TabsTrigger value="groups">
                  <Users className="h-4 w-4 mr-2" />
                  Groups
                </TabsTrigger>
                <TabsTrigger value="both">Both</TabsTrigger>
              </TabsList>

              <TabsContent value="students" className="mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {selectedMembers.length} student{selectedMembers.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={selectAllStudents}>
                        Select All
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={clearStudents}>
                        Clear
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-48 border rounded-lg p-3">
                    {membersLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {students.map((student) => (
                          <label
                            key={student.user_id}
                            className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedMembers.includes(student.user_id)}
                              onCheckedChange={() => toggleMember(student.user_id)}
                            />
                            <span className="text-sm">{student.display_name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="groups" className="mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {selectedGroups.length} group{selectedGroups.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={selectAllGroups}>
                        Select All
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={clearGroups}>
                        Clear
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-48 border rounded-lg p-3">
                    {groupsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : groups.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No groups found. Create groups to assign to them.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {groups.map((group) => (
                          <label
                            key={group.id}
                            className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedGroups.includes(group.id)}
                              onCheckedChange={() => toggleGroup(group.id)}
                            />
                            <div className="flex-1">
                              <span className="text-sm font-medium">{group.name}</span>
                              <p className="text-xs text-muted-foreground">
                                {group.member_count || 0} member{group.member_count !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="both" className="mt-4">
                <div className="space-y-4">
                  {/* Students */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Students ({selectedMembers.length})</Label>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={selectAllStudents}>
                          Select All
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={clearStudents}>
                          Clear
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="h-32 border rounded-lg p-3">
                      {students.map((student) => (
                        <label
                          key={student.user_id}
                          className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedMembers.includes(student.user_id)}
                            onCheckedChange={() => toggleMember(student.user_id)}
                          />
                          <span className="text-sm">{student.display_name}</span>
                        </label>
                      ))}
                    </ScrollArea>
                  </div>

                  {/* Groups */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Groups ({selectedGroups.length})</Label>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={selectAllGroups}>
                          Select All
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={clearGroups}>
                          Clear
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="h-32 border rounded-lg p-3">
                      {groups.map((group) => (
                        <label
                          key={group.id}
                          className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedGroups.includes(group.id)}
                            onCheckedChange={() => toggleGroup(group.id)}
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{group.name}</span>
                            <p className="text-xs text-muted-foreground">
                              {group.member_count || 0} member{group.member_count !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </label>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Progress Bar */}
          {isSubmitting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Creating assignments...</span>
                <span className="text-muted-foreground">
                  {progress.current} of {progress.total}
                </span>
              </div>
              <Progress value={(progress.current / progress.total) * 100} />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={getTotalTargets() === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  Assign to {getTotalTargets()}{' '}
                  {activeTab === 'groups' ? 'group' : activeTab === 'both' ? 'target' : 'student'}
                  {getTotalTargets() !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
