import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Mail, Trash2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface PendingInvitesListProps {
  familyId: string;
}

export const PendingInvitesList = ({ familyId }: PendingInvitesListProps) => {
  const queryClient = useQueryClient();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const { data: invites, isLoading } = useQuery({
    queryKey: ['pending-invites', familyId],
    queryFn: async () => {
      // First, mark any expired invites
      await supabase.rpc('mark_expired_invites');

      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('family_id', familyId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleCopyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/accept-invite?token=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(token);
    toast.success("Invite link copied to clipboard");
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleResend = async (inviteId: string, email: string, token: string) => {
    try {
      const inviteUrl = `${window.location.origin}/accept-invite?token=${token}`;
      toast.info(`Invite link: ${inviteUrl}`, {
        duration: 10000,
        description: "Copy this link and send it to the invitee",
      });
      
      // In production, this would call the send-invitation function
      toast.success("Ready to resend (email integration pending)");
    } catch (error) {
      console.error('Error resending invite:', error);
      toast.error("Failed to resend invitation");
    }
  };

  const handleRevoke = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('invites')
        .delete()
        .eq('id', inviteId);

      if (error) throw error;

      toast.success("Invitation revoked");
      queryClient.invalidateQueries({ queryKey: ['pending-invites', familyId] });
    } catch (error: any) {
      console.error('Error revoking invite:', error);
      toast.error(error.message || "Failed to revoke invitation");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading invitations...</div>;
  }

  if (!invites || invites.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No pending invitations</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Sent</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invites.map((invite) => {
          const isExpired = new Date(invite.expires_at) < new Date();
          
          return (
            <TableRow key={invite.id}>
              <TableCell className="font-medium">{invite.invitee_email}</TableCell>
              <TableCell>
                <Badge variant="outline">{invite.role}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(invite.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-sm">
                {isExpired ? (
                  <Badge variant="destructive">Expired</Badge>
                ) : (
                  <span className="text-muted-foreground">
                    {format(new Date(invite.expires_at), 'MMM d, yyyy')}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyInviteLink(invite.token)}
                >
                  {copiedToken === invite.token ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResend(invite.id, invite.invitee_email, invite.token)}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to revoke this invitation? The invite link will no longer work.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRevoke(invite.id)}>
                        Revoke
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
