import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, QrCode, Copy, Check, ExternalLink } from 'lucide-react';
import { useEmailInvitation } from '@/hooks/useInvitationSystem';
import { useOrgInvites } from '@/hooks/useOrgInvites';
import { useToast } from '@/hooks/use-toast';

interface EnhancedInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnhancedInviteDialog({ open, onOpenChange }: EnhancedInviteDialogProps) {
  const { toast } = useToast();
  const emailInviteMutation = useEmailInvitation();
  const { createInvite, generateInviteUrl, isCreating } = useOrgInvites();
  
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [maxUses, setMaxUses] = useState('100');
  const [expiresDays, setExpiresDays] = useState('30');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEmailInvite = async () => {
    if (!email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address to send the invitation.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // This will automatically send the email via the database function
      await emailInviteMutation.mutateAsync({
        orgId: '', // This will be handled by the assertOrg in the hook
        email: email.trim(),
        role: role
      });
      setEmail('');
      // Don't close dialog immediately - let user see success message
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCreateInvite = async () => {
    try {
      const inviteCode = await createInvite({
        role,
        max_uses: parseInt(maxUses, 10),
        expires_days: parseInt(expiresDays, 10),
      });
      
      setGeneratedCode(inviteCode);
    } catch (error) {
      console.error('Error creating invite:', error);
    }
  };

  const handleCopyLink = async () => {
    if (!generatedCode) return;
    
    const inviteUrl = generateInviteUrl(generatedCode);
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setGeneratedCode(null);
    setCopied(false);
    setEmail('');
    setRole('student');
    setMaxUses('100');
    setExpiresDays('30');
    onOpenChange(false);
  };

  const inviteUrl = generatedCode ? generateInviteUrl(generatedCode) : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite New Members</DialogTitle>
          <DialogDescription>
            Send email invitations or generate invitation codes for your organization.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email Invitation</TabsTrigger>
            <TabsTrigger value="link">Invitation Link</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Email Invitation
                </CardTitle>
                <CardDescription>
                  Send a personalized invitation email directly to the recipient.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailRole">Role</Label>
                  <Select value={role} onValueChange={setRole as (value: string) => void}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleEmailInvite}
                  disabled={emailInviteMutation.isPending}
                  className="w-full"
                >
                  {emailInviteMutation.isPending ? 'Sending...' : 'Send Invitation Email'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            {!generatedCode ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole as (value: string) => void}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxUses">Maximum Uses</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    min="1"
                    max="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiresDays">Expires In (Days)</Label>
                  <Select value={expiresDays} onValueChange={setExpiresDays}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expiration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Day</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="365">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateInvite} disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Generate Invite Link'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Invitation Link</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={inviteUrl || ''}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyLink}
                      className="shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="capitalize font-medium">{role}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Uses:</span>
                    <span className="font-medium">{maxUses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-medium">{expiresDays} days</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleClose}>
                    Done
                  </Button>
                  <Button onClick={handleCopyLink}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Copy & Share
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}