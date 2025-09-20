import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Link, Copy, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEmailInvitation } from '@/hooks/useInvitationSystem';
import { useOrgInvites } from '@/hooks/useOrgInvites';

interface SimpleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

export function SimpleModal({ open, onOpenChange, organizationId }: SimpleModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const emailInviteMutation = useEmailInvitation();
  const { createInvite, generateInviteUrl } = useOrgInvites();

  console.log('SimpleModal - open:', open);

  const handleEmailInvite = async () => {
    if (!email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address.',
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

  const generateInviteCode = async () => {
    try {
      const code = await createInvite({
        role: 'student',
        max_uses: 100,
        expires_days: 30
      });
      setInviteCode(code);
      toast({
        title: 'Invitation code generated',
        description: 'Share this code with your student to join your organization.',
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteCode);
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = inviteCode;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Invitation code copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: 'Failed',
        description: 'Please manually copy the code from above.',
        variant: 'destructive',
      });
    }
  };

  if (!open) {
    console.log('SimpleModal not rendering - open is false');
    return null;
  }

  console.log('SimpleModal rendering - open is true');

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-xl border p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Invite Students</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Email Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-700">Send Email Invitation</span>
            </div>
            
            <Input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            
            <Button 
              onClick={handleEmailInvite} 
              disabled={emailInviteMutation.isPending || !email.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {emailInviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">or</span>
            </div>
          </div>

          {/* Code Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-700">Generate Invite Code</span>
            </div>
            
            {!inviteCode ? (
              <Button 
                onClick={generateInviteCode} 
                variant="outline"
                className="w-full"
              >
                Generate Code
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded border">
                  <code className="text-lg font-mono font-bold break-all select-all">
                    {inviteCode}
                  </code>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={copyToClipboard}
                    variant="outline"
                    className="flex-1"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Code
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={generateInviteCode} 
                    variant="outline"
                  >
                    New
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}