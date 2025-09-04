import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Link2, 
  Copy, 
  MoreHorizontal, 
  Ban,
  Users,
  Calendar,
  Mail,
  ExternalLink
} from 'lucide-react';
import { useOrgInvitations } from '@/hooks/useOrgInvitations';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface InviteLinkManagerProps {
  organizationId: string;
  organizationName: string;
}

export default function InviteLinkManager({ organizationId, organizationName }: InviteLinkManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [maxUses, setMaxUses] = useState('1');
  const [expiresIn, setExpiresIn] = useState('168'); // 7 days
  
  const { toast } = useToast();
  const { 
    invitations, 
    isLoading, 
    createInvitation, 
    deactivateInvitation,
    isCreating,
    isDeactivating
  } = useOrgInvitations(organizationId);

  const handleCreateInvitation = () => {
    createInvitation({
      organizationId,
      email: email.trim() || undefined,
      maxUses: parseInt(maxUses) || 1,
      expiresIn: parseInt(expiresIn) || 168
    });

    setShowCreateDialog(false);
    setEmail('');
    setMaxUses('1');
    setExpiresIn('168');
  };

  const copyInviteLink = (invitationCode: string) => {
    const inviteUrl = `${window.location.origin}/auth?invite=${invitationCode}`;
    navigator.clipboard.writeText(inviteUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "The invitation link has been copied to your clipboard.",
      });
    });
  };

  const getStatusBadgeVariant = (status: string, isActive: boolean, expiresAt: string) => {
    if (!isActive || new Date(expiresAt) < new Date()) {
      return 'secondary' as const;
    }
    switch (status) {
      case 'pending': return 'default' as const;
      case 'accepted': return 'default' as const;
      case 'expired': return 'secondary' as const;
      default: return 'secondary' as const;
    }
  };

  const getStatusText = (status: string, isActive: boolean, expiresAt: string) => {
    if (!isActive) return 'Deactivated';
    if (new Date(expiresAt) < new Date()) return 'Expired';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Student Invitation Links
            </CardTitle>
            <CardDescription>
              Generate and manage invitation links to add students to {organizationName}
            </CardDescription>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Invite Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Invitation Link</DialogTitle>
                <DialogDescription>
                  Generate a new invitation link for students to join {organizationName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Leave empty for a generic invite link
                  </p>
                </div>

                <div>
                  <Label htmlFor="maxUses">Maximum Uses</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    min="1"
                    max="100"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    How many students can use this link
                  </p>
                </div>

                <div>
                  <Label htmlFor="expiresIn">Expires In (Hours)</Label>
                  <Input
                    id="expiresIn"
                    type="number"
                    min="1"
                    max="8760"
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Default: 168 hours (7 days)
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateInvitation} disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Link'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading invitations...</div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-8">
            <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No invitation links created yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(
                      invitation.status, 
                      invitation.is_active || false, 
                      invitation.expires_at
                    )}>
                      {getStatusText(invitation.status, invitation.is_active || false, invitation.expires_at)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {invitation.email ? (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {invitation.email}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Generic link</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {invitation.current_uses || 0} / {invitation.max_uses || 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(invitation.expires_at), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(invitation.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => copyInviteLink(invitation.invitation_code || '')}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => {
                            const inviteUrl = `${window.location.origin}/auth?invite=${invitation.invitation_code}`;
                            window.open(inviteUrl, '_blank');
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Link
                        </DropdownMenuItem>

                        {invitation.is_active && (
                          <DropdownMenuItem 
                            onClick={() => deactivateInvitation(invitation.id)}
                            disabled={isDeactivating}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Separator className="my-6" />
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-md">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">How to Invite Students</h4>
              <p className="text-sm text-blue-800 mb-3">
                Create an invitation link and share it with your students. They'll be automatically added to your organization when they sign up.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Email-specific links work only for that email address</li>
                <li>• Generic links can be used by any student</li>
                <li>• Set usage limits to control how many students can join</li>
                <li>• Links expire automatically for security</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}