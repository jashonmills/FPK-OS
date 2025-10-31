import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Mail, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { UserAvatar } from '@/components/ui/avatar-with-initials';
import { useIsMobile } from '@/hooks/use-mobile';

interface TeamMember {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'member';
  confirmed_at: string | null;
}

export const TeamMembersTable = () => {
  const isMobile = useIsMobile();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; memberId: string | null }>({
    open: false,
    memberId: null,
  });
  const { toast } = useToast();

  const fetchMembers = async () => {
    try {
      // Call edge function to get team members with proper status
      const { data, error } = await supabase.functions.invoke('get-team-members');

      if (error) throw error;

      if (data?.members) {
        setMembers(data.members);
      }
    } catch (error: any) {
      console.error('Error fetching members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();

    // Subscribe to profile changes
    const channel = supabase
      .channel('team-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchMembers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_roles' }, fetchMembers)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'member') => {
    // Check if this would remove the last admin
    if (newRole === 'member') {
      const adminCount = members.filter(m => m.role === 'admin').length;
      if (adminCount <= 1) {
        toast({
          title: 'Cannot Change Role',
          description: 'You cannot demote the last admin. Promote another user to admin first.',
          variant: 'destructive',
        });
        return;
      }
    }

    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Role updated successfully',
      });

      fetchMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update role',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendInvite = async (email: string) => {
    setActionLoading(email);
    try {
      const { error } = await supabase.functions.invoke('invite-user', {
        body: { email, fullName: '', role: 'member' },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Invitation resent',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend invitation',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveMember = async () => {
    if (!deleteDialog.memberId) return;

    const memberToDelete = members.find(m => m.id === deleteDialog.memberId);
    if (!memberToDelete) return;

    setActionLoading(deleteDialog.memberId);
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: deleteDialog.memberId },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User removed from team',
      });

      fetchMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove user',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
      setDeleteDialog({ open: false, memberId: null });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mobile card layout
  if (isMobile) {
    return (
      <>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-card border border-border rounded-lg p-4 space-y-3"
            >
              {/* Avatar and Name */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <UserAvatar
                    avatarUrl={member.avatar_url}
                    fullName={member.full_name || member.email}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{member.full_name || 'No name set'}</p>
                    <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!member.confirmed_at && (
                      <DropdownMenuItem
                        onClick={() => handleResendInvite(member.email)}
                        disabled={actionLoading === member.email}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Resend Invitation
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => setDeleteDialog({ open: true, memberId: member.id })}
                      className="text-destructive"
                      disabled={actionLoading === member.id}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {member.confirmed_at ? 'Remove from Team' : 'Revoke Invitation'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Role and Status */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Role</p>
                  <Select
                    value={member.role}
                    onValueChange={(value) => handleRoleChange(member.id, value as 'admin' | 'member')}
                    disabled={actionLoading === member.id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  {member.confirmed_at ? (
                    <Badge variant="default" className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, memberId: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the user from your team.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemoveMember} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Desktop table layout
  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      avatarUrl={member.avatar_url}
                      fullName={member.full_name || member.email}
                    />
                    <span className="font-medium">{member.full_name || 'No name set'}</span>
                  </div>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Select
                    value={member.role}
                    onValueChange={(value) => handleRoleChange(member.id, value as 'admin' | 'member')}
                    disabled={actionLoading === member.id}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {member.confirmed_at ? (
                    <Badge variant="default" className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700">
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!member.confirmed_at && (
                        <DropdownMenuItem
                          onClick={() => handleResendInvite(member.email)}
                          disabled={actionLoading === member.email}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Resend Invitation
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => setDeleteDialog({ open: true, memberId: member.id })}
                        className="text-destructive"
                        disabled={actionLoading === member.id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {member.confirmed_at ? 'Remove from Team' : 'Revoke Invitation'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, memberId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the user from your team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};