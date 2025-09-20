import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useIEPInvites } from '@/hooks/useIEPInvites';
import { useIEPData } from '@/hooks/useIEPData';

export default function IEPModulePage() {
  const { orgId } = useParams<{ orgId: string }>();
  const { currentOrg } = useOrgContext();
  const [inviteEmail, setInviteEmail] = useState('');
  
  const { 
    invites, 
    createInvite, 
    deleteInvite, 
    isLoading: invitesLoading 
  } = useIEPInvites(orgId);
  
  const {
    parentResponses,
    isLoading: dataLoading
  } = useIEPData(orgId);

  const handleGenerateInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter a parent email address');
      return;
    }

    try {
      await createInvite(inviteEmail.trim());
      setInviteEmail('');
      toast.success('IEP invite sent successfully');
    } catch (error) {
      toast.error('Failed to send IEP invite');
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Invite code copied to clipboard');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'used':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Interactive IEP Module</h1>
        <p className="text-muted-foreground mt-2">
          Send secure invites to parents to collect IEP preparation information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invite Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Parent Invite
            </CardTitle>
            <CardDescription>
              Generate a secure invite code for parents to access the IEP preparation forms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="parent@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                type="email"
              />
              <Button 
                onClick={handleGenerateInvite}
                disabled={!inviteEmail.trim() || invitesLoading}
              >
                Send Invite
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              The parent will receive an email with instructions and their unique access code.
            </div>
          </CardContent>
        </Card>

        {/* Active Invites */}
        <Card>
          <CardHeader>
            <CardTitle>Active Invite Codes</CardTitle>
            <CardDescription>
              Manage parent access codes for IEP forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitesLoading ? (
              <div className="text-center py-4">Loading invites...</div>
            ) : invites.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No invite codes generated yet
              </div>
            ) : (
              <div className="space-y-3">
                {invites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(invite.status)}
                      <div>
                        <div className="font-mono font-medium">{invite.code}</div>
                        <div className="text-sm text-muted-foreground">
                          {invite.current_uses}/{invite.max_uses} uses
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={invite.status === 'active' ? 'default' : 'secondary'}>
                        {invite.status}
                      </Badge>
                      {invite.status === 'active' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyInviteCode(invite.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parent Responses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Parent Responses</CardTitle>
            <CardDescription>
              View and manage IEP preparation data submitted by parents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="text-center py-8">Loading parent responses...</div>
            ) : parentResponses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No parent responses yet. Send invites to start collecting data.
              </div>
            ) : (
              <div className="space-y-4">
                {parentResponses.map((response) => (
                  <div key={response.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{response.form_section}</h4>
                        <p className="text-sm text-muted-foreground">
                          Submitted {new Date(response.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">Complete</Badge>
                    </div>
                    <div className="text-sm">
                      {Object.keys(response.form_data).length} responses collected
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}