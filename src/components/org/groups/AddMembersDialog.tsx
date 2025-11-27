import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, UserPlus, Mail } from 'lucide-react';
import type { AvailableStudent } from '@/hooks/useOrgGroupMembers';

interface AddMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  availableStudents: AvailableStudent[];
  onAddMember: (userId: string) => void;
  onBulkAddMembers: (userIds: string[]) => void;
  isAddingMember: boolean;
  isBulkAddingMembers: boolean;
}

export function AddMembersDialog({
  open,
  onOpenChange,
  groupName,
  availableStudents,
  onAddMember,
  onBulkAddMembers,
  isAddingMember,
  isBulkAddingMembers,
}: AddMembersDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  const filteredAvailableStudents = availableStudents.filter(student => {
    const displayName = student.display_name || student.full_name || '';
    const email = student.email || '';
    return displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleSelectAll = () => {
    if (selectedUserIds.size === filteredAvailableStudents.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredAvailableStudents.map(s => s.user_id)));
    }
  };

  const toggleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUserIds);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUserIds(newSelected);
  };

  const handleBulkAdd = () => {
    if (selectedUserIds.size > 0) {
      onBulkAddMembers(Array.from(selectedUserIds));
      setSelectedUserIds(new Set());
      setSearchQuery('');
    }
  };

  const handleSingleAdd = (userId: string) => {
    onAddMember(userId);
    setSearchQuery('');
  };

  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedUserIds(new Set());
      setSearchQuery('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Members to {groupName}</DialogTitle>
          <DialogDescription>
            Select students to add to this group
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {filteredAvailableStudents.length > 0 && (
            <div className="flex items-center justify-between px-2 py-1 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedUserIds.size === filteredAvailableStudents.length && filteredAvailableStudents.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                  Select All ({filteredAvailableStudents.length})
                </label>
              </div>
              {selectedUserIds.size > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedUserIds.size} selected
                </span>
              )}
            </div>
          )}

          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {filteredAvailableStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {availableStudents.length === 0 
                  ? 'All students are already in this group'
                  : 'No students found matching your search'
                }
              </div>
            ) : (
              filteredAvailableStudents.map((student) => (
                <Card key={student.user_id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedUserIds.has(student.user_id)}
                        onCheckedChange={() => toggleSelectUser(student.user_id)}
                      />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar_url} />
                        <AvatarFallback>
                          {(student.display_name || student.full_name || 'U')[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {student.display_name || student.full_name || 'Unnamed Student'}
                        </p>
                        {student.email && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {student.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSingleAdd(student.user_id)}
                      disabled={isAddingMember}
                    >
                      {isAddingMember ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {selectedUserIds.size > 0 && (
            <div className="sticky bottom-0 pt-4 bg-background border-t">
              <Button
                className="w-full"
                onClick={handleBulkAdd}
                disabled={isBulkAddingMembers}
              >
                {isBulkAddingMembers ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add {selectedUserIds.size} Selected Student{selectedUserIds.size > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
