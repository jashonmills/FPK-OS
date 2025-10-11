import { useParams, useNavigate } from 'react-router-dom';
import { useOrgGroups } from '@/hooks/useOrgGroups';
import { useOrgGroupMembers } from '@/hooks/useOrgGroupMembers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  UserMinus, 
  Loader2,
  Mail
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { AddMembersDialog } from '@/components/org/groups/AddMembersDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const GroupDetailPage = () => {
  const { groupId, orgId } = useParams<{ groupId: string; orgId: string }>();
  const navigate = useNavigate();
  const { groups, isLoading: loadingGroup } = useOrgGroups();
  const { 
    members, 
    availableStudents, 
    isLoading: loadingMembers,
    addMember,
    bulkAddMembers,
    removeMember,
    isAddingMember,
    isBulkAddingMembers,
    isRemovingMember
  } = useOrgGroupMembers(groupId);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeUserId, setRemoveUserId] = useState<string | null>(null);

  const group = groups.find(g => g.id === groupId);

  if (loadingGroup || loadingMembers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Group Not Found</CardTitle>
            <CardDescription>The group you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(`/org/${orgId}/groups`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Groups
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddMember = (userId: string) => {
    addMember(userId);
    setAddDialogOpen(false);
  };

  const handleBulkAddMembers = (userIds: string[]) => {
    bulkAddMembers(userIds);
    setAddDialogOpen(false);
  };

  const handleRemoveMember = () => {
    if (removeUserId) {
      removeMember(removeUserId);
      setRemoveUserId(null);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate(`/org/${orgId}/groups`)}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Groups
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg flex items-center gap-3">
            <Users className="w-8 h-8 text-orange-300" />
            {group.name}
          </h1>
          {group.description && (
            <p className="text-white/80 mt-2 drop-shadow">{group.description}</p>
          )}
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Members
            </Button>
          </DialogTrigger>
        </Dialog>

        <AddMembersDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          groupName={group.name}
          availableStudents={availableStudents}
          onAddMember={handleAddMember}
          onBulkAddMembers={handleBulkAddMembers}
          isAddingMember={isAddingMember}
          isBulkAddingMembers={isBulkAddingMembers}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{members.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Available Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{availableStudents.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">
              {new Date(group.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Members */}
      <Card className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/50">
        <CardHeader>
          <CardTitle className="text-orange-200 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Group Members
          </CardTitle>
          <CardDescription className="text-orange-100/80">
            Students currently in this group
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-orange-300/50 mb-4" />
              <p className="text-orange-100/80 mb-4">No members in this group yet</p>
              <Button variant="outline" onClick={() => setAddDialogOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add First Member
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => {
                const profile = member.profiles;
                const displayName = profile?.display_name || profile?.full_name || 'Unnamed Student';
                
                return (
                  <Card key={member.id} className="bg-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profile?.avatar_url} />
                            <AvatarFallback className="bg-orange-600 text-white">
                              {displayName[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{displayName}</p>
                            {profile?.email && (
                              <p className="text-sm text-orange-100/70 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {profile.email}
                              </p>
                            )}
                            <p className="text-xs text-orange-100/60">
                              Added {new Date(member.added_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRemoveUserId(member.user_id)}
                          disabled={isRemovingMember}
                          className="text-orange-200 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <UserMinus className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!removeUserId} onOpenChange={() => setRemoveUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member from Group?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the student from "{group.name}". They will no longer receive group assignments.
              This action can be reversed by adding them back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GroupDetailPage;
