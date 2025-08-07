import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getSiteUrl } from '@/utils/siteUrl';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = ''
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getSiteUrl()}/login`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setEmailSent(true);
      toast({
        title: 'Reset Email Sent',
        description: 'Check your email for a link to reset your password.',
      });
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail(defaultEmail);
    setError('');
    setEmailSent(false);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {emailSent ? 'Check Your Email' : 'Reset Password'}
          </DialogTitle>
          <DialogDescription>
            {emailSent 
              ? `We've sent a password reset link to ${email}. Click the link in your email to reset your password.`
              : 'Enter your email address and we\'ll send you a link to reset your password.'
            }
          </DialogDescription>
        </DialogHeader>

        {emailSent ? (
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <Mail className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-sm text-green-800">
                Password reset email sent successfully!
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => setEmailSent(false)}
                className="flex-1"
              >
                Send Another Email
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-gray-200"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 fpk-gradient text-white font-semibold hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};