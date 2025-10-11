import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Clock, RefreshCw, Copy, Check } from 'lucide-react';
import { usePendingInvitations } from '@/hooks/usePendingInvitations';
import { format, formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function PendingInvitationsList() {
  const { data: invitations = [], isLoading, refetch } = usePendingInvitations();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    toast({ title: 'Email copied to clipboard' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <Card className="bg-white/10 border-orange-400/30">
        <CardContent className="p-8 text-center">
          <p className="text-white/70">Loading pending invitations...</p>
        </CardContent>
      </Card>
    );
  }

  if (invitations.length === 0) {
    return (
      <Card className="bg-white/10 border-orange-400/30">
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
    <Card className="bg-white/10 border-orange-400/30">
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
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
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

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyEmail(invitation.invited_email, invitation.id)}
                  className="shrink-0"
                >
                  {copiedId === invitation.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
