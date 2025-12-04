import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Users, User, MessageSquare, Lock, Info } from 'lucide-react';
import { useMessagingPermissions } from '@/hooks/useMessagingPermissions';
import { MentionableUser } from '@/hooks/useOrgMembersForMention';
import { cn } from '@/lib/utils';

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId?: string;
  onConversationCreated: (conversation: any) => void;
  createConversation: (type: 'dm' | 'group', participantIds: string[], name?: string) => Promise<any>;
}

export function NewConversationDialog({
  open,
  onOpenChange,
  orgId,
  onConversationCreated,
  createConversation
}: NewConversationDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<MentionableUser[]>([]);
  const [groupName, setGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'dm' | 'group'>('dm');

  const { allowedRecipients, isLoading, currentUserRole } = useMessagingPermissions(orgId);

  // Filter recipients by search query
  const filteredMembers = allowedRecipients.filter(member => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      member.full_name.toLowerCase().includes(query) ||
      member.email?.toLowerCase().includes(query)
    );
  });

  const handleUserToggle = (user: MentionableUser) => {
    if (activeTab === 'dm') {
      // For DM, select only one user
      setSelectedUsers([user]);
    } else {
      // For group, toggle selection
      setSelectedUsers(prev => {
        const exists = prev.find(u => u.id === user.id);
        if (exists) {
          return prev.filter(u => u.id !== user.id);
        }
        return [...prev, user];
      });
    }
  };

  const handleCreate = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setIsCreating(true);
      const conversation = await createConversation(
        activeTab,
        selectedUsers.map(u => u.id),
        activeTab === 'group' ? groupName : undefined
      );
      
      if (conversation) {
        onConversationCreated(conversation);
        handleClose();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedUsers([]);
    setGroupName('');
    setActiveTab('dm');
    onOpenChange(false);
  };

  const isUserSelected = (userId: string) => selectedUsers.some(u => u.id === userId);

  const isStudent = currentUserRole === 'student';
  const hasStudentRecipients = filteredMembers.some(m => m.role === 'student');
  const hasEducatorRecipients = filteredMembers.some(m => 
    ['owner', 'admin', 'instructor', 'instructor_aide'].includes(m.role || '')
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Start a direct message or create a group chat
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => {
          setActiveTab(v as 'dm' | 'group');
          setSelectedUsers([]);
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dm" className="gap-2">
              <User className="h-4 w-4" />
              Direct Message
            </TabsTrigger>
            <TabsTrigger value="group" className="gap-2">
              <Users className="h-4 w-4" />
              Group Chat
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            {/* Group name input */}
            {activeTab === 'group' && (
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="Enter group name..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Student permission info */}
            {isStudent && (
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  You can message your educators directly. To message other students, 
                  you must both be in a group with messaging enabled.
                </span>
              </div>
            )}

            {/* Selected users badges */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedUsers.map(user => (
                  <Badge 
                    key={user.id} 
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleUserToggle(user)}
                  >
                    {user.full_name}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
              </div>
            )}

            {/* Member list */}
            <ScrollArea className="h-[250px] border rounded-lg">
              <div className="p-2 space-y-1">
                {isLoading ? (
                  <p className="text-center text-muted-foreground py-4">Loading...</p>
                ) : filteredMembers.length === 0 ? (
                  <div className="text-center py-4">
                    <Lock className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground text-sm">
                      {searchQuery 
                        ? 'No matching members found' 
                        : isStudent 
                          ? 'No users available to message'
                          : 'No members available'
                      }
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Section: Educators */}
                    {hasEducatorRecipients && (
                      <>
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Educators
                        </div>
                        {filteredMembers
                          .filter(m => ['owner', 'admin', 'instructor', 'instructor_aide'].includes(m.role || ''))
                          .map(member => (
                            <MemberButton
                              key={member.id}
                              member={member}
                              isSelected={isUserSelected(member.id)}
                              showCheckbox={activeTab === 'group'}
                              onToggle={() => handleUserToggle(member)}
                            />
                          ))}
                      </>
                    )}

                    {/* Section: Students */}
                    {hasStudentRecipients && (
                      <>
                        <div className="px-2 py-1 mt-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Students
                        </div>
                        {filteredMembers
                          .filter(m => m.role === 'student')
                          .map(member => (
                            <MemberButton
                              key={member.id}
                              member={member}
                              isSelected={isUserSelected(member.id)}
                              showCheckbox={activeTab === 'group'}
                              onToggle={() => handleUserToggle(member)}
                            />
                          ))}
                      </>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Create button */}
            <Button
              onClick={handleCreate}
              disabled={
                selectedUsers.length === 0 || 
                isCreating || 
                (activeTab === 'group' && !groupName.trim())
              }
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {isCreating ? 'Creating...' : activeTab === 'dm' ? 'Start Chat' : 'Create Group'}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Extracted member button for cleaner code
function MemberButton({ 
  member, 
  isSelected, 
  showCheckbox, 
  onToggle 
}: { 
  member: MentionableUser; 
  isSelected: boolean; 
  showCheckbox: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left",
        isSelected 
          ? "bg-primary/10 border border-primary/20" 
          : "hover:bg-muted/50"
      )}
    >
      {showCheckbox && (
        <Checkbox 
          checked={isSelected}
          className="pointer-events-none"
        />
      )}
      <Avatar className="h-9 w-9">
        <AvatarImage src={member.avatar_url} />
        <AvatarFallback>
          {member.full_name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{member.full_name}</p>
        {member.email && (
          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
        )}
      </div>
      {member.role && (
        <Badge variant="outline" className="text-[10px] capitalize flex-shrink-0">
          {member.role.replace('_', ' ')}
        </Badge>
      )}
    </button>
  );
}
