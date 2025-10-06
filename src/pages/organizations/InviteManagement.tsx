import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Copy, Mail, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface UserInvite {
  id: string;
  invite_token: string;
  invited_email: string;
  role: 'student' | 'instructor';
  created_at: string;
  expires_at: string;
  is_used: boolean;
  used_at: string | null;
  created_by: string;
}

export function InviteManagement() {
  const { orgId } = useParams<{ orgId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');

  // Fetch invites
  const { data: invites = [], isLoading } = useQuery({
    queryKey: ['user-invites', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_invites')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserInvite[];
    },
    enabled: !!orgId,
  });

  // Generate invite mutation
  const generateInvite = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: 'student' | 'instructor' }) => {
      const { data, error } = await supabase.functions.invoke('generate-org-invite', {
        body: { orgId, email, role },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to generate invite');
      
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Invitation Created',
        description: `Invitation sent to ${email}`,
      });
      
      // Copy link to clipboard
      navigator.clipboard.writeText(data.inviteUrl);
      toast({
        title: 'Link Copied',
        description: 'Invitation link copied to clipboard',
      });
      
      // Reset form
      setEmail('');
      setRole('student');
      
      // Refresh invites list
      queryClient.invalidateQueries({ queryKey: ['user-invites', orgId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Generate Invite',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Delete invite mutation
  const deleteInvite = useMutation({
    mutationFn: async (inviteId: string) => {
      const { error } = await supabase
        .from('user_invites')
        .delete()
        .eq('id', inviteId)
        .eq('org_id', orgId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Invitation Revoked',
        description: 'The invitation has been deleted',
      });
      queryClient.invalidateQueries({ queryKey: ['user-invites', orgId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Revoke Invite',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }
    
    await generateInvite.mutateAsync({ email, role });
  };

  const copyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/join?token=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    toast({
      title: 'Link Copied',
      description: 'Invitation link copied to clipboard',
    });
  };

  const getStatusBadge = (invite: UserInvite) => {
    if (invite.is_used) {
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Used</Badge>;
    }
    
    const now = new Date();
    const expiresAt = new Date(invite.expires_at);
    
    if (now > expiresAt) {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>;
    }
    
    return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
  };

  const isExpired = (invite: UserInvite) => {
    return new Date() > new Date(invite.expires_at);
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-8">
      {/* Generate Invite Form */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Invitation</CardTitle>
          <CardDescription>
            Send an invitation link to add new members to your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value: 'student' | 'instructor') => setRole(value)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={generateInvite.isPending || !email}
              className="w-full md:w-auto"
            >
              {generateInvite.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Generate & Send Invitation
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Invites List */}
      <Card>
        <CardHeader>
          <CardTitle>Invitation History</CardTitle>
          <CardDescription>
            Manage and track all organization invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : invites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No invitations yet. Create one above to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">{invite.invited_email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{invite.role}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(invite)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(invite.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(invite.expires_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!invite.is_used && !isExpired(invite) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyInviteLink(invite.invite_token)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                          {!invite.is_used && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteInvite.mutate(invite.id)}
                              disabled={deleteInvite.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default InviteManagement;
