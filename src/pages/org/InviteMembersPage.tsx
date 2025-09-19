import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Mail, 
  Link2, 
  Copy, 
  UserPlus,
  MoreHorizontal,
  X,
  RefreshCw,
  Plus,
  Info,
  Shield,
  Eye,
  BookOpen,
  Settings,
  Check,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgInvites } from '@/hooks/useOrgInvites';
import { useEmailInvitation } from '@/hooks/useInvitationSystem';
import { useOrgMembers } from '@/hooks/useOrganization';
import { useOrgPermissions } from '@/hooks/useOrgPermissions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { TransparentTile } from '@/components/ui/transparent-tile';

const InviteMembersPage = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentOrg } = useOrgContext();
  const { canManageStudents, canManageOrg } = useOrgPermissions();
  
  // Email invitation state
  const [emails, setEmails] = useState(['']);
  const [selectedRole, setSelectedRole] = useState('student');
  const [inviteMessage, setInviteMessage] = useState('');
  const [expiresIn, setExpiresIn] = useState('7');
  
  // Join code state
  const [joinCodeCopied, setJoinCodeCopied] = useState(false);
  
  // Hooks
  const { invites, createInvite, deleteInvite, generateInviteUrl, isCreating, isDeleting } = useOrgInvites();
  const emailInviteMutation = useEmailInvitation();
  const { data: members, isLoading: membersLoading } = useOrgMembers(orgId!);

  if (!canManageStudents() && !canManageOrg()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to invite members to this organization. Contact your organization owner or an instructor.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Role descriptions for tooltips
  const roleDescriptions = {
    owner: 'Full org management (members, courses, settings)',
    instructor: 'Create/assign courses, view analytics for their students',
    'instructor-aide': 'Assist instructors (no org settings)',
    student: 'Access assigned courses and complete learning activities',
    viewer: 'Read-only analytics and rosters'
  };

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleRemoveEmail = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSendInvites = async () => {
    const validEmails = emails.filter(email => email.trim() && email.includes('@'));
    
    if (validEmails.length === 0) {
      toast({
        title: 'Please enter at least one valid email.',
        variant: 'destructive',
      });
      return;
    }

    try {
      for (const email of validEmails) {
        await emailInviteMutation.mutateAsync({
          orgId: orgId!,
          email: email.trim(),
          role: (selectedRole === 'instructor' ? 'instructor' : 'student') as 'student' | 'instructor'
        });
      }
      
      toast({
        title: `Invite sent to ${validEmails.length} recipient${validEmails.length > 1 ? 's' : ''}.`,
      });
      
      // Reset form
      setEmails(['']);
      setInviteMessage('');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleGenerateJoinCode = async () => {
    try {
      const code = await createInvite({
        role: selectedRole as any, // Type assertion for role compatibility
        max_uses: 100,
        expires_days: parseInt(expiresIn)
      });
      
      toast({
        title: 'New join code generated. The previous code is now invalid.',
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCopyJoinCode = async (code: string) => {
    const joinUrl = generateInviteUrl(code);
    try {
      await navigator.clipboard.writeText(joinUrl);
      setJoinCodeCopied(true);
      toast({
        title: 'Join code copied.',
      });
      setTimeout(() => setJoinCodeCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy join code to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      await deleteInvite(inviteId);
      toast({
        title: 'Invite canceled.',
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleResendInvite = async (email: string) => {
    try {
      await emailInviteMutation.mutateAsync({
        orgId: orgId!,
        email,
        role: 'student'
      });
      
      toast({
        title: 'Invitation resent.',
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const activeJoinCode = invites?.find(invite => 
    invite.uses_count < invite.max_uses && 
    new Date(invite.expires_at) > new Date()
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <TransparentTile>
        <h1 className="text-3xl font-bold">Invite teammates to your organization</h1>
        <p className="text-muted-foreground mt-2">
          Send an invite or share a join code to give teammates access with the right role.
        </p>
      </TransparentTile>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Invite Actions */}
        <div className="space-y-6">
          {/* Invite by Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Invite by Email
              </CardTitle>
              <CardDescription>
                Send personalized invitations directly to email addresses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Email addresses</Label>
                {emails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="colleague@example.com"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      className="flex-1"
                    />
                    {emails.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveEmail(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleAddEmail}
                  className="w-full"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Email
                </Button>
              </div>

              <div>
                <Label htmlFor="role">Select role</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 mt-1">
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {canManageOrg() && (
                              <SelectItem value="instructor">Instructor</SelectItem>
                            )}
                            <SelectItem value="student">Student</SelectItem>
                            {canManageOrg() && (
                              <>
                                <SelectItem value="instructor-aide">Instructor Aide</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{roleDescriptions[selectedRole as keyof typeof roleDescriptions]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div>
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message to your invitation..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="expires">Invite expires in</Label>
                <Select value={expiresIn} onValueChange={setExpiresIn}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSendInvites}
                disabled={emailInviteMutation.isPending}
                className="w-full"
              >
                {emailInviteMutation.isPending ? 'Sending...' : 'Send Invite'}
              </Button>
            </CardContent>
          </Card>

          {/* Share Join Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Share Join Code
              </CardTitle>
              <CardDescription>
                Generate a shareable link that multiple people can use.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeJoinCode ? (
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-mono break-all">
                      {generateInviteUrl(activeJoinCode.code)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCopyJoinCode(activeJoinCode.code)}
                      variant="outline"
                      className="flex-1"
                    >
                      {joinCodeCopied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Join Code
                        </>
                      )}
                    </Button>
                    <Button onClick={handleGenerateJoinCode} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate Code
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used {activeJoinCode.uses_count} of {activeJoinCode.max_uses} times • 
                    Expires {format(new Date(activeJoinCode.expires_at), 'MMM d, yyyy')}
                  </p>
                </div>
              ) : (
                <Button onClick={handleGenerateJoinCode} className="w-full">
                  Generate New Join Code
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Current State */}
        <div className="space-y-6">
          {/* Pending Invitations */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Invitations waiting for response
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invites && invites.length > 0 ? (
                <div className="space-y-3">
                  {invites.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{invite.role}</Badge>
                          <span className="text-sm">
                            {invite.uses_count}/{invite.max_uses} uses
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Expires {format(new Date(invite.expires_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyJoinCode(invite.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelInvite(invite.id)}
                          disabled={isDeleting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No invites yet. Send your first invite to start building your team.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Members & Roles */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Members & Roles</CardTitle>
                  <CardDescription>
                    Current organization members
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate(`/org/${orgId}/students`)}>
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {membersLoading ? (
                <div className="text-center py-4">Loading members...</div>
              ) : members && members.length > 0 ? (
                <div className="space-y-3">
                  {members.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {member.profiles?.display_name || member.profiles?.full_name || 'Anonymous User'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Member since {format(new Date(member.created_at), 'MMM yyyy')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  ))}
                  {members.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      And {members.length - 5} more members...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No additional members. Add instructors or aides to collaborate on courses.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Safety Notes */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Safety notes:</strong> Invites expire after {expiresIn} days. 
          You can revoke access or change roles anytime in Members & Roles.
        </AlertDescription>
      </Alert>

      {/* Footer Hint */}
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          Need to invite students? 
          <Button 
            variant="link" 
            className="p-0 ml-1 h-auto"
            onClick={() => navigate(`/org/${orgId}/students`)}
          >
            Go to Students → Invite
          </Button>
        </p>
      </div>
    </div>
  );
};

export default InviteMembersPage;