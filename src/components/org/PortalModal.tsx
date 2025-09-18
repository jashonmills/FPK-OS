import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Link, Copy, Check, X, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEmailInvitation } from '@/hooks/useInvitationSystem';

interface PortalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

export function PortalModal({ open, onOpenChange, organizationId }: PortalModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [inviteLink, setInviteLink] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  
  const emailInvitation = useEmailInvitation();

  // Debug logging
  React.useEffect(() => {
    console.log('PortalModal render - open:', open, 'organizationId:', organizationId);
  }, [open, organizationId]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

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
      await emailInvitation.mutateAsync({
        email: email.trim(),
        orgId: organizationId,
        role: 'student'
      });
      setEmail('');
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const generateInviteLink = () => {
    const code = Math.random().toString(36).substring(2, 10);
    const link = `${window.location.origin}/invite/${code}`;
    setInviteLink(link);
    
    toast({
      title: 'Link Generated!',
      description: 'Share this link with students.',
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Link copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Failed',
        description: 'Could not copy link',
        variant: 'destructive',
      });
    }
  };

  if (!open) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        style={{ zIndex: 50000 }}
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 50001 }}
      >
        <div 
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Invite Students</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Email Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Send Email Invitation</span>
              </div>
              
              <Input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailInvite()}
                className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
              
              <Button 
                onClick={handleEmailInvite} 
                disabled={emailInvitation.isPending || !email.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {emailInvitation.isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-900 px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
              </div>
            </div>

            {/* Link Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-green-600" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Generate Invite Link</span>
              </div>
              
              {!inviteLink ? (
                <Button 
                  onClick={generateInviteLink} 
                  variant="outline"
                  className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                >
                  Generate Link
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-sm break-all text-gray-900 dark:text-gray-100">
                    {inviteLink}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={copyToClipboard}
                      variant="outline"
                      className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={generateInviteLink} 
                      variant="outline"
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    >
                      New
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}