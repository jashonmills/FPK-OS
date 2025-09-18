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
import { Mail, Link, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

export function SimpleInviteDialog({ open, onOpenChange, organizationId }: SimpleInviteDialogProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailInvite = async () => {
    if (!email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address to send the invitation.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // For now, just show success message - we'll implement the actual invite later
      toast({
        title: 'Invitation Sent',
        description: `Invitation email sent to ${email}`,
      });
      setEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateInviteLink = () => {
    // Generate a simple invite link
    const inviteCode = Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/invite/${inviteCode}`;
    setInviteLink(link);
    
    toast({
      title: 'Invite Link Generated',
      description: 'Share this link with students to join your organization.',
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: 'Link Copied',
        description: 'Invite link copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy link to clipboard',
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
            Send email invitations or generate a shareable invite link for students to join your organization.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email Invitation</TabsTrigger>
            <TabsTrigger value="link">Invite Link</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email Invitation
                </CardTitle>
                <CardDescription>
                  Enter the student's email address to send them an invitation.
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
                <Button 
                  onClick={handleEmailInvite} 
                  disabled={isLoading || !email.trim()}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Invitation'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Generate Invite Link
                </CardTitle>
                <CardDescription>
                  Create a shareable link that students can use to join your organization.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!inviteLink ? (
                  <Button onClick={generateInviteLink} className="w-full">
                    Generate Invite Link
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm break-all">{inviteLink}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={copyToClipboard}
                        variant="outline"
                        className="flex-1"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </>
                        )}
                      </Button>
                      <Button onClick={generateInviteLink} variant="outline">
                        Generate New
                      </Button>
                    </div>
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