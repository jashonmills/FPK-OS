import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrgStudents } from '@/hooks/useOrgStudents';
import { useOrgGroups } from '@/hooks/useOrgGroups';
import { useOrgAssignments } from '@/hooks/useOrgAssignments';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { Calendar, Loader2, UserPlus, Users, FileText, Sparkles } from 'lucide-react';

interface StudyMaterial {
  id: string;
  title: string;
  file_type: string;
  file_size?: number;
  created_at: string;
}

interface StudyMaterialAssignmentDialogProps {
  material: StudyMaterial;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function StudyMaterialAssignmentDialog({ 
  material, 
  trigger, 
  open: controlledOpen, 
  onOpenChange 
}: StudyMaterialAssignmentDialogProps) {
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

  const [assignmentTitle, setAssignmentTitle] = useState(material.title);
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'groups' | 'both'>('students');

  const { currentOrg } = useOrgContext();
  const { students: allStudents, isLoading: membersLoading } = useOrgStudents(currentOrg?.organization_id || '', undefined);
  const { groups, isLoading: groupsLoading } = useOrgGroups();
  const { createAssignment, isCreating } = useOrgAssignments();

  // Only show students with linked accounts
  const students = allStudents.filter(s => s.linked_user_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetMembers = activeTab === 'groups' ? [] : selectedMembers;
    const targetGroups = activeTab === 'students' ? [] : selectedGroups;
    
    if (targetMembers.length === 0 && targetGroups.length === 0) return;

    await createAssignment({
      title: assignmentTitle,
      type: 'study_material',
      resource_id: material.id,
      metadata: { 
        instructions,
        due_at: dueDate ? new Date(dueDate).toISOString() : undefined,
        required: isRequired
      },
      target_members: targetMembers.length > 0 ? targetMembers : undefined,
      target_groups: targetGroups.length > 0 ? targetGroups : undefined,
    });

    // Reset form
    setAssignmentTitle(material.title);
    setInstructions('');
    setDueDate('');
    setIsRequired(false);
    setSelectedMembers([]);
    setSelectedGroups([]);
    handleOpenChange(false);
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
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
    setSelectedMembers(students.map(s => s.linked_user_id!).filter(Boolean));
  };

  const selectAllGroups = () => {
    setSelectedGroups(groups.map(g => g.id));
  };

  const clearStudents = () => setSelectedMembers([]);
  const clearGroups = () => setSelectedGroups([]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Assign Study Material</DialogTitle>
          <DialogDescription>
            Assign {material.title} to students with AI coaching guidance
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pb-4">
              {/* Material Info */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <FileText className="w-10 h-10 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{material.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {material.file_type} • {formatFileSize(material.file_size)}
                  </p>
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
                  <Label htmlFor="instructions" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Guiding Instructions
                  </Label>
                  <Textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Tell the AI how to coach the student on this material. Example: 'Focus on the key vocabulary words on pages 3-5' or 'Help them understand the main argument of the article.'"
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    These instructions guide the AI in providing personalized coaching for this assignment
                  </p>
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
                        ) : students.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No students found. Add students to your organization first.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {students.map((student) => (
                              <label
                                key={student.id}
                                className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                              >
                                <Checkbox
                                  checked={selectedMembers.includes(student.linked_user_id!)}
                                  onCheckedChange={() => toggleMember(student.linked_user_id!)}
                                />
                                <span className="text-sm">{student.full_name}</span>
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
                    {/* Both tabs implementation - similar to AssignmentCreateDialog */}
                    <div className="space-y-4">
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
                        <ScrollArea className="h-24 border rounded-lg p-3">
                          {membersLoading ? (
                            <div className="flex justify-center py-4">
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                          ) : students.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground text-xs">
                              No students found
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {students.map((student) => (
                                <label
                                  key={student.id}
                                  className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                                >
                                  <Checkbox
                                    checked={selectedMembers.includes(student.linked_user_id!)}
                                    onCheckedChange={() => toggleMember(student.linked_user_id!)}
                                  />
                                  <span className="text-sm">{student.full_name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                      </div>

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
                        <ScrollArea className="h-24 border rounded-lg p-3">
                          {groupsLoading ? (
                            <div className="flex justify-center py-4">
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                          ) : groups.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground text-xs">
                              No groups found
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
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isCreating ||
                !assignmentTitle.trim() ||
                (selectedMembers.length === 0 && selectedGroups.length === 0)
              }
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Assignment'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
