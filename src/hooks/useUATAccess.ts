import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UATTester {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
}

export function useUATAccess() {
  const { user } = useAuth();
  const [isUATTester, setIsUATTester] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUATAccess = async () => {
      if (!user?.email) {
        setIsUATTester(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('uat_testers')
          .select('*')
          .eq('email', user.email)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          console.error('Error checking UAT access:', error);
          setError(error.message);
          setIsUATTester(false);
        } else {
          setIsUATTester(!!data);
        }
      } catch (err) {
        console.error('Unexpected error checking UAT access:', err);
        setError('Failed to check UAT access');
        setIsUATTester(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUATAccess();
  }, [user?.email]);

  return { isUATTester, isLoading, error };
}