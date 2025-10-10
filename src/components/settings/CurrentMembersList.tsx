import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface CurrentMembersListProps {
  familyId: string;
  isOwner: boolean;
}

export const CurrentMembersList = ({ familyId, isOwner }: CurrentMembersListProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: members, isLoading, error: queryError } = useQuery({
    queryKey: ['family-members', familyId],
    queryFn: async () => {
      console.log('🔍 Fetching family members for familyId:', familyId);
      console.log('🔍 Current user:', user?.id);
      
      const { data, error } = await supabase
        .from('family_members')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('family_id', familyId)
        .order('joined_at', { ascending: false });

      console.log('🔍 Query result:', { data, error });
      console.log('🔍 Number of members returned:', data?.length || 0);
      
      if (data) {
        data.forEach((member, index) => {
          console.log(`🔍 Member ${index + 1}:`, {
            id: member.id,
            user_id: member.user_id,
            role: member.role,
            profile: member.profiles
          });
        });
      }

      if (error) {
        console.error('❌ Error fetching family members:', error);
        throw error;
      }
      return data;
    },
    enabled: !!familyId,
  });

  // Add error logging
  if (queryError) {
    console.error('❌ Query error:', queryError);
  }

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['family-members', familyId] });
      toast.success('Member role updated successfully');
    } catch (error: any) {
      console.error('Error updating member role:', error);
      toast.error(error.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (memberId: string, userId: string) => {
    try {
      console.log('Attempting to delete member:', { memberId, userId, familyId, currentUser: user?.id });
      
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId);

      if (error) {
        console.error('Delete error details:', error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['family-members', familyId] });
      toast.success('Member removed successfully');
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast.error(error.message || 'Failed to remove member');
    }
  };

  console.log('📊 CurrentMembersList render:', {
    isLoading,
    hasMembers: !!members,
    memberCount: members?.length,
    familyId,
    isOwner,
    currentUserId: user?.id
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Members</CardTitle>
          <CardDescription>Loading members...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!members || members.length === 0) {
    console.warn('⚠️ No members found!', {
      members,
      familyId,
      queryError
    });
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Members</CardTitle>
          <CardDescription>
            No members found (Check console for debugging info)
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Members</CardTitle>
        <CardDescription>Manage family members and their roles</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              {isOwner && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const profile = member.profiles as any;
              const isCurrentUser = member.user_id === user?.id;
              
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {profile?.full_name || 'No name set'}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {member.user_id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isOwner && member.role !== 'owner' ? (
                      <Select
                        value={member.role}
                        onValueChange={(value) => handleRoleChange(member.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm capitalize">{member.role}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(member.joined_at), 'MMM d, yyyy')}
                  </TableCell>
                  {isOwner && (
                    <TableCell className="text-right">
                      {member.role !== 'owner' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove this member from the family? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveMember(member.id, member.user_id)}>
                              Remove
                            </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
