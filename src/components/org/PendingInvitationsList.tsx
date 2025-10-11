import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Clock, RefreshCw, Copy, Check, MoreVertical, Trash2, Send } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { usePendingInvitations } from '@/hooks/usePendingInvitations';
import { format, formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function PendingInvitationsList() {
  const { data: invitations = [], isLoading, refetch } = usePendingInvitations();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInviteId, setSelectedInviteId] = useState<string | null>(null);

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    toast({ title: 'Email copied to clipboard' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteInvitation = useMutation({
    mutationFn: async (inviteId: string) => {
      const { error } = await supabase
        .from('user_invites')
        .delete()
        .eq('id', inviteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Invitation Cancelled",
        description: "The invitation has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['pending-invitations'] });
      setDeleteDialogOpen(false);
      setSelectedInviteId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Invitation",
        description: error.message || "There was an error deleting the invitation.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (inviteId: string) => {
    setSelectedInviteId(inviteId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedInviteId) {
      deleteInvitation.mutate(selectedInviteId);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-orange-500/20 backdrop-blur-sm border-orange-400/30">
        <CardContent className="p-8 text-center">
          <p className="text-white/70">Loading pending invitations...</p>
        </CardContent>
      </Card>
    );
  }

  if (invitations.length === 0) {
    return (
      <Card className="bg-orange-500/20 backdrop-blur-sm border-orange-400/30">
        <CardContent className="p-8 text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-white/40" />
          <p className="text-white/70">No pending invitations</p>
          <p className="text-sm text-white/50 mt-2">
            Invitations will appear here once sent and will be removed when accepted
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-orange-500/20 backdrop-blur-sm border-orange-400/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Pending Email Invitations
          </CardTitle>
          <CardDescription className="text-white/70">
            {invitations.length} invitation{invitations.length !== 1 ? 's' : ''} waiting to be accepted
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="bg-orange-400/20 backdrop-blur-sm border border-orange-300/30 rounded-lg p-4 hover:bg-orange-400/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Mail className="h-4 w-4 text-orange-300" />
                    <span className="text-white font-medium">
                      {invitation.invited_email}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className="bg-orange-500/20 text-orange-200 border-orange-400/30"
                    >
                      {invitation.role}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
                    >
                      Pending
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-white/60 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        Sent {formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        Expires {format(new Date(invitation.expires_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyEmail(invitation.invited_email, invitation.id)}
                  >
                    {copiedId === invitation.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(invitation.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancel Invitation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this invitation? The recipient will no longer be able to accept it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Invitation</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
