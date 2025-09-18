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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, QrCode, Copy, Check } from 'lucide-react';
import { useEmailInvitation } from '@/hooks/useInvitationSystem';
import { useOrgInvites } from '@/hooks/useOrgInvites';
import { useToast } from '@/hooks/use-toast';
import { useCleanup } from '@/utils/cleanupManager';

interface InviteStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

export default function InviteStudentDialog({ 
  open, 
  onOpenChange, 
  organizationId 
}: InviteStudentDialogProps) {
  const [email, setEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const emailInviteMutation = useEmailInvitation();
  const { createInvite, generateInviteUrl } = useOrgInvites();
  const { toast } = useToast();
  const cleanup = useCleanup('InviteStudentDialog');

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
      await emailInviteMutation.mutateAsync({
        orgId: organizationId,
        email: email.trim(),
        role: 'student'
      });
      setEmail('');
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleGenerateCode = async () => {
    try {
      const inviteCode = await createInvite({
        role: 'student',
        max_uses: 100,
        expires_days: 30
      });
      setGeneratedCode(inviteCode);
      toast({
        title: 'Invitation code generated',
        description: 'Share this code with your student to join your organization.',
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      cleanup.setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied to clipboard',
        description: 'The invitation code has been copied to your clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the code manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Students</DialogTitle>
          <DialogDescription>
            Send email invitations or generate invitation codes for your students.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email Invitation</TabsTrigger>
            <TabsTrigger value="code">Invitation Code</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Email Invitation
                </CardTitle>
                <CardDescription>
                  Send a personalized invitation email to your student.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Student Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleEmailInvite}
                  disabled={emailInviteMutation.isPending}
                  className="w-full"
                >
                  {emailInviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Generate Invitation Code
                </CardTitle>
                <CardDescription>
                  Create a unique code that students can use to join your organization.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!generatedCode ? (
                  <Button 
                    onClick={handleGenerateCode}
                    disabled={emailInviteMutation.isPending}
                    className="w-full"
                  >
                    {emailInviteMutation.isPending ? 'Generating...' : 'Generate Code'}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">
                        Invitation Code
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-2xl font-mono font-bold tracking-wider">
                          {generatedCode}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedCode)}
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Share this code with your student. They can enter it during signup
                      or in their account settings to join your organization.
                    </div>
                    <Button 
                      onClick={handleGenerateCode}
                      variant="outline" 
                      className="w-full"
                      disabled={emailInviteMutation.isPending}
                    >
                      Generate New Code
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}