import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrgMembers } from '@/hooks/useOrgMembers';
import { useOrgGroups } from '@/hooks/useOrgGroups';
import { useOrgAssignments } from '@/hooks/useOrgAssignments';
import { Calendar, Loader2, User, Users, UserPlus } from 'lucide-react';
import { getCourseImage } from '@/utils/courseImages';
import type { CourseCard } from '@/types/course-card';

interface AssignmentCreateDialogProps {
  course: CourseCard;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AssignmentCreateDialog({ course, trigger, open: controlledOpen, onOpenChange }: AssignmentCreateDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'groups' | 'both'>('students');

  const { members, isLoading: membersLoading } = useOrgMembers();
  const { groups, isLoading: groupsLoading } = useOrgGroups();
  const { createAssignment, isCreating } = useOrgAssignments();

  const students = members.filter(m => m.role === 'student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetMembers = activeTab === 'groups' ? [] : selectedMembers;
    const targetGroups = activeTab === 'students' ? [] : selectedGroups;
    
    if (targetMembers.length === 0 && targetGroups.length === 0) return;

    await createAssignment({
      title: assignmentTitle,
      type: 'course',
      resource_id: course.id,
      metadata: { 
        instructions,
        due_at: dueDate ? new Date(dueDate).toISOString() : undefined,
        required: isRequired
      },
      target_members: targetMembers.length > 0 ? targetMembers : undefined,
      target_groups: targetGroups.length > 0 ? targetGroups : undefined,
    });

    // Reset form
    setAssignmentTitle('');
    setInstructions('');
    setDueDate('');
    setIsRequired(false);
    setSelectedMembers([]);
    setSelectedGroups([]);
    handleOpenChange(false);
  };

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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Assignment</DialogTitle>
          <DialogDescription>
            Assign {course.title} to students or groups
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Info */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <img
              src={getCourseImage(course.id, course.title)}
              alt={course.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-medium">{course.title}</p>
              <p className="text-sm text-muted-foreground">{course.description}</p>
            </div>
          </div>

          {/* Assignment Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                placeholder="Enter assignment title"
                required
              />
            </div>

            <div>
              <Label htmlFor="instructions">Instructions (Optional)</Label>
              <Input
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Add any specific instructions..."
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

          {/* Assign to Students or Groups */}
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

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={(selectedMembers.length === 0 && selectedGroups.length === 0) || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create for{' '}
                  {activeTab === 'groups' 
                    ? `${selectedGroups.length} group${selectedGroups.length !== 1 ? 's' : ''}`
                    : activeTab === 'both'
                    ? `${selectedMembers.length + selectedGroups.length} target${selectedMembers.length + selectedGroups.length !== 1 ? 's' : ''}`
                    : `${selectedMembers.length} student${selectedMembers.length !== 1 ? 's' : ''}`
                  }
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
