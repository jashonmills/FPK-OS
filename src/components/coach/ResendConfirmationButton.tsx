import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw } from 'lucide-react';

interface ResendConfirmationButtonProps {
  email: string;
}

export const ResendConfirmationButton: React.FC<ResendConfirmationButtonProps> = ({ email }) => {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address first.',
        variant: 'destructive'
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Email sent!',
        description: 'Please check your inbox for the confirmation link.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend confirmation email.',
        variant: 'destructive'
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Button 
      type="button"
      variant="link" 
      onClick={handleResend}
      disabled={isResending}
      className="text-white/80 hover:text-white p-0 h-auto text-sm"
    >
      {isResending ? (
        <>
          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <RefreshCw className="w-3 h-3 mr-1" />
          Didn't receive email? Resend
        </>
      )}
    </Button>
  );
};
