import React, { useState } from 'react';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash2, Clock, Users, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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
import { OrgInvite } from '@/hooks/useOrgInvites';

interface InvitationManagementCardProps {
  invites: OrgInvite[];
  onCopyInvite: (code: string) => void;
  onRevokeInvite: (inviteId: string) => void;
  onRegenerateInvite: (invite: OrgInvite) => void;
  isDeleting: boolean;
}

export function InvitationManagementCard({
  invites,
  onCopyInvite,
  onRevokeInvite,
  onRegenerateInvite,
  isDeleting
}: InvitationManagementCardProps) {
  const { toast } = useToast();
  const [inviteToRevoke, setInviteToRevoke] = useState<string | null>(null);

  const getInviteStatus = (invite: OrgInvite) => {
    const now = new Date();
    const expiresAt = new Date(invite.expires_at);
    
    if (expiresAt < now) return 'expired';
    if (invite.uses_count >= invite.max_uses) return 'maxed_out';
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300 border-green-400/50"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-500/20 text-red-300 border-red-400/50"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      case 'maxed_out':
        return <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/50"><Users className="h-3 w-3 mr-1" />Max Uses</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-400/50">Unknown</Badge>;
    }
  };

  const handleRevoke = (inviteId: string) => {
    setInviteToRevoke(inviteId);
  };

  const confirmRevoke = () => {
    if (inviteToRevoke) {
      onRevokeInvite(inviteToRevoke);
      setInviteToRevoke(null);
    }
  };

  if (!invites || invites.length === 0) {
    return (
      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <OrgCardTitle className="text-white">Active Invitations</OrgCardTitle>
          <OrgCardDescription className="text-white/80">
            No active invitations. Create one above to get started.
          </OrgCardDescription>
        </OrgCardHeader>
      </OrgCard>
    );
  }

  return (
    <>
      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <OrgCardTitle className="text-white">Active Invitations ({invites.length})</OrgCardTitle>
          <OrgCardDescription className="text-white/80">
            Manage and track your organization invitations
          </OrgCardDescription>
        </OrgCardHeader>
        <OrgCardContent className="space-y-4">
          {invites.map((invite) => {
            const status = getInviteStatus(invite);
            const isExpired = status === 'expired';
            const isMaxedOut = status === 'maxed_out';
            const canRegenerate = isExpired || isMaxedOut;

            return (
              <div
                key={invite.id}
                className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/50 capitalize">
                      {invite.role}
                    </Badge>
                    {getStatusBadge(status)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{invite.uses_count}/{invite.max_uses} uses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {isExpired 
                          ? `Expired ${formatDistanceToNow(new Date(invite.expires_at))} ago`
                          : `Expires ${formatDistanceToNow(new Date(invite.expires_at), { addSuffix: true })}`
                        }
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-white/50 font-mono bg-white/5 p-2 rounded border border-white/10">
                    {invite.code}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCopyInvite(invite.code)}
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {canRegenerate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRegenerateInvite(invite)}
                      className="bg-green-500/20 border-green-400/50 text-green-300 hover:bg-green-500/30"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Regenerate
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevoke(invite.id)}
                    disabled={isDeleting}
                    className="bg-red-500/20 border-red-400/50 text-red-300 hover:bg-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </OrgCardContent>
      </OrgCard>

      <AlertDialog open={inviteToRevoke !== null} onOpenChange={(open) => !open && setInviteToRevoke(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Revoke Invitation</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to revoke this invitation? The invite link will no longer work, and you'll need to create a new one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRevoke}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
