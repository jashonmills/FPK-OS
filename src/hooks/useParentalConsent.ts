import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SendConsentParams {
  userId: string;
  parentEmail: string;
  childName: string;
}

export const useParentalConsent = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendConsentRequest = async ({ userId, parentEmail, childName }: SendConsentParams) => {
    setIsSending(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-parental-consent', {
        body: { userId, parentEmail, childName }
      });

      if (error) throw error;

      toast({
        title: 'Consent Request Sent',
        description: `We've sent a consent request to ${parentEmail}. They have 7 days to respond.`,
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Error sending consent request:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send consent request. Please try again.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setIsSending(false);
    }
  };

  const checkConsentStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('parental_consent_status, parent_email, is_minor, date_of_birth')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking consent status:', error);
      return null;
    }
  };

  const resendConsentRequest = async (userId: string) => {
    try {
      // Get existing consent info
      const profile = await checkConsentStatus(userId);
      
      if (!profile?.parent_email) {
        throw new Error('No parent email found');
      }

      // Get user display name
      const { data: fullProfile } = await supabase
        .from('profiles')
        .select('display_name, full_name')
        .eq('id', userId)
        .single();

      const childName = fullProfile?.display_name || fullProfile?.full_name || 'Your child';

      return sendConsentRequest({
        userId,
        parentEmail: profile.parent_email,
        childName
      });
    } catch (error: any) {
      console.error('Error resending consent:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend consent request.',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  return {
    sendConsentRequest,
    checkConsentStatus,
    resendConsentRequest,
    isSending
  };
};
