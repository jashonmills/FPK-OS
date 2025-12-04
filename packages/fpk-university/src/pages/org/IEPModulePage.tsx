import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrgButton as Button } from '@/components/org/OrgButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, Send, Clock, CheckCircle, XCircle, FileText, Plus } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { OrgRequireRole } from '@/components/organizations/OrgRequireRole';
import { useIEPInvites } from '@/hooks/useIEPInvites';
import { useIEPData } from '@/hooks/useIEPData';
import { ContextualHelpButton } from '@/components/common/ContextualHelpButton';

function IEPModuleContent() {
  const {
    orgId
  } = useParams<{
    orgId: string;
  }>();
  const {
    currentOrg
  } = useOrgContext();
  const navigate = useNavigate();
  const [inviteEmail, setInviteEmail] = useState('');

  // Add safety check for orgId
  if (!orgId) {
    return <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Organization not found</p>
        </div>
      </div>;
  }
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
  const handleStartIEPBuilder = () => {
    navigate(`/org/${orgId}/iep/wizard`);
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
  return <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">Interactive IEP Module</h1>
          <ContextualHelpButton section="iep" size="icon" variant="ghost" className="text-white hover:text-white/80" />
        </div>
        <p className="mt-2 text-zinc-950 font-semibold">
          Create comprehensive IEPs and collect parent preparation information
        </p>
      </div>

      {/* Preparation Video */}
      <Card className="mb-6 org-tile">
        <CardHeader>
          <CardTitle>Preparing for the IEP Builder</CardTitle>
          <CardDescription>
            Watch this video to understand how to effectively use the IEP Builder system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <video controls className="w-full max-w-2xl h-auto rounded-lg" poster="">
              <source src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/fpk-iep/Preparing_for_the_IEP_Builder%20(1).mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </CardContent>
      </Card>

      {/* IEP Builder Section */}
      <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 org-tile">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <FileText className="h-6 w-6" />
            Interactive IEP Builder
          </CardTitle>
          <CardDescription>
            Start creating a comprehensive IEP using our step-by-step guided wizard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                Our guided 13-step process supports both US (IDEA) and Ireland (EPSEN) frameworks
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Student profile and assessment data</li>
                <li>• Present levels and goal development</li>
                <li>• Service planning and transition support</li>
              </ul>
            </div>
            <Button onClick={handleStartIEPBuilder} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Start Interactive IEP Builder
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invite Generation */}
        <Card className="org-tile">
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
              <Input placeholder="parent@email.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} type="email" />
              <Button onClick={handleGenerateInvite} disabled={!inviteEmail.trim() || invitesLoading}>
                Send Invite
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              The parent will receive an email with instructions and their unique access code.
            </div>
          </CardContent>
        </Card>

        {/* Active Invites */}
        <Card className="org-tile">
          <CardHeader>
            <CardTitle>Active Invite Codes</CardTitle>
            <CardDescription>
              Manage parent access codes for IEP forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitesLoading ? <div className="text-center py-4">Loading invites...</div> : invites.length === 0 ? <div className="text-center py-4 text-muted-foreground">
                No invite codes generated yet
              </div> : <div className="space-y-3">
                {invites.map(invite => <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                      {invite.status === 'active' && <Button size="sm" variant="ghost" onClick={() => copyInviteCode(invite.code)}>
                          <Copy className="h-4 w-4" />
                        </Button>}
                    </div>
                  </div>)}
              </div>}
          </CardContent>
        </Card>

        {/* Parent Responses */}
        <Card className="lg:col-span-2 org-tile">
          <CardHeader>
            <CardTitle>Parent Responses</CardTitle>
            <CardDescription>
              View and manage IEP preparation data submitted by parents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dataLoading ? <div className="text-center py-8">Loading parent responses...</div> : parentResponses.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                No parent responses yet. Send invites to start collecting data.
              </div> : <div className="space-y-4">
                {parentResponses.map(response => <div key={response.id} className="border rounded-lg p-4">
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
                  </div>)}
              </div>}
          </CardContent>
        </Card>
      </div>
    </div>;
}

export default function IEPModulePage() {
  return (
    <OrgRequireRole roles={['owner', 'admin', 'instructor', 'instructor_aide']}>
      <IEPModuleContent />
    </OrgRequireRole>
  );
}